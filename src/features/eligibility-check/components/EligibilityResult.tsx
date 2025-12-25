import type { CertificationPath, RiskLevel } from "../types";

import { AlertTriangle, CheckCircle, FileText, RefreshCw, Shield } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "wouter";

interface EligibilityResultProps {
  certificationPath: CertificationPath;
  riskLevel: RiskLevel;
  disqualifyingFactors: string[];
  onReset: () => Promise<void>;
  isResetting?: boolean;
}

const PATH_INFO = {
  self_declare: {
    title: "Jalur Self-Declare",
    description: "Selamat! Usaha Anda memenuhi syarat untuk jalur Self-Declare. Proses sertifikasi lebih cepat dan sederhana.",
    icon: CheckCircle,
    color: "emerald",
    benefits: [
      "Proses lebih cepat (14-21 hari kerja)",
      "Biaya lebih terjangkau",
      "Audit mandiri dengan panduan",
      "Cocok untuk UMK dengan produk risiko rendah",
    ],
  },
  reguler: {
    title: "Jalur Reguler",
    description:
      "Usaha Anda memerlukan jalur sertifikasi Reguler karena karakteristik produk yang membutuhkan verifikasi mendalam.",
    icon: Shield,
    color: "amber",
    benefits: [
      "Audit oleh auditor tersertifikasi",
      "Verifikasi menyeluruh proses produksi",
      "Sertifikat diakui internasional",
      "Cocok untuk produk risiko tinggi",
    ],
  },
};

const RISK_COLORS = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

const RISK_LABELS = {
  low: "Risiko Rendah",
  medium: "Risiko Sedang",
  high: "Risiko Tinggi",
};

export function EligibilityResult({
  certificationPath,
  riskLevel,
  disqualifyingFactors,
  onReset,
  isResetting,
}: EligibilityResultProps) {
  const pathInfo = PATH_INFO[certificationPath];
  const Icon = pathInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl space-y-4 sm:space-y-6"
    >
      {/* Main result card */}
      <div
        className={`rounded-2xl border-2 p-4 sm:p-6 ${
          certificationPath === "self_declare" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div
            className={`mx-auto shrink-0 rounded-full p-3 sm:mx-0 ${certificationPath === "self_declare" ? "bg-emerald-100" : "bg-amber-100"}`}
          >
            <Icon className={`h-8 w-8 ${certificationPath === "self_declare" ? "text-emerald-600" : "text-amber-600"}`} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{pathInfo.title}</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${RISK_COLORS[riskLevel]}`}>
                {RISK_LABELS[riskLevel]}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700 sm:text-base">{pathInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Disqualifying factors */}
      {disqualifyingFactors.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 sm:text-base">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 sm:h-5 sm:w-5" />
            Faktor yang Memerlukan Jalur Reguler
          </h3>
          <ul className="mt-3 space-y-2">
            {disqualifyingFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 sm:text-base">
          <FileText className="h-4 w-4 shrink-0 text-blue-500 sm:h-5 sm:w-5" />
          Keuntungan {pathInfo.title}
        </h3>
        <ul className="mt-3 space-y-2">
          {pathInfo.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          disabled={isResetting}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${isResetting ? "animate-spin" : ""}`} />
          Ulangi Pemeriksaan
        </button>
        <Link
          href="/dashboard/dokumen-halal"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          <FileText className="h-5 w-5" />
          Lanjut Buat Dokumen
        </Link>
      </div>
    </motion.div>
  );
}
