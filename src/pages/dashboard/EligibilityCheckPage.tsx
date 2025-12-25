import type { EligibilityAnswers } from "@features/eligibility-check";

import { useState } from "react";

import { History, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

import { EligibilityResult, EligibilityWizard, useEligibility } from "@features/eligibility-check";

import { PageContainer } from "./components";

export function EligibilityCheckPage() {
  const [, navigate] = useLocation();
  const { eligibility, isLoading, hasCompleted, submitEligibility, resetEligibility } = useEligibility();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleSubmit = async (answers: EligibilityAnswers) => {
    setIsSubmitting(true);
    try {
      await submitEligibility({ eligibilityAnswers: answers });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetEligibility();
      setShowIntro(true);
    } finally {
      setIsResetting(false);
    }
  };

  const handleStart = () => {
    setShowIntro(false);
  };

  const displayState = hasCompleted && eligibility ? "result" : showIntro ? "intro" : "wizard";
  const isMobileOnlyBack = displayState === "intro";

  if (isLoading) {
    return (
      <PageContainer centered maxWidth="2xl">
        <div className="flex min-h-100 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </PageContainer>
    );
  }

  if (hasCompleted && eligibility) {
    return (
      <PageContainer
        backButton={{ onClick: () => navigate("/dashboard"), label: "Kembali" }}
        centered
        maxWidth="2xl"
        scrollResetKey={displayState}
      >
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Hasil Cek Jalur Sertifikasi</h1>
          <button
            type="button"
            onClick={() => navigate("/dashboard/dokumen-halal/history")}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 sm:w-auto sm:py-1.5"
          >
            <History className="h-4 w-4" />
            Riwayat Dokumen
          </button>
        </div>
        <EligibilityResult
          certificationPath={eligibility.certificationPath}
          riskLevel={eligibility.riskLevel}
          disqualifyingFactors={eligibility.disqualifyingFactors}
          onReset={handleReset}
          isResetting={isResetting}
        />
      </PageContainer>
    );
  }

  if (showIntro) {
    return (
      <PageContainer
        backButton={{ onClick: () => navigate("/dashboard"), label: "Kembali", mobileOnly: isMobileOnlyBack }}
        centered
        maxWidth="2xl"
        scrollResetKey={displayState}
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Cek Jalur Sertifikasi Halal</h1>
            <p className="mt-2 text-gray-600">
              Jawab beberapa pertanyaan singkat untuk mengetahui apakah usaha Anda memenuhi syarat jalur
              <strong> Self-Declare</strong> atau perlu melalui jalur <strong>Reguler</strong>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="font-medium text-emerald-800">Self-Declare</h3>
              <ul className="mt-2 space-y-1 text-sm text-emerald-700">
                <li>- Proses lebih cepat</li>
                <li>- Biaya lebih terjangkau</li>
                <li>- Untuk UMK risiko rendah</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-medium text-amber-800">Reguler</h3>
              <ul className="mt-2 space-y-1 text-sm text-amber-700">
                <li>- Audit oleh auditor resmi</li>
                <li>- Verifikasi menyeluruh</li>
                <li>- Untuk produk risiko tinggi</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="w-full cursor-pointer rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-90"
          >
            Mulai Pemeriksaan
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      backButton={{ onClick: () => setShowIntro(true), label: "Kembali" }}
      centered
      maxWidth="2xl"
      scrollResetKey={displayState}
    >
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-900">Cek Jalur Sertifikasi Halal</h1>
      </div>
      <EligibilityWizard onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </PageContainer>
  );
}
