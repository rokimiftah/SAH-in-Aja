/**
 * Mayar.id Payment Integration
 * Handles Top-Up Kredit AI via Mayar payment gateway
 * Docs: https://docs.mayar.id
 */

import type { Id } from "./_generated/dataModel";

import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { api, internal } from "./_generated/api";
import { action, internalMutation, internalQuery, query } from "./_generated/server";

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
const MAYAR_API_ORIGIN = process.env.MAYAR_SANDBOX === "true" ? "https://api.mayar.club" : "https://api.mayar.id";
const MAYAR_BASE_URL = `${MAYAR_API_ORIGIN}/hl/v1`;

// Webhook secret for verification (generate a random string and configure in Mayar webhook URL)
// Example webhook URL: https://your-project.convex.site/mayar-webhook?token=YOUR_SECRET_HERE
const MAYAR_WEBHOOK_SECRET = process.env.MAYAR_WEBHOOK_SECRET;
const MAYAR_COUPON_PAYMENT_LINK_ID = process.env.MAYAR_COUPON_PAYMENT_LINK_ID;
const PAYMENT_REQUEST_MIN_INTERVAL_MS = 60_000;

function getDateInUTC7(): string {
  const now = new Date();
  const jakartaDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const year = jakartaDate.getFullYear();
  const month = String(jakartaDate.getMonth() + 1).padStart(2, "0");
  const day = String(jakartaDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function parseString(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) return value;
  return null;
}

function parseMayarMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  return parseString(data.messages) || parseString(data.message);
}

function isFinalizedMayarPayment(data: Record<string, unknown>): boolean {
  const transactionStatus = parseString(data.transactionStatus)?.toLowerCase();
  const statusString = parseString(data.status)?.toLowerCase();
  const statusBoolean = typeof data.status === "boolean" ? data.status : null;

  if (statusBoolean === true) return true;
  if (statusString && ["paid", "settled", "success", "true"].includes(statusString)) return true;
  if (transactionStatus && ["paid", "settled", "success"].includes(transactionStatus)) return true;

  if (statusBoolean === false) return false;
  if (statusString && ["pending", "unpaid", "failed", "expired", "cancelled", "false"].includes(statusString)) {
    return false;
  }
  if (transactionStatus && ["pending", "unpaid", "failed", "expired", "cancelled"].includes(transactionStatus)) {
    return false;
  }

  // Mayar payment.received in sandbox can carry transactionStatus="created"
  // while status is already SUCCESS. For safety, unknown combinations default
  // to processed and idempotency is enforced by payment status checks.
  return true;
}

type CouponValidationResult = {
  couponCode: string;
  discountType: string;
  discountValue: number;
  minimumPurchase: number | null;
};

function calculateCouponDiscount(amount: number, coupon: CouponValidationResult): number {
  if (coupon.minimumPurchase !== null && amount < coupon.minimumPurchase) {
    throw new ConvexError("Nominal belum memenuhi minimum pembelian untuk kupon");
  }

  const discountType = coupon.discountType.toLowerCase();

  if (discountType.includes("percent")) {
    return Math.round((amount * coupon.discountValue) / 100);
  }

  // Mayar docs use terms like monetary/fixed for nominal discount
  if (discountType.includes("fixed") || discountType.includes("monetary") || discountType.includes("amount")) {
    return Math.round(coupon.discountValue);
  }

  throw new ConvexError("Tipe diskon kupon belum didukung");
}

async function validateCouponWithMayar(args: {
  apiKey: string;
  paymentLinkId: string;
  couponCode: string;
  finalAmount: number;
  customerEmail: string;
}): Promise<CouponValidationResult> {
  const endpoint = `${MAYAR_BASE_URL}/coupon/validate`;

  const queryParams = new URLSearchParams({
    paymentLinkId: args.paymentLinkId,
    couponCode: args.couponCode,
    finalAmount: String(args.finalAmount),
    customerEmail: args.customerEmail,
  });

  const attempts: Array<{ method: "GET" | "POST"; url: string; body?: string }> = [
    {
      method: "GET",
      url: `${endpoint}?${queryParams.toString()}`,
    },
    {
      method: "POST",
      url: endpoint,
      body: JSON.stringify({
        paymentLinkId: args.paymentLinkId,
        tickets: [],
        couponCode: args.couponCode,
        finalAmount: args.finalAmount,
        customerEmail: args.customerEmail,
      }),
    },
  ];

  let lastError = "Gagal memvalidasi kupon";

  for (const attempt of attempts) {
    const response = await fetch(attempt.url, {
      method: attempt.method,
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
        "Content-Type": "application/json",
      },
      body: attempt.body,
    });

    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      lastError = parseMayarMessage(payload) || `HTTP ${response.status}`;
      continue;
    }

    if (!payload || typeof payload !== "object") {
      lastError = "Respons validasi kupon tidak valid";
      continue;
    }

    const data = payload as Record<string, unknown>;
    const statusCode = parseNumber(data.statusCode);
    const bodyData = data.data && typeof data.data === "object" ? (data.data as Record<string, unknown>) : null;
    const valid = bodyData ? bodyData.valid === true : false;
    const coupon = bodyData?.coupon && typeof bodyData.coupon === "object" ? (bodyData.coupon as Record<string, unknown>) : null;

    if (statusCode !== 200 || !valid || !coupon) {
      lastError = parseMayarMessage(payload) || "Kupon tidak valid";
      continue;
    }

    const couponCode = parseString(coupon.code) || parseString(coupon.couponCode) || args.couponCode;
    const discountType = parseString(coupon.discountType) || parseString(coupon.couponDiscountType);
    const discountValue = parseNumber(coupon.discountValue) ?? parseNumber(coupon.couponDiscountValue);
    const minimumPurchase = parseNumber(coupon.minimumPurchase) ?? parseNumber(coupon.couponMinimumPurchase);

    if (!discountType || discountValue === null) {
      lastError = "Data diskon kupon tidak lengkap";
      continue;
    }

    return {
      couponCode,
      discountType,
      discountValue,
      minimumPurchase,
    };
  }

  throw new ConvexError(lastError);
}

