import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.string(),
    businessName: v.optional(v.string()),
    businessType: v.optional(v.string()), // KBLI code
    address: v.optional(v.string()),
    credits: v.number(), // Koin SAH
    tier: v.union(v.literal("free"), v.literal("eceran"), v.literal("juragan")),
    createdAt: v.number(),
  })
    .index("by_phone", ["phone"])
    .index("by_email", ["email"]),

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
