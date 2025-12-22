/**
 * SAH-in Aja! - Branding Constants
 *
 * IMPORTANT: Read docs/BRANDING_GUIDE.md before modifying!
 *
 * Key Positioning:
 * - We are an ASSISTANT, not a service provider
 * - We provide INFORMATION, not execution
 * - We help PREPARE, not replace professionals
 */

export const BRANDING = {
  /**
   * Brand Name
   */
  name: "SAH-in Aja!",

  /**
   * Tagline - Always appears with logo
   * Used in: Logo lockup, headers, footers, email signatures
   */
  tagline: "Siap Halal dari Dapur hingga Sertifikat",

  /**
   * Slogan - For marketing campaigns
   * Used in: Ads, video endings, pitch closing, social campaigns
   */
  slogan: "Paham Dulu, Baru Usahamu SAH!",

  /**
   * Alternative slogans for different campaigns
   */
  sloganAlternatives: [
    "Paham Dulu, Urus Sendiri!",
    "Tahu Caranya, Beres Urusannya!",
    "Info Lengkap, Akses Mudah!",
    "Urus Sendiri, Bisa Kok!",
  ] as const,

  /**
   * Meta description for SEO
   * Used in: HTML meta tag, social share previews
   */
  description:
    "Platform persiapan sertifikasi halal berbasis AI untuk UMKM Indonesia. Foto area produksi, dapat laporan kesiapan halal, lengkap dengan dokumen wajib dan panduan step-by-step ke BPJPH/MUI.",

  /**
   * Short pitch for various contexts
   */
  pitch: {
    short: "Asisten persiapan sertifikasi halal untuk UMKM",
    medium:
      "Platform persiapan sertifikasi halal berbasis AI: assessment kesiapan, generate dokumen SJPH, dan panduan BPJPH step-by-step",
    long: "SAH-in Aja! adalah asisten AI yang membantu UMKM mempersiapkan diri untuk sertifikasi halal BPJPH/MUI - dari assessment kesiapan dapur, generate dokumen wajib SJPH, hingga panduan submit aplikasi - bukan menggantikan LPH, tapi memandu persiapan sebelum audit resmi.",
  },

  /**
   * Core value propositions
   */
  valueProps: [
    {
      title: "Accessibility",
      tagline: "Gratis & Mudah",
      description: "Akses informasi halal dan legal yang biasanya mahal dan rumit, sekarang gratis dan mudah dipahami.",
    },
    {
      title: "Empowerment",
      tagline: "Urus Sendiri",
      description: "Dari yang tadinya harus bayar konsultan, sekarang bisa pahami dan urus sendiri dengan panduan step-by-step.",
    },
    {
      title: "Clarity",
      tagline: "Jelas & Sederhana",
      description: "Regulasi dan hukum yang rumit dijelaskan dalam bahasa sederhana yang mudah dipahami ibu-ibu UMKM.",
    },
    {
      title: "Speed",
      tagline: "Hasil Instan",
      description: "Dari yang tadinya harus antri konsultasi berhari-hari, sekarang dapat jawaban dalam hitungan detik.",
    },
    {
      title: "Preparation",
      tagline: "Siap Sebelum Audit",
      description: "Tahu apa yang kurang sebelum audit/meeting dengan profesional, jadi lebih siap dan hemat biaya.",
    },
  ] as const,
} as const;

/**
 * Feature-specific messaging
 */
