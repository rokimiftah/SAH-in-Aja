import type { ReactNode } from "react";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useLocation } from "wouter";

interface BackButtonConfig {
  label?: string;
  onClick: () => void;
  mobileOnly?: boolean;
  disabled?: boolean;
}

interface PageContainerProps {
  children: ReactNode;
  backButton?: BackButtonConfig;
  centered?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  scrollResetKey?: unknown;
}

const MAX_WIDTH_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export function PageContainer({ children, backButton, centered = false, maxWidth = "xl", scrollResetKey }: PageContainerProps) {
  const [location] = useLocation();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Back button area - sticky, tidak scroll */}
      {backButton && (
        <div className={`shrink-0 px-1 pt-1 ${backButton.mobileOnly ? "lg:hidden" : ""}`}>
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <button
              type="button"
              onClick={backButton.onClick}
              disabled={backButton.disabled}
              className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
              {backButton.label || "Kembali"}
            </button>
          </div>
        </div>
      )}

      {/* Scrollable content area */}
      <motion.div
        key={scrollResetKey ? `${location}-${String(scrollResetKey)}` : location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex-1 overflow-y-auto p-6 lg:p-8"
      >
        {centered ? (
          <div className="flex min-h-full items-center justify-center">
            <div className={`w-full ${MAX_WIDTH_CLASSES[maxWidth]}`}>{children}</div>
          </div>
        ) : (
          <div className={`mx-auto w-full ${MAX_WIDTH_CLASSES[maxWidth]}`}>{children}</div>
        )}
      </motion.div>
    </div>
  );
}
