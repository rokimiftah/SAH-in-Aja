import { useCallback, useEffect, useRef, useState } from "react";

import { useAction, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

interface CreditPackage {
  id: string;
  credits: number;
  amount: number;
  name: string;
  description: string;
  popular: boolean;
}

interface PaymentState {
  selectedPackage: string | null;
  couponCode: string;
  couponValidationStatus: "idle" | "validating" | "valid" | "invalid";
  couponValidationMessage: string;
  couponDiscountAmount: number | null;
  couponFinalAmount: number | null;
  couponDiscountType: string | null;
  couponDiscountValue: number | null;
  isPaymentCooldown: boolean;
  isPreparingPaymentLink: boolean;
  paymentError: string | null;
}

const PAYMENT_REQUEST_COOLDOWN_MS = 60_000;

function extractConvexErrorData(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;

  const candidate = error as { data?: unknown };

  if (typeof candidate.data === "string" && candidate.data.trim()) {
    return candidate.data.trim();
  }

  if (candidate.data && typeof candidate.data === "object") {
    const message = (candidate.data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  return null;
}

function sanitizeConvexMessage(message: string): string {
  const uncaughtMarker = "Uncaught ConvexError:";
  const markerIndex = message.indexOf(uncaughtMarker);

  if (markerIndex >= 0) {
    const raw = message.slice(markerIndex + uncaughtMarker.length).trim();
    const firstLine = raw.split("\n")[0]?.trim();
    if (firstLine) {
      return firstLine.replace(/\s+at handler[\s\S]*$/, "").trim();
    }
  }

  return message.replace(/\s+at handler[\s\S]*$/, "").trim();
}

function getPaymentErrorMessage(error: unknown): string {
  const convexDataMessage = extractConvexErrorData(error);
  if (convexDataMessage) return convexDataMessage;

  if (error instanceof Error) {
    const cleaned = sanitizeConvexMessage(error.message);
    if (cleaned) return cleaned;
  }

  return "Terjadi kesalahan pembayaran";
}

export function usePayment() {
  const packages = useQuery(api.mayar.getCreditPackages) as CreditPackage[] | undefined;
  const createPayment = useAction(api.mayar.createPayment);
  const validateCouponPreview = useAction(api.mayar.validateCouponPreview);

  const [state, setState] = useState<PaymentState>({
    selectedPackage: null,
    couponCode: "",
    couponValidationStatus: "idle",
    couponValidationMessage: "Kupon akan divalidasi saat Anda membuat pembayaran.",
    couponDiscountAmount: null,
    couponFinalAmount: null,
    couponDiscountType: null,
    couponDiscountValue: null,
    isPaymentCooldown: false,
    isPreparingPaymentLink: false,
    paymentError: null,
  });
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const couponValidationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const couponValidationRequestIdRef = useRef(0);

  const activateCooldown = useCallback((durationMs: number = PAYMENT_REQUEST_COOLDOWN_MS) => {
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
    }

    setState((prev) => ({
      ...prev,
      isPaymentCooldown: true,
    }));

    cooldownTimerRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isPaymentCooldown: false,
      }));
      cooldownTimerRef.current = null;
    }, durationMs);
  }, []);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
      if (couponValidationTimerRef.current) {
        clearTimeout(couponValidationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (couponValidationTimerRef.current) {
      clearTimeout(couponValidationTimerRef.current);
      couponValidationTimerRef.current = null;
    }

    const normalizedCouponCode = state.couponCode.trim();
    if (!normalizedCouponCode) {
      setState((prev) => ({
        ...prev,
        couponValidationStatus: "idle",
        couponValidationMessage: "Kupon akan divalidasi saat Anda membuat pembayaran.",
        couponDiscountAmount: null,
        couponFinalAmount: null,
        couponDiscountType: null,
        couponDiscountValue: null,
      }));
      return;
    }

    if (!state.selectedPackage) {
      setState((prev) => ({
        ...prev,
        couponValidationStatus: "invalid",
        couponValidationMessage: "Pilih paket kredit terlebih dahulu untuk validasi kupon.",
        couponDiscountAmount: null,
        couponFinalAmount: null,
        couponDiscountType: null,
        couponDiscountValue: null,
      }));
      return;
    }

    const requestId = couponValidationRequestIdRef.current + 1;
    couponValidationRequestIdRef.current = requestId;

    setState((prev) => ({
      ...prev,
      couponValidationStatus: "validating",
      couponValidationMessage: "Memvalidasi kupon...",
      couponDiscountAmount: null,
      couponFinalAmount: null,
      couponDiscountType: null,
      couponDiscountValue: null,
    }));

    couponValidationTimerRef.current = setTimeout(() => {
      void validateCouponPreview({
        packageId: state.selectedPackage as string,
        couponCode: normalizedCouponCode,
      })
        .then((result) => {
          if (couponValidationRequestIdRef.current !== requestId) {
            return;
          }

          if (result.valid) {
            setState((prev) => ({
              ...prev,
              couponValidationStatus: "valid",
              couponValidationMessage: result.message,
              couponDiscountAmount: result.discountAmount ?? null,
              couponFinalAmount: result.finalAmount ?? null,
              couponDiscountType: result.discountType ?? null,
              couponDiscountValue: result.discountValue ?? null,
            }));
            return;
          }

          setState((prev) => ({
            ...prev,
            couponValidationStatus: "invalid",
            couponValidationMessage: result.message,
            couponDiscountAmount: null,
            couponFinalAmount: null,
            couponDiscountType: null,
            couponDiscountValue: null,
          }));
        })
        .catch(() => {
          if (couponValidationRequestIdRef.current !== requestId) {
            return;
          }

          setState((prev) => ({
            ...prev,
            couponValidationStatus: "invalid",
            couponValidationMessage: "Gagal memvalidasi kupon. Coba lagi.",
            couponDiscountAmount: null,
            couponFinalAmount: null,
            couponDiscountType: null,
            couponDiscountValue: null,
          }));
        });
    }, 600);

    return () => {
      if (couponValidationTimerRef.current) {
        clearTimeout(couponValidationTimerRef.current);
        couponValidationTimerRef.current = null;
      }
    };
  }, [state.couponCode, state.selectedPackage, validateCouponPreview]);

  const selectPackage = useCallback((packageId: string) => {
    setState((prev) => ({
      ...prev,
      selectedPackage: prev.selectedPackage === packageId ? null : packageId,
      paymentError: null,
    }));
  }, []);

  const preparePaymentLink = useCallback(async () => {
    if (!state.selectedPackage) return;
    if (state.isPaymentCooldown) {
      const cooldownError = new Error("Tunggu 1 menit sebelum membuat pembayaran baru");
      setState((prev) => ({
        ...prev,
        paymentError: cooldownError.message,
      }));
      throw cooldownError;
    }

    setState((prev) => ({
      ...prev,
      isPreparingPaymentLink: true,
      paymentError: null,
    }));

    try {
      const couponCode = state.couponCode.trim();
      const result = await createPayment({
        packageId: state.selectedPackage,
        couponCode: couponCode.length > 0 ? couponCode : undefined,
      });

      setState((prev) => ({
        ...prev,
        isPreparingPaymentLink: false,
      }));
      activateCooldown();
      return result;
    } catch (error) {
      const errorMessage = getPaymentErrorMessage(error);
      if (/duplicate request|1 minute|1 menit/i.test(errorMessage)) {
        activateCooldown();
      }
      setState((prev) => ({
        ...prev,
        isPreparingPaymentLink: false,
        paymentError: errorMessage,
      }));
      throw error;
    }
  }, [state.selectedPackage, state.couponCode, state.isPaymentCooldown, createPayment, activateCooldown]);

  const setCouponCode = useCallback((couponCode: string) => {
    setState((prev) => ({
      ...prev,
      couponCode,
      couponValidationStatus: couponCode.trim() ? "validating" : "idle",
      couponValidationMessage: couponCode.trim() ? "Memvalidasi kupon..." : "Kupon akan divalidasi saat Anda membuat pembayaran.",
      couponDiscountAmount: null,
      couponFinalAmount: null,
      couponDiscountType: null,
      couponDiscountValue: null,
      paymentError: null,
    }));
  }, []);

  const resetPayment = useCallback(() => {
    setState((prev) => ({
      selectedPackage: null,
      couponCode: "",
      couponValidationStatus: "idle",
      couponValidationMessage: "Kupon akan divalidasi saat Anda membuat pembayaran.",
      couponDiscountAmount: null,
      couponFinalAmount: null,
      couponDiscountType: null,
      couponDiscountValue: null,
      isPaymentCooldown: prev.isPaymentCooldown,
      isPreparingPaymentLink: false,
      paymentError: null,
    }));
  }, []);

  const selectedPackageData = state.selectedPackage ? packages?.find((p) => p.id === state.selectedPackage) : null;

  return {
    packages,
    selectedPackage: state.selectedPackage,
    selectedPackageData,
    couponCode: state.couponCode,
    couponValidationStatus: state.couponValidationStatus,
    couponValidationMessage: state.couponValidationMessage,
    couponDiscountAmount: state.couponDiscountAmount,
    couponFinalAmount: state.couponFinalAmount,
    couponDiscountType: state.couponDiscountType,
    couponDiscountValue: state.couponDiscountValue,
    isPaymentCooldown: state.isPaymentCooldown,
    isPreparingPaymentLink: state.isPreparingPaymentLink,
    paymentError: state.paymentError,
    selectPackage,
    setCouponCode,
    preparePaymentLink,
    resetPayment,
  };
}
