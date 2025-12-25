import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Users table
  users: defineTable({
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    linkedProviders: v.optional(v.array(v.string())),
    businessName: v.optional(v.string()),
    businessType: v.optional(v.string()), // KBLI code
    address: v.optional(v.string()),
    credits: v.optional(v.number()), // Koin SAH
    tier: v.optional(v.union(v.literal("free"), v.literal("eceran"), v.literal("juragan"))),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
    createdAt: v.optional(v.number()),
    storageId: v.optional(v.string()),
    preferredTitle: v.optional(v.union(v.literal("bapak"), v.literal("ibu"), v.literal("mas"), v.literal("mbak"))),
  })
    .index("by_phone", ["phone"])
    .index("by_email", ["email"]),

  // Daily credits table - reset every day at UTC+7
  user_daily_credits: defineTable({
    userId: v.id("users"),
    date: v.string(), // Format: YYYY-MM-DD in UTC+7
    siapHalalCredits: v.number(), // Max 3 per day
    dokumenHalalCredits: v.number(), // Max 3 per day
    asistenHalalChats: v.number(), // Max 5 new chats per day
    cekBahanCredits: v.number(), // Max 10 per day
    voiceAuditCredits: v.number(), // Max 2 per day
    trainingCredits: v.number(), // Max 3 per day
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),

  // Promo codes table - manage via Convex dashboard
  promo_codes: defineTable({
    code: v.string(), // The promo code (case-sensitive)
    credits: v.number(), // Credits to add (e.g., 100)
    maxUsage: v.optional(v.number()), // Max total usages (null = unlimited)
    usageCount: v.number(), // Current usage count
    expiresAt: v.optional(v.number()), // Expiration timestamp (null = never)
    isActive: v.boolean(), // Can be deactivated without deleting
    createdAt: v.number(),
  }).index("by_code", ["code"]),

  // Track which users have used which promo codes
  promo_code_usages: defineTable({
    userId: v.id("users"),
    promoCodeId: v.id("promo_codes"),
    usedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_code", ["userId", "promoCodeId"]),

  // Material scans table (Cek Bahan / Smart Material Scanner history)
  material_scans: defineTable({
    userId: v.id("users"),
    photoUrls: v.array(v.string()), // Array of Convex storage URLs (depan + belakang kemasan)
    extractedIngredients: v.array(v.string()), // OCR extracted ingredients
    analysis: v.array(
      v.object({
        ingredient: v.string(),
        status: v.union(v.literal("aman"), v.literal("meragukan"), v.literal("tidak_halal")),
        reason: v.string(),
        action: v.optional(v.string()),
      }),
    ),
    overallStatus: v.union(v.literal("aman"), v.literal("meragukan"), v.literal("tidak_halal")),
    summary: v.string(),
    // Optional: detected halal certificate info
    halalCertificate: v.optional(
      v.object({
        detected: v.boolean(),
        number: v.optional(v.string()),
        issuer: v.optional(v.string()), // MUI, BPJPH, etc.
      }),
    ),
    // Optional: positive list detection
    positiveListDetected: v.optional(v.boolean()),
    creditsUsed: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Halal scans table (Siap Halal history)
  halal_scans: defineTable({
    userId: v.id("users"),
    photoUrls: v.array(v.string()), // Array of Convex storage URLs
    findings: v.array(
      v.object({
        type: v.union(v.literal("pass"), v.literal("warning"), v.literal("critical")),
        item: v.string(),
        location: v.string(),
        confidence: v.number(),
      }),
    ),
    score: v.number(), // 0-100
    actionItems: v.array(v.string()),
    summaryPoints: v.optional(v.array(v.string())),
    overallMessage: v.optional(v.string()),
    creditsUsed: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Halal documents table (Dokumen Halal history)
  halal_documents: defineTable({
    userId: v.id("users"),
    templateType: v.union(
      v.literal("sop_produksi"),
      v.literal("perjanjian_supplier"),
      v.literal("daftar_bahan"),
      v.literal("traceability"),
      v.literal("komitmen_halal"),
      v.literal("sop_pencucian_najis"),
      v.literal("pernyataan_bebas_babi"),
    ),
    businessInfo: v.object({
      name: v.string(),
      address: v.string(),
      owner: v.string(),
      productType: v.string(),
    }),
    ingredients: v.array(
      v.object({
        name: v.string(),
        supplier: v.string(),
        halalStatus: v.string(),
      }),
    ),
    generatedContent: v.string(), // AI-generated document content
    pdfUrl: v.optional(v.string()), // Convex storage URL
    creditsUsed: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Halal consultations table (Asisten Halal history)
  halal_consultations: defineTable({
    userId: v.id("users"),
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        timestamp: v.number(),
      }),
    ),
    topic: v.optional(v.string()), // "halal_cert", "bpjph", "sjph", etc.
    resolved: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Knowledge base for FAQs
  halal_knowledge_base: defineTable({
    category: v.string(), // "halal", "bpjph", "sjph", "bahan"
    question: v.string(),
    answer: v.string(),
    keywords: v.array(v.string()),
    source: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_category", ["category"]),

  // Voice Audit Sessions (Simulasi Audit Suara)
  voice_audit_sessions: defineTable({
    userId: v.id("users"),
    vapiCallId: v.optional(v.string()),
    auditorType: v.union(v.literal("galak"), v.literal("ramah")),
    focusTopic: v.union(v.literal("bahan"), v.literal("produksi"), v.literal("sop"), v.literal("umum")),
    preferredTitle: v.union(v.literal("bapak"), v.literal("ibu"), v.literal("mas"), v.literal("mbak")),
    transcript: v.array(
      v.object({
        role: v.union(v.literal("assistant"), v.literal("user")),
        text: v.string(),
        timestamp: v.number(),
      }),
    ),
    summary: v.optional(v.string()),
    durationSeconds: v.optional(v.number()),
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("abandoned")),
    creditsUsed: v.number(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Certification Eligibility (Self-Declare vs Reguler pathway screening)
  certification_eligibility: defineTable({
    userId: v.id("users"),
    certificationPath: v.union(v.literal("self_declare"), v.literal("reguler")),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    disqualifyingFactors: v.array(v.string()),
    eligibilityAnswers: v.object({
      hasSlaughteredMeat: v.boolean(),
      hasHighTechProcess: v.boolean(),
      hasAnimalDerivatives: v.boolean(),
      productionScale: v.union(v.literal("mikro"), v.literal("kecil"), v.literal("menengah")),
    }),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Products table (for traceability matrix)
  products: defineTable({
    userId: v.id("users"),
    name: v.string(),
    productCode: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Ingredients table (standalone for traceability)
  ingredients: defineTable({
    userId: v.id("users"),
    name: v.string(),
    supplier: v.string(),
    halalCertNumber: v.optional(v.string()),
    certExpiryDate: v.optional(v.number()),
    halalStatus: v.union(v.literal("halal"), v.literal("dalam_proses"), v.literal("perlu_verifikasi"), v.literal("alami")),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Product-Ingredient junction table (many-to-many traceability)
  product_ingredients: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    ingredientId: v.id("ingredients"),
  })
    .index("by_product", ["productId"])
    .index("by_ingredient", ["ingredientId"])
    .index("by_user", ["userId"]),

  // Training sessions table (halal awareness quiz)
  training_sessions: defineTable({
    userId: v.id("users"),
    participantName: v.string(),
    quizAnswers: v.array(
      v.object({
        questionId: v.string(),
        selectedAnswer: v.string(),
        isCorrect: v.boolean(),
      }),
    ),
    quizScore: v.number(),
    passed: v.boolean(),
    certificateNumber: v.optional(v.string()),
    certificatePdfUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