export const FEATURES = {
  siapHalal: {
    name: "Siap Halal",
    icon: "🎯",
    tagline: "Persiapan Sertifikasi Halal MUI",
    positioning: "Cek Kesiapan Halal - Persiapan Sebelum Audit Resmi",
    description:
      "Foto 5 area usahamu, AI kami analisis berdasarkan standar SJPH HAS 23000. Ketahui apa yang perlu diperbaiki sebelum mengajukan audit resmi ke BPJPH.",

    benefits: ["Cek kesiapan sebelum audit", "Hemat biaya konsultan", "Hasil dalam 2 menit"],

    cta: {
      primary: "Cek Kesiapan Dapur",
      secondary: "Lihat Apa yang Kurang",
      tertiary: "Mulai Persiapan",
    },

    // MANDATORY: Always show this disclaimer with results
    disclaimer: `
      ⚠️ HASIL ANALISIS INFORMATIF

      Ini adalah analisis PERSIAPAN berdasarkan standar SJPH HAS 23000.
      BUKAN sertifikasi halal resmi dari MUI/BPJPH.

      Untuk mendapatkan sertifikasi halal yang sah:
      1. Perbaiki semua temuan "Critical" dan "Warning"
      2. Lengkapi dokumen persyaratan SJPH
      3. Daftar audit ke BPJPH: https://halal.go.id
      4. Atau hubungi LPH terakreditasi terdekat

      Hasil AI dapat memiliki error. Gunakan sebagai panduan awal,
      bukan keputusan final untuk mengajukan sertifikasi.`,

    officialResources: [
      {
        name: "BPJPH",
        url: "https://halal.go.id",
        description: "Portal resmi pendaftaran sertifikasi halal",
      },
      {
        name: "LPPOM MUI",
        url: "https://www.halalmui.org",
        description: "Informasi standar halal dan LPH terakreditasi",
      },
    ],
  },

  dokumenHalal: {
    name: "Dokumen Halal",
    icon: "📄",
    tagline: "Generate Dokumen Wajib SJPH",
    positioning: "Generate Dokumen Wajib untuk Sertifikasi Halal",
    description:
      "Generate otomatis dokumen persyaratan sertifikasi halal seperti SOP Produksi Halal, Perjanjian Supplier, dan Daftar Bahan Baku. Auto-fill dari hasil assessment kamu.",

    benefits: ["Template lengkap SJPH HAS 23000", "Auto-fill dari assessment", "Download PDF siap print"],

    cta: {
      primary: "Generate Dokumen Wajib",
      secondary: "Download Template SOP",
      tertiary: "Siapkan Dokumen SJPH",
    },

    // MANDATORY: Always show this disclaimer with output
    disclaimer: `
      ⚠️ TEMPLATE DOKUMEN - PERLU REVIEW

      Ini adalah TEMPLATE AUTO-GENERATED dari hasil assessment AI.

      Sebelum submit ke BPJPH:
      1. ✅ Review dan sesuaikan dengan kondisi usaha Anda
      2. ✅ Lengkapi data yang masih kosong [...]
      3. ✅ Konsultasikan dengan pendamping halal jika ada
      4. ✅ Pastikan supplier bahan baku sudah tersertifikasi halal

      Untuk kepastian kelengkapan dokumen:
      • Hubungi LPH (Lembaga Pemeriksa Halal) terakreditasi
      • Konsultasi dengan pendamping halal BPJPH

      Template AI dapat memiliki ketidakakuratan.
      Periksa dengan teliti sebelum submit aplikasi.`,

    officialResources: [
      {
        name: "BPJPH",
        url: "https://halal.go.id",
        description: "Portal resmi pendaftaran sertifikasi halal",
      },
      {
        name: "LPPOM MUI",
        url: "https://www.halalmui.org",
        description: "Informasi standar SJPH HAS 23000",
      },
    ],
  },

  asistenHalal: {
    name: "Asisten Halal",
    icon: "💬",
    tagline: "Tanya Jawab Sertifikasi Halal",
    positioning: "Tanya Jawab Seputar Sertifikasi Halal - Panduan Step-by-Step ke BPJPH",
    description:
      "Tanya tentang proses sertifikasi halal, cara perbaiki temuan assessment, rekomendasi supplier bahan baku halal, atau panduan submit aplikasi ke BPJPH.",

    benefits: ["Jawaban instant 24/7", "Knowledge base SJPH HAS 23000", "Solusi praktis dan actionable"],

    cta: {
      primary: "Tanya Asisten Halal",
      secondary: "Konsultasi Gratis",
      tertiary: "Cari Solusi",
    },

    // MANDATORY: Show in chat interface
    disclaimer: `
      💡 INFORMASI UMUM - BUKAN AUDIT RESMI

      Jawaban kami berdasarkan:
      • Standar SJPH HAS 23000 (Sistem Jaminan Produk Halal)
      • Regulasi BPJPH terkini
      • Best practice persiapan sertifikasi halal

      BELUM tentu sesuai dengan kondisi spesifik usaha Anda.

      Untuk informasi resmi dan audit:
      • Sertifikasi Halal → BPJPH: https://halal.go.id
      • LPH Terakreditasi: untuk on-site audit resmi
      • Pendamping Halal BPJPH: konsultasi gratis pemerintah

      Untuk konsultasi spesifik kasus Anda:
      • Hubungi LPH (Lembaga Pemeriksa Halal) terakreditasi
      • Konsultasi pendamping halal BPJPH
      • Asosiasi industri halal (GAPPHI, AHMI)

      AI dapat memberikan informasi yang outdated atau tidak lengkap.
      Selalu cross-check dengan BPJPH sebelum submit aplikasi.`,

    officialResources: [
      {
        name: "BPJPH",
        url: "https://halal.go.id",
        description: "Portal resmi pendaftaran sertifikasi halal",
      },
      {
        name: "LPPOM MUI",
        url: "https://www.halalmui.org",
        description: "Informasi LPH terakreditasi",
      },
      {
        name: "Pendamping Halal BPJPH",
        url: "https://halal.go.id",
        description: "Konsultasi gratis dari pemerintah",
      },
    ],
  },

  cekBahan: {
    name: "Cek Bahan",
    icon: "📦",
    tagline: "Smart Material Scanner",
    positioning: "Cek Status Halal Bahan dari Kemasan",
    description:
      "Foto kemasan produk, AI deteksi logo halal, cek Positive List, dan analisis komposisi bahan untuk memastikan status halal sebelum digunakan.",

    benefits: ["Deteksi logo halal otomatis", "Cek bahan kritis E-Number", "Hasil instan 10 detik"],

    cta: {
      primary: "Foto Kemasan Bahan",
      secondary: "Cek Status Bahan",
      tertiary: "Scan Label",
    },

    disclaimer: `
      ⚠️ ANALISIS BAHAN - PERLU VERIFIKASI

      Ini adalah analisis PERSIAPAN berdasarkan foto label kemasan.

      Hasil analisis AI:
      • Deteksi logo halal berdasarkan visual
      • Pengecekan Positive List (KMA No. 335/2022)
      • Analisis komposisi dan bahan kritis

      BUKAN pengganti sertifikat halal resmi.

      Untuk kepastian status halal bahan:
      • Minta sertifikat halal dari supplier
      • Verifikasi nomor sertifikat di halal.go.id
      • Konsultasikan dengan LPH terakreditasi

      AI dapat memiliki error dalam membaca label.
      Selalu verifikasi dengan dokumen resmi.`,

    officialResources: [
      {
        name: "BPJPH",
        url: "https://halal.go.id",
        description: "Verifikasi nomor sertifikat halal",
      },
      {
        name: "LPPOM MUI",
        url: "https://www.halalmui.org",
        description: "Database produk halal tersertifikasi",
      },
    ],
  },
} as const;

