import type { Id } from "../../../../convex/_generated/dataModel";
import type { HalalStatus, Ingredient, Product, ProductIngredient } from "../types";

import { Check, Package } from "lucide-react";

import { HALAL_STATUS_COLORS, HALAL_STATUS_LABELS } from "../types";

interface TraceabilityMatrixProps {
  products: Product[];
  ingredients: Ingredient[];
  mappings: ProductIngredient[];
  onToggleMapping: (productId: Id<"products">, ingredientId: Id<"ingredients">, isCurrentlyMapped: boolean) => void;
}

export function TraceabilityMatrix({ products, ingredients, mappings, onToggleMapping }: TraceabilityMatrixProps) {
  const isMapped = (productId: Id<"products">, ingredientId: Id<"ingredients">) => {
    return mappings.some((m) => m.productId === productId && m.ingredientId === ingredientId);
  };

  if (products.length === 0 || ingredients.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
        <Package className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-3 font-medium text-gray-900">Matriks Traceability</h3>
        <p className="mt-1 text-sm text-gray-600">
          {products.length === 0 && ingredients.length === 0
            ? "Tambahkan produk dan bahan terlebih dahulu untuk membuat matriks."
            : products.length === 0
              ? "Tambahkan produk terlebih dahulu."
              : "Tambahkan bahan terlebih dahulu."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Matriks Produk-Bahan</h3>
        <p className="hidden text-sm text-gray-500 sm:block">Klik sel untuk menambah/hapus mapping</p>
      </div>

      {/* Mobile hint */}
      <p className="text-xs text-gray-500 sm:hidden">Geser untuk melihat semua data. Tap sel untuk toggle.</p>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-50">
              <th className="bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700">Bahan \ Produk</th>
              {products.map((product) => (
                <th key={product._id} className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                  <div>
                    <p className="whitespace-nowrap">{product.name}</p>
                    {product.productCode && (
                      <p className="text-xs font-normal whitespace-nowrap text-gray-500">{product.productCode}</p>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ingredients.map((ingredient) => (
              <tr key={ingredient._id} className="hover:bg-gray-50">
                <td className="bg-white px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0">
                      <p className="font-medium whitespace-nowrap text-gray-900">{ingredient.name}</p>
                      <p className="text-xs whitespace-nowrap text-gray-500">{ingredient.supplier}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${HALAL_STATUS_COLORS[ingredient.halalStatus as HalalStatus]}`}
                    >
                      {HALAL_STATUS_LABELS[ingredient.halalStatus as HalalStatus]}
                    </span>
                  </div>
                </td>
                {products.map((product) => {
                  const mapped = isMapped(product._id, ingredient._id);
                  return (
                    <td key={product._id} className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleMapping(product._id, ingredient._id, mapped)}
                        className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all ${
                          mapped
                            ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        }`}
                      >
                        {mapped && <Check className="h-5 w-5" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Matriks ini menunjukkan bahan mana yang digunakan di produk mana. Klik sel untuk toggle mapping.
          Data ini penting untuk dokumen SJPH (Traceability).
        </p>
      </div>
    </div>
  );
}
