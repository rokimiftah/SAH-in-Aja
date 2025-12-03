import { v } from "convex/values";

import { action } from "./_generated/server";
import { createNvidiaClient, NVIDIA_MODELS, SYSTEM_PROMPTS } from "./lib/nvidia";

// Simple FAQ matching (no embedding/RAG needed)
const HALAL_FAQS: Array<{ keywords: string[]; question: string; answer: string }> = [
  {
    keywords: ["daftar", "cara", "sertifikasi", "halal", "bpjph"],
    question: "Bagaimana cara mendaftar sertifikasi halal?",
    answer: `Langkah pendaftaran sertifikasi halal BPJPH:

1. Buka website halal.go.id
2. Registrasi akun pelaku usaha
3. Login dan pilih "Pengajuan Sertifikasi Halal"
4. Lengkapi data usaha dan produk
5. Upload dokumen SJPH (SOP, Daftar Bahan, dll)
6. Bayar biaya sertifikasi
7. Tunggu jadwal audit dari LPH
8. Jika lulus, sertifikat halal akan diterbitkan

Biaya sertifikasi untuk UMKM Mikro: GRATIS (program SEHATI)
Untuk info lebih lanjut: halal.go.id atau hubungi BPJPH di 1500-363`,
  },
  {
    keywords: ["dokumen", "persyaratan", "sjph", "syarat"],
    question: "Apa saja dokumen yang diperlukan untuk sertifikasi halal?",
    answer: `Dokumen wajib untuk sertifikasi halal BPJPH:

1. SOP Produksi Halal
2. Daftar Bahan Baku (dengan sertifikat halal masing-masing)
3. Perjanjian Supplier Halal
4. Form Traceability
5. Surat Komitmen Halal dari Pemilik Usaha
6. Denah Lokasi Produksi
7. Foto Area Produksi
8. NIB (Nomor Induk Berusaha)

Tips: Gunakan fitur "Dokumen Halal" di SAH-in Aja! untuk generate template dokumen ini.`,
  },
  {
    keywords: ["biaya", "harga", "tarif", "gratis", "sehati"],
    question: "Berapa biaya sertifikasi halal?",
    answer: `Biaya sertifikasi halal BPJPH:

GRATIS untuk UMKM Mikro (Program SEHATI):
- Omset < 2 Miliar/tahun
- Daftar melalui halal.go.id pilih "SEHATI"

Berbayar untuk usaha menengah/besar:
- Tarif tergantung jenis dan jumlah produk
- Mulai dari Rp 300.000 - Rp 5.000.000
- Cek tarif resmi di halal.go.id

Biaya audit LPH (Lembaga Pemeriksa Halal):
- Terpisah dari biaya BPJPH
- Rata-rata Rp 1.500.000 - Rp 3.000.000`,
  },
  {
    keywords: ["lama", "waktu", "proses", "berapa hari"],
    question: "Berapa lama proses sertifikasi halal?",
    answer: `Estimasi waktu proses sertifikasi halal:

1. Persiapan dokumen: 1-2 minggu (tergantung kesiapan)
2. Review dokumen BPJPH: 1-3 hari kerja
3. Audit LPH: 1-2 minggu (sesuai jadwal)
4. Penetapan kehalalan MUI: 1-2 minggu
5. Penerbitan sertifikat: 1-3 hari

TOTAL: sekitar 1-2 bulan

Tips untuk mempercepat:
- Siapkan semua dokumen dengan lengkap
- Gunakan SAH-in Aja! untuk cek kesiapan sebelum audit
- Pastikan tidak ada temuan critical saat audit`,
  },
  {
    keywords: ["bahan", "haram", "critical", "tidak boleh"],
    question: "Bahan apa saja yang haram dan harus dihindari?",
    answer: `Bahan yang HARUS DIHINDARI untuk produk halal:

BAHAN JELAS HARAM:
- Daging babi dan turunannya (gelatin babi, lard)
- Alkohol (etanol, wine, mirin, sake)
- Darah dan produk darah
- Bangkai (hewan tidak disembelih)

BAHAN PERLU CEK SERTIFIKAT:
- Gelatin (bisa dari sapi halal atau babi)
- Emulsifier E471, E481, E482 (bisa dari hewani)
- Shortening, margarin (cek sumber lemak)
- Whey, kasein (dairy, perlu cek proses)
- Enzim (bisa dari mikroba atau hewani)
- Pewarna karmin/E120 (dari serangga)

TIPS: Selalu minta sertifikat halal dari supplier untuk setiap bahan!`,
  },
];

function findMatchingFAQ(query: string): { question: string; answer: string } | null {
  const lowerQuery = query.toLowerCase();
  let bestMatch: (typeof HALAL_FAQS)[0] | null = null;
  let bestScore = 0;

  for (const faq of HALAL_FAQS) {
    const matchCount = faq.keywords.filter((kw) => lowerQuery.includes(kw)).length;
    const score = matchCount / faq.keywords.length;
    if (score > bestScore && score >= 0.3) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestMatch;
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
    // Try FAQ matching first
    const faqMatch = findMatchingFAQ(args.message);

    if (faqMatch) {
      return {
        response: faqMatch.answer,
        source: "faq",
        confidence: 1.0,
      };
    }

    // Fallback to LLM
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return {
        response: "Maaf, sistem sedang tidak tersedia. Silakan coba lagi nanti atau hubungi BPJPH di 1500-363.",
        source: "error",
        confidence: 0,
      };
    }

    const nvidia = createNvidiaClient(apiKey);

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

    const response = await nvidia.chat.completions.create({
      model: NVIDIA_MODELS.TEXT,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
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
