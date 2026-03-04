/**
 * Mayar.id Payment Integration
 * Handles Top-Up Kredit AI via Mayar payment gateway
 * Docs: https://docs.mayar.id
 */

import type { Id } from "./_generated/dataModel";

import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { api, internal } from "./_generated/api";
import { action, internalMutation, query } from "./_generated/server";

// Credit packages configuration
export const CREDIT_PACKAGES = [
  {
    id: "credits_50",
    credits: 50,
    amount: 25000, // IDR
    name: "Paket Starter",
    description: "50 Kredit AI",
    popular: false,
  },
  {
    id: "credits_100",
    credits: 100,
    amount: 45000, // IDR - 10% discount
    name: "Paket Reguler",
    description: "100 Kredit AI (Hemat 10%)",
    popular: true,
  },
  {
    id: "credits_250",
    credits: 250,
    amount: 100000, // IDR - 20% discount
    name: "Paket Juragan",
    description: "250 Kredit AI (Hemat 20%)",
    popular: false,
  },
] as const;

export type CreditPackage = (typeof CREDIT_PACKAGES)[number];

// Mayar API configuration
// Production: https://api.mayar.id/hl/v1
// Sandbox: https://api.mayar.club/hl/v1
const MAYAR_BASE_URL = process.env.MAYAR_SANDBOX === "true" ? "https://api.mayar.club/hl/v1" : "https://api.mayar.id/hl/v1";

// Webhook secret for verification (generate a random string and configure in Mayar webhook URL)
// Example webhook URL: https://your-project.convex.site/api/mayar-webhook?token=YOUR_SECRET_HERE
const MAYAR_WEBHOOK_SECRET = process.env.MAYAR_WEBHOOK_SECRET;

/**
 * Verify webhook request is from Mayar
 * Since Mayar doesn't provide HMAC signature verification, we use:
 * 1. Secret token in webhook URL query parameter (e.g., ?token=SECRET)
 *
 * To configure:
 * 1. Generate a random secret: openssl rand -hex 32
 * 2. Add MAYAR_WEBHOOK_SECRET to Convex environment variables
 * 3. Set webhook URL in Mayar dashboard: https://your-project.convex.site/api/mayar-webhook?token=YOUR_SECRET
 */
export function verifyWebhookRequest(token: string | null, webhookData: unknown): { valid: boolean; error?: string } {
  // Webhook secret MUST be configured for security
  if (!MAYAR_WEBHOOK_SECRET) {
    console.error("MAYAR_WEBHOOK_SECRET is not configured");
    return { valid: false, error: "Webhook secret not configured" };
  }

  // Verify webhook secret token
  if (!token || token !== MAYAR_WEBHOOK_SECRET) {
    return { valid: false, error: "Invalid webhook token" };
  }

  // Verify the webhook data has expected structure
  const data = webhookData as Record<string, unknown>;
  if (!data?.event || !data?.data) {
    return { valid: false, error: "Invalid webhook payload structure" };
  }

  return { valid: true };
}

// Get all available credit packages
export const getCreditPackages = query({
  args: {},
  handler: async () => {
    return CREDIT_PACKAGES;
  },
});

// Get user's payment history
export const getMyPayments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const payments = await ctx.db
      .query("mayar_payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);

    return payments;
  },
});

