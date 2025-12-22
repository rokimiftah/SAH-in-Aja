import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Get consultations by user (authorized - only own data or admin)
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
      .query("halal_consultations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get single consultation (authorized - only owner or admin)
export const get = query({
  args: { consultationId: v.id("halal_consultations") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) return null;

    // Check if requesting own data or is admin
    if (currentUserId !== consultation.userId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ConvexError("Tidak memiliki akses ke data ini");
      }
    }

    return consultation;
  },
});

// Create new consultation (authorized - only for own userId)
export const create = mutation({
  args: {
    userId: v.id("users"),
    initialMessage: v.string(),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    // Only allow creating consultation for own userId
    if (currentUserId !== args.userId) {
      throw new ConvexError("Tidak dapat membuat konsultasi untuk user lain");
    }

    const consultationId = await ctx.db.insert("halal_consultations", {
      userId: args.userId,
      messages: [
        {
          role: "user",
          content: args.initialMessage,
          timestamp: Date.now(),
        },
      ],
      topic: args.topic,
      resolved: false,
      createdAt: Date.now(),
    });
    return consultationId;
  },
});

// Add message to consultation (authorized - only owner)
export const addMessage = mutation({
  args: {
    consultationId: v.id("halal_consultations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) {
      throw new ConvexError("Konsultasi tidak ditemukan");
    }

    // Only owner can add messages to their consultation
    if (currentUserId !== consultation.userId) {
      throw new ConvexError("Tidak memiliki akses ke konsultasi ini");
    }

    await ctx.db.patch(args.consultationId, {
      messages: [
        ...consultation.messages,
        {
          role: args.role,
          content: args.content,
          timestamp: Date.now(),
        },
      ],
    });
  },
});

// Mark consultation as resolved (authorized - only owner or admin)
export const resolve = mutation({
  args: { consultationId: v.id("halal_consultations") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) {
      throw new ConvexError("Konsultasi tidak ditemukan");
    }

    // Check if resolving own consultation or is admin
    if (currentUserId !== consultation.userId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ConvexError("Tidak memiliki akses ke konsultasi ini");
      }
    }

    await ctx.db.patch(args.consultationId, { resolved: true });
  },
});
