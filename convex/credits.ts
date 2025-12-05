import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

// Daily credit limits
const DAILY_LIMITS = {
  siapHalal: 3,
  dokumenHalal: 3,
  asistenHalal: 3,
};

// Get current date in UTC+7 (Asia/Jakarta)
function getDateInUTC7(): string {
  const now = new Date();
  // UTC+7 = UTC + 7 hours
  const utc7Offset = 7 * 60 * 60 * 1000;
  const utc7Date = new Date(now.getTime() + utc7Offset);
  return utc7Date.toISOString().split("T")[0];
}

// Get daily credit record for user (query only - no creation)
async function getDailyCredits(ctx: QueryCtx, userId: Id<"users">) {
  const today = getDateInUTC7();

  return await ctx.db
    .query("user_daily_credits")
    .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", today))
    .first();
}

// Get or create daily credit record for user (mutation context)
async function getOrCreateDailyCredits(ctx: MutationCtx, userId: Id<"users">) {
  const today = getDateInUTC7();

  const existing = await ctx.db
    .query("user_daily_credits")
    .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", today))
    .first();

  if (existing) {
    return existing;
  }

  // Create new record for today
  const newId = await ctx.db.insert("user_daily_credits", {
    userId,
    date: today,
    siapHalalCredits: DAILY_LIMITS.siapHalal,
    dokumenHalalCredits: DAILY_LIMITS.dokumenHalal,
    asistenHalalChats: DAILY_LIMITS.asistenHalal,
  });

  return {
    _id: newId,
    userId,
    date: today,
    siapHalalCredits: DAILY_LIMITS.siapHalal,
    dokumenHalalCredits: DAILY_LIMITS.dokumenHalal,
    asistenHalalChats: DAILY_LIMITS.asistenHalal,
  };
}

// Get current user's daily credits
export const getMyDailyCredits = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const credits = await getDailyCredits(ctx, userId);

    // Return defaults if no record exists yet (will be created on first use)
    // Cap values to current limits (in case old data has higher values)
    return {
      siapHalalCredits: Math.min(credits?.siapHalalCredits ?? DAILY_LIMITS.siapHalal, DAILY_LIMITS.siapHalal),
      dokumenHalalCredits: Math.min(credits?.dokumenHalalCredits ?? DAILY_LIMITS.dokumenHalal, DAILY_LIMITS.dokumenHalal),
      asistenHalalChats: Math.min(credits?.asistenHalalChats ?? DAILY_LIMITS.asistenHalal, DAILY_LIMITS.asistenHalal),
      limits: DAILY_LIMITS,
    };
  },
});

// Check if user has credits for a specific feature
export const checkCredits = query({
  args: {
    feature: v.union(v.literal("siapHalal"), v.literal("dokumenHalal"), v.literal("asistenHalal")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { hasCredits: false, remaining: 0, limit: 0 };

    const credits = await getDailyCredits(ctx, userId);

    let remaining: number;
    let limit: number;

    switch (args.feature) {
      case "siapHalal":
        limit = DAILY_LIMITS.siapHalal;
        remaining = Math.min(credits?.siapHalalCredits ?? limit, limit);
        break;
      case "dokumenHalal":
        limit = DAILY_LIMITS.dokumenHalal;
        remaining = Math.min(credits?.dokumenHalalCredits ?? limit, limit);
        break;
      case "asistenHalal":
        limit = DAILY_LIMITS.asistenHalal;
        remaining = Math.min(credits?.asistenHalalChats ?? limit, limit);
        break;
    }

    return {
      hasCredits: remaining > 0,
      remaining,
      limit,
    };
  },
});

// Use credit for Siap Halal
export const useSiapHalalCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const credits = await getOrCreateDailyCredits(ctx, userId);

    if (credits.siapHalalCredits <= 0) {
      throw new ConvexError("Kredit Siap Halal habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
    }

    await ctx.db.patch(credits._id, {
      siapHalalCredits: credits.siapHalalCredits - 1,
    });

    return {
      remaining: credits.siapHalalCredits - 1,
      limit: DAILY_LIMITS.siapHalal,
    };
  },
});

// Use credit for Dokumen Halal
export const useDokumenHalalCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const credits = await getOrCreateDailyCredits(ctx, userId);

    if (credits.dokumenHalalCredits <= 0) {
      throw new ConvexError("Kredit Dokumen Halal habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
    }

    await ctx.db.patch(credits._id, {
      dokumenHalalCredits: credits.dokumenHalalCredits - 1,
    });

    return {
      remaining: credits.dokumenHalalCredits - 1,
      limit: DAILY_LIMITS.dokumenHalal,
    };
  },
});

// Use credit for Asisten Halal (new chat)
export const useAsistenHalalCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const credits = await getOrCreateDailyCredits(ctx, userId);

    // Cap to current limit (in case old data has higher values)
    const currentCredits = Math.min(credits.asistenHalalChats, DAILY_LIMITS.asistenHalal);

    if (currentCredits <= 0) {
      throw new ConvexError("Kredit chat Asisten Halal habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
    }

    const newCredits = currentCredits - 1;
    await ctx.db.patch(credits._id, {
      asistenHalalChats: newCredits,
    });

    return {
      remaining: newCredits,
      limit: DAILY_LIMITS.asistenHalal,
    };
  },
});

// Internal mutation for cron job to clean up old records
export const cleanupOldCredits = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = getDateInUTC7();

    // Get all records that are not from today
    const oldRecords = await ctx.db
      .query("user_daily_credits")
      .filter((q) => q.neq(q.field("date"), today))
      .collect();

    // Delete old records
    for (const record of oldRecords) {
      await ctx.db.delete(record._id);
    }

    return { deleted: oldRecords.length };
  },
});
