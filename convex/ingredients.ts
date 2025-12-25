import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getMyIngredients = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("ingredients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createIngredient = mutation({
  args: {
    name: v.string(),
    supplier: v.string(),
    halalCertNumber: v.optional(v.string()),
    certExpiryDate: v.optional(v.number()),
    halalStatus: v.union(v.literal("halal"), v.literal("dalam_proses"), v.literal("perlu_verifikasi"), v.literal("alami")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const ingredientId = await ctx.db.insert("ingredients", {
      userId,
      name: args.name,
      supplier: args.supplier,
      halalCertNumber: args.halalCertNumber,
      certExpiryDate: args.certExpiryDate,
      halalStatus: args.halalStatus,
      createdAt: Date.now(),
    });

    return ingredientId;
  },
});

export const updateIngredient = mutation({
  args: {
    ingredientId: v.id("ingredients"),
    name: v.string(),
    supplier: v.string(),
    halalCertNumber: v.optional(v.string()),
    certExpiryDate: v.optional(v.number()),
    halalStatus: v.union(v.literal("halal"), v.literal("dalam_proses"), v.literal("perlu_verifikasi"), v.literal("alami")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient || ingredient.userId !== userId) {
      throw new ConvexError("Bahan tidak ditemukan");
    }

    await ctx.db.patch(args.ingredientId, {
      name: args.name,
      supplier: args.supplier,
      halalCertNumber: args.halalCertNumber,
      certExpiryDate: args.certExpiryDate,
      halalStatus: args.halalStatus,
    });
  },
});

export const deleteIngredient = mutation({
  args: { ingredientId: v.id("ingredients") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient || ingredient.userId !== userId) {
      throw new ConvexError("Bahan tidak ditemukan");
    }

    // Delete all product-ingredient mappings
    const mappings = await ctx.db
      .query("product_ingredients")
      .withIndex("by_ingredient", (q) => q.eq("ingredientId", args.ingredientId))
      .collect();

    for (const mapping of mappings) {
      await ctx.db.delete(mapping._id);
    }

    await ctx.db.delete(args.ingredientId);
  },
});
