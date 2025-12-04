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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content - offset for floating sidebar on desktop */}
      <main className="min-h-screen lg:ml-80">
        {/* Top Bar - Mobile only */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-gray-100 px-4 py-4 lg:hidden">
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

        {/* Nested Routes */}
        <Switch>
          <Route path="/dashboard" component={DashboardHomePage} />
          <Route path="/dashboard/siap-halal" component={SiapHalalPage} />
          <Route path="/dashboard/dokumen-halal" component={DokumenHalalPage} />
          <Route path="/dashboard/asisten-halal" component={AsistenHalalPage} />
          <Route>
            <div className="flex min-h-[50vh] items-center justify-center">
              <h1 className="text-xl font-bold text-gray-600">Halaman tidak ditemukan</h1>
            </div>
          </Route>
        </Switch>
      </main>

      {/* Disclaimer - Fixed Bottom */}
      <div
        className={`fixed right-4 bottom-3 left-4 z-40 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center transition-all duration-300 sm:bottom-4 lg:right-8 lg:left-84 ${
          sidebarOpen
            ? "pointer-events-none translate-y-full opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100"
            : "translate-y-0 opacity-100"
        }`}
      >
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
    </div>
  );
}
