import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Validation helpers
const SH_NUMBER_PATTERN = /^[A-Z0-9\-/]+$/i;

function validateHalalCertNumber(certNumber: string | undefined): void {
  if (!certNumber || certNumber.trim() === "") {
    return; // Optional field, skip validation if empty
  }

  const trimmedCert = certNumber.trim();

  // Check minimum length (typical SH number has at least 5 characters)
  if (trimmedCert.length < 5) {
    throw new ConvexError("Nomor sertifikat halal terlalu pendek (minimal 5 karakter)");
  }

  // Check format (alphanumeric with dashes and slashes)
  if (!SH_NUMBER_PATTERN.test(trimmedCert)) {
    throw new ConvexError("Format nomor sertifikat halal tidak valid (gunakan huruf, angka, '-', atau '/')");
  }
}

function validateCertExpiryDate(expiryDate: number | undefined, certNumber: string | undefined): void {
  // If no certificate number, no need to validate expiry
  if (!certNumber || certNumber.trim() === "") {
    return;
  }

  // If certificate number exists but no expiry date
  if (!expiryDate) {
    throw new ConvexError("Tanggal kadaluarsa sertifikat wajib diisi jika ada nomor sertifikat");
  }

  // Check if certificate is already expired
  const now = Date.now();
  if (expiryDate < now) {
    throw new ConvexError("Sertifikat halal sudah kadaluarsa. Mohon perbarui sertifikat dari supplier");
  }

  // Warn if expiring soon (within 30 days) - but don't throw error
  const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;
  if (expiryDate < thirtyDaysFromNow) {
    // This is just a warning, we'll handle in UI
    console.warn(`Certificate expiring soon: ${new Date(expiryDate).toLocaleDateString()}`);
  }
}

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

// Query to get expiring certificates (within 30 days)
export const getExpiringCertificates = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const ingredients = await ctx.db
      .query("ingredients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const now = Date.now();
    const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;

    return ingredients.filter(
      (ingredient) =>
        ingredient.certExpiryDate && ingredient.certExpiryDate < thirtyDaysFromNow && ingredient.certExpiryDate > now,
    );
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

    // Validate certificate number format
    validateHalalCertNumber(args.halalCertNumber);

    // Validate expiry date
    validateCertExpiryDate(args.certExpiryDate, args.halalCertNumber);

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

    // Validate certificate number format
    validateHalalCertNumber(args.halalCertNumber);

    // Validate expiry date
    validateCertExpiryDate(args.certExpiryDate, args.halalCertNumber);

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
