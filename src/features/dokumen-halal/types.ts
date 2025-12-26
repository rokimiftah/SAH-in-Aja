export type TemplateType =
  | "sop_produksi"
  | "perjanjian_supplier"
  | "daftar_bahan"
  | "traceability"
  | "komitmen_halal"
  | "sop_pencucian_najis"
  | "pernyataan_bebas_babi";

export interface BusinessInfo {
  name: string;
  address: string;
  owner: string;
  productType: string;
  washingMethod?: "air_mengalir" | "rendam_bilas" | "usap_basah" | "lainnya";
}

export interface Product {
  id: string;
  name: string;
}

export interface Ingredient {
  name: string;
  supplier: string;
  halalStatus: string;
  productsUsedIn?: string[]; // Array of product names/IDs
}

export interface DocumentData {
  templateType: TemplateType;
  businessInfo: BusinessInfo;
  products: Product[];
  ingredients: Ingredient[];
}

export type GenerationStage = "idle" | "generating" | "complete" | "error";

export const TEMPLATE_INFO: Record<TemplateType, { name: string; description: string; icon: string }> = {
  sop_produksi: {
    name: "SOP Produksi Halal",
    description: "Prosedur operasional standar untuk menjaga kehalalan produksi",
    icon: "📋",
  },
  perjanjian_supplier: {
    name: "Perjanjian Supplier Halal",
    description: "Surat perjanjian dengan supplier bahan baku halal",
    icon: "🤝",
  },
  daftar_bahan: {
    name: "Daftar Bahan Baku",
    description: "Daftar lengkap bahan baku beserta status halal",
    icon: "📦",
  },
  traceability: {
    name: "Form Traceability",
    description: "Formulir pelacakan bahan dari supplier hingga produk jadi",
    icon: "🔍",
  },
  komitmen_halal: {
    name: "Surat Komitmen Halal",
    description: "Surat pernyataan komitmen menjaga kehalalan produk",
    icon: "✍️",
  },
  sop_pencucian_najis: {
    name: "SOP Pencucian Najis",
    description: "Prosedur pencucian peralatan yang terkontaminasi najis (samak)",
    icon: "🧼",
  },
  pernyataan_bebas_babi: {
    name: "Pernyataan Bebas Babi",
    description: "Surat pernyataan tidak menggunakan bahan babi dan turunannya",
    icon: "🐷",
  },
};
