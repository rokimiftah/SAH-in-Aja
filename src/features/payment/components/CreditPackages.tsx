import { Check, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@shared/lib";

interface CreditPackage {
  id: string;
  credits: number;
  amount: number;
  name: string;
  description: string;
  popular: boolean;
}

interface CreditPackagesProps {
  packages: CreditPackage[];
  selectedPackage: string | null;
  onSelect: (packageId: string) => void;
  isLoading?: boolean;
}

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

export function CreditPackages({ packages, selectedPackage, onSelect, isLoading }: CreditPackagesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className={cn(
            "group relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300",
            selectedPackage === pkg.id
              ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10"
              : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md",
            isLoading && "pointer-events-none opacity-60",
          )}
          onClick={() => onSelect(pkg.id)}
        >
          {/* Popular badge */}
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                <Sparkles className="h-3 w-3" />
                Terpopuler
              </div>
            </div>
          )}

          {/* Selected indicator */}
          {selectedPackage === pkg.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white"
            >
              <Check className="h-4 w-4" />
            </motion.div>
          )}

          {/* Content */}
          <div className="text-center">
            {/* Credits badge */}
            <div
              className={cn(
                "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl",
                pkg.popular
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                  : selectedPackage === pkg.id
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700",
              )}
            >
              <Zap className="h-7 w-7" />
            </div>

            {/* Package name */}
            <h3 className="mb-1 text-lg font-bold text-gray-900">{pkg.name}</h3>

            {/* Credits */}
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{formatNumber(pkg.credits)}</span>
              <span className="ml-1 text-sm font-medium text-gray-500">kredit</span>
            </div>

            {/* Description */}
            <p className="mb-3 text-xs text-gray-500">{pkg.description}</p>

            {/* Price */}
            <div className="rounded-xl bg-gray-50 px-4 py-2">
              <span className="text-xl font-bold text-gray-900">{formatCurrency(pkg.amount)}</span>
            </div>

            {/* Per credit calculation */}
            <p className="mt-2 text-xs text-gray-400">{formatCurrency(Math.round(pkg.amount / pkg.credits))}/kredit</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