// Create payment request via Mayar API
export const createPayment = action({
  args: {
    packageId: v.string(),
  },
  handler: async (ctx, args): Promise<{ paymentLink: string; paymentId: Id<"mayar_payments"> }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    // Find the package
    const pkg = CREDIT_PACKAGES.find((p) => p.id === args.packageId);
    if (!pkg) throw new ConvexError("Paket kredit tidak valid");

    // Get user info for payment
    const user = await ctx.runQuery(api.users.getCurrentUser, {});
    if (!user) throw new ConvexError("User tidak ditemukan");

    const mayarApiKey = process.env.MAYAR_API_KEY;
    if (!mayarApiKey) throw new ConvexError("Konfigurasi pembayaran belum selesai");

    // Log environment for debugging
    const isSandbox = process.env.MAYAR_SANDBOX === "true";
    console.log("Mayar environment:", isSandbox ? "SANDBOX" : "PRODUCTION");
    console.log("Mayar API URL:", MAYAR_BASE_URL);

    // Validate required fields for Mayar
    const phone = (user.phone || "").replace(/\D/g, ""); // Remove non-digit characters
    if (phone.length < 10) {
      throw new ConvexError("Nomor telepon diperlukan untuk pembayaran. Silakan lengkapi profil Anda di menu Edit Profile.");
    }

    const email = user.email || "";
    if (!email) {
      throw new ConvexError("Email diperlukan untuk pembayaran. Silakan lengkapi profil Anda.");
    }

    // Create payment request via Mayar API
    // Docs: https://docs.mayar.id/api-reference/reqpayment/create
    // Endpoint: /payment/create (simpler, uses amount directly without items array)
    const response = await fetch(`${MAYAR_BASE_URL}/payment/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mayarApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name || "Pengguna SAH-in Aja",
        email: email,
        mobile: phone,
        amount: pkg.amount,
        description: `${pkg.name} - ${pkg.credits} Kredit AI untuk SAH-in Aja!`,
        redirectUrl: `${process.env.SITE_URL || "https://sahin.biz.id"}/dashboard?payment=success`,
        // Set expiry to 24 hours from now
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Mayar API error:", error);
      throw new ConvexError("Gagal membuat link pembayaran. Silakan coba lagi.");
    }

    const data = await response.json();
    console.log("Mayar API response:", JSON.stringify(data, null, 2));

    if (data.statusCode !== 200 || !data.data?.link) {
      console.error("Mayar API unexpected response:", data);
      throw new ConvexError("Gagal membuat link pembayaran. Silakan coba lagi.");
    }

    // Log the payment link for debugging
    console.log("Mayar payment link:", data.data.link);

    // Store payment record in database
    const paymentId = await ctx.runMutation(internal.mayar.createPaymentRecord, {
      userId,
      mayarTransactionId: data.data.transactionId || data.data.transaction_id,
      paymentLink: data.data.link,
      packageId: pkg.id,
      credits: pkg.credits,
      amount: pkg.amount,
    });

    return {
      paymentLink: data.data.link,
      paymentId,
    };
  },
});

// Internal mutation to create payment record
export const createPaymentRecord = internalMutation({
  args: {
    userId: v.id("users"),
    mayarTransactionId: v.string(),
    paymentLink: v.string(),
    packageId: v.string(),
    credits: v.number(),
    amount: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"mayar_payments">> => {
    return await ctx.db.insert("mayar_payments", {
      userId: args.userId,
      mayarTransactionId: args.mayarTransactionId,
      paymentLink: args.paymentLink,
      packageId: args.packageId,
      credits: args.credits,
      amount: args.amount,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// Handle payment.received webhook from Mayar
export const handlePaymentReceived = internalMutation({
  args: {
    webhookData: v.any(),
  },
  handler: async (ctx, args) => {
    const data = args.webhookData.data;

    // Find the payment by Mayar transaction ID
    const payment = await ctx.db
      .query("mayar_payments")
      .withIndex("by_mayarTransactionId", (q) => q.eq("mayarTransactionId", data.transactionId || data.id))
      .first();

    if (!payment) {
      console.error("Payment not found for transaction:", data.transactionId || data.id);
      return { success: false, error: "Payment not found" };
    }

    // Skip if already paid
    if (payment.status === "paid") {
      return { success: true, alreadyPaid: true };
    }

    // Update payment status
    await ctx.db.patch(payment._id, {
      status: "paid",
      paidAt: Date.now(),
      mayarPaymentId: data.id,
      mayarWebhookData: args.webhookData,
    });

    // Add credits to user's daily credits
    // Get today's date in UTC+7
    const now = new Date();
    const jakartaDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const year = jakartaDate.getFullYear();
    const month = String(jakartaDate.getMonth() + 1).padStart(2, "0");
    const day = String(jakartaDate.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    // Get or create daily credits record
    const dailyCredits = await ctx.db
      .query("user_daily_credits")
      .withIndex("by_user_date", (q) => q.eq("userId", payment.userId).eq("date", today))
      .first();

    if (dailyCredits) {
      // Add credits to all features
      await ctx.db.patch(dailyCredits._id, {
        cekDapurCredits: dailyCredits.cekDapurCredits + payment.credits,
        dokumenHalalCredits: dailyCredits.dokumenHalalCredits + payment.credits,
        asistenHalalChats: dailyCredits.asistenHalalChats + payment.credits,
        cekBahanCredits: dailyCredits.cekBahanCredits + payment.credits,
        voiceAuditCredits: dailyCredits.voiceAuditCredits + payment.credits,
        trainingCredits: dailyCredits.trainingCredits + payment.credits,
      });
    } else {
      // Create new daily credits record with purchased credits
      const dailyLimits = {
        cekDapur: 3,
        dokumenHalal: 3,
        asistenHalal: 5,
        cekBahan: 10,
        voiceAudit: 2,
        training: 3,
      };

      await ctx.db.insert("user_daily_credits", {
        userId: payment.userId,
        date: today,
        cekDapurCredits: dailyLimits.cekDapur + payment.credits,
        dokumenHalalCredits: dailyLimits.dokumenHalal + payment.credits,
        asistenHalalChats: dailyLimits.asistenHalal + payment.credits,
        cekBahanCredits: dailyLimits.cekBahan + payment.credits,
        voiceAuditCredits: dailyLimits.voiceAudit + payment.credits,
        trainingCredits: dailyLimits.training + payment.credits,
      });
    }

    return { success: true, creditsAdded: payment.credits };
  },
});

// Handle payment.reminder webhook (optional: can send WhatsApp notification)
export const handlePaymentReminder = internalMutation({
  args: {
    webhookData: v.any(),
  },
  handler: async (ctx, args) => {
    const data = args.webhookData.data;

    // Find the payment
    const payment = await ctx.db
      .query("mayar_payments")
      .withIndex("by_mayarTransactionId", (q) => q.eq("mayarTransactionId", data.transactionId || data.id))
      .first();

    if (!payment || payment.status !== "pending") {
      return { success: false, error: "Payment not found or not pending" };
    }

    // TODO: Send WhatsApp notification via WhatsApp Business API
    // For now, just log the reminder
    console.log(`Payment reminder for user ${payment.userId}, payment ${payment._id}`);

    return { success: true };
  },
});

// Check payment status
export const checkPaymentStatus = query({
  args: {
    paymentId: v.id("mayar_payments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const payment = await ctx.db.get(args.paymentId);

    if (!payment || payment.userId !== userId) {
      throw new ConvexError("Pembayaran tidak ditemukan");
    }

    return {
      status: payment.status,
      credits: payment.credits,
      paidAt: payment.paidAt,
      paymentLink: payment.paymentLink,
    };
  },
});

// Cancel expired payments (can be called by cron)
export const cancelExpiredPayments = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredThreshold = now - 24 * 60 * 60 * 1000; // 24 hours ago

    const pendingPayments = await ctx.db
      .query("mayar_payments")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    let cancelled = 0;

    for (const payment of pendingPayments) {
      if (payment.createdAt < expiredThreshold) {
        await ctx.db.patch(payment._id, {
          status: "expired",
          expiredAt: now,
        });
        cancelled++;
      }
    }

    return { cancelled };
  },
});
