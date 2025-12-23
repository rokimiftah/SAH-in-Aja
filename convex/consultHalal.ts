import { v } from "convex/values";

import { action } from "./_generated/server";
import { createLLMClient, getLLMModel, SYSTEM_PROMPTS } from "./lib/llmClient";

// Guardrails - Keywords that indicate harmful/inappropriate content (tetap keyword-based untuk keamanan)
const BLOCKED_KEYWORDS = [
  // Harmful content
  "bunuh",
  "mati",
  "racun",
  "bom",
  "senjata",
  "narkoba",
  "drugs",
  "teror",
  // Adult content
  "sex",
  "porn",
  "bokep",
  "bugil",
  "telanjang",
  "mesum",
  "cabul",
  // Hate speech
  "kafir",
  "benci",
  "serang",
  "hina",
  "rasis",
  // Illegal activities
  "hack",
  "crack",
  "bajak",
  "cheat",
  "curang",
  "ilegal",
  "penipuan",
];

// Check if message contains blocked content (harmful, inappropriate)
function containsBlockedContent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return BLOCKED_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

// Simple greetings that are allowed without classification
const ALLOWED_GREETINGS = [
  "halo",
  "hai",
  "hi",
  "hello",
  "selamat pagi",
  "selamat siang",
  "selamat sore",
  "selamat malam",
  "assalamualaikum",
  "terima kasih",
  "makasih",
  "thanks",
  "oke",
  "ok",
  "baik",
  "siap",
  "ya",
  "tidak",
  "bisa",
  "tolong bantu",
  "bantu saya",
  "mau tanya",
];

// Check if message is a simple greeting
function isGreeting(message: string): boolean {
  const lowerMessage = message.toLowerCase().trim();
  const words = lowerMessage.split(/\s+/);
  if (words.length <= 4) {
    return ALLOWED_GREETINGS.some((greeting) => lowerMessage.includes(greeting));
  }
  return false;
}

// LLM-based topic classification
async function classifyTopicWithLLM(
  message: string,
  llmClient: ReturnType<typeof createLLMClient>,
): Promise<{ isHalalRelated: boolean; reason: string }> {
  const classificationPrompt = `Kamu adalah classifier untuk aplikasi "Asisten Halal" - chatbot khusus sertifikasi halal BPJPH/MUI.

KONTEKS PENTING: Karena ini adalah Asisten Halal, pertanyaan yang AMBIGU harus diasumsikan terkait halal.
Contoh: "Apa saja dokumen yang diperlukan?" → TERKAIT (tentang dokumen sertifikasi halal)
Contoh: "Berapa biayanya?" → TERKAIT (tentang biaya sertifikasi halal)
Contoh: "Siapa presiden Indonesia?" → TIDAK TERKAIT (jelas bukan topik halal)

Topik yang TERKAIT halal:
- Status halal/haram makanan, minuman, bahan masakan, bumbu
- Sertifikasi halal, dokumen, persyaratan, proses, biaya
- Bahan-bahan kritis (gelatin, emulsifier, alkohol, dll)
- Produksi makanan, dapur, restoran, UMKM
- Audit halal, LPH, BPJPH, MUI, SJPH
- Hukum Islam terkait makanan

ATURAN: Jika ragu, jawab TRUE (lebih baik menjawab pertanyaan yang mungkin relevan daripada menolak).

Pertanyaan: "${message}"

Jawab dengan format JSON (tanpa markdown):
{"isHalalRelated": true/false, "reason": "alasan singkat"}`;

  try {
    const response = await llmClient.chat.completions.create({
      model: getLLMModel("text"),
      messages: [{ role: "user", content: classificationPrompt }],
      temperature: 0,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return { isHalalRelated: true, reason: "fallback" };
    }

    // Parse JSON response
    const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleanedContent);
    return {
      isHalalRelated: result.isHalalRelated === true,
      reason: result.reason || "",
    };
  } catch {
    // Fallback: jika gagal classify, allow the message (lebih baik false positive)
    return { isHalalRelated: true, reason: "classification_error" };
  }
}

export const chat = action({
  args: {
    message: v.string(),
    conversationHistory: v.optional(
      v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
        }),
      ),
    ),
    userContext: v.optional(
      v.object({
        halalScore: v.optional(v.number()),
        lastScanFindings: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async (_ctx, args) => {
    // === SETUP API CLIENT ===
    const llmClient = createLLMClient();

    // === GUARDRAILS ===
    // Check for blocked content (harmful, adult, hate speech) - keyword-based untuk kecepatan
    if (containsBlockedContent(args.message)) {
      return {
        response:
          "Maaf, saya tidak dapat memproses pertanyaan tersebut. Saya adalah Asisten Halal yang fokus membantu pertanyaan seputar sertifikasi halal, bahan baku, dan proses produksi halal. Silakan ajukan pertanyaan terkait halal.",
        source: "guardrail",
        confidence: 0,
      };
    }

    // Skip classification for greetings
    if (!isGreeting(args.message)) {
      // LLM-based topic classification untuk pertanyaan non-greeting
      const classification = await classifyTopicWithLLM(args.message, llmClient);

      if (!classification.isHalalRelated) {
        return {
          response:
            "Maaf, pertanyaan Anda sepertinya di luar topik yang bisa saya bantu. Saya adalah Asisten Halal yang khusus membantu:\n\n• Proses sertifikasi halal BPJPH\n• Persyaratan dokumen SJPH\n• Informasi bahan baku halal/haram\n• Tips persiapan audit halal\n• Panduan untuk UMKM\n\nSilakan ajukan pertanyaan terkait halal, dan saya siap membantu!",
          source: "guardrail",
          confidence: 0,
        };
      }
    }

    // Build context from user data
    let contextPrompt = "";
    if (args.userContext?.halalScore) {
      contextPrompt += `\n\nKonteks user: Skor kesiapan halal terakhir adalah ${args.userContext.halalScore}/100.`;
    }
    if (args.userContext?.lastScanFindings?.length) {
      contextPrompt += `\nTemuan dari scan terakhir: ${args.userContext.lastScanFindings.join(", ")}`;
    }

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: SYSTEM_PROMPTS.HALAL_ASSISTANT + contextPrompt,
      },
    ];

    // Add conversation history
    if (args.conversationHistory) {
      for (const msg of args.conversationHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    messages.push({
      role: "user",
      content: args.message,
    });

    const response = await llmClient.chat.completions.create({
      model: getLLMModel("text"),
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        response: "Maaf, tidak dapat memproses pertanyaan Anda. Silakan coba lagi.",
        source: "error",
        confidence: 0,
      };
    }

    return {
      response: `${content}\n\n_Catatan: Jawaban ini dihasilkan AI. Untuk kepastian, konsultasikan dengan LPH atau BPJPH._`,
      source: "llm",
      confidence: 0.7,
    };
  },
});
