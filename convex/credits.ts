import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

// Daily credit limits
const DAILY_LIMITS = {
  cekDapur: 3,
  dokumenHalal: 3,
  asistenHalal: 5,
  cekBahan: 10,
  voiceAudit: 2,
  training: 3,
};

// Get current date in UTC+7 (Asia/Jakarta)
function getDateInUTC7(): string {
  const now = new Date();
  const jakartaDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const year = jakartaDate.getFullYear();
  const month = String(jakartaDate.getMonth() + 1).padStart(2, "0");
  const day = String(jakartaDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
    cekDapurCredits: DAILY_LIMITS.cekDapur,
    dokumenHalalCredits: DAILY_LIMITS.dokumenHalal,
    asistenHalalChats: DAILY_LIMITS.asistenHalal,
    cekBahanCredits: DAILY_LIMITS.cekBahan,
    voiceAuditCredits: DAILY_LIMITS.voiceAudit,
    trainingCredits: DAILY_LIMITS.training,
  });

  return {
    _id: newId,
    userId,
    date: today,
    cekDapurCredits: DAILY_LIMITS.cekDapur,
    dokumenHalalCredits: DAILY_LIMITS.dokumenHalal,
    asistenHalalChats: DAILY_LIMITS.asistenHalal,
    cekBahanCredits: DAILY_LIMITS.cekBahan,
    voiceAuditCredits: DAILY_LIMITS.voiceAudit,
    trainingCredits: DAILY_LIMITS.training,
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
    // Only cap if value <= daily limit (not boosted by promo code)
    const cekDapur = credits?.cekDapurCredits ?? DAILY_LIMITS.cekDapur;
    const dokumenHalal = credits?.dokumenHalalCredits ?? DAILY_LIMITS.dokumenHalal;
    const asistenHalal = credits?.asistenHalalChats ?? DAILY_LIMITS.asistenHalal;
    const cekBahan = credits?.cekBahanCredits ?? DAILY_LIMITS.cekBahan;
    const voiceAudit = credits?.voiceAuditCredits ?? DAILY_LIMITS.voiceAudit;
    const training = credits?.trainingCredits ?? DAILY_LIMITS.training;

    return {
      cekDapurCredits: cekDapur > DAILY_LIMITS.cekDapur ? cekDapur : Math.min(cekDapur, DAILY_LIMITS.cekDapur),
      dokumenHalalCredits:
        dokumenHalal > DAILY_LIMITS.dokumenHalal ? dokumenHalal : Math.min(dokumenHalal, DAILY_LIMITS.dokumenHalal),
      asistenHalalChats:
        asistenHalal > DAILY_LIMITS.asistenHalal ? asistenHalal : Math.min(asistenHalal, DAILY_LIMITS.asistenHalal),
      cekBahanCredits: cekBahan > DAILY_LIMITS.cekBahan ? cekBahan : Math.min(cekBahan, DAILY_LIMITS.cekBahan),
      voiceAuditCredits: voiceAudit > DAILY_LIMITS.voiceAudit ? voiceAudit : Math.min(voiceAudit, DAILY_LIMITS.voiceAudit),
      trainingCredits: training > DAILY_LIMITS.training ? training : Math.min(training, DAILY_LIMITS.training),
      limits: DAILY_LIMITS,
    };
  },
});

