import { useState } from "react";

import { Menu } from "lucide-react";
import { Link, Route, Switch, useLocation } from "wouter";

import { BRANDING } from "@shared/config/branding";
import { ProcessingProvider } from "@shared/contexts";

import { AsistenHalalHistoryPage } from "./AsistenHalalHistoryPage";
import { AsistenHalalPage } from "./AsistenHalalPage";
import { CekBahanHistoryPage } from "./CekBahanHistoryPage";
import { CekBahanPage } from "./CekBahanPage";
import { Sidebar } from "./components";
import { DashboardHomePage } from "./DashboardHomePage";
import { DokumenHalalHistoryPage } from "./DokumenHalalHistoryPage";
import { DokumenHalalPage } from "./DokumenHalalPage";
import { EditProfilePage } from "./EditProfilePage";
import { EligibilityCheckPage } from "./EligibilityCheckPage";
import { SiapHalalHistoryPage } from "./SiapHalalHistoryPage";
import { SiapHalalPage } from "./SiapHalalPage";
import { TraceabilityPage } from "./TraceabilityPage";
import { TrainingHistoryPage } from "./TrainingHistoryPage";
import { TrainingPage } from "./TrainingPage";
import { VoiceAuditHistoryPage } from "./VoiceAuditHistoryPage";
import { VoiceAuditPage } from "./VoiceAuditPage";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  // Don't render anything if we're navigating away from dashboard
  // This prevents 404 flash during route transitions
  if (!location.startsWith("/dashboard")) {
    return null;
  }

  return (
    <ProcessingProvider>
      <div className="h-dvh bg-gray-100 p-4 lg:flex lg:gap-4">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex h-[calc(100dvh-32px)] flex-1 flex-col gap-4 lg:ml-0">
          {/* Top Bar - Mobile only */}
          <header className="flex items-center justify-between lg:hidden">
            <Link href="/dashboard">
              <img src="/logo.avif" alt={BRANDING.name} className="h-12 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl bg-white p-2.5 shadow-sm hover:shadow-md"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </header>

          {/* Content Area - Bento tile */}
          <div className="flex-1 overflow-hidden">
            <Switch>
              <Route path="/dashboard" component={DashboardHomePage} />
              <Route path="/dashboard/siap-halal/history" component={SiapHalalHistoryPage} />
              <Route path="/dashboard/siap-halal" component={SiapHalalPage} />
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
                  <Link
                    href="/dashboard"
                    className="bg-primary-green hover:bg-primary-green/90 mt-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
                  >
                    Kembali ke Dashboard
                  </Link>
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
    </ProcessingProvider>
  );
}