/**
 * Global disclaimers
 */
export const DISCLAIMERS = {
  /**
   * Footer disclaimer - appears on all pages
   */
  global: `
    SAH-in Aja! adalah platform persiapan sertifikasi halal untuk UMKM.
    Kami BUKAN lembaga sertifikasi halal atau instansi pemerintah.

    Untuk sertifikasi halal resmi, hubungi:
    • BPJPH: https://halal.go.id (pendaftaran sertifikasi)
    • Lembaga Pemeriksa Halal (LPH) terakreditasi (audit on-site)
    • Pendamping Halal BPJPH (konsultasi gratis pemerintah)

    Informasi di platform ini bersifat edukatif berdasarkan standar SJPH HAS 23000
    dan dapat berubah sesuai pembaruan regulasi. Gunakan sebagai persiapan awal,
    bukan pengganti audit resmi.`,

  /**
   * Short version for mobile
   */
  globalShort: `Platform persiapan sertifikasi halal. Bukan lembaga resmi. Konsultasikan dengan LPH terakreditasi untuk audit resmi.`,
} as const;

/**
 * Call-to-action text library
 * Use these instead of creating ad-hoc CTAs
 */
export const CTA_TEXT = {
  // Primary actions
  tryNow: "Coba Gratis Sekarang",
  checkReadiness: "Cek Kesiapan Sekarang",
  createDraft: "Buat Draft Kontrak",
  askQuestion: "Tanya Sekarang",

  // Secondary actions
  learnHow: "Pahami Caranya",
  seeGuide: "Lihat Panduannya",
  readMore: "Baca Selengkapnya",

  // With context
  checkHalalReadiness: "Cek Kesiapan Halal Dapurmu",
  createContractDraft: "Buat Draft Perjanjian",
  consultFree: "Konsultasi Gratis",

  // Disclaimer context
  learnMore: "Pelajari Lebih Lanjut",
  contactProfessional: "Hubungi Profesional",
  checkOfficialSource: "Cek Sumber Resmi",
} as const;

/**
 * Tone of voice guidelines
 */
export const TONE = {
  /**
   * Words to USE (empowering, educational)
   */
  use: [
    "kami bantu kamu paham",
    "cara",
    "langkah-langkah",
    "draft",
    "persiapan",
    "kesiapan",
    "pahami",
    "pelajari",
    "tahu",
    "konsultasi",
    "panduan",
    "informasi",
  ] as const,

  /**
   * Words to AVOID (over-promising, misleading)
   */
  avoid: [
    "kami bikin kamu halal/legal",
    "dijamin lulus audit",
    "kontrak sah" + " (tanpa disclaimer)",
    "dapatkan sertifikat",
    "instant certification",
    "urus otomatis",
    "kami yang kerjakan",
  ] as const,
} as const;

/**
 * SEO Keywords
 */
export const SEO = {
  primaryKeywords: [
    "cara sertifikasi halal UMKM",
    "persiapan audit halal",
    "cek kesiapan halal",
    "panduan sertifikasi halal MUI",
    "SJPH HAS 23000",
    "dokumen persyaratan sertifikasi halal",
  ] as const,

  avoidKeywords: [
    "jasa sertifikasi halal murah",
    "beli sertifikat halal",
    "sertifikasi halal instant",
    "biro jasa sertifikasi halal",
  ] as const,
} as const;

/**
 * Social media hashtags
 */
export const HASHTAGS = {
  primary: ["#UMKM", "#SertifikasiHalal", "#HalalMUI", "#BPJPH", "#SiapHalal"],
  avoid: ["#JasaHalal", "#BeliSertifikatHalal"],
} as const;

/**
 * Helper function to get disclaimer for a feature
 */
export function getFeatureDisclaimer(featureKey: keyof typeof FEATURES): string {
  return FEATURES[featureKey].disclaimer;
}

/**
 * Helper function to get CTA text
 */
export function getCTA(action: keyof typeof CTA_TEXT): string {
  return CTA_TEXT[action];
}

/**
 * Type exports for TypeScript usage
 */
export type FeatureKey = keyof typeof FEATURES;
export type CTAKey = keyof typeof CTA_TEXT;
