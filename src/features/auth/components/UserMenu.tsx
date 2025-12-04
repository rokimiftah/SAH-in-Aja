// src/features/auth/components/UserMenu.tsx

import { useMemo, useRef, useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { LogOut, User } from "lucide-react";
import { useLocation } from "wouter";

import { api } from "../../../../convex/_generated/api";

export function UserMenu() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = (user?.name ?? "").trim();
  const email = (user?.email ?? "").trim();
  const hasName = !!name;
  const image = typeof user?.image === "string" ? user.image : undefined;

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

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-green-600 text-white ring-2 ring-green-500 ring-offset-2 ring-offset-white transition-all hover:bg-green-700"
        aria-label="Account menu"
      >
        {image ? (
          <img src={image} alt={hasName ? name : email || "User"} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span className="text-sm font-medium">{initials}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <div className="border-b border-gray-100 px-4 py-3">
              {hasName ? (
                <>
                  <p className="truncate text-sm font-medium text-gray-900" title={name}>
                    {name}
                  </p>
                  {email && (
                    <p className="truncate text-xs text-gray-500" title={email}>
                      {email}
                    </p>
                  )}
                </>
              ) : (
                <p className="truncate text-sm text-gray-700" title={email}>
                  {email || "Pengguna"}
                </p>
              )}
            </div>

            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard/profile");
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={16} />
                Edit Profile
              </button>
            </div>

            <div className="border-t border-gray-100 py-1">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
