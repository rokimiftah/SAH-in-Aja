import type { Id } from "../../../../convex/_generated/dataModel";
import type { Product } from "../types";

import { useState } from "react";

import { AlertCircle, Edit2, Plus, Trash2, X } from "lucide-react";

interface ProductManagerProps {
  products: Product[];
  onCreate: (data: { name: string; productCode?: string; description?: string }) => Promise<Id<"products">>;
  onUpdate: (data: {
    productId: Id<"products">;
    name: string;
    productCode?: string;
    description?: string;
  }) => Promise<null | undefined>;
  onDelete: (data: { productId: Id<"products"> }) => Promise<null | undefined>;
}

export function ProductManager({ products, onCreate, onUpdate, onDelete }: ProductManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [formData, setFormData] = useState({ name: "", productCode: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ name: "", productCode: "", description: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate({
        name: formData.name.trim(),
        productCode: formData.productCode.trim() || undefined,
        description: formData.description.trim() || undefined,
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name.trim()) return;
    setIsSubmitting(true);
    try {
      await onUpdate({
        productId: editingId,
        name: formData.name.trim(),
        productCode: formData.productCode.trim() || undefined,
        description: formData.description.trim() || undefined,
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: Id<"products">) => {
    if (!confirm("Hapus produk ini? Semua mapping bahan akan ikut terhapus.")) return;
    await onDelete({ productId });
  };

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      productCode: product.productCode ?? "",
      description: product.description ?? "",
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Daftar Produk</h3>
        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 sm:w-auto sm:py-1.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{editingId ? "Edit Produk" : "Tambah Produk Baru"}</h4>
            <button type="button" onClick={resetForm} className="cursor-pointer text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nama produk (wajib)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <input
              type="text"
              value={formData.productCode}
              onChange={(e) => setFormData((p) => ({ ...p, productCode: e.target.value }))}
              placeholder="Kode produk (opsional)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Deskripsi (opsional)"
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
                disabled={!formData.name.trim() || isSubmitting}
                className="cursor-pointer rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : editingId ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Belum ada produk. Tambahkan produk untuk memulai.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product._id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                {product.productCode && <p className="text-xs text-gray-500">Kode: {product.productCode}</p>}
                {product.description && <p className="mt-1 text-sm text-gray-600">{product.description}</p>}
              </div>
              <div className="ml-3 flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(product)}
                  className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product._id)}
                  className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
