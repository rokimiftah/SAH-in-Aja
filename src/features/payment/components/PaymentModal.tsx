import { useEffect, useRef } from "react";

import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: () => void;
  packageName: string;
  credits: number;
  amount: number;
  isLoading: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PaymentModal({ isOpen, onClose, onConfirmPayment, packageName, credits, amount, isLoading }: PaymentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
        >
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={!isLoading ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
            ></button>

            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                ) : (
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                )}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {isLoading ? "Mempersiapkan Pembayaran..." : "Lanjutkan Pembayaran"}
              </h3>

              {/* Details */}
              <div className="mb-6 rounded-xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Paket</span>
                  <span className="font-semibold text-gray-900">{packageName}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Kredit</span>
                  <span className="font-semibold text-gray-900">{credits} kredit</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-lg font-bold text-emerald-600">{formatCurrency(amount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment info */}
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
                <p className="text-sm text-amber-800">
                  <strong>Cara Bayar:</strong>
                </p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-amber-700">
                  <li>Klik tombol "Bayar Sekarang" di bawah</li>
                  <li>Anda akan diarahkan ke halaman pembayaran Mayar</li>
                  <li>Pilih metode pembayaran (QRIS/E-Wallet)</li>
                  <li>Selesaikan pembayaran</li>
                  <li>Kredit akan otomatis masuk ke akun Anda</li>
                </ol>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Mohon tunggu...</span>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onConfirmPayment}
                      className="cursor-pointer rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg"
                    >
                      Bayar Sekarang
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>

              {/* Note */}
              <p className="mt-4 text-xs text-gray-400">
                Link pembayaran valid selama 24 jam. Setelah pembayaran berhasil, kredit akan otomatis masuk ke akun Anda.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
