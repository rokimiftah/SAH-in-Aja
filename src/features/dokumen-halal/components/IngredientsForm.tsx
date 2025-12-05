import type { Ingredient } from "../types";

import { Plus, Trash2 } from "lucide-react";

interface IngredientsFormProps {
  data: Ingredient[];
  onChange: (data: Ingredient[]) => void;
}

const HALAL_STATUS_OPTIONS = [
  { value: "halal", label: "Halal (Bersertifikat)" },
  { value: "dalam_proses", label: "Dalam Proses Sertifikasi" },
  { value: "perlu_verifikasi", label: "Perlu Verifikasi" },
  { value: "alami", label: "Bahan Alami (Tanpa Proses)" },
];

export function IngredientsForm({ data, onChange }: IngredientsFormProps) {
  const addIngredient = () => {
    onChange([...data, { name: "", supplier: "", halalStatus: "perlu_verifikasi" }]);
  };

  const removeIngredient = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-text-dark text-xl font-bold">Daftar Bahan Baku</h2>
        <p className="mt-1 text-sm text-gray-600">Tambahkan bahan-bahan yang digunakan dalam produksi</p>
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

              <select
                value={ingredient.halalStatus}
                onChange={(e) => updateIngredient(index, "halalStatus", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                {HALAL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