// Check if user has credits for a specific feature
export const checkCredits = query({
  args: {
    feature: v.union(
      v.literal("cekDapur"),
      v.literal("dokumenHalal"),
      v.literal("asistenHalal"),
      v.literal("cekBahan"),
      v.literal("voiceAudit"),
      v.literal("training"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { hasCredits: false, remaining: 0, limit: 0 };

    const credits = await getDailyCredits(ctx, userId);

    let remaining: number;
    let limit: number;

    switch (args.feature) {
      case "cekDapur":
        limit = DAILY_LIMITS.cekDapur;
        remaining = credits?.cekDapurCredits ?? limit;
        if (remaining <= limit) remaining = Math.min(remaining, limit);
        break;
      case "dokumenHalal":
        limit = DAILY_LIMITS.dokumenHalal;
        remaining = credits?.dokumenHalalCredits ?? limit;
        if (remaining <= limit) remaining = Math.min(remaining, limit);
        break;
      case "asistenHalal":
        limit = DAILY_LIMITS.asistenHalal;
        remaining = credits?.asistenHalalChats ?? limit;
        if (remaining <= limit) remaining = Math.min(remaining, limit);
        break;
      case "cekBahan":
        limit = DAILY_LIMITS.cekBahan;
        remaining = credits?.cekBahanCredits ?? limit;
        if (remaining <= limit) remaining = Math.min(remaining, limit);
        break;
      case "voiceAudit":
        limit = DAILY_LIMITS.voiceAudit;
        remaining = credits?.voiceAuditCredits ?? limit;
        if (remaining <= limit) remaining = Math.min(remaining, limit);
        break;
      case "training":
        limit = DAILY_LIMITS.training;
        remaining = credits?.trainingCredits ?? limit;
        if (remaining <= limit) remaining = Math.min(remaining, limit);
        break;
    }

    return {
      hasCredits: remaining > 0,
      remaining,
      limit,
    };
  },
});

// Use credit for Cek Dapur
export const useCekDapurCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const credits = await getOrCreateDailyCredits(ctx, userId);

    // Re-fetch to get latest value (prevents race condition)
    const freshCredits = await ctx.db.get(credits._id);
    if (!freshCredits) throw new ConvexError("Data kredit tidak ditemukan");

    if (freshCredits.cekDapurCredits <= 0) {
      throw new ConvexError("Kredit Cek Dapur Halal habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
    }

    const newCredits = freshCredits.cekDapurCredits - 1;
    await ctx.db.patch(credits._id, {
      cekDapurCredits: newCredits,
    });

    return {
      remaining: newCredits,
      limit: DAILY_LIMITS.cekDapur,
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

    // Re-fetch to get latest value (prevents race condition)
    const freshCredits = await ctx.db.get(credits._id);
    if (!freshCredits) throw new ConvexError("Data kredit tidak ditemukan");

    if (freshCredits.dokumenHalalCredits <= 0) {
      throw new ConvexError("Kredit Dokumen Halal habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
    }

    const newCredits = freshCredits.dokumenHalalCredits - 1;
    await ctx.db.patch(credits._id, {
      dokumenHalalCredits: newCredits,
    });

    return {
      remaining: newCredits,
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

    // Re-fetch to get latest value (prevents race condition)
    const freshCredits = await ctx.db.get(credits._id);
    if (!freshCredits) throw new ConvexError("Data kredit tidak ditemukan");

    // Only cap if not boosted (credits <= limit means not boosted)
    const currentCredits =
      freshCredits.asistenHalalChats > DAILY_LIMITS.asistenHalal
        ? freshCredits.asistenHalalChats
        : Math.min(freshCredits.asistenHalalChats, DAILY_LIMITS.asistenHalal);

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

// Use credit for Cek Bahan (material scan)
export const useCekBahanCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const credits = await getOrCreateDailyCredits(ctx, userId);

    // Re-fetch to get latest value (prevents race condition)
    const freshCredits = await ctx.db.get(credits._id);
    if (!freshCredits) throw new ConvexError("Data kredit tidak ditemukan");

    const currentCredits = freshCredits.cekBahanCredits ?? DAILY_LIMITS.cekBahan;
    const cappedCredits =
      currentCredits > DAILY_LIMITS.cekBahan ? currentCredits : Math.min(currentCredits, DAILY_LIMITS.cekBahan);

    if (cappedCredits <= 0) {
      throw new ConvexError("Kredit Cek Bahan habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
    }

    const newCredits = cappedCredits - 1;
    await ctx.db.patch(credits._id, {
      cekBahanCredits: newCredits,
    });

    return {
      remaining: newCredits,
      limit: DAILY_LIMITS.cekBahan,
    };
  },
});

// Use credit for Voice Audit (simulasi audit suara)
export const useVoiceAuditCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const credits = await getOrCreateDailyCredits(ctx, userId);

    // Re-fetch to get latest value (prevents race condition)
    const freshCredits = await ctx.db.get(credits._id);
    if (!freshCredits) throw new ConvexError("Data kredit tidak ditemukan");

    const currentCredits = freshCredits.voiceAuditCredits ?? DAILY_LIMITS.voiceAudit;
    const cappedCredits =
      currentCredits > DAILY_LIMITS.voiceAudit ? currentCredits : Math.min(currentCredits, DAILY_LIMITS.voiceAudit);

    if (cappedCredits <= 0) {
      throw new ConvexError("Kredit Simulasi Audit habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
    }

    const newCredits = cappedCredits - 1;
    await ctx.db.patch(credits._id, {
      voiceAuditCredits: newCredits,
    });

    return {
      remaining: newCredits,
      limit: DAILY_LIMITS.voiceAudit,
    };
  },
});

// Use credit for Training (kuis pelatihan halal)
export const useTrainingCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const credits = await getOrCreateDailyCredits(ctx, userId);

    // Re-fetch to get latest value (prevents race condition)
    const freshCredits = await ctx.db.get(credits._id);
    if (!freshCredits) throw new ConvexError("Data kredit tidak ditemukan");

    const currentCredits = freshCredits.trainingCredits ?? DAILY_LIMITS.training;
    const cappedCredits =
      currentCredits > DAILY_LIMITS.training ? currentCredits : Math.min(currentCredits, DAILY_LIMITS.training);

    if (cappedCredits <= 0) {
      throw new ConvexError("Kredit Pelatihan Halal habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
    }

    const newCredits = cappedCredits - 1;
    await ctx.db.patch(credits._id, {
      trainingCredits: newCredits,
    });

    return {
      remaining: newCredits,
      limit: DAILY_LIMITS.training,
    };
  },
});

