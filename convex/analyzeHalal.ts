import { v } from "convex/values";

import { action } from "./_generated/server";
import { createNvidiaClient, NVIDIA_MODELS, SYSTEM_PROMPTS } from "./lib/nvidia";

export const analyzeKitchen = action({
  args: {
    photoStorageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      throw new Error("NVIDIA_API_KEY not configured");
    }

    // Convert storage IDs to URLs
    const photoUrls: string[] = [];
    for (const storageId of args.photoStorageIds) {
      const url = await ctx.storage.getUrl(storageId);
      if (url) {
        photoUrls.push(url);
      }
    }

    if (photoUrls.length === 0) {
      throw new Error("No valid photo URLs");
    }

    const nvidia = createNvidiaClient(apiKey);

    // Build message content with images
    const imageContents = photoUrls.map((url) => ({
      type: "image_url" as const,
      image_url: { url },
    }));

    let response: Awaited<ReturnType<typeof nvidia.chat.completions.create>>;
    try {
      response = await nvidia.chat.completions.create({
        model: NVIDIA_MODELS.VISION,
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
        max_tokens: 2000,
      });
    } catch (apiError) {
      console.error("NVIDIA API Error:", apiError);
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
        score: result.score || 0,
        findings: result.findings || [],
        actionItems: result.actionItems || [],
        summaryPoints: result.summaryPoints || [],
        overallMessage: result.overallMessage || "",
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
