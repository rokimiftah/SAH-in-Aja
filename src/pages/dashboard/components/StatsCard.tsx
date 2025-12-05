import type { LucideIcon } from "lucide-react";

import { cn } from "@shared/lib";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: "emerald" | "blue" | "orange";
}

export function StatsCard({ label, value, icon: Icon, variant }: StatsCardProps) {
  const variants = {
    emerald: {
      border: "group-hover:border-emerald-200",
      iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
      iconColor: "text-emerald-600",
      decoration: "text-emerald-600/5",
    },
    blue: {
      border: "group-hover:border-blue-200",
      iconBg: "bg-blue-50 group-hover:bg-blue-100",
      iconColor: "text-blue-600",
      decoration: "text-blue-600/5",
    },
    orange: {
      border: "group-hover:border-orange-200",
      iconBg: "bg-orange-50 group-hover:bg-orange-100",
      iconColor: "text-orange-600",
      decoration: "text-orange-600/5",
    },
  };

  const style = variants[variant];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200 bg-neutral-50 p-6 shadow-sm transition-all duration-300",
        style.border,
      )}
    >
      <div className="relative z-10 flex items-center gap-5">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300",
            style.iconBg,
            style.iconColor,
          )}
        >
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <p className="font-medium text-gray-500">{label}</p>
          <h3 className="mt-0.5 text-4xl font-extrabold tracking-tight text-gray-900">{value}</h3>
        </div>
      </div>

      {/* Background Decoration */}
      <Icon
        className={cn(
          "absolute -right-4 -bottom-4 h-24 w-24 rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0",
          style.decoration,
        )}
      />
    </div>
  );
}
