import type { MaterialScanResult } from "../hooks/useCekBahan";

import { useState } from "react";

import {
  AlertTriangle,
  Award,
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Info,
  MessageCircle,
  Package,
  Plus,
  Share2,
  Shield,
  XCircle,
} from "lucide-react";

import { cn } from "@shared/lib";

import { AddIngredientModal } from "./AddIngredientModal";

interface ScanResultProps {
  result: MaterialScanResult;
  onNewScan: () => void;
  onGoToDokumen?: () => void;
  onGoToAsisten?: () => void;
}

function PhotoGallery({ photoUrls }: { photoUrls: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photoUrls.length === 0) return null;

  const labels = ["Depan", "Belakang"];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-4/3 w-full bg-gray-100">
        <img
          src={photoUrls[activeIndex]}
          alt={`Foto ${labels[activeIndex] || activeIndex + 1}`}
          className="h-full w-full object-contain"
        />

        {photoUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev === 0 ? photoUrls.length - 1 : prev - 1))}
              className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev === photoUrls.length - 1 ? 0 : prev + 1))}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {photoUrls.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "h-2 w-2 cursor-pointer rounded-full transition-all",
                    idx === activeIndex ? "w-6 bg-white" : "bg-white/50 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
          {labels[activeIndex] || `Foto ${activeIndex + 1}`}
        </div>
      </div>

      {photoUrls.length > 1 && (
        <div className="flex gap-2 border-t border-gray-100 bg-gray-50 p-3">
          {photoUrls.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                idx === activeIndex ? "border-cyan-500 ring-2 ring-cyan-200" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img src={url} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "aman" | "meragukan" | "tidak_halal" }) {
  const config = {
    aman: {
      bg: "from-green-500 to-emerald-600",
      ringColor: "ring-green-200",
      label: "Aman Digunakan",
      icon: CheckCircle,
      iconColor: "text-green-600",
      badgeBg: "bg-green-100",
      desc: "Bahan ini dapat digunakan untuk produk halal.",
    },
    meragukan: {
      bg: "from-yellow-500 to-orange-500",
      ringColor: "ring-yellow-200",
      label: "Perlu Verifikasi",
      icon: HelpCircle,
      iconColor: "text-yellow-600",
      badgeBg: "bg-yellow-100",
      desc: "Ada bahan yang perlu diverifikasi lebih lanjut.",
    },
    tidak_halal: {
      bg: "from-red-500 to-rose-600",
      ringColor: "ring-red-200",
      label: "Tidak Halal",
      icon: XCircle,
      iconColor: "text-red-600",
      badgeBg: "bg-red-100",
      desc: "Terdapat bahan yang tidak halal. Jangan digunakan.",
    },
  }[status];

  const Icon = config.icon;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:mb-8">
      <div className="bg-linear-to-br from-gray-50 to-white p-5 text-center sm:p-8">
        <div className="relative mx-auto mb-4 sm:mb-6">
          <div
            className={cn(
              "absolute inset-0 mx-auto h-24 w-24 rounded-full bg-linear-to-br opacity-30 blur-2xl sm:h-32 sm:w-32",
              config.bg,
            )}
          />
          <div
            className={cn(
              "relative mx-auto flex h-24 w-24 items-center justify-center rounded-full ring-4 sm:h-32 sm:w-32 sm:ring-8",
              config.ringColor,
            )}
          >
            <div
              className={cn(
                "flex h-18 w-18 items-center justify-center rounded-full bg-linear-to-br shadow-xl sm:h-24 sm:w-24",
                config.bg,
              )}
            >
              <Icon className="h-10 w-10 text-white sm:h-12 sm:w-12" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mx-auto mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:mb-3 sm:px-4 sm:py-2",
            config.badgeBg,
          )}
        >
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", config.iconColor)} />
          <span className={cn("text-base font-bold sm:text-lg", config.iconColor)}>{config.label}</span>
        </div>

        <p className="mx-auto max-w-sm text-sm text-gray-600 sm:text-base">{config.desc}</p>
      </div>
    </div>
  );
}

