import { useState } from "react";

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

import { AnalysisResults, PhotoCapture, UploadProgress, useSiapHalal } from "@features/siap-halal";
import { Header } from "@shared/components/layout";
import { FEATURES } from "@shared/config/branding";

type FlowState = "intro" | "capture" | "processing" | "results" | "error";

export function SiapHalalPage() {
  const [, navigate] = useLocation();
  const [flowState, setFlowState] = useState<FlowState>("intro");

  const { stage, progress, currentPhoto, totalPhotos, result, error, analyzePhotos, reset } = useSiapHalal();

  const handleStartCapture = () => {
    setFlowState("capture");
  };

  const handlePhotosComplete = async (photos: File[]) => {
    setFlowState("processing");
    await analyzePhotos(photos);
  };

  const handleCancel = () => {
    reset();
    setFlowState("intro");
  };

  const handleNewScan = () => {
    reset();
    setFlowState("intro");
  };

  const handleGenerateDocuments = () => {
    // Pass analysis result to dokumen-halal via URL state or context
    navigate("/dokumen-halal");
  };

  const handleRetry = () => {
    reset();
    setFlowState("capture");
  };

  // Sync flow state with hook stage
  const currentFlowState = (): FlowState => {
    if (flowState === "processing") {
      if (stage === "error") return "error";
      if (stage === "complete") return "results";
      return "processing";
    }
    return flowState;
  };

  const displayState = currentFlowState();

  return (
    <div className="bg-bg-cream font-poppins min-h-screen">
      <Header />

      <main className="px-4 py-6">
        <div className="mx-auto max-w-5xl">
          {/* Back button for non-intro states */}
          {displayState !== "intro" && displayState !== "processing" && (
            <button
              type="button"
              onClick={handleCancel}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
          )}

          {/* Intro State */}
          {displayState === "intro" && (
            <div className="mx-auto max-w-lg text-center">
              <div className="mb-6">
                <span className="text-5xl">{FEATURES.siapHalal.icon}</span>
              </div>
              <h1 className="text-text-dark mb-2 text-2xl font-bold">{FEATURES.siapHalal.name}</h1>
              <p className="text-primary-green mb-4 font-medium">{FEATURES.siapHalal.tagline}</p>
              <p className="mb-8 text-gray-600">{FEATURES.siapHalal.description}</p>

              <div className="mb-8 space-y-3 text-left">
                {FEATURES.siapHalal.benefits.map((benefit, idx) => (
                  <div key={benefit} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                    <span className="bg-primary-green/10 text-primary-green flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-text-dark text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleStartCapture}
                className="bg-primary-green w-full rounded-xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
              >
                {FEATURES.siapHalal.cta.primary}
              </button>
            </div>
          )}

          {/* Capture State */}
          {displayState === "capture" && <PhotoCapture onPhotosComplete={handlePhotosComplete} onCancel={handleCancel} />}

          {/* Processing State */}
          {displayState === "processing" && (
            <UploadProgress
              stage={stage === "analyzing" ? "analyzing" : "uploading"}
              progress={progress}
              currentPhoto={currentPhoto}
              totalPhotos={totalPhotos}
            />
          )}

          {/* Error State */}
          {displayState === "error" && (
            <div className="mx-auto max-w-md py-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-text-dark mb-2 text-lg font-semibold">Terjadi Kesalahan</h3>
              <p className="mb-6 text-sm text-gray-600">{error || "Gagal menganalisis foto. Silakan coba lagi."}</p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="bg-primary-green flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Results State */}
          {displayState === "results" && result && (
            <AnalysisResults
              score={result.score}
              findings={result.findings}
              actionItems={result.actionItems}
              summaryPoints={result.summaryPoints}
              overallMessage={result.overallMessage}
              onNewScan={handleNewScan}
              onGenerateDocuments={handleGenerateDocuments}
            />
          )}
        </div>
      </main>
    </div>
  );
}
