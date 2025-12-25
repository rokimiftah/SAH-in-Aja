import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  BookOpen,
  Camera,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Gift,
  History,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Mic,
  Package,
  Table,
  UserPen,
  X,
} from "lucide-react";
import { useLocation } from "wouter";

import { useToast } from "@shared/components/ui";
import { BRANDING, FEATURES } from "@shared/config/branding";
import { useProcessing } from "@shared/contexts";
import { cn } from "@shared/lib";

import { api } from "../../../../convex/_generated/api";

interface CreditBadgeProps {
  remaining: number;
  limit: number;
}

function CreditBadge({ remaining, limit }: CreditBadgeProps) {
  // Check if boosted (promo code applied) - credits > daily limit means boosted
  const isBoosted = remaining > limit;
  // Cap remaining to limit (in case old data has higher values) - unless boosted
  const cappedRemaining = isBoosted ? remaining : Math.min(remaining, limit);
  const isLow = !isBoosted && cappedRemaining <= 1;
  const isEmpty = cappedRemaining === 0;
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, position: "right" as "right" | "top" });
  const badgeRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      const tooltipWidth = 180;

      // Check if tooltip would go off-screen to the right
      if (rect.right + tooltipWidth + 16 > window.innerWidth) {
        // Position above the badge
        setTooltipPos({
          top: rect.top - 8,
          left: rect.left + rect.width / 2,
          position: "top",
        });
      } else {
        // Position to the right
        setTooltipPos({
          top: rect.top + rect.height / 2,
          left: rect.right + 8,
          position: "right",
        });
      }
      setShowTooltip(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  return (
    <>
      <span
        ref={badgeRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className={cn(
          "ml-auto inline-flex min-w-5 cursor-default items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
          isBoosted || (!isEmpty && !isLow)
            ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
            : isEmpty
              ? "bg-red-100 text-red-600"
              : isLow
                ? "bg-amber-100 text-amber-600"
                : "bg-gray-300/80 text-gray-700",
        )}
      >
        {cappedRemaining}
      </span>
      {showTooltip &&
        createPortal(
          <div
            style={{ top: tooltipPos.top, left: tooltipPos.left }}
            className={cn(
              "fixed z-9999 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg",
              tooltipPos.position === "right" ? "-translate-y-1/2" : "-translate-x-1/2 -translate-y-full",
            )}
          >
            Sisa kredit anda hari ini
            {tooltipPos.position === "right" ? (
              <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            ) : (
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    available: true,
    activeClass: "bg-primary-green text-white shadow-md",
  },
  {
    id: "cek-jalur",
    label: "Cek Jalur Sertifikasi",
    icon: ClipboardCheck,
    href: "/dashboard/cek-jalur",
    available: true,
    activeClass: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md",
  },
  {
    id: "traceability",
    label: "Data Produk & Bahan",
    icon: Table,
    href: "/dashboard/traceability",
    available: true,
    activeClass: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md",
  },
  {
    id: "siap-halal",
    label: FEATURES.siapHalal.name,
    icon: Camera,
    href: "/dashboard/siap-halal",
    available: true,
    activeClass: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md",
    activeLightClass: "bg-emerald-50 text-emerald-700",
    subItems: [
      {
        id: "siap-halal-history",
        label: "Riwayat",
        icon: History,
        href: "/dashboard/siap-halal/history",
      },
    ],
  },
  {
    id: "cek-bahan",
    label: FEATURES.cekBahan.name,
    icon: Package,
    href: "/dashboard/cek-bahan",
    available: true,
    activeClass: "bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-md",
    activeLightClass: "bg-cyan-50 text-cyan-700",
    subItems: [
      {
        id: "cek-bahan-history",
        label: "Riwayat",
        icon: History,
        href: "/dashboard/cek-bahan/history",
      },
    ],
  },
  {
    id: "dokumen-halal",
    label: FEATURES.dokumenHalal.name,
    icon: FileText,
    href: "/dashboard/dokumen-halal",
    available: true,
    activeClass: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md",
    activeLightClass: "bg-blue-50 text-blue-700",
    subItems: [
      {
        id: "dokumen-halal-history",
        label: "Riwayat",
        icon: History,
        href: "/dashboard/dokumen-halal/history",
      },
    ],
  },
  {
    id: "asisten-halal",
    label: FEATURES.asistenHalal.name,
    icon: MessageCircle,
    href: "/dashboard/asisten-halal",
    available: true,
    activeClass: "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md",
    activeLightClass: "bg-orange-50 text-orange-700",
    subItems: [
      {
        id: "asisten-halal-history",
        label: "Riwayat",
        icon: History,
        href: "/dashboard/asisten-halal/history",
      },
    ],
  },
  {
    id: "pelatihan",
    label: "Pelatihan Halal",
    icon: BookOpen,
    href: "/dashboard/pelatihan",
    available: true,
    activeClass: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md",
    activeLightClass: "bg-cyan-50 text-cyan-700",
    subItems: [
      {
        id: "pelatihan-history",
        label: "Riwayat",
        icon: History,
        href: "/dashboard/pelatihan/history",
      },
    ],
  },
  {
    id: "voice-audit",
    label: FEATURES.voiceAudit.name,
    icon: Mic,
    href: "/dashboard/voice-audit",
    available: true,
    activeClass: "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md",
    activeLightClass: "bg-rose-50 text-rose-700",
    subItems: [
      {
        id: "voice-audit-history",
        label: "Riwayat",
        icon: History,
        href: "/dashboard/voice-audit/history",
      },
    ],
  },
];

const EXTERNAL_LINKS = [
  { label: "BPJPH", url: "https://halal.go.id" },
  { label: "LPPOM MUI", url: "https://www.halalmui.org" },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location, navigate] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showProcessingWarning, setShowProcessingWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(() => {
    // Auto-expand menu based on current location
    const initialExpanded = new Set<string>();
    for (const item of NAV_ITEMS) {
      if ("subItems" in item && item.subItems && item.href !== "/dashboard" && location.startsWith(item.href)) {
        initialExpanded.add(item.id);
      }
    }
    return initialExpanded;
  });
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback((menuId: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  }, []);

  const { signOut } = useAuthActions();
  const toast = useToast();
  const { isProcessing, processingMessage } = useProcessing();
  const user = useQuery(api.users.getCurrentUser);
  const dailyCredits = useQuery(api.credits.getMyDailyCredits);
  const applyPromoCode = useMutation(api.credits.applyPromoCode);

  const handleNavigation = useCallback(
    (href: string) => {
      if (isProcessing) {
        setPendingNavigation(href);
        setShowProcessingWarning(true);
        return false;
      }
      return true;
    },
    [isProcessing],
  );

  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
      onClose();
    }
    setShowProcessingWarning(false);
    setPendingNavigation(null);
  }, [pendingNavigation, navigate, onClose]);

  const cancelNavigation = useCallback(() => {
    setShowProcessingWarning(false);
    setPendingNavigation(null);
  }, []);

  const name = (user?.name ?? "").trim();
  const email = (user?.email ?? "").trim();
  const displayName = name || email;
  const image = typeof user?.image === "string" ? user.image : undefined;
  const storageId = user?.storageId;

  const initials = useMemo(() => {
    const src = (name || email || "?").trim();
    const parts = src.includes("@")
      ? src
          .split("@")[0]
          .split(/[.\s_+-]+/)
          .filter(Boolean)
      : src.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "?";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [name, email]);

  const avatarUrl =
    image && !imageError
      ? image
      : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=525252`;

  // Use storageId as key to force image element refresh when avatar changes
  const avatarKey = storageId ? String(storageId) : initials;

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate("/", { replace: true });
    }
  };

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

      {/* Sidebar - Floating on mobile, static on desktop */}
      <aside
        className={cn(
          "fixed inset-3 z-50 flex flex-col rounded-2xl bg-white shadow-2xl transition-transform duration-300 lg:static lg:inset-auto lg:z-auto lg:h-full lg:w-72 lg:shrink-0 lg:border lg:border-gray-200 lg:shadow-sm",
          isOpen ? "translate-x-0" : "-translate-x-[150%] lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <button
            type="button"
            onClick={() => {
              if (handleNavigation("/dashboard")) {
                navigate("/dashboard");
                onClose();
              }
            }}
            className="flex w-full cursor-pointer items-center justify-center"
          >
            <img src="/logo.avif" alt={BRANDING.name} className="h-12 w-auto" />
          </button>
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
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const hasSubItems = "subItems" in item && item.subItems && item.subItems.length > 0;
              const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
              const isAvailable = item.available !== false;

              return (
                <li key={item.id}>
                  {isAvailable ? (
                    <>
                      {hasSubItems ? (
                        <button
                          type="button"
                          onClick={() => toggleMenu(item.id)}
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                            isActive
                              ? `${item.activeLightClass} font-semibold`
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform duration-200",
                              expandedMenus.has(item.id) ? "rotate-180" : "",
                            )}
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (handleNavigation(item.href)) {
                              navigate(item.href);
                              onClose();
                            }
                          }}
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                            isActive ? item.activeClass : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </button>
                      )}
                      {/* Submenu */}
                      {hasSubItems && (
                        <div
                          className={cn(
                            "grid px-4 transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out",
                            expandedMenus.has(item.id) ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <div className="flex flex-col gap-1 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                if (handleNavigation(item.href)) {
                                  navigate(item.href);
                                  onClose();
                                }
                              }}
                              className={cn(
                                "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                location === item.href ? item.activeClass : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.id === "siap-halal"
                                ? "Analisis Baru"
                                : item.id === "asisten-halal"
                                  ? "Konsultasi Baru"
                                  : item.id === "cek-bahan"
                                    ? "Scan Baru"
                                    : item.id === "voice-audit"
                                      ? "Simulasi Baru"
                                      : item.id === "pelatihan"
                                        ? "Mulai Quiz"
                                        : "Buat Dokumen"}
                              {dailyCredits && item.id === "siap-halal" && (
                                <CreditBadge remaining={dailyCredits.siapHalalCredits} limit={dailyCredits.limits.siapHalal} />
                              )}
                              {dailyCredits && item.id === "dokumen-halal" && (
                                <CreditBadge
                                  remaining={dailyCredits.dokumenHalalCredits}
                                  limit={dailyCredits.limits.dokumenHalal}
                                />
                              )}
                              {dailyCredits && item.id === "asisten-halal" && (
                                <CreditBadge
                                  remaining={dailyCredits.asistenHalalChats}
                                  limit={dailyCredits.limits.asistenHalal}
                                />
                              )}
                              {dailyCredits && item.id === "cek-bahan" && (
                                <CreditBadge
                                  remaining={dailyCredits.cekBahanCredits ?? dailyCredits.limits.cekBahan}
                                  limit={dailyCredits.limits.cekBahan}
                                />
                              )}
                              {dailyCredits && item.id === "voice-audit" && (
                                <CreditBadge
                                  remaining={dailyCredits.voiceAuditCredits ?? dailyCredits.limits.voiceAudit}
                                  limit={dailyCredits.limits.voiceAudit}
                                />
                              )}
                              {dailyCredits && item.id === "pelatihan" && (
                                <CreditBadge
                                  remaining={dailyCredits.trainingCredits ?? dailyCredits.limits.training}
                                  limit={dailyCredits.limits.training}
                                />
                              )}
                            </button>
                            {item.subItems.map((subItem) => {
                              const isSubActive = location === subItem.href;
                              return (
                                <button
                                  key={subItem.id}
                                  type="button"
                                  onClick={() => {
                                    if (handleNavigation(subItem.href)) {
                                      navigate(subItem.href);
                                      onClose();
                                    }
                                  }}
                                  className={cn(
                                    "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                    isSubActive ? item.activeClass : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                                  )}
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  {subItem.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
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
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
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
            {/* Promo Code */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("promoCode") as HTMLInputElement;
                const code = input.value.trim();
                if (!code) return;

                input.value = "";
                const btn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
                if (btn) btn.disabled = true;

                try {
                  const result = await applyPromoCode({ code });
                  setUserMenuOpen(false);
                  toast.success(result.message);
                } catch {
                  toast.error("Kode promo tidak valid");
                }
              }}
              className="flex items-center gap-2 px-4 py-3"
            >
              <input
                type="text"
                name="promoCode"
                placeholder="Kode promo"
                onChange={(e) => {
                  const btn = e.target.form?.querySelector('button[type="submit"]') as HTMLButtonElement;
                  if (btn) btn.disabled = !e.target.value.trim();
                }}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled
                className="shrink-0 cursor-pointer rounded-lg bg-linear-to-r from-purple-500 to-pink-500 p-1.5 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Gift className="h-4 w-4" />
              </button>
            </form>
            {user?.role === "admin" && (
              <>
                <div className="border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => {
                    navigate("/admin");
                    setUserMenuOpen(false);
                    onClose();
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </button>
              </>
            )}
            <div className="border-t border-gray-100" />
            <button
              type="button"
              onClick={() => {
                if (handleNavigation("/dashboard/profile")) {
                  navigate("/dashboard/profile");
                  setUserMenuOpen(false);
                  onClose();
                }
              }}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <UserPen className="h-4 w-4" />
              Edit Profile
            </button>
            <div className="border-t border-gray-100" />
            <button
              type="button"
              onClick={handleSignOut}
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
              key={avatarKey}
              src={avatarUrl}
              alt="Avatar"
              className="h-10 w-10 rounded-full shadow-sm ring-2 ring-white"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-gray-800">{displayName}</p>
              {name && <p className="truncate text-xs text-gray-500">{email}</p>}
            </div>
            <ChevronUp className={cn("h-4 w-4 text-gray-400 transition-transform", userMenuOpen ? "rotate-180" : "")} />
          </button>
        </div>
      </aside>

      {/* Processing Warning Modal */}
      {showProcessingWarning &&
        createPortal(
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
          </div>,
          document.body,
        )}
    </>
  );
}
