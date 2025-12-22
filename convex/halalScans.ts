import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Get current user's scans
export const getMyScans = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("halal_scans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get scans by user (authorized - only own data or admin)
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    // Check if requesting own data or is admin
    if (currentUserId !== args.userId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ConvexError("Tidak memiliki akses ke data ini");
      }
    }

    return await ctx.db
      .query("halal_scans")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get latest scan by user (authorized - only own data or admin)
export const getLatest = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    // Check if requesting own data or is admin
    if (currentUserId !== args.userId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ConvexError("Tidak memiliki akses ke data ini");
      }
    }

    return await ctx.db
      .query("halal_scans")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});

// Get single scan (authorized - only owner or admin)
export const get = query({
  args: { scanId: v.id("halal_scans") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const scan = await ctx.db.get(args.scanId);
    if (!scan) return null;

    // Check if requesting own data or is admin
    if (currentUserId !== scan.userId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ConvexError("Tidak memiliki akses ke data ini");
      }
    }

    return scan;
  },
});

// Create new scan result (authorized - only for own userId)
export const create = mutation({
  args: {
    userId: v.id("users"),
    photoUrls: v.array(v.string()),
    findings: v.array(
      v.object({
        type: v.union(v.literal("pass"), v.literal("warning"), v.literal("critical")),
        item: v.string(),
        location: v.string(),
        confidence: v.number(),
      }),
    ),
    score: v.number(),
    actionItems: v.array(v.string()),
    summaryPoints: v.optional(v.array(v.string())),
    overallMessage: v.optional(v.string()),
    creditsUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    // Only allow creating scan for own userId
    if (currentUserId !== args.userId) {
      throw new ConvexError("Tidak dapat membuat scan untuk user lain");
    }

    const scanId = await ctx.db.insert("halal_scans", {
      userId: args.userId,
      photoUrls: args.photoUrls,
      findings: args.findings,
      score: args.score,
      actionItems: args.actionItems,
      summaryPoints: args.summaryPoints,
      overallMessage: args.overallMessage,
      creditsUsed: args.creditsUsed,
      createdAt: Date.now(),
    });
    return scanId;
  },
});
