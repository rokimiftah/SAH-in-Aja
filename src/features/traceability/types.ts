import type { Doc } from "../../../convex/_generated/dataModel";

export type Product = Doc<"products">;
export type Ingredient = Doc<"ingredients">;
export type ProductIngredient = Doc<"product_ingredients">;

export type HalalStatus = "halal" | "dalam_proses" | "perlu_verifikasi" | "alami";

export interface TraceabilityMatrix {
  products: Product[];
  ingredients: Ingredient[];
  mappings: ProductIngredient[];
}

export const HALAL_STATUS_OPTIONS = [
  { value: "halal", label: "Halal (Bersertifikat)", color: "bg-emerald-500" },
  { value: "dalam_proses", label: "Dalam Proses Sertifikasi", color: "bg-amber-500" },
  { value: "perlu_verifikasi", label: "Perlu Verifikasi", color: "bg-red-500" },
  { value: "alami", label: "Bahan Alami (Tanpa Proses)", color: "bg-blue-500" },
] as const;

export const HALAL_STATUS_COLORS: Record<HalalStatus, string> = {
  halal: "bg-emerald-100 text-emerald-800",
  dalam_proses: "bg-amber-100 text-amber-800",
  perlu_verifikasi: "bg-red-100 text-red-800",
  alami: "bg-blue-100 text-blue-800",
};

export const HALAL_STATUS_LABELS: Record<HalalStatus, string> = {
  halal: "Halal",
  dalam_proses: "Dalam Proses",
  perlu_verifikasi: "Perlu Verifikasi",
  alami: "Bahan Alami",
};