function StatsSummary({ analysis }: { analysis: MaterialScanResult["analysis"] }) {
  const aman = analysis.filter((a) => a.status === "aman").length;
  const meragukan = analysis.filter((a) => a.status === "meragukan").length;
  const tidakHalal = analysis.filter((a) => a.status === "tidak_halal").length;

  return (
    <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
      <div className="overflow-hidden rounded-xl border border-green-100 bg-linear-to-br from-green-50 to-white p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:p-4">
        <CheckCircle className="mx-auto mb-1 h-5 w-5 text-green-500 sm:mb-2 sm:h-6 sm:w-6" />
        <div className="text-2xl font-bold text-green-600 sm:text-3xl">{aman}</div>
        <div className="text-[10px] font-medium text-green-600 sm:text-xs">Aman</div>
      </div>
      <div className="overflow-hidden rounded-xl border border-yellow-100 bg-linear-to-br from-yellow-50 to-white p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:p-4">
        <AlertTriangle className="mx-auto mb-1 h-5 w-5 text-yellow-500 sm:mb-2 sm:h-6 sm:w-6" />
        <div className="text-2xl font-bold text-yellow-600 sm:text-3xl">{meragukan}</div>
        <div className="text-[10px] font-medium text-yellow-600 sm:text-xs">Meragukan</div>
      </div>
      <div className="overflow-hidden rounded-xl border border-red-100 bg-linear-to-br from-red-50 to-white p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:p-4">
        <XCircle className="mx-auto mb-1 h-5 w-5 text-red-500 sm:mb-2 sm:h-6 sm:w-6" />
        <div className="text-2xl font-bold text-red-600 sm:text-3xl">{tidakHalal}</div>
        <div className="text-[10px] font-medium text-red-600 sm:text-xs">Tidak Halal</div>
      </div>
    </div>
  );
}

