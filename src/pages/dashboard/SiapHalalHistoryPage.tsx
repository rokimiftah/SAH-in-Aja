import type { Doc } from "../../../convex/_generated/dataModel";

import { useState } from "react";

import { useQuery } from "convex/react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";

import { AnalysisResults } from "@features/siap-halal";
import { FEATURES } from "@shared/config/branding";
import { cn } from "@shared/lib";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type Scan = Doc<"halal_scans">;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScanListItem({ scan, onClick }: { scan: Scan; onClick: () => void }) {
  const config =
    scan.score >= 80
      ? { bg: "bg-green-500", label: "Siap Audit" }
      : scan.score >= 60
        ? { bg: "bg-yellow-500", label: "Perlu Perbaikan" }
        : { bg: "bg-red-500", label: "Belum Siap" };

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
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white sm:h-14 sm:w-14 sm:text-lg",
              config.bg,
            )}
          >
            {scan.score}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-dark truncate font-semibold">{config.label}</p>
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

export function SiapHalalHistoryPage() {
  const [, navigate] = useLocation();
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const scans = useQuery(api.halalScans.getMyScans);

  const isLoading = scans === undefined;

  const handleNewScan = () => navigate("/dashboard/siap-halal");
  const handleGenerateDocuments = () => navigate("/dashboard/dokumen-halal");

  // Detail view
  if (selectedScan) {
    return (
      <PageContainer backButton={{ onClick: () => setSelectedScan(null) }} centered maxWidth="3xl">
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {formatDate(selectedScan.createdAt)}
        </div>
        <AnalysisResults
          score={selectedScan.score}
          findings={selectedScan.findings}
          actionItems={selectedScan.actionItems}
          summaryPoints={selectedScan.summaryPoints ?? []}
          overallMessage={selectedScan.overallMessage ?? ""}
          onNewScan={handleNewScan}
          onGenerateDocuments={handleGenerateDocuments}
        />
      </PageContainer>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
      </div>
    );
  }

  // List view
  return (
    <PageContainer backButton={{ onClick: () => navigate("/dashboard/siap-halal") }} maxWidth="3xl">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-text-dark mb-2 text-2xl font-bold">Riwayat Analisis {FEATURES.siapHalal.name}</h1>
      </div>

      {scans.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Belum Ada Riwayat</h3>
          <p className="mb-6 text-gray-600">Mulai analisis pertama Anda untuk melihat riwayat di sini.</p>
          <Link
            href="/dashboard/siap-halal"
            className="bg-primary-green inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white"
          >
            Mulai Analisis
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
              href="/dashboard/siap-halal"
              className="bg-primary-green inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
            >
              Analisis Baru
            </Link>
          </div>
        </>
      )}
    </PageContainer>
  );
}
