import type { Ingredient, Product } from "../types";

import { Plus, Trash2 } from "lucide-react";

import { Select } from "@shared/components/ui";

interface IngredientsFormProps {
  data: Ingredient[];
  products: Product[];
  onChange: (data: Ingredient[]) => void;
}

const HALAL_STATUS_OPTIONS = [
  { value: "halal", label: "Halal (Bersertifikat)", color: "bg-emerald-500" },
  { value: "dalam_proses", label: "Dalam Proses Sertifikasi", color: "bg-amber-500" },
  { value: "perlu_verifikasi", label: "Perlu Verifikasi", color: "bg-red-500" },
  { value: "alami", label: "Bahan Alami (Tanpa Proses)", color: "bg-blue-500" },
];

export function IngredientsForm({ data, products, onChange }: IngredientsFormProps) {
  const addIngredient = () => {
    onChange([...data, { name: "", supplier: "", halalStatus: "perlu_verifikasi", productsUsedIn: [] }]);
  };

  const removeIngredient = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | string[]) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const toggleProduct = (index: number, productId: string) => {
    const ingredient = data[index];
    const currentProducts = ingredient.productsUsedIn || [];
    const newProducts = currentProducts.includes(productId)
      ? currentProducts.filter((id) => id !== productId)
      : [...currentProducts, productId];
    updateIngredient(index, "productsUsedIn", newProducts);
  };

  const toggleSelectAll = (index: number) => {
    const ingredient = data[index];
    const currentProducts = ingredient.productsUsedIn || [];
    const allProductIds = products.map((p) => p.id);

    // If all are selected, deselect all. Otherwise, select all.
    const newProducts = currentProducts.length === products.length ? [] : allProductIds;
    updateIngredient(index, "productsUsedIn", newProducts);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-text-dark text-xl font-bold">Daftar Bahan Baku</h2>
        <p className="mt-1 text-sm text-gray-600">Tambahkan bahan dan pilih produk mana saja yang menggunakan bahan tersebut.</p>
      </div>

      <div className="space-y-3">
        {data.map((ingredient, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Bahan #{index + 1}</span>
              {data.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                placeholder="Nama bahan (contoh: Tepung Terigu)"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />

              <input
                type="text"
                value={ingredient.supplier}
                onChange={(e) => updateIngredient(index, "supplier", e.target.value)}
                placeholder="Supplier (contoh: PT Bogasari)"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />

              <Select
                value={ingredient.halalStatus}
                onChange={(value) => updateIngredient(index, "halalStatus", value)}
                options={HALAL_STATUS_OPTIONS}
                placeholder="Pilih status halal"
              />

              <div className="pt-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="block text-xs font-medium text-gray-500">Digunakan pada Produk:</span>
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(index)}
                    className="text-primary-blue cursor-pointer text-xs font-medium hover:underline"
                  >
                    {ingredient.productsUsedIn?.length === products.length ? "Hapus Semua" : "Pilih Semua"}
                  </button>
                </div>

                {products.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Belum ada produk yang didaftarkan.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {products.map((product) => {
                      const isSelected = ingredient.productsUsedIn?.includes(product.id);
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => toggleProduct(index, product.id)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              isSelected ? "border-emerald-500 bg-emerald-500" : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && <Plus className="h-3 w-3 text-white" />}
                          </div>
                          <span className="truncate">{product.name || "(Tanpa Nama)"}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addIngredient}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-blue-400 hover:text-blue-600"
      >
        <Plus className="h-4 w-4" />
        Tambah Bahan Lainnya
      </button>
    </div>
  );
}