function IngredientCard({
  item,
  onAddToList,
}: {
  item: MaterialScanResult["analysis"][0];
  onAddToList: (ingredientName: string, status: "aman" | "meragukan" | "tidak_halal") => void;
}) {
  const config = {
    aman: {
      icon: CheckCircle,
      bg: "bg-gradient-to-br from-green-50 to-white",
      border: "border-green-200",
      iconColor: "text-green-600",
      badgeBg: "bg-green-100",
      label: "Aman",
    },
    meragukan: {
      icon: AlertTriangle,
      bg: "bg-gradient-to-br from-yellow-50 to-white",
      border: "border-yellow-200",
      iconColor: "text-yellow-600",
      badgeBg: "bg-yellow-100",
      label: "Meragukan",
    },
    tidak_halal: {
      icon: XCircle,
      bg: "bg-gradient-to-br from-red-50 to-white",
      border: "border-red-200",
      iconColor: "text-red-600",
      badgeBg: "bg-red-100",
      label: "Tidak Halal",
    },
  }[item.status];

  const Icon = config.icon;

  return (
    <div className={cn("overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md", config.border, config.bg)}>
      <div className={cn("flex items-center justify-between gap-2 px-4 py-2.5", config.badgeBg)}>
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", config.iconColor)} />
          <span className={cn("text-xs font-bold tracking-wide uppercase", config.iconColor)}>{config.label}</span>
        </div>
        <button
          type="button"
          onClick={() => onAddToList(item.ingredient, item.status)}
          className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
        >
          <Plus className="h-3 w-3" />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>
      <div className="p-4">
        <p className="text-text-dark mb-2 font-semibold">{item.ingredient}</p>
        <p className="mb-2 text-sm text-gray-600">{item.reason}</p>
        {item.action && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
            <Info className="h-3 w-3" />
            <span>{item.action}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ScanResult({ result, onNewScan, onGoToDokumen, onGoToAsisten }: ScanResultProps) {
  const [modalIngredient, setModalIngredient] = useState<{
    name: string;
    status: "aman" | "meragukan" | "tidak_halal";
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const amanItems = result.analysis.filter((a) => a.status === "aman");
  const meragukanItems = result.analysis.filter((a) => a.status === "meragukan");
  const tidakHalalItems = result.analysis.filter((a) => a.status === "tidak_halal");

  const handleAddToList = (ingredientName: string, status: "aman" | "meragukan" | "tidak_halal") => {
    setModalIngredient({ name: ingredientName, status });
  };

  const handleModalClose = () => {
    setModalIngredient(null);
  };

  const handleModalSuccess = () => {
    setModalIngredient(null);
    setSuccessMessage(`"${modalIngredient?.name}" berhasil ditambahkan ke Daftar Bahan!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleShare = async () => {
    const statusText = {
      aman: "AMAN",
      meragukan: "PERLU VERIFIKASI",
      tidak_halal: "TIDAK HALAL",
    }[result.overallStatus];

    const shareText = `Status Bahan: ${statusText}\n\n${result.summary}\n\nDicek dengan SAH-in Aja! - Platform persiapan sertifikasi halal untuk UMKM\nhttps://sahin.biz.id`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Hasil disalin ke clipboard!");
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-1">
      <PhotoGallery photoUrls={result.photoUrls} />

      <StatusBadge status={result.overallStatus} />

      {!result.halalCertificate?.detected && <StatsSummary analysis={result.analysis} />}

      {result.halalCertificate?.detected && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-800">Logo Halal Terdeteksi</h4>
              <p className="mb-3 text-sm text-green-700">
                Produk ini memiliki logo halal resmi. Anda cukup menambahkan produk ini sebagai 1 bahan baku tanpa perlu breakdown
                komposisi.
              </p>
              <button
                type="button"
                onClick={() => handleAddToList("", "aman")}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Tambah Produk ke Daftar Bahan
              </button>
            </div>
          </div>
        </div>
      )}

      {result.positiveListDetected && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800">Bahan Alam (Positive List)</h4>
              <p className="text-sm text-blue-700">
                Bahan ini termasuk dalam Positive List KMA No. 335/2022 - tidak memerlukan sertifikat halal.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-primary-green/10 border-primary-green/30 mb-6 rounded-xl border p-4">
        <p className="text-text-dark text-center text-base leading-relaxed font-medium">{result.summary}</p>
      </div>

      {!result.halalCertificate?.detected && result.extractedIngredients.length > 0 && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Award className="text-primary-blue h-5 w-5" />
            <h3 className="text-text-dark font-semibold">Bahan Terdeteksi ({result.extractedIngredients.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.extractedIngredients.map((ing, idx) => (
              <span key={idx} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {!result.halalCertificate?.detected && tidakHalalItems.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-600">
            <XCircle className="h-5 w-5" />
            Tidak Halal
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm">{tidakHalalItems.length}</span>
          </h3>
          <div className="space-y-3">
            {tidakHalalItems.map((item, idx) => (
              <IngredientCard key={idx} item={item} onAddToList={handleAddToList} />
            ))}
          </div>
        </div>
      )}

      {!result.halalCertificate?.detected && meragukanItems.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            Perlu Verifikasi
            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-sm">{meragukanItems.length}</span>
          </h3>
          <div className="space-y-3">
            {meragukanItems.map((item, idx) => (
              <IngredientCard key={idx} item={item} onAddToList={handleAddToList} />
            ))}
          </div>
        </div>
      )}

      {!result.halalCertificate?.detected && amanItems.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-green-600">
            <CheckCircle className="h-5 w-5" />
            Aman
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm">{amanItems.length}</span>
          </h3>
          <div className="space-y-3">
            {amanItems.map((item, idx) => (
              <IngredientCard key={idx} item={item} onAddToList={handleAddToList} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-2 flex items-start gap-2">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h4 className="font-semibold text-amber-800">Penting!</h4>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Ini adalah analisis <strong>PERSIAPAN</strong> berdasarkan foto label. Untuk kepastian status halal, verifikasi
              dengan supplier dan pastikan bahan baku Anda memiliki sertifikat halal yang valid.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {onGoToDokumen && (
          <button
            type="button"
            onClick={onGoToDokumen}
            className="bg-primary-green flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-4 text-base font-semibold text-white shadow-md transition-shadow hover:shadow-xl sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-5 sm:text-lg"
          >
            <FileText className="hidden h-5 w-5 sm:block sm:h-6 sm:w-6" />
            <span>Buat Daftar Bahan Baku</span>
            <ChevronRight className="hidden h-4 w-4 sm:block sm:h-5 sm:w-5" />
          </button>
        )}

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onNewScan}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm sm:gap-2 sm:px-4 sm:py-3.5 sm:text-base"
          >
            <Camera className="hidden h-4 w-4 sm:block" />
            <span>Scan Lagi</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm sm:gap-2 sm:px-4 sm:py-3.5 sm:text-base"
          >
            <Share2 className="hidden h-4 w-4 sm:block" />
            <span>Bagikan</span>
          </button>
        </div>

        {onGoToAsisten && (meragukanItems.length > 0 || tidakHalalItems.length > 0) && (
          <button
            type="button"
            onClick={onGoToAsisten}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700 transition-all hover:border-orange-300 hover:bg-orange-100 sm:py-3.5 sm:text-base"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Tanya Alternatif Bahan Halal</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
            <CheckCircle className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {modalIngredient && (
        <AddIngredientModal
          ingredientName={modalIngredient.name}
          suggestedStatus={modalIngredient.status}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
