import type { Doc } from "./_generated/dataModel";

import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getMyMappings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("product_ingredients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getMappingsByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const product = await ctx.db.get(args.productId);
    if (!product || product.userId !== userId) {
      return [];
    }

    const mappings = await ctx.db
      .query("product_ingredients")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    const ingredients: Doc<"ingredients">[] = [];
    for (const mapping of mappings) {
      const ingredient = await ctx.db.get(mapping.ingredientId);
      if (ingredient) {
        ingredients.push(ingredient);
      }
    }

    return ingredients;
  },
});

export const getTraceabilityMatrix = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { products: [], ingredients: [], mappings: [] };

    const products = await ctx.db
      .query("products")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const ingredients = await ctx.db
      .query("ingredients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const mappings = await ctx.db
      .query("product_ingredients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return { products, ingredients, mappings };
  },
});

export const addMapping = mutation({
  args: {
    productId: v.id("products"),
    ingredientId: v.id("ingredients"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const product = await ctx.db.get(args.productId);
    if (!product || product.userId !== userId) {
      throw new ConvexError("Produk tidak ditemukan");
    }

    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient || ingredient.userId !== userId) {
      throw new ConvexError("Bahan tidak ditemukan");
    }

    // Check if mapping already exists
    const existingMappings = await ctx.db
      .query("product_ingredients")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    const alreadyExists = existingMappings.some((m) => m.ingredientId === args.ingredientId);
    if (alreadyExists) {
      return; // Already mapped
    }

    await ctx.db.insert("product_ingredients", {
      userId,
      productId: args.productId,
      ingredientId: args.ingredientId,
    });
  },
});

export const removeMapping = mutation({
  args: {
    productId: v.id("products"),
    ingredientId: v.id("ingredients"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const mappings = await ctx.db
      .query("product_ingredients")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    const mapping = mappings.find((m) => m.ingredientId === args.ingredientId);
    if (mapping && mapping.userId === userId) {
      await ctx.db.delete(mapping._id);
    }
  },
});

export const updateProductIngredients = mutation({
  args: {
    productId: v.id("products"),
    ingredientIds: v.array(v.id("ingredients")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const product = await ctx.db.get(args.productId);
    if (!product || product.userId !== userId) {
      throw new ConvexError("Produk tidak ditemukan");
    }

    // Get current mappings
    const currentMappings = await ctx.db
      .query("product_ingredients")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    const currentIngredientIds = new Set(currentMappings.map((m) => m.ingredientId));
    const newIngredientIds = new Set(args.ingredientIds);

    // Remove mappings not in new list
    for (const mapping of currentMappings) {
      if (!newIngredientIds.has(mapping.ingredientId)) {
        await ctx.db.delete(mapping._id);
      }
    }

    // Add new mappings
    for (const ingredientId of args.ingredientIds) {
      if (!currentIngredientIds.has(ingredientId)) {
        const ingredient = await ctx.db.get(ingredientId);
        if (ingredient && ingredient.userId === userId) {
          await ctx.db.insert("product_ingredients", {
            userId,
            productId: args.productId,
            ingredientId,
          });
        }
      }
    }
  },
});
