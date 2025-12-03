import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Get scans by user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("halal_scans")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get latest scan by user
export const getLatest = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("halal_scans")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});

// Get single scan
export const get = query({
  args: { scanId: v.id("halal_scans") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scanId);
  },
});

// Create new scan result
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
    creditsUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const scanId = await ctx.db.insert("halal_scans", {
      userId: args.userId,
      photoUrls: args.photoUrls,
      findings: args.findings,
      score: args.score,
      actionItems: args.actionItems,
      creditsUsed: args.creditsUsed,
      createdAt: Date.now(),
    });
    return scanId;
  },
});