/**
 * Verify webhook request is from Mayar
 * Since Mayar doesn't provide HMAC signature verification, we use:
 * 1. Secret token in webhook URL query parameter (e.g., ?token=SECRET)
 *
 * To configure:
 * 1. Generate a random secret: openssl rand -hex 32
 * 2. Add MAYAR_WEBHOOK_SECRET to Convex environment variables
 * 3. Set webhook URL in Mayar dashboard: https://your-project.convex.site/mayar-webhook?token=YOUR_SECRET
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
      .collect();

    return payments.slice(0, 20);
  },
});

export const getLatestPaymentByUser = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mayar_payments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});

export const getPaymentForCancellation = internalQuery({
  args: {
    paymentId: v.id("mayar_payments"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment || payment.userId !== args.userId) {
      return null;
    }

    return payment;
  },
});

export const markPaymentCancelled = internalMutation({
  args: {
    paymentId: v.id("mayar_payments"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment || payment.userId !== args.userId) {
      throw new ConvexError("Pembayaran tidak ditemukan");
    }

    if (payment.status !== "pending") {
      return { success: false, status: payment.status };
    }

    await ctx.db.patch(payment._id, {
      status: "cancelled",
    });

    return { success: true };
  },
});

export const cancelMyPendingPayment = action({
  args: {
    paymentId: v.id("mayar_payments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const payment = await ctx.runQuery(internal.mayar.getPaymentForCancellation, {
      paymentId: args.paymentId,
      userId,
    });

    if (!payment) {
      throw new ConvexError("Pembayaran tidak ditemukan");
    }

    if (payment.status === "paid") {
      throw new ConvexError("Pembayaran sudah berhasil dan tidak bisa dibatalkan");
    }

    if (payment.status === "cancelled") {
      return { success: true, alreadyCancelled: true };
    }

    if (payment.status === "expired") {
      return { success: true, alreadyExpired: true };
    }

    const mayarApiKey = process.env.MAYAR_API_KEY;
    if (!mayarApiKey) throw new ConvexError("Konfigurasi pembayaran belum selesai");

    if (!payment.mayarPaymentId) {
      throw new ConvexError("Pembayaran ini belum memiliki ID Mayar untuk dibatalkan");
    }

    const response = await fetch(`${MAYAR_BASE_URL}/payment/close/${payment.mayarPaymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${mayarApiKey}`,
        "Content-Type": "application/json",
      },
    });

    const responseText = await response.text();
    let payload: unknown = null;
    try {
      payload = JSON.parse(responseText) as unknown;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      throw new ConvexError(parseMayarMessage(payload) || "Gagal membatalkan pembayaran di Mayar");
    }

    if (!payload || typeof payload !== "object") {
      throw new ConvexError("Respons pembatalan Mayar tidak valid");
    }

    const body = payload as Record<string, unknown>;
    const statusCode = parseNumber(body.statusCode);
    const message = (parseMayarMessage(payload) || "").toLowerCase();

    if (statusCode !== 200 || message !== "success") {
      throw new ConvexError(parseMayarMessage(payload) || "Gagal membatalkan pembayaran di Mayar");
    }

    await ctx.runMutation(internal.mayar.markPaymentCancelled, {
      paymentId: args.paymentId,
      userId,
    });

    return { success: true };
  },
});

// Create payment request via Mayar API
export const createPayment = action({
  args: {
    packageId: v.string(),
    couponCode: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ paymentLink: string; paymentId: Id<"mayar_payments">; amount: number; discountAmount: number }> => {
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

    const latestPayment = await ctx.runQuery(internal.mayar.getLatestPaymentByUser, {
      userId,
    });
    if (latestPayment && Date.now() - latestPayment.createdAt < PAYMENT_REQUEST_MIN_INTERVAL_MS) {
      throw new ConvexError("Tunggu 1 menit sebelum membuat pembayaran baru");
    }

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

    const normalizedCouponCode = args.couponCode?.trim();
    let discountAmount = 0;
    let appliedCouponCode: string | undefined;

    if (normalizedCouponCode) {
      if (!MAYAR_COUPON_PAYMENT_LINK_ID) {
        throw new ConvexError("Kupon belum bisa dipakai karena konfigurasi merchant belum lengkap");
      }

      const coupon = await validateCouponWithMayar({
        apiKey: mayarApiKey,
        paymentLinkId: MAYAR_COUPON_PAYMENT_LINK_ID,
        couponCode: normalizedCouponCode,
        finalAmount: pkg.amount,
        customerEmail: email,
      });

      discountAmount = calculateCouponDiscount(pkg.amount, coupon);
      if (discountAmount <= 0) {
        throw new ConvexError("Kupon tidak memberikan potongan untuk paket ini");
      }

      appliedCouponCode = coupon.couponCode;
    }

    const finalAmount = Math.max(1, pkg.amount - discountAmount);
    const siteUrl = (process.env.SITE_URL || "https://sahin.biz.id").replace(/\/$/, "");

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
        amount: finalAmount,
        description: `${pkg.name} - ${pkg.credits} Kredit AI untuk SAH-in Aja!`,
        redirectUrl: `${siteUrl}/dashboard/top-up`,
        // Set expiry to 24 hours from now
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mayar API error:", errorText);

      if (response.status === 429) {
        let payload: unknown = null;
        try {
          payload = JSON.parse(errorText) as unknown;
        } catch {
          payload = null;
        }

        throw new ConvexError(
          parseMayarMessage(payload) || "Permintaan duplikat terdeteksi. Tunggu 1 menit sebelum membuat pembayaran baru.",
        );
      }

      throw new ConvexError("Gagal membuat link pembayaran. Silakan coba lagi.");
    }

    const data = (await response.json()) as unknown;
    console.log("Mayar API response:", JSON.stringify(data, null, 2));

    if (!data || typeof data !== "object") {
      throw new ConvexError("Respons Mayar tidak valid");
    }

    const payload = data as Record<string, unknown>;
    const statusCode = parseNumber(payload.statusCode);
    const payloadData = payload.data && typeof payload.data === "object" ? (payload.data as Record<string, unknown>) : null;

    const link = payloadData ? parseString(payloadData.link) : null;
    const mayarPaymentId = payloadData ? parseString(payloadData.id) : null;
    const transactionId =
      (payloadData && parseString(payloadData.transactionId)) ||
      (payloadData && parseString(payloadData.transaction_id)) ||
      (payloadData && parseString(payloadData.id));

    if (statusCode !== 200 || !link || !transactionId || !mayarPaymentId) {
      console.error("Mayar API unexpected response:", data);
      throw new ConvexError("Gagal membuat link pembayaran. Silakan coba lagi.");
    }

    // Log the payment link for debugging
    console.log("Mayar payment link:", link);

    // Store payment record in database
    const paymentId = await ctx.runMutation(internal.mayar.createPaymentRecord, {
      userId,
      mayarTransactionId: transactionId,
      paymentLink: link,
      packageId: pkg.id,
      credits: pkg.credits,
      amount: finalAmount,
      paymentType: "payment_request",
      quantity: 1,
      originalAmount: finalAmount === pkg.amount ? undefined : pkg.amount,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      couponCode: appliedCouponCode,
      mayarPaymentId,
    });

    return {
      paymentLink: link,
      paymentId,
      amount: finalAmount,
      discountAmount,
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
    paymentType: v.optional(v.union(v.literal("payment_request"), v.literal("invoice"))),
    quantity: v.optional(v.number()),
    originalAmount: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    couponCode: v.optional(v.string()),
    mayarInvoiceId: v.optional(v.string()),
    mayarPaymentId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"mayar_payments">> => {
    return await ctx.db.insert("mayar_payments", {
      userId: args.userId,
      mayarTransactionId: args.mayarTransactionId,
      mayarInvoiceId: args.mayarInvoiceId,
      mayarPaymentId: args.mayarPaymentId,
      paymentLink: args.paymentLink,
      packageId: args.packageId,
      credits: args.credits,
      amount: args.amount,
      originalAmount: args.originalAmount,
      discountAmount: args.discountAmount,
      couponCode: args.couponCode,
      quantity: args.quantity ?? 1,
      paymentType: args.paymentType ?? "payment_request",
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
    const paymentData = data as Record<string, unknown>;

    // payment.received should only be processed as paid when transaction is finalized
    if (!isFinalizedMayarPayment(paymentData)) {
      const transactionStatus = parseString(paymentData.transactionStatus) || "unknown";
      const status = parseString(paymentData.status) || "unknown";
      console.warn("Ignoring payment.received with non-final status", {
        transactionStatus,
        status,
      });
      return {
        success: false,
        ignored: true,
        reason: `transaction status is ${transactionStatus}`,
      };
    }

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
    const today = getDateInUTC7();

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
