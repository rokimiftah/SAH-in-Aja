import type { Id } from "../../../convex/_generated/dataModel";

import { useState } from "react";

import { Loader2, Package } from "lucide-react";
import { useLocation } from "wouter";

import {
  IngredientManager,
  ProductManager,
  TraceabilityMatrix,
  useIngredients,
  useProducts,
  useTraceability,
} from "@features/traceability";

import { PageContainer } from "./components";

type Tab = "products" | "ingredients" | "matrix";

export function TraceabilityPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("products");

  const { products, isLoading: loadingProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const { ingredients, isLoading: loadingIngredients, createIngredient, updateIngredient, deleteIngredient } = useIngredients();
  const { matrix, isLoading: loadingMatrix, addMapping, removeMapping } = useTraceability();

  const isLoading = loadingProducts || loadingIngredients || loadingMatrix;

  const handleToggleMapping = async (productId: Id<"products">, ingredientId: Id<"ingredients">, isCurrentlyMapped: boolean) => {
    if (isCurrentlyMapped) {
      await removeMapping({ productId, ingredientId });
    } else {
      await addMapping({ productId, ingredientId });
    }
  };

  const tabs = [
    { id: "products" as Tab, label: "Produk", count: products.length },
    { id: "ingredients" as Tab, label: "Bahan", count: ingredients.length },
    { id: "matrix" as Tab, label: "Matriks", count: matrix.mappings.length },
  ];

  if (isLoading) {
    return (
      <PageContainer centered maxWidth="4xl">
        <div className="flex min-h-100 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      backButton={{ onClick: () => navigate("/dashboard"), label: "Kembali" }}
      maxWidth="5xl"
      scrollResetKey={activeTab}
    >
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <div className="shrink-0 rounded-xl bg-indigo-100 p-3">
            <Package className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Data Produk & Bahan</h1>
            <p className="mt-1 text-sm text-gray-600 sm:mt-0">
              Kelola produk, bahan baku, dan matriks traceability untuk dokumen SJPH
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-gray-100 p-1 sm:mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:flex-row sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
              activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs ${
                activeTab === tab.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "products" && (
        <ProductManager products={products} onCreate={createProduct} onUpdate={updateProduct} onDelete={deleteProduct} />
      )}

      {activeTab === "ingredients" && (
        <IngredientManager
          ingredients={ingredients}
          onCreate={createIngredient}
          onUpdate={updateIngredient}
          onDelete={deleteIngredient}
        />
      )}

      {activeTab === "matrix" && (
        <TraceabilityMatrix
          products={matrix.products}
          ingredients={matrix.ingredients}
          mappings={matrix.mappings}
          onToggleMapping={handleToggleMapping}
        />
      )}
    </PageContainer>
  );
}
