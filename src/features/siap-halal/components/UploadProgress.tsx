import { Loader2, Sparkles, Upload } from "lucide-react";

type UploadStage = "uploading" | "analyzing";

interface UploadProgressProps {
  stage: UploadStage;
  progress: number;
  currentPhoto?: number;
  totalPhotos?: number;
}

const ANALYSIS_STEPS = [
  "Mendeteksi objek dalam foto...",
  "Memeriksa pemisahan bahan halal-haram...",
  "Menganalisis kebersihan area produksi...",
  "Mengevaluasi penyimpanan bahan baku...",
  "Menyusun laporan kesiapan...",
];

export function UploadProgress({ stage, progress, currentPhoto = 0, totalPhotos = 5 }: UploadProgressProps) {
  const analysisStepIndex = Math.min(Math.floor(Math.random() * ANALYSIS_STEPS.length), ANALYSIS_STEPS.length - 1);

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {stage === "uploading" ? (
          <div className="p-8 text-center">
            {/* Animated Icon */}
            <div className="relative mx-auto mb-6 h-24 w-24">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75" />
              <div className="bg-primary-blue relative flex h-full w-full items-center justify-center rounded-full shadow-lg">
                <Upload className="h-10 w-10 text-white" />
              </div>
            </div>

            <h3 className="text-text-dark mb-2 text-xl font-bold">Mengunggah Foto</h3>
            <p className="mb-6 text-gray-600">
              Foto <span className="text-primary-blue font-semibold">{currentPhoto}</span> dari {totalPhotos}
            </p>

            {/* Progress Bar */}
            <div className="mb-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="bg-primary-blue h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-primary-blue text-sm font-medium">{progress}%</p>

            {/* Photo indicators */}
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPhotos }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-all ${
                    idx < currentPhoto
                      ? "bg-primary-green scale-100"
                      : idx === currentPhoto - 1
                        ? "bg-primary-blue scale-125"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Gradient Header */}
            <div className="bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 p-8 text-center">
              <div className="relative mx-auto mb-6 h-24 w-24">
                <div className="bg-primary-green/20 absolute inset-0 animate-pulse rounded-full" />
                <div
                  className="border-t-primary-green absolute inset-2 animate-spin rounded-full border-4 border-transparent"
                  style={{ animationDuration: "2s" }}
                />
                <div className="bg-primary-green absolute inset-4 flex items-center justify-center rounded-full shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>

              <h3 className="text-text-dark mb-2 text-xl font-bold">Menganalisis dengan AI</h3>
              <p className="text-gray-600">Memeriksa kesiapan halal berdasarkan standar SJPH HAS 23000</p>
            </div>

            {/* Analysis Steps */}
            <div className="p-6">
              <div className="space-y-3">
                {ANALYSIS_STEPS.map((step, idx) => (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${
                      idx === analysisStepIndex ? "bg-primary-green/10" : "opacity-50"
                    }`}
                  >
                    {idx === analysisStepIndex ? (
                      <Loader2 className="text-primary-green h-4 w-4 shrink-0 animate-spin" />
                    ) : idx < analysisStepIndex ? (
                      <div className="bg-primary-green h-4 w-4 shrink-0 rounded-full" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full bg-gray-200" />
                    )}
                    <span className={`text-sm ${idx === analysisStepIndex ? "text-text-dark font-medium" : "text-gray-500"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center text-xs text-gray-500">Mohon tunggu...</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
