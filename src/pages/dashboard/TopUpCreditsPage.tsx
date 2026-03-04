import { useEffect, useState } from "react";

import { useQuery } from "convex/react";
import { AlertTriangle, ArrowLeft, History, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

import { useToast } from "@shared/components/ui";

import { api } from "../../../convex/_generated/api";
import { CreditPackages, PaymentModal, usePayment } from "../../features/payment";
import { PageContainer } from "./components";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(timestamp);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "expired":
    case "cancelled":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Berhasil";
    case "pending":
      return "Menunggu";
    case "expired":
      return "Kadaluarsa";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
}

export function TopUpCreditsPage() {
  const [, setLocation] = useLocation();
  const toast = useToast();
  const {
    packages,
    selectedPackage,
    selectedPackageData,
    isCreatingPayment,
    paymentLink,
    paymentError,
    selectPackage,
    initiatePayment,
    resetPayment,
  } = usePayment();
  const paymentHistory = useQuery(api.mayar.getMyPayments);
  const dailyCredits = useQuery(api.credits.getMyDailyCredits);
  const currentUser = useQuery(api.users.getCurrentUser);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const isUserLoading = currentUser === undefined;
  const hasPhoneForPayment = !isUserLoading && (currentUser?.phone ?? "").replace(/\D/g, "").length >= 10;

  const redirectToEditProfile = () => {
    setLocation(`/dashboard/profile?returnTo=${encodeURIComponent("/dashboard/top-up")}`);
  };

  // Show error toast when payment fails
  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError);
    }
  }, [paymentError, toast]);

  const handleBuyCredits = async () => {
    if (!selectedPackage || isUserLoading) return;

    if (!hasPhoneForPayment) {
      toast.info("Lengkapi nomor telepon dulu sebelum pembayaran");
      redirectToEditProfile();
      return;
    }

    try {
      await initiatePayment();
      setShowPaymentModal(true);
    } catch {
      // Error is handled in the hook
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    resetPayment();
  };

  return (
    <PageContainer
      backButton={{
        label: "Dashboard",
        onClick: () => setLocation("/dashboard"),
      }}
      maxWidth="3xl"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Top-Up Kredit AI</h1>
        <p className="text-gray-500">Beli kredit tambahan untuk akses fitur AI di luar batas harian</p>
      </div>

      {/* Current Credits */}
      {dailyCredits && (
        <div className="mb-6 rounded-xl border border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 p-4 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">Sisa kredit per fitur</p>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-lg border border-emerald-100 bg-white/75 px-2.5 py-2">
              <p className="text-[11px] text-gray-500">Cek Dapur</p>
              <p className="text-base leading-none font-semibold text-gray-900">{dailyCredits.cekDapurCredits}</p>
            </div>

            <div className="rounded-lg border border-teal-100 bg-white/75 px-2.5 py-2">
              <p className="text-[11px] text-gray-500">Dokumen</p>
              <p className="text-base leading-none font-semibold text-gray-900">{dailyCredits.dokumenHalalCredits}</p>
            </div>

            <div className="rounded-lg border border-cyan-100 bg-white/75 px-2.5 py-2">
              <p className="text-[11px] text-gray-500">Asisten</p>
              <p className="text-base leading-none font-semibold text-gray-900">{dailyCredits.asistenHalalChats}</p>
            </div>

            <div className="rounded-lg border border-emerald-100 bg-white/75 px-2.5 py-2">
              <p className="text-[11px] text-gray-500">Cek Bahan</p>
              <p className="text-base leading-none font-semibold text-gray-900">{dailyCredits.cekBahanCredits}</p>
            </div>

            <div className="rounded-lg border border-teal-100 bg-white/75 px-2.5 py-2">
              <p className="text-[11px] text-gray-500">Voice</p>
              <p className="text-base leading-none font-semibold text-gray-900">{dailyCredits.voiceAuditCredits}</p>
            </div>

            <div className="rounded-lg border border-cyan-100 bg-white/75 px-2.5 py-2">
              <p className="text-[11px] text-gray-500">Training</p>
              <p className="text-base leading-none font-semibold text-gray-900">{dailyCredits.trainingCredits}</p>
            </div>
          </div>
        </div>
      )}

      {/* Packages */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Pilih Paket Kredit</h2>
        {packages ? (
          <CreditPackages
            packages={packages}
            selectedPackage={selectedPackage}
            onSelect={selectPackage}
            isLoading={isCreatingPayment}
          />
        ) : (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Buy Button */}
      <div className="mb-8">
        {!isUserLoading && !hasPhoneForPayment && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">Nomor telepon wajib diisi sebelum melakukan pembayaran.</p>
                <button
                  type="button"
                  onClick={redirectToEditProfile}
                  className="mt-2 cursor-pointer text-sm font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-800"
                >
                  Isi nomor telepon di Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleBuyCredits}
          disabled={!selectedPackage || isCreatingPayment || isUserLoading}
          className="w-full cursor-pointer rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreatingPayment ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memproses...
            </span>
          ) : selectedPackageData && !isUserLoading && !hasPhoneForPayment ? (
            "Isi nomor HP dulu untuk melanjutkan"
          ) : selectedPackageData ? (
            `Beli ${selectedPackageData.credits} Kredit - ${formatCurrency(selectedPackageData.amount)}`
          ) : (
            "Pilih paket untuk melanjutkan"
          )}
        </button>
      </div>

      {/* Payment History */}
      <div className="rounded-2xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="flex w-full cursor-pointer items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">Riwayat Pembelian</span>
          </div>
          <ArrowLeft className={`h-4 w-4 text-gray-400 transition-transform ${showHistory ? "-rotate-90" : "-rotate-180"}`} />
        </button>

        {showHistory && (
          <div className="border-t border-gray-100">
            {paymentHistory && paymentHistory.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {paymentHistory.slice(0, 5).map((payment) => (
                  <div key={payment._id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-gray-900">{payment.credits} Kredit</p>
                      <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(payment.status)}`}
                      >
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Belum ada riwayat pembelian</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        paymentLink={paymentLink}
        packageName={selectedPackageData?.name || ""}
        credits={selectedPackageData?.credits || 0}
        amount={selectedPackageData?.amount || 0}
        isLoading={isCreatingPayment}
      />
    </PageContainer>
  );
}
