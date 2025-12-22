import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getMyScans = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("material_scans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    if (currentUserId !== args.userId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ConvexError("Tidak memiliki akses ke data ini");
      }
    }

    return await ctx.db
      .query("material_scans")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { scanId: v.id("material_scans") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const scan = await ctx.db.get(args.scanId);
    if (!scan) return null;

    if (currentUserId !== scan.userId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ConvexError("Tidak memiliki akses ke data ini");
      }
    }

    return scan;
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    photoUrls: v.array(v.string()),
    extractedIngredients: v.array(v.string()),
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
    halalCertificate: v.optional(
      v.object({
        detected: v.boolean(),
        number: v.optional(v.string()),
        issuer: v.optional(v.string()),
      }),
    ),
    positiveListDetected: v.optional(v.boolean()),
    creditsUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    if (currentUserId !== args.userId) {
      throw new ConvexError("Tidak dapat membuat scan untuk user lain");
    }

    const scanId = await ctx.db.insert("material_scans", {
      userId: args.userId,
      photoUrls: args.photoUrls,
      extractedIngredients: args.extractedIngredients,
      analysis: args.analysis,
      overallStatus: args.overallStatus,
      summary: args.summary,
      halalCertificate: args.halalCertificate,
      positiveListDetected: args.positiveListDetected,
      creditsUsed: args.creditsUsed,
      createdAt: Date.now(),
    });
    return scanId;
  },
});

export const remove = mutation({
  args: { scanId: v.id("material_scans") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const scan = await ctx.db.get(args.scanId);
    if (!scan) {
      throw new ConvexError("Scan tidak ditemukan");
    }

    if (currentUserId !== scan.userId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ConvexError("Tidak memiliki akses untuk menghapus data ini");
      }
    }

    await ctx.db.delete(args.scanId);
    return { success: true };
  },
});
