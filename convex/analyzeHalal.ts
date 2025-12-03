import { v } from "convex/values";

import { action } from "./_generated/server";
import { createNvidiaClient, NVIDIA_MODELS, SYSTEM_PROMPTS } from "./lib/nvidia";

export const analyzeKitchen = action({
  args: {
    photoUrls: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      throw new Error("NVIDIA_API_KEY not configured");
    }

    const nvidia = createNvidiaClient(apiKey);

    // Build message content with images
    const imageContents = args.photoUrls.map((url) => ({
      type: "image_url" as const,
      image_url: { url },
    }));

    const response = await nvidia.chat.completions.create({
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
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    try {
      const result = JSON.parse(content);
      return {
        score: result.score || 0,
        findings: result.findings || [],
        actionItems: result.actionItems || [],
        summary: result.summary || "",
      };
    } catch {
      // If JSON parsing fails, return raw content
      return {
        score: 0,
        findings: [],
        actionItems: [],
        summary: content,
      };
    }
  },
});
