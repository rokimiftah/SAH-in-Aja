/**
 * Test script untuk verify CanopyWave API connection
 * Run dengan: npx convex run testCanopyWave
 */

import { v } from "convex/values";

import { internalAction } from "./_generated/server";

export const testConnection = internalAction({
  args: {
    testMessage: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const LLM_API_KEY = process.env.LLM_API_KEY;
    const LLM_API_URL = process.env.LLM_API_URL;
    const LLM_MODEL_TEXT = process.env.LLM_MODEL_TEXT;

    console.log("=== LLM Configuration ===");
    console.log("API Key:", LLM_API_KEY ? `${LLM_API_KEY.substring(0, 10)}...` : "NOT SET");
    console.log("API URL:", LLM_API_URL);
    console.log("Model:", LLM_MODEL_TEXT);

    if (!LLM_API_KEY || !LLM_API_URL || !LLM_MODEL_TEXT) {
      return {
        success: false,
        error: "Missing environment variables",
      };
    }

    // Test with OpenAI SDK
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: LLM_API_KEY,
      baseURL: LLM_API_URL,
    });

    try {
      console.log("\n=== Testing API Call ===");
      const response = await client.chat.completions.create({
        model: LLM_MODEL_TEXT,
        messages: [
          {
            role: "user",
            content: args.testMessage || "Halo, ini test koneksi. Jawab dengan 'OK' jika berhasil.",
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      });

      console.log("Response:", JSON.stringify(response, null, 2));

      return {
        success: true,
        response: {
          choices: response.choices?.length,
          content: response.choices?.[0]?.message?.content,
          model: response.model,
          usage: response.usage,
        },
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      };
    }
  },
});
