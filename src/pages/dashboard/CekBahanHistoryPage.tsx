import type { Doc } from "../../../convex/_generated/dataModel";

import { useState } from "react";

import { useQuery } from "convex/react";
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, Clock, Package, XCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

import { ScanResult } from "@features/cek-bahan";
import { FEATURES } from "@shared/config/branding";
import { cn } from "@shared/lib";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type MaterialScan = Doc<"material_scans">;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScanListItem({ scan, onClick }: { scan: MaterialScan; onClick: () => void }) {
  const config = {
    aman: { bg: "bg-green-500", label: "Aman", icon: CheckCircle },
    meragukan: { bg: "bg-yellow-500", label: "Meragukan", icon: AlertTriangle },
    tidak_halal: { bg: "bg-red-500", label: "Tidak Halal", icon: XCircle },
  }[scan.overallStatus];

  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white sm:h-14 sm:w-14",
              config.bg,
            )}
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-dark truncate font-semibold">{config.label}</p>
            <p className="mt-0.5 truncate text-sm text-gray-600">{scan.summary}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{formatDate(scan.createdAt)}</span>
            </div>
          </div>
        </div>
        <ArrowLeft className="h-5 w-5 shrink-0 rotate-180 text-gray-400" />
      </div>
    </button>
  );
}

export function CekBahanHistoryPage() {
  const [, navigate] = useLocation();
  const [selectedScan, setSelectedScan] = useState<MaterialScan | null>(null);
  const scans = useQuery(api.materialScans.getMyScans);

  const isLoading = scans === undefined;

  const handleNewScan = () => navigate("/dashboard/cek-bahan");
  const handleGoToDokumen = () => navigate("/dashboard/dokumen-halal");
  const handleGoToAsisten = () => navigate("/dashboard/asisten-halal");

  // Detail view
  if (selectedScan) {
    return (
      <PageContainer backButton={{ onClick: () => setSelectedScan(null) }} centered maxWidth="3xl">
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {formatDate(selectedScan.createdAt)}
        </div>
        <ScanResult
          result={{
            halalCertificate: selectedScan.halalCertificate,
            positiveListDetected: selectedScan.positiveListDetected,
            extractedIngredients: selectedScan.extractedIngredients,
            analysis: selectedScan.analysis,
            overallStatus: selectedScan.overallStatus,
            summary: selectedScan.summary,
            photoUrls: selectedScan.photoUrls,
          }}
          onNewScan={handleNewScan}
          onGoToDokumen={handleGoToDokumen}
          onGoToAsisten={handleGoToAsisten}
        />
      </PageContainer>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-cyan-500" />
      </div>
    );
  }

  // List view
  return (
    <PageContainer backButton={{ onClick: () => navigate("/dashboard/cek-bahan") }} maxWidth="3xl">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-text-dark mb-2 text-2xl font-bold">Riwayat {FEATURES.cekBahan.name}</h1>
      </div>

      {scans.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Belum Ada Riwayat</h3>
          <p className="mb-6 text-gray-600">Mulai scan bahan pertama Anda untuk melihat riwayat di sini.</p>
          <Link
            href="/dashboard/cek-bahan"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
          >
            <Package className="h-5 w-5" />
            Mulai Scan Bahan
          </Link>
        </div>
      )}

      {scans.length > 0 && (
        <>
          <div className="space-y-4">
            {scans.map((scan) => (
              <ScanListItem key={scan._id} scan={scan} onClick={() => setSelectedScan(scan)} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/dashboard/cek-bahan"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
            >
              <Package className="h-5 w-5" />
              Scan Bahan Baru
            </Link>
          </div>
        </>
      )}
    </PageContainer>
  );
}
