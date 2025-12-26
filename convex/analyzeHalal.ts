import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { action } from "./_generated/server";
import { createLLMClient, getLLMModel, SYSTEM_PROMPTS } from "./lib/llmClient";

// Helper function to convert ArrayBuffer to base64 (works in Convex runtime)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper function to convert image URL to base64
async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);
  const contentType = response.headers.get("content-type") || "image/jpeg";
  return `data:${contentType};base64,${base64}`;
}

export const analyzeKitchen = action({
  args: {
    photoStorageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Auth check
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    // Convert storage IDs to URLs and then to base64
    const photoUrls: string[] = [];
    const imageBase64List: string[] = [];
    for (const storageId of args.photoStorageIds) {
      const url = await ctx.storage.getUrl(storageId);
      if (url) {
        photoUrls.push(url);
        const base64 = await urlToBase64(url);
        imageBase64List.push(base64);
      }
    }

    if (imageBase64List.length === 0) {
      throw new Error("No valid photo URLs");
    }

    const llmClient = createLLMClient();

    // Build message content with base64 images
    const imageContents = imageBase64List.map((base64Url) => ({
      type: "image_url" as const,
      image_url: { url: base64Url },
    }));

    let response: Awaited<ReturnType<typeof llmClient.chat.completions.create>>;
    try {
      response = await llmClient.chat.completions.create({
        model: getLLMModel("vision"),
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS.HALAL_ASSESSMENT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analisis foto area produksi/dapur berikut untuk penilaian kesiapan sertifikasi halal:",
              },
              ...imageContents,
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 8192,
      });
    } catch (apiError) {
      console.error("LLM API Error:", apiError);
      throw new Error(`AI API Error: ${apiError instanceof Error ? apiError.message : "Unknown error"}`);
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
    let jsonContent = content.trim();

    // Handle various markdown code block formats
    // Match ```json, ```JSON, ``` followed by optional whitespace/newline
    const codeBlockMatch = jsonContent.match(/^```(?:json|JSON)?\s*([\s\S]*?)\s*```$/);
    if (codeBlockMatch) {
      jsonContent = codeBlockMatch[1].trim();
    } else if (jsonContent.startsWith("```")) {
      // Fallback: remove opening and closing backticks
      jsonContent = jsonContent.replace(/^```(?:json|JSON)?\s*/, "").replace(/\s*```$/, "");
    }

    // Also try to extract JSON object if there's extra text
    const jsonObjectMatch = jsonContent.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      jsonContent = jsonObjectMatch[0];
    }

    try {
      const result = JSON.parse(jsonContent);
      return {
        score: typeof result.score === "number" ? result.score : 0,
        findings: Array.isArray(result.findings) ? result.findings : [],
        actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],
        summaryPoints: Array.isArray(result.summaryPoints) ? result.summaryPoints : [],
        overallMessage: typeof result.overallMessage === "string" ? result.overallMessage : "",
        photoUrls,
      };
    } catch {
      // If JSON parsing fails, return raw content
      return {
        score: 0,
        findings: [],
        actionItems: [],
        summaryPoints: [],
        overallMessage: content,
        photoUrls,
      };
    }
  },
});
