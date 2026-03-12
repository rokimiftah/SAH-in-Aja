import { useMemo } from "react";

import { useQuery } from "convex/react";
import { Check, Loader2, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@shared/lib";

import { api } from "../../../../convex/_generated/api";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

type PricingSectionVariant = "landing" | "page";

export function PricingSection({ variant = "landing" }: { variant?: PricingSectionVariant }) {
  const packages = useQuery(api.mayar.getCreditPackages);

  const orderedPackages = useMemo(() => {
    if (!packages) return packages;
    return [...packages].sort((a, b) => a.credits - b.credits);
  }, [packages]);

  return (
    <section id="pricing" className={cn("scroll-mt-12 bg-white py-12 sm:py-34", variant === "landing")}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-16"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:mb-3 sm:text-3xl">Harga Fleksibel</h2>
          <p className="text-sm text-gray-500 sm:text-base">
            Mulai gratis, lalu top-up kredit sesuai kebutuhan untuk akses fitur AI.
          </p>
        </motion.div>

        {orderedPackages ? (
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {orderedPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={cn(
                  "relative rounded-2xl border bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] sm:p-6",
                  pkg.popular ? "border-emerald-200 shadow-[0_14px_35px_-20px_rgba(16,185,129,0.5)]" : "border-gray-200",
                )}
              >
                {pkg.popular ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Terpopuler
                    </div>
                  </div>
                ) : null}

                <div className="text-center">
                  <div
                    className={cn(
                      "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl",
                      pkg.popular ? "bg-linear-to-br from-emerald-500 to-teal-500 text-white" : "bg-gray-100 text-gray-700",
                    )}
                  >
                    <Zap className="h-7 w-7" />
                  </div>

                  <h3 className="mb-1 text-lg font-bold text-gray-900">{pkg.name}</h3>
                  <p className="mb-4 text-xs text-gray-500">{pkg.description}</p>

                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{formatNumber(pkg.credits)}</span>
                    <span className="ml-1 text-sm font-medium text-gray-500">kredit</span>
                  </div>

                  <div className={cn("rounded-xl px-4 py-3", pkg.popular ? "bg-emerald-50" : "bg-gray-50")}>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(pkg.amount)}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      {formatCurrency(Math.round(pkg.amount / pkg.credits))}/kredit
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-left">
                    <li className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", pkg.popular ? "text-emerald-600" : "text-gray-500")} />
                      Kredit dapat dipakai untuk analisis AI dan generate dokumen.
                    </li>
                    <li className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", pkg.popular ? "text-emerald-600" : "text-gray-500")} />
                      Tidak ada langganan—top-up hanya saat butuh.
                    </li>
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <p className="mt-12 text-sm text-gray-400">Semua transaksi diproses aman melalui Mayar.id</p>
        </div>
      </div>
    </section>
  );
}
