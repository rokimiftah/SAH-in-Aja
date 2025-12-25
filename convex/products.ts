import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getMyProducts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("products")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    productCode: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const productId = await ctx.db.insert("products", {
      userId,
      name: args.name,
      productCode: args.productCode,
      description: args.description,
      createdAt: Date.now(),
    });

    return productId;
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.string(),
    productCode: v.optional(v.string()),
    description: v.optional(v.string()),
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

    await ctx.db.patch(args.productId, {
      name: args.name,
      productCode: args.productCode,
      description: args.description,
    });
  },
});

export const deleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const product = await ctx.db.get(args.productId);
    if (!product || product.userId !== userId) {
      throw new ConvexError("Produk tidak ditemukan");
    }

    // Delete all product-ingredient mappings
    const mappings = await ctx.db
      .query("product_ingredients")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    for (const mapping of mappings) {
      await ctx.db.delete(mapping._id);
    }

    await ctx.db.delete(args.productId);
  },
});
