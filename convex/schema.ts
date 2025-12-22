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
    cekBahanCredits: v.optional(v.number()), // Max 10 per day (optional for backward compatibility)
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
});
