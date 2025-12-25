export type ProductionScale = "mikro" | "kecil" | "menengah";
export type CertificationPath = "self_declare" | "reguler";
export type RiskLevel = "low" | "medium" | "high";

export interface EligibilityAnswers {
  hasSlaughteredMeat: boolean;
  hasHighTechProcess: boolean;
  hasAnimalDerivatives: boolean;
  productionScale: ProductionScale;
}

export interface EligibilityResultData {
  certificationPath: CertificationPath;
  riskLevel: RiskLevel;
  disqualifyingFactors: string[];
}

export const PRODUCTION_SCALE_OPTIONS = [
  { value: "mikro", label: "Mikro (Omzet < Rp 300 juta/tahun)" },
  { value: "kecil", label: "Kecil (Omzet Rp 300 juta - 2,5 miliar/tahun)" },
  { value: "menengah", label: "Menengah (Omzet Rp 2,5 - 50 miliar/tahun)" },
] as const;

export const ELIGIBILITY_QUESTIONS = [
  {
    id: "hasSlaughteredMeat",
    question: "Apakah produk Anda mengandung daging sembelihan?",
    description: "Contoh: daging sapi, ayam, kambing, bebek, atau produk olahan daging seperti bakso, sosis, nugget",
    helpText:
      "Produk yang mengandung daging sembelihan memerlukan proses verifikasi penyembelihan yang hanya bisa dilakukan melalui jalur Reguler",
  },
  {
    id: "hasHighTechProcess",
    question: "Apakah proses produksi menggunakan teknologi tinggi?",
    description:
      "Contoh: fermentasi mikroba, ekstraksi enzim, proses bioteknologi, modifikasi genetik, atau proses kimia kompleks",
    helpText: "Proses teknologi tinggi memerlukan audit mendalam oleh ahli untuk memastikan kehalalan setiap tahapan",
  },
  {
    id: "hasAnimalDerivatives",
    question: "Apakah produk mengandung turunan hewan?",
    description: "Contoh: gelatin, kolagen, lemak hewani, minyak ikan, susu dan produk turunannya, telur, madu",
    helpText: "Turunan hewan memerlukan verifikasi sumber dan proses pengolahan untuk memastikan kehalalan",
  },
] as const;
