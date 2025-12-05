import { useState } from "react";

import { Menu } from "lucide-react";
import { Link, Route, Switch } from "wouter";

import { BRANDING } from "@shared/config/branding";

import { AsistenHalalPage } from "./AsistenHalalPage";
import { Sidebar } from "./components";
import { DashboardHomePage } from "./DashboardHomePage";
import { DokumenHalalPage } from "./DokumenHalalPage";
import { SiapHalalPage } from "./SiapHalalPage";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 p-4 lg:flex lg:gap-4">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex h-[calc(100vh-32px)] flex-1 flex-col gap-4 lg:ml-0">
        {/* Top Bar - Mobile only */}
        <header className="flex items-center justify-between lg:hidden">
          <Link href="/">
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
            <Route path="/dashboard/siap-halal" component={SiapHalalPage} />
            <Route path="/dashboard/dokumen-halal" component={DokumenHalalPage} />
            <Route path="/dashboard/asisten-halal" component={AsistenHalalPage} />
            <Route>
              <div className="flex h-full items-center justify-center rounded-2xl border border-gray-200 bg-white">
                <h1 className="text-xl font-bold text-gray-600">Halaman tidak ditemukan</h1>
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
  );
}
