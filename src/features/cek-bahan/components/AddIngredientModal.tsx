import type { HalalStatus } from "@features/traceability/types";

import { useState } from "react";

import { useMutation } from "convex/react";
import { AlertCircle, Check, Loader2, Package, X } from "lucide-react";

import { DatePicker, Select } from "@shared/components/ui";
import { cn } from "@shared/lib";

import { api } from "../../../../convex/_generated/api";

interface AddIngredientModalProps {
  ingredientName: string;
  suggestedStatus: "aman" | "meragukan" | "tidak_halal";
  onClose: () => void;
  onSuccess: () => void;
}

const HALAL_STATUS_OPTIONS = [
  { value: "halal", label: "Halal (Bersertifikat)", color: "bg-emerald-500" },
  { value: "dalam_proses", label: "Dalam Proses Sertifikasi", color: "bg-amber-500" },
  { value: "perlu_verifikasi", label: "Perlu Verifikasi", color: "bg-red-500" },
  { value: "alami", label: "Bahan Alami (Tanpa Proses)", color: "bg-blue-500" },
];

function mapScanStatusToHalalStatus(scanStatus: "aman" | "meragukan" | "tidak_halal"): HalalStatus {
  switch (scanStatus) {
    case "aman":
      return "halal";
    case "meragukan":
      return "perlu_verifikasi";
    case "tidak_halal":
      return "perlu_verifikasi";
    default:
      return "perlu_verifikasi";
  }
}

export function AddIngredientModal({ ingredientName, suggestedStatus, onClose, onSuccess }: AddIngredientModalProps) {
  const createIngredient = useMutation(api.ingredients.createIngredient);

  const [formData, setFormData] = useState({
    name: ingredientName,
    supplier: "",
    halalCertNumber: "",
    certExpiryDate: "",
    halalStatus: mapScanStatusToHalalStatus(suggestedStatus),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Nama bahan wajib diisi");
      return;
    }
    if (!formData.supplier.trim()) {
      setError("Nama supplier wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      await createIngredient({
        name: formData.name.trim(),
        supplier: formData.supplier.trim(),
        halalCertNumber: formData.halalCertNumber.trim() || undefined,
        certExpiryDate: formData.certExpiryDate ? new Date(formData.certExpiryDate).getTime() : undefined,
        halalStatus: formData.halalStatus,
      });
      onSuccess();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "data" in err && typeof err.data === "string"
          ? err.data
          : err instanceof Error
            ? err.message
            : "Gagal menambahkan bahan";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Tambah ke Daftar Bahan</h3>
              <p className="text-xs text-gray-500">Import dari hasil scan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Nama Bahan <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              placeholder="Nama bahan"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Supplier <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              placeholder="Nama supplier/produsen"
            />
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Status Halal</span>
            <Select
              value={formData.halalStatus}
              onChange={(value) => setFormData({ ...formData, halalStatus: value as HalalStatus })}
              options={HALAL_STATUS_OPTIONS}
              placeholder="Pilih status halal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">No. Sertifikat Halal</span>
              <input
                type="text"
                value={formData.halalCertNumber}
                onChange={(e) => setFormData({ ...formData, halalCertNumber: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                placeholder="Contoh: LPPOM-123456"
              />
            </label>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Berlaku Hingga</span>
              <DatePicker
                value={formData.certExpiryDate}
                onChange={(value) => setFormData({ ...formData, certExpiryDate: value })}
                placeholder="Pilih tanggal..."
              />
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 p-3">
            <p className="text-xs text-amber-700">
              <strong>Tips:</strong> Masukkan nomor sertifikat halal dari kemasan atau dokumen supplier. Pastikan sertifikat masih
              berlaku untuk lolos audit.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all",
                isSubmitting ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Simpan Bahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
