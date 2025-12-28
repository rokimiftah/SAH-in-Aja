import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { action } from "./_generated/server";
import { createLLMClient, getLLMModel, SYSTEM_PROMPTS } from "./lib/llmClient";

const MAX_PHOTOS = 3;
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function urlToBase64WithValidation(url: string): Promise<{ base64: string; contentType: string }> {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";

  if (!ALLOWED_CONTENT_TYPES.some((allowed) => contentType.startsWith(allowed))) {
    throw new ConvexError(`Format file tidak didukung: ${contentType}. Gunakan JPEG, PNG, atau WebP.`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);
  return { base64: `data:${contentType};base64,${base64}`, contentType };
}

interface IngredientAnalysis {
  ingredient: string;
  status: "aman" | "meragukan" | "tidak_halal";
  reason: string;
  action?: string;
}

interface MaterialAnalysisResult {
  halalCertificate?: {
    detected: boolean;
  };
  positiveListDetected?: boolean;
  extractedIngredients: string[];
  analysis: IngredientAnalysis[];
  overallStatus: "aman" | "meragukan" | "tidak_halal";
  summary: string;
  photoUrls: string[];
}

export const analyzeMaterial = action({
  args: {
    photoStorageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args): Promise<MaterialAnalysisResult> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    if (args.photoStorageIds.length === 0) {
      throw new ConvexError("Minimal 1 foto diperlukan");
    }

    if (args.photoStorageIds.length > MAX_PHOTOS) {
      throw new ConvexError(`Maksimal ${MAX_PHOTOS} foto yang dapat dianalisis sekaligus`);
    }

    const photoUrls: string[] = [];
    const imageBase64List: string[] = [];

    for (const storageId of args.photoStorageIds) {
      const photoUrl = await ctx.storage.getUrl(storageId);
      if (!photoUrl) {
        throw new ConvexError("Foto tidak ditemukan di storage");
      }
      photoUrls.push(photoUrl);

      const { base64 } = await urlToBase64WithValidation(photoUrl);
      imageBase64List.push(base64);
    }

    const llmClient = createLLMClient();

    const imageContents = imageBase64List.map((base64, index) => ({
      type: "image_url" as const,
      image_url: { url: base64 },
      ...(imageBase64List.length > 1 && {
        detail: index === 0 ? "Foto bagian depan kemasan" : "Foto bagian belakang kemasan",
      }),
    }));

    const photoLabels =
      imageBase64List.length === 1 ? "foto kemasan ini" : `${imageBase64List.length} foto kemasan (depan dan belakang)`;

    let response: Awaited<ReturnType<typeof llmClient.chat.completions.create>>;
    try {
      response = await llmClient.chat.completions.create({
        model: getLLMModel("vision"),
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS.MATERIAL_SCANNER,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analisis ${photoLabels}. Cek logo halal di foto depan, dan analisis komposisi bahan di foto belakang. Identifikasi logo halal, cek positive list, atau analisis komposisi bahan:`,
              },
              ...imageContents,
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 8192,
      });
    } catch (apiError) {
      console.error("LLM API Error:", apiError);
      throw new ConvexError(`Gagal menganalisis foto. Silakan coba lagi.`);
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ConvexError("Tidak ada respons dari AI. Silakan coba lagi.");
    }

    let jsonContent = content.trim();

    // Remove code block markers (```json ... ```) - handle multiple occurrences
    const codeBlockMatch = jsonContent.match(/```(?:json|JSON)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonContent = codeBlockMatch[1].trim();
    }

    // Extract the last complete JSON object from the content (more robust)
    // This handles cases where AI adds text before/after the JSON
    let jsonObjectMatch: RegExpMatchArray | null = null;
    let depth = 0;
    let startIndex = -1;
    let lastValidJson = "";

    for (let i = 0; i < jsonContent.length; i++) {
      if (jsonContent[i] === "{") {
        if (depth === 0) startIndex = i;
        depth++;
      } else if (jsonContent[i] === "}") {
        depth--;
        if (depth === 0 && startIndex !== -1) {
          const candidate = jsonContent.slice(startIndex, i + 1);
          try {
            JSON.parse(candidate);
            lastValidJson = candidate;
          } catch {
            // Not valid JSON, continue searching
          }
        }
      }
    }

    if (lastValidJson) {
      jsonContent = lastValidJson;
    } else {
      // Fallback to regex extraction if bracket matching fails
      jsonObjectMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        jsonContent = jsonObjectMatch[0];
      }
    }

    // Sanitize: replace JavaScript undefined with JSON null
    jsonContent = jsonContent.replace(/:\s*undefined\b/g, ": null");
    // Sanitize: remove trailing commas before closing brackets
    jsonContent = jsonContent.replace(/,\s*([\]}])/g, "$1");

    try {
      const result = JSON.parse(jsonContent);

      const validStatus = (status: string): "aman" | "meragukan" | "tidak_halal" => {
        if (status === "aman" || status === "meragukan" || status === "tidak_halal") {
          return status;
        }
        return "meragukan";
      };

      return {
        halalCertificate: result.halalCertificate
          ? {
              detected: Boolean(result.halalCertificate.detected),
            }
          : undefined,
        positiveListDetected: result.positiveListDetected ?? undefined,
        extractedIngredients: Array.isArray(result.extractedIngredients) ? result.extractedIngredients : [],
        analysis: Array.isArray(result.analysis)
          ? result.analysis.map((a: IngredientAnalysis) => ({
              ingredient: String(a.ingredient || ""),
              status: validStatus(a.status),
              reason: String(a.reason || ""),
              action: a.action ? String(a.action) : undefined,
            }))
          : [],
        overallStatus: validStatus(result.overallStatus),
        summary: String(result.summary || "Tidak dapat menganalisis gambar"),
        photoUrls,
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Failed to parse content:", jsonContent);
      throw new ConvexError("Gagal memproses hasil analisis AI. Silakan coba lagi dengan foto yang lebih jelas.");
    }
  },
});
