import type { Id } from "../../../../convex/_generated/dataModel";
import type { HalalStatus, Ingredient } from "../types";

import { useState } from "react";

import { AlertCircle, AlertTriangle, Calendar, Edit2, Plus, Trash2, X } from "lucide-react";

import { Select } from "@shared/components/ui";

import { HALAL_STATUS_COLORS, HALAL_STATUS_LABELS, HALAL_STATUS_OPTIONS } from "../types";

interface IngredientManagerProps {
  ingredients: Ingredient[];
  onCreate: (data: {
    name: string;
    supplier: string;
    halalCertNumber?: string;
    certExpiryDate?: number;
    halalStatus: HalalStatus;
  }) => Promise<Id<"ingredients">>;
  onUpdate: (data: {
    ingredientId: Id<"ingredients">;
    name: string;
    supplier: string;
    halalCertNumber?: string;
    certExpiryDate?: number;
    halalStatus: HalalStatus;
  }) => Promise<null | undefined>;
  onDelete: (data: { ingredientId: Id<"ingredients"> }) => Promise<null | undefined>;
}

const INITIAL_FORM = {
  name: "",
  supplier: "",
  halalCertNumber: "",
  certExpiryDate: "",
  halalStatus: "perlu_verifikasi" as HalalStatus,
};

export function IngredientManager({ ingredients, onCreate, onUpdate, onDelete }: IngredientManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"ingredients"> | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.supplier.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate({
        name: formData.name.trim(),
        supplier: formData.supplier.trim(),
        halalCertNumber: formData.halalCertNumber.trim() || undefined,
        certExpiryDate: formData.certExpiryDate ? new Date(formData.certExpiryDate).getTime() : undefined,
        halalStatus: formData.halalStatus,
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name.trim() || !formData.supplier.trim()) return;
    setIsSubmitting(true);
    try {
      await onUpdate({
        ingredientId: editingId,
        name: formData.name.trim(),
        supplier: formData.supplier.trim(),
        halalCertNumber: formData.halalCertNumber.trim() || undefined,
        certExpiryDate: formData.certExpiryDate ? new Date(formData.certExpiryDate).getTime() : undefined,
        halalStatus: formData.halalStatus,
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ingredientId: Id<"ingredients">) => {
    if (!confirm("Hapus bahan ini? Semua mapping produk akan ikut terhapus.")) return;
    await onDelete({ ingredientId });
  };

  const startEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient._id);
    setFormData({
      name: ingredient.name,
      supplier: ingredient.supplier,
      halalCertNumber: ingredient.halalCertNumber ?? "",
      certExpiryDate: ingredient.certExpiryDate ? new Date(ingredient.certExpiryDate).toISOString().split("T")[0] : "",
      halalStatus: ingredient.halalStatus,
    });
    setIsAdding(false);
  };

  const isExpiringSoon = (expiryDate?: number) => {
    if (!expiryDate) return false;
    const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;
    return expiryDate < thirtyDaysFromNow;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Daftar Bahan Baku</h3>
        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-600 sm:w-auto sm:py-1.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Bahan
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{editingId ? "Edit Bahan" : "Tambah Bahan Baru"}</h4>
            <button type="button" onClick={resetForm} className="cursor-pointer text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nama bahan (wajib)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            />
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData((p) => ({ ...p, supplier: e.target.value }))}
              placeholder="Supplier/Produsen (wajib)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={formData.halalCertNumber}
                onChange={(e) => setFormData((p) => ({ ...p, halalCertNumber: e.target.value }))}
                placeholder="Nomor Sertifikat Halal"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
              <input
                type="date"
                value={formData.certExpiryDate}
                onChange={(e) => setFormData((p) => ({ ...p, certExpiryDate: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <Select
              value={formData.halalStatus}
              onChange={(value) => setFormData((p) => ({ ...p, halalStatus: value as HalalStatus }))}
              options={HALAL_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              placeholder="Pilih status halal"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={editingId ? handleUpdate : handleAdd}
                disabled={!formData.name.trim() || !formData.supplier.trim() || isSubmitting}
                className="cursor-pointer rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : editingId ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {ingredients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Belum ada bahan. Tambahkan bahan untuk memulai.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ingredients.map((ingredient) => (
            <div key={ingredient._id} className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{ingredient.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${HALAL_STATUS_COLORS[ingredient.halalStatus as HalalStatus]}`}
                    >
                      {HALAL_STATUS_LABELS[ingredient.halalStatus as HalalStatus]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Supplier: {ingredient.supplier}</p>
                  {ingredient.halalCertNumber && (
                    <p className="text-xs text-gray-500">No. Sertifikat: {ingredient.halalCertNumber}</p>
                  )}
                  {ingredient.certExpiryDate && (
                    <p
                      className={`flex items-center gap-1 text-xs ${isExpiringSoon(ingredient.certExpiryDate) ? "text-amber-600" : "text-gray-500"}`}
                    >
                      <Calendar className="h-3 w-3" />
                      Berlaku s.d. {new Date(ingredient.certExpiryDate).toLocaleDateString("id-ID")}
                      {isExpiringSoon(ingredient.certExpiryDate) && (
                        <span className="ml-1 flex items-center gap-0.5 text-amber-600">
                          <AlertTriangle className="h-3 w-3" />
                          Segera berakhir
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="ml-3 flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(ingredient)}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ingredient._id)}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
