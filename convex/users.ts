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

// Get user profile
export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Deduct credits
export const deductCredits = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    if ((user.credits ?? 0) < args.amount) throw new Error("Insufficient credits");

    await ctx.db.patch(args.userId, {
      credits: (user.credits ?? 0) - args.amount,
    });
  },
});