// Apply promo code
export const applyPromoCode = mutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const code = args.code.trim();

    // Find promo code in database
    const promoCode = await ctx.db
      .query("promo_codes")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!promoCode) {
      throw new ConvexError("Kode promo tidak valid");
    }

    // Check if promo code is active
    if (!promoCode.isActive) {
      throw new ConvexError("Kode promo sudah tidak aktif");
    }

    // Check if promo code has expired
    if (promoCode.expiresAt && promoCode.expiresAt < Date.now()) {
      throw new ConvexError("Kode promo sudah kadaluarsa");
    }

    // Check if max usage reached
    if (promoCode.maxUsage && promoCode.usageCount >= promoCode.maxUsage) {
      throw new ConvexError("Kode promo sudah mencapai batas penggunaan");
    }

    // Check if user already used this promo code
    const existingUsage = await ctx.db
      .query("promo_code_usages")
      .withIndex("by_user_code", (q) => q.eq("userId", userId).eq("promoCodeId", promoCode._id))
      .first();

    if (existingUsage) {
      throw new ConvexError("Anda sudah pernah menggunakan kode promo ini");
    }

    // Get or create daily credits
    const credits = await getOrCreateDailyCredits(ctx, userId);

    // Add credits from promo code
    await ctx.db.patch(credits._id, {
      cekDapurCredits: credits.cekDapurCredits + promoCode.credits,
      dokumenHalalCredits: credits.dokumenHalalCredits + promoCode.credits,
      asistenHalalChats: credits.asistenHalalChats + promoCode.credits,
      cekBahanCredits: credits.cekBahanCredits + promoCode.credits,
      voiceAuditCredits: credits.voiceAuditCredits + promoCode.credits,
      trainingCredits: credits.trainingCredits + promoCode.credits,
    });

    // Record usage
    await ctx.db.insert("promo_code_usages", {
      userId,
      promoCodeId: promoCode._id,
      usedAt: Date.now(),
    });

    // Increment usage count
    await ctx.db.patch(promoCode._id, {
      usageCount: promoCode.usageCount + 1,
    });

    return {
      success: true,
      message: `Kode promo berhasil!`,
    };
  },
});

// One-time migration: Create daily credits for all existing users who don't have one
// Run this from Convex dashboard: internal.credits.migrateExistingUsers
export const migrateExistingUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = getDateInUTC7();
    const users = await ctx.db.query("users").collect();

    let created = 0;
    let skipped = 0;

    for (const user of users) {
      const existing = await ctx.db
        .query("user_daily_credits")
        .withIndex("by_user_date", (q) => q.eq("userId", user._id).eq("date", today))
        .first();

      if (existing) {
        skipped++;
        continue;
      }

      await ctx.db.insert("user_daily_credits", {
        userId: user._id,
        date: today,
        cekDapurCredits: DAILY_LIMITS.cekDapur,
        dokumenHalalCredits: DAILY_LIMITS.dokumenHalal,
        asistenHalalChats: DAILY_LIMITS.asistenHalal,
        cekBahanCredits: DAILY_LIMITS.cekBahan,
        voiceAuditCredits: DAILY_LIMITS.voiceAudit,
        trainingCredits: DAILY_LIMITS.training,
      });
      created++;
    }

    return { created, skipped, total: users.length };
  },
});

