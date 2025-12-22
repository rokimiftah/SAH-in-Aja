import type { MutationCtx, QueryCtx } from "./_generated/server";

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Helper to check if user is admin
async function checkAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await ctx.db.get(userId);
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}

// Get all promo codes (Admin only)
export const getAllPromoCodes = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);
    return await ctx.db.query("promo_codes").order("desc").collect();
  },
});

// Create promo code (Admin only)
export const createPromoCode = mutation({
  args: {
    code: v.string(),
    credits: v.number(),
    maxUsage: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    // Check uniqueness
    const existing = await ctx.db
      .query("promo_codes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (existing) {
      throw new Error("Promo code already exists");
    }

    // Validation
    if (args.credits <= 0) {
      throw new Error("Credits must be greater than 0");
    }

    if (args.maxUsage !== undefined && args.maxUsage <= 0) {
      throw new Error("Max usage must be greater than 0");
    }

    if (args.expiresAt !== undefined && args.expiresAt <= Date.now()) {
      throw new Error("Expiration date must be in the future");
    }

    return await ctx.db.insert("promo_codes", {
      code: args.code,
      credits: args.credits,
      maxUsage: args.maxUsage,
      expiresAt: args.expiresAt,
      usageCount: 0,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Toggle promo code status (Admin only)
export const togglePromoCode = mutation({
  args: {
    id: v.id("promo_codes"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const code = await ctx.db.get(args.id);
    if (!code) throw new Error("Code not found");

    await ctx.db.patch(args.id, {
      isActive: !code.isActive,
    });
  },
});

// Get basic stats with growth trends (Admin only)
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    // Helper to calculate growth
    const calculateGrowth = (items: { createdAt?: number }[]) => {
      const currentPeriod = items.filter((i) => (i.createdAt ?? 0) >= thirtyDaysAgo).length;
      const lastPeriod = items.filter((i) => (i.createdAt ?? 0) >= sixtyDaysAgo && (i.createdAt ?? 0) < thirtyDaysAgo).length;

      if (lastPeriod === 0) return currentPeriod > 0 ? "+100%" : "0%";
      const growth = ((currentPeriod - lastPeriod) / lastPeriod) * 100;
      return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
    };

    // Helper to determine trend direction
    const getTrend = (items: { createdAt?: number }[]) => {
      const currentPeriod = items.filter((i) => (i.createdAt ?? 0) >= thirtyDaysAgo).length;
      const lastPeriod = items.filter((i) => (i.createdAt ?? 0) >= sixtyDaysAgo && (i.createdAt ?? 0) < thirtyDaysAgo).length;
      return currentPeriod >= lastPeriod ? "up" : "down";
    };

    const users = await ctx.db.query("users").collect();
    const scans = await ctx.db.query("halal_scans").collect();
    const docs = await ctx.db.query("halal_documents").collect();

    return {
      totalUsers: users.length,
      userGrowth: calculateGrowth(users),
      userTrend: getTrend(users),

      totalScans: scans.length,
      scanGrowth: calculateGrowth(scans),
      scanTrend: getTrend(scans),

      totalDocs: docs.length,
      docGrowth: calculateGrowth(docs),
      docTrend: getTrend(docs),
    };
  },
});

// Get all users (Admin only)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);
    return await ctx.db.query("users").order("desc").collect();
  },
});
