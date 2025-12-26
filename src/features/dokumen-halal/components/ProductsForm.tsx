import type { Product } from "../types";

import { Plus, Trash2 } from "lucide-react";

interface ProductsFormProps {
  data: Product[];
  onChange: (data: Product[]) => void;
}

export function ProductsForm({ data, onChange }: ProductsFormProps) {
  const addProduct = () => {
    onChange([...data, { id: crypto.randomUUID(), name: "" }]);
  };

  const removeProduct = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, name: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], name };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-text-dark text-xl font-bold">Daftar Produk/Menu</h2>
        <p className="mt-1 text-sm text-gray-600">
          Masukkan daftar semua varian produk yang Anda produksi (untuk matriks bahan).
        </p>
      </div>

      <div className="space-y-3">
        {data.map((product, index) => (
          <div key={product.id || index} className="flex items-center gap-2">
            <span className="min-w-8 text-sm font-medium text-gray-500">#{index + 1}</span>
            <input
              type="text"
              value={product.name}
              onChange={(e) => updateProduct(index, e.target.value)}
              placeholder="Nama Produk (contoh: Bakso Urat, Tahu Bakso)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            {data.length > 1 && (
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addProduct}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-blue-400 hover:text-blue-600"
      >
        <Plus className="h-4 w-4" />
        Tambah Produk
      </button>
    </div>
  );
}