// Internal mutation to create daily credits for a new user (called from auth.ts)
export const createDailyCreditsForUser = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const today = getDateInUTC7();

    // Check if already exists
    const existing = await ctx.db
      .query("user_daily_credits")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId).eq("date", today))
      .first();

    if (existing) {
      return { id: existing._id, created: false };
    }

    const newId = await ctx.db.insert("user_daily_credits", {
      userId: args.userId,
      date: today,
      cekDapurCredits: DAILY_LIMITS.cekDapur,
      dokumenHalalCredits: DAILY_LIMITS.dokumenHalal,
      asistenHalalChats: DAILY_LIMITS.asistenHalal,
      cekBahanCredits: DAILY_LIMITS.cekBahan,
      voiceAuditCredits: DAILY_LIMITS.voiceAudit,
      trainingCredits: DAILY_LIMITS.training,
    });

    return { id: newId, created: true };
  },
});

// Internal mutation for cron job to reset all user credits at 00:00 UTC+7
// Preserves bonus credits from promo codes (credits above daily limit)
export const resetAllDailyCredits = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = getDateInUTC7();

    // Get all users
    const users = await ctx.db.query("users").collect();

    let created = 0;
    let updated = 0;

    for (const user of users) {
      // First, check for old records to get any bonus credits to carry over
      const oldRecords = await ctx.db
        .query("user_daily_credits")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      // Filter out today's record and sort by date descending to get the latest previous record
      const latestPreviousRecord = oldRecords.filter((r) => r.date !== today).sort((a, b) => b.date.localeCompare(a.date))[0];

      // Calculate bonus credits (credits above daily limit) to carry over
      let bonusCekDapur = 0;
      let bonusDokumenHalal = 0;
      let bonusAsistenHalal = 0;
      let bonusCekBahan = 0;
      let bonusVoiceAudit = 0;
      let bonusTraining = 0;

      if (latestPreviousRecord) {
        bonusCekDapur = Math.max(0, latestPreviousRecord.cekDapurCredits - DAILY_LIMITS.cekDapur);
        bonusDokumenHalal = Math.max(0, latestPreviousRecord.dokumenHalalCredits - DAILY_LIMITS.dokumenHalal);
        bonusAsistenHalal = Math.max(0, latestPreviousRecord.asistenHalalChats - DAILY_LIMITS.asistenHalal);
        bonusCekBahan = Math.max(0, latestPreviousRecord.cekBahanCredits - DAILY_LIMITS.cekBahan);
        bonusVoiceAudit = Math.max(0, latestPreviousRecord.voiceAuditCredits - DAILY_LIMITS.voiceAudit);
        bonusTraining = Math.max(0, latestPreviousRecord.trainingCredits - DAILY_LIMITS.training);
      }

      // Check if user has a record for today
      const existingToday = await ctx.db
        .query("user_daily_credits")
        .withIndex("by_user_date", (q) => q.eq("userId", user._id).eq("date", today))
        .first();

      if (existingToday) {
        // Reset to daily limit + preserve bonus credits
        await ctx.db.patch(existingToday._id, {
          cekDapurCredits: DAILY_LIMITS.cekDapur + bonusCekDapur,
          dokumenHalalCredits: DAILY_LIMITS.dokumenHalal + bonusDokumenHalal,
          asistenHalalChats: DAILY_LIMITS.asistenHalal + bonusAsistenHalal,
          cekBahanCredits: DAILY_LIMITS.cekBahan + bonusCekBahan,
          voiceAuditCredits: DAILY_LIMITS.voiceAudit + bonusVoiceAudit,
          trainingCredits: DAILY_LIMITS.training + bonusTraining,
        });
        updated++;
      } else {
        // Create new record for today with daily limit + bonus carry over
        await ctx.db.insert("user_daily_credits", {
          userId: user._id,
          date: today,
          cekDapurCredits: DAILY_LIMITS.cekDapur + bonusCekDapur,
          dokumenHalalCredits: DAILY_LIMITS.dokumenHalal + bonusDokumenHalal,
          asistenHalalChats: DAILY_LIMITS.asistenHalal + bonusAsistenHalal,
          cekBahanCredits: DAILY_LIMITS.cekBahan + bonusCekBahan,
          voiceAuditCredits: DAILY_LIMITS.voiceAudit + bonusVoiceAudit,
          trainingCredits: DAILY_LIMITS.training + bonusTraining,
        });
        created++;
      }
    }

    // Clean up old records (from previous days)
    const oldRecords = await ctx.db
      .query("user_daily_credits")
      .filter((q) => q.neq(q.field("date"), today))
      .collect();

    for (const record of oldRecords) {
      await ctx.db.delete(record._id);
    }

    return { created, updated, deleted: oldRecords.length };
  },
});
