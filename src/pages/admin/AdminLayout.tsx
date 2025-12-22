import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowLeft, LayoutDashboard, LogOut, Menu, Tag, Users, X } from "lucide-react";
import { Link, useLocation } from "wouter";

import { BRANDING } from "@shared/config/branding";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { signOut } = useAuthActions();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Promo Codes", href: "/admin/promos", icon: Tag },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  const handleNavigation = (href: string) => {
    setLocation(href);
    setSidebarOpen(false);
  };

  return (
    <div className="h-dvh bg-gray-100 p-4 lg:flex lg:gap-4">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-3 z-50 flex flex-col rounded-2xl bg-white shadow-2xl transition-transform duration-300 lg:static lg:inset-auto lg:z-auto lg:h-full lg:w-72 lg:shrink-0 lg:border lg:border-gray-200 lg:shadow-sm ${sidebarOpen ? "translate-x-0" : "-translate-x-[150%] lg:translate-x-0"} `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full cursor-pointer items-center justify-center transition-opacity hover:opacity-80"
            >
              <img src="/logo.avif" alt="Logo" className="h-12 w-auto" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Menu</div>
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-4">
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/dashboard"
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Link>

              <button
                onClick={() => signOut()}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-transparent bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm transition-all hover:bg-red-100 hover:shadow-md"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex h-[calc(100dvh-32px)] flex-1 flex-col gap-4 lg:ml-0">
        {/* Top Bar - Mobile only */}
        <header className="flex items-center justify-between lg:hidden">
          <Link href="/admin" className="flex items-center gap-2 transition-opacity hover:opacity-80">
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
        <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">{children}</div>
      </main>
    </div>
  );
}
