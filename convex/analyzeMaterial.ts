import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { action } from "./_generated/server";
import { createKolosalClient, KOLOSAL_MODELS, SYSTEM_PROMPTS } from "./lib/kolosal";

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
    number?: string;
    issuer?: string;
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

    const apiKey = process.env.KOLOSAL_API_KEY;
    if (!apiKey) {
      throw new Error("KOLOSAL_API_KEY not configured");
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

    const kolosal = createKolosalClient(apiKey);

    const imageContents = imageBase64List.map((base64, index) => ({
      type: "image_url" as const,
      image_url: { url: base64 },
      ...(imageBase64List.length > 1 && {
        detail: index === 0 ? "Foto bagian depan kemasan" : "Foto bagian belakang kemasan",
      }),
    }));

    const photoLabels =
      imageBase64List.length === 1 ? "foto kemasan ini" : `${imageBase64List.length} foto kemasan (depan dan belakang)`;

    let response: Awaited<ReturnType<typeof kolosal.chat.completions.create>>;
    try {
      response = await kolosal.chat.completions.create({
        model: KOLOSAL_MODELS.VISION,
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
        max_tokens: 2000,
      });
    } catch (apiError) {
      console.error("Kolosal API Error:", apiError);
      throw new ConvexError(`Gagal menganalisis foto. Silakan coba lagi.`);
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ConvexError("Tidak ada respons dari AI. Silakan coba lagi.");
    }

    let jsonContent = content.trim();

    const codeBlockMatch = jsonContent.match(/^```(?:json|JSON)?\s*([\s\S]*?)\s*```$/);
    if (codeBlockMatch) {
      jsonContent = codeBlockMatch[1].trim();
    } else if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/^```(?:json|JSON)?\s*/, "").replace(/\s*```$/, "");
    }

    const jsonObjectMatch = jsonContent.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      jsonContent = jsonObjectMatch[0];
    }

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
              number: result.halalCertificate.number || undefined,
              issuer: result.halalCertificate.issuer || undefined,
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
    } catch {
      return {
        extractedIngredients: [],
        analysis: [],
        overallStatus: "meragukan",
        summary: "Gagal memproses hasil analisis AI. Silakan coba lagi dengan foto yang lebih jelas.",
        photoUrls,
      };
    }
  },
});
