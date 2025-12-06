import { useCallback, useEffect, useState } from "react";

import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

import { cn } from "@shared/lib";

const HALAL_TIPS = [
  {
    title: "Pemisahan Area Produksi",
    content: "Pastikan area produksi halal terpisah dari area non-halal. Gunakan peralatan khusus yang tidak tercampur.",
    category: "Fasilitas",
  },
  {
    title: "Sertifikat Bahan Baku",
    content: "Semua bahan baku harus memiliki sertifikat halal atau dokumen pendukung kehalalan dari pemasok.",
    category: "Bahan",
  },
  {
    title: "Audit Internal Berkala",
    content: "Lakukan audit internal minimal setiap 6 bulan sekali untuk memastikan konsistensi penerapan SJH.",
    category: "Audit",
  },
  {
    title: "Pelatihan Karyawan",
    content: "Karyawan yang menangani produk halal wajib mengikuti pelatihan Sistem Jaminan Halal (SJH).",
    category: "SDM",
  },
  {
    title: "Penyimpanan Terpisah",
    content: "Penyimpanan bahan halal harus terpisah dari bahan non-halal dan diberi label yang jelas.",
    category: "Fasilitas",
  },
  {
    title: "Dokumentasi Lengkap",
    content: "Siapkan dokumen SJPH seperti Manual SJH, SOP, Daftar Bahan, dan Matriks Produk sebelum mengajukan sertifikasi.",
    category: "Dokumen",
  },
  {
    title: "Kebersihan Peralatan",
    content: "Peralatan produksi harus dibersihkan sesuai prosedur yang ditetapkan untuk menjaga status kehalalan.",
    category: "Fasilitas",
  },
  {
    title: "Penelusuran Bahan",
    content: "Pastikan sistem penelusuran (traceability) bahan baku hingga produk jadi terdokumentasi dengan baik.",
    category: "Bahan",
  },
];

const AUTO_SLIDE_INTERVAL = 8000;

export function TipsCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTip = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HALAL_TIPS.length);
  }, []);

  const prevTip = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HALAL_TIPS.length) % HALAL_TIPS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextTip, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextTip]);

  const currentTip = HALAL_TIPS[currentIndex];

  return (
    <div
      className="group relative flex h-[355px] flex-col overflow-hidden rounded-xl border border-stone-200 bg-linear-to-br from-stone-50 to-neutral-50 p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:block sm:h-auto sm:rounded-2xl sm:p-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header - Mobile: Centered, Desktop: Horizontal */}
      <div className="mb-3 flex flex-col items-center sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Tips Sertifikasi Halal</h3>
        </div>
        <span className="mt-2 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:mt-0">
          {currentTip.category}
        </span>
      </div>

      {/* Content */}
      <div className="overflow-hidden text-center sm:min-h-20 sm:overflow-visible sm:text-left">
        <h4 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">{currentTip.title}</h4>
        <p className="line-clamp-4 text-sm leading-relaxed text-gray-600 sm:line-clamp-none">{currentTip.content}</p>
      </div>

      {/* Navigation */}
      <div className="relative z-10 mt-auto flex flex-col items-center gap-3 sm:mt-2 sm:flex-row sm:justify-between sm:gap-0">
        <div className="order-1 flex gap-1 sm:order-0 sm:gap-1.5">
          {HALAL_TIPS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1.5 cursor-pointer rounded-full transition-all duration-300 sm:h-2",
                index === currentIndex ? "w-4 bg-orange-300 sm:w-6" : "w-1.5 bg-orange-100 hover:bg-orange-200 sm:w-2",
              )}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>
        <div className="order-2 flex gap-1 sm:order-0">
          <button
            type="button"
            onClick={prevTip}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors hover:bg-blue-200 sm:h-8 sm:w-8"
            aria-label="Previous tip"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            type="button"
            onClick={nextTip}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors hover:bg-blue-200 sm:h-8 sm:w-8"
            aria-label="Next tip"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Background Decoration */}
      <Lightbulb className="absolute -right-4 -bottom-4 h-20 w-20 rotate-12 text-stone-600/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0 sm:h-24 sm:w-24" />
    </div>
  );
}
