import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Get current user's documents
export const getMyDocuments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("halal_documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get documents by user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("halal_documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get single document
export const get = query({
  args: { documentId: v.id("halal_documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

// Create new document
export const create = mutation({
  args: {
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
    generatedContent: v.string(),
    creditsUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("halal_documents", {
      userId: args.userId,
      templateType: args.templateType,
      businessInfo: args.businessInfo,
      ingredients: args.ingredients,
      generatedContent: args.generatedContent,
      creditsUsed: args.creditsUsed,
      createdAt: Date.now(),
    });
    return docId;
  },
});

// Update document with PDF URL
export const updatePdfUrl = mutation({
  args: {
    documentId: v.id("halal_documents"),
    pdfUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      pdfUrl: args.pdfUrl,
    });
  },
});
