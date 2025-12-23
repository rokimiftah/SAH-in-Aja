import { Loader2, Package, Sparkles, Upload } from "lucide-react";

type ScanStage = "uploading" | "analyzing";

interface ScanProgressProps {
  stage: ScanStage;
  progress: number;
}

const ANALYSIS_STEPS = [
  "Membaca teks pada kemasan...",
  "Mendeteksi logo halal...",
  "Mengekstrak daftar bahan...",
  "Memeriksa bahan kritis...",
  "Menyusun hasil analisis...",
];

export function ScanProgress({ stage, progress }: ScanProgressProps) {
  const analysisStepIndex = Math.min(Math.floor(Math.random() * ANALYSIS_STEPS.length), ANALYSIS_STEPS.length - 1);

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {stage === "uploading" ? (
          <div className="p-8 text-center">
            <div className="relative mx-auto mb-6 h-24 w-24">
              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-100 opacity-75" />
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-teal-600 shadow-lg">
                <Upload className="h-10 w-10 text-white" />
              </div>
            </div>

            <h3 className="text-text-dark mb-2 text-xl font-bold">Mengunggah Foto</h3>
            <p className="mb-6 text-gray-600">Memproses gambar kemasan...</p>

            <div className="mb-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-3 rounded-full bg-linear-to-r from-cyan-500 to-teal-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-cyan-600">{progress}%</p>
          </div>
        ) : (
          <>
            <div className="bg-linear-to-br from-cyan-50 via-teal-50 to-cyan-50 p-8 text-center">
              <div className="relative mx-auto mb-6 h-24 w-24">
                <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/20" />
                <div
                  className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-cyan-500"
                  style={{ animationDuration: "2s" }}
                />
                <div className="absolute inset-4 flex items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-teal-600 shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>

              <h3 className="text-text-dark mb-2 text-xl font-bold">Menganalisis Bahan</h3>
              <p className="text-gray-600">AI sedang memeriksa status halal setiap bahan</p>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {ANALYSIS_STEPS.map((step, idx) => (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${
                      idx === analysisStepIndex ? "bg-cyan-500/10" : "opacity-50"
                    }`}
                  >
                    {idx === analysisStepIndex ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan-600" />
                    ) : idx < analysisStepIndex ? (
                      <div className="h-4 w-4 shrink-0 rounded-full bg-linear-to-br from-cyan-500 to-teal-600" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full bg-gray-200" />
                    )}
                    <span className={`text-sm ${idx === analysisStepIndex ? "text-text-dark font-medium" : "text-gray-500"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Package className="h-4 w-4" />
                <span>Mohon tunggu...</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
