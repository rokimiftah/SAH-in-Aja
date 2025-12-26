import { useState } from "react";

import { AlertTriangle, Menu } from "lucide-react";
import { Route, Switch, useLocation } from "wouter";

import { BRANDING } from "@shared/config/branding";
import { ProcessingProvider, useProcessing } from "@shared/contexts";

import { AsistenHalalHistoryPage } from "./AsistenHalalHistoryPage";
import { AsistenHalalPage } from "./AsistenHalalPage";
import { CekBahanHistoryPage } from "./CekBahanHistoryPage";
import { CekBahanPage } from "./CekBahanPage";
import { CekDapurHistoryPage } from "./CekDapurHistoryPage";
import { CekDapurPage } from "./CekDapurPage";
import { Sidebar } from "./components";
import { DashboardHomePage } from "./DashboardHomePage";
import { DokumenHalalHistoryPage } from "./DokumenHalalHistoryPage";
import { DokumenHalalPage } from "./DokumenHalalPage";
import { EditProfilePage } from "./EditProfilePage";
import { EligibilityCheckPage } from "./EligibilityCheckPage";
import { TraceabilityPage } from "./TraceabilityPage";
import { TrainingHistoryPage } from "./TrainingHistoryPage";
import { TrainingPage } from "./TrainingPage";
import { VoiceAuditHistoryPage } from "./VoiceAuditHistoryPage";
import { VoiceAuditPage } from "./VoiceAuditPage";

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { isProcessing, processingMessage } = useProcessing();
  const [showProcessingWarning, setShowProcessingWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Don't render anything if we're navigating away from dashboard
  // This prevents 404 flash during route transitions
  if (!location.startsWith("/dashboard")) {
    return null;
  }

  const handleNavigation = (href: string) => {
    if (isProcessing) {
      setPendingNavigation(href);
      setShowProcessingWarning(true);
      return false;
    }
    navigate(href);
    return true;
  };

  const confirmNavigation = () => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowProcessingWarning(false);
    setPendingNavigation(null);
  };

  const cancelNavigation = () => {
    setShowProcessingWarning(false);
    setPendingNavigation(null);
  };

  return (
    <>
      <div className="h-dvh bg-gray-100 p-4 lg:flex lg:gap-4">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex h-[calc(100dvh-32px)] flex-1 flex-col gap-4 lg:ml-0">
          {/* Top Bar - Mobile only */}
          <header className="flex items-center justify-between lg:hidden">
            <button type="button" onClick={() => handleNavigation("/dashboard")} className="cursor-pointer">
              <img src="/logo.avif" alt={BRANDING.name} className="h-12 w-auto" />
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="cursor-pointer rounded-xl bg-white p-2.5 shadow-sm hover:shadow-md"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </header>

          {/* Content Area - Bento tile */}
          <div className="flex-1 overflow-hidden">
            <Switch>
              <Route path="/dashboard" component={DashboardHomePage} />
              <Route path="/dashboard/cek-dapur/history" component={CekDapurHistoryPage} />
              <Route path="/dashboard/cek-dapur" component={CekDapurPage} />
              <Route path="/dashboard/dokumen-halal/history" component={DokumenHalalHistoryPage} />
              <Route path="/dashboard/dokumen-halal" component={DokumenHalalPage} />
              <Route path="/dashboard/asisten-halal/history" component={AsistenHalalHistoryPage} />
              <Route path="/dashboard/asisten-halal" component={AsistenHalalPage} />
              <Route path="/dashboard/cek-bahan/history" component={CekBahanHistoryPage} />
              <Route path="/dashboard/cek-bahan" component={CekBahanPage} />
              <Route path="/dashboard/voice-audit/history" component={VoiceAuditHistoryPage} />
              <Route path="/dashboard/voice-audit" component={VoiceAuditPage} />
              <Route path="/dashboard/cek-jalur" component={EligibilityCheckPage} />
              <Route path="/dashboard/traceability" component={TraceabilityPage} />
              <Route path="/dashboard/pelatihan/history" component={TrainingHistoryPage} />
              <Route path="/dashboard/pelatihan" component={TrainingPage} />
              <Route path="/dashboard/profile" component={EditProfilePage} />
              <Route>
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white">
                  <p className="text-6xl font-bold text-gray-200">404</p>
                  <h1 className="text-lg font-semibold text-gray-900">Halaman tidak ditemukan</h1>
                  <p className="max-w-sm text-center text-sm text-gray-500">
                    Halaman yang Anda cari tidak tersedia di dashboard.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavigation("/dashboard")}
                    className="bg-primary-green hover:bg-primary-green/90 mt-2 cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
                  >
                    Kembali ke Dashboard
                  </button>
                </div>
              </Route>
            </Switch>
          </div>

          {/* Disclaimer - Bento tile */}
          <div className="rounded-2xl border border-amber-300 bg-amber-200 px-4 py-3 text-center">
            <p className="text-text-muted text-sm">
              <strong>{BRANDING.name}</strong> adalah platform persiapan sertifikasi halal.{" "}
              <a
                href="https://halal.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4 hover:text-neutral-700"
              >
                Daftar ke BPJPH
              </a>{" "}
              untuk sertifikasi resmi.
            </p>
          </div>
        </main>
      </div>

      {/* Processing Warning Modal */}
      {showProcessingWarning && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">Proses Sedang Berjalan</h3>
            <p className="mb-1 text-center text-sm text-gray-600">
              {processingMessage || "Analisis atau pembuatan dokumen sedang berjalan."}
            </p>
            <p className="mb-6 text-center text-sm font-medium text-red-600">
              Meninggalkan halaman akan menghentikan proses dan kredit yang sudah dipakai tidak dapat dikembalikan.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={cancelNavigation}
                className="flex-1 cursor-pointer rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 sm:py-3"
              >
                Tetap di Sini
              </button>
              <button
                type="button"
                onClick={confirmNavigation}
                className="flex-1 cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 sm:py-3"
              >
                Tinggalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DashboardLayout() {
  return (
    <ProcessingProvider>
      <DashboardContent />
    </ProcessingProvider>
  );
}
