import { useEffect, useRef, useState } from "react";

import { Camera, ChevronUp, ExternalLink, FileText, LayoutDashboard, LogOut, MessageCircle, UserPen, X } from "lucide-react";
import { Link, useLocation } from "wouter";

import { BRANDING, FEATURES } from "@shared/config/branding";
import { cn } from "@shared/lib";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    available: true,
  },
  {
    id: "siap-halal",
    label: FEATURES.siapHalal.name,
    icon: Camera,
    href: "/dashboard/siap-halal",
    available: true,
  },
  {
    id: "dokumen-halal",
    label: FEATURES.dokumenHalal.name,
    icon: FileText,
    href: "/dashboard/dokumen-halal",
    available: false,
  },
  {
    id: "asisten-halal",
    label: FEATURES.asistenHalal.name,
    icon: MessageCircle,
    href: "/dashboard/asisten-halal",
    available: false,
  },
] as const;

const EXTERNAL_LINKS = [
  { label: "BPJPH", url: "https://halal.go.id" },
  { label: "LPPOM MUI", url: "https://www.halalmui.org" },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sidebar - Floating */}
      <aside
        className={cn(
          "fixed inset-3 z-50 flex flex-col rounded-2xl bg-white shadow-2xl transition-transform duration-300 lg:inset-auto lg:top-4 lg:right-auto lg:bottom-4 lg:left-4 lg:w-72 lg:border lg:border-gray-200 lg:shadow-md",
          isOpen ? "translate-x-0" : "-translate-x-[150%] lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <Link href="/" className="flex w-full items-center justify-center">
            <img src="/logo.avif" alt={BRANDING.name} className="h-12 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Menu</div>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
              const isAvailable = item.available !== false;

              return (
                <li key={item.id}>
                  {isAvailable ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary-green text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400">
                      <item.icon className="h-5 w-5" />
                      {item.label}
                      <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">Soon</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Sumber Resmi</div>
          <ul className="space-y-1">
            {EXTERNAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                >
                  <ExternalLink className="h-4 w-4" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile */}
        <div ref={userMenuRef} className="relative p-4">
          <div
            className={cn(
              "absolute right-4 bottom-full left-4 mb-2 origin-bottom overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200 transition-all duration-200",
              userMenuOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-95 opacity-0",
            )}
          >
            <button
              type="button"
              onClick={() => setUserMenuOpen(false)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <UserPen className="h-4 w-4" />
              Edit Profile
            </button>
            <div className="border-t border-gray-100" />
            <button
              type="button"
              onClick={() => setUserMenuOpen(false)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>

          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-linear-to-br from-gray-50 to-gray-100 p-3 transition-all hover:shadow-md"
          >
            <img
              src="https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundColor=10b981"
              alt="Avatar"
              className="h-10 w-10 rounded-full shadow-sm ring-2 ring-white"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-gray-800">Pengguna</p>
              <p className="truncate text-xs text-gray-500">pengguna@email.com</p>
            </div>
            <ChevronUp className={cn("h-4 w-4 text-gray-400 transition-transform", userMenuOpen ? "rotate-180" : "")} />
          </button>
        </div>
      </aside>
    </>
  );
}
