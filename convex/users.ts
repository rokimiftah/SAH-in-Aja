import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Get current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Generate upload URL for avatar
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Update user profile (for authenticated users)
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    businessName: v.optional(v.string()),
    businessType: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const { storageId, ...updates } = args;
    let imageUrl: string | undefined;
    if (storageId) {
      const url = await ctx.storage.getUrl(storageId);
      imageUrl = url ?? undefined;
    }

    const filteredUpdates = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));

    await ctx.db.patch(userId, {
      ...filteredUpdates,
      ...(imageUrl && { image: imageUrl, storageId }),
    });
  },
});

// Get user profile (authenticated users only - returns limited public data for others)
export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // If requesting own profile or is admin, return full data
    if (currentUserId === args.userId) {
      return user;
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (currentUser?.role === "admin") {
      return user;
    }

    // For other users, return limited public data only
    return {
      _id: user._id,
      name: user.name,
      image: user.image,
      businessName: user.businessName,
    };
  },
});

// Get user by email (admin only)
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.role !== "admin") {
      throw new ConvexError("Hanya admin yang dapat mencari user berdasarkan email");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Deduct credits (internal use only - caller must be the user themselves)
export const deductCredits = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    // Only allow deducting own credits
    if (currentUserId !== args.userId) {
      throw new ConvexError("Tidak dapat mengurangi kredit user lain");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) throw new ConvexError("User tidak ditemukan");
    if ((user.credits ?? 0) < args.amount) throw new ConvexError("Kredit tidak mencukupi");

    await ctx.db.patch(args.userId, {
      credits: (user.credits ?? 0) - args.amount,
    });
  },
});
