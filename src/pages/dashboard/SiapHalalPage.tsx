import { useEffect, useState } from "react";

import { useQuery } from "convex/react";
import { AlertCircle, Camera, CheckCircle2, Clock, History, RefreshCw, Sparkles, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";

import { AnalysisResults, PhotoCapture, UploadProgress, useSiapHalal } from "@features/siap-halal";
import { FEATURES } from "@shared/config/branding";
import { useProcessing } from "@shared/contexts";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type FlowState = "intro" | "capture" | "processing" | "results" | "error";

const INTRO_FEATURES = [
  {
    icon: Camera,
    title: "Foto 5 Area",
    desc: "Kompor, rak bumbu, kulkas, wastafel, dan area produksi",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "Analisis AI",
    desc: "Berdasarkan standar SJPH HAS 23000",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Target,
    title: "Laporan Detail",
    desc: "Temuan kritis, peringatan, dan yang sudah sesuai",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export function SiapHalalPage() {
  const [, navigate] = useLocation();
  const [flowState, setFlowState] = useState<FlowState>("intro");

  const { stage, progress, currentPhoto, totalPhotos, result, error, analyzePhotos, reset } = useSiapHalal();
  const creditStatus = useQuery(api.credits.checkCredits, { feature: "siapHalal" });
  const isLoadingCredits = creditStatus === undefined;
  const hasCredits = creditStatus?.hasCredits ?? false;
  const { setProcessing } = useProcessing();

  useEffect(() => {
    const isProcessing = flowState === "processing" && stage !== "complete" && stage !== "error";
    setProcessing(isProcessing, "Analisis foto sedang berjalan...");
    return () => setProcessing(false);
  }, [flowState, stage, setProcessing]);

  const handleStartCapture = () => setFlowState("capture");

  const handlePhotosComplete = async (photos: File[]) => {
    setFlowState("processing");
    await analyzePhotos(photos);
  };

  const handleCancel = () => {
    reset();
    setFlowState("intro");
  };

  const handleBack = () => {
    if (flowState === "intro") navigate("/dashboard");
    else handleCancel();
  };

  const handleNewScan = () => {
    reset();
    setFlowState("intro");
  };

  const handleGenerateDocuments = () => navigate("/dashboard/dokumen-halal");
  const handleConsultFindings = () => navigate("/dashboard/asisten-halal");

  const handleRetry = () => {
    reset();
    setFlowState("capture");
  };

  const currentFlowState = (): FlowState => {
    if (flowState === "processing") {
      if (stage === "error") return "error";
      if (stage === "complete") return "results";
      return "processing";
    }
    return flowState;
  };

  const displayState = currentFlowState();
  const showBackButton = displayState !== "processing";
  const isMobileOnlyBack = displayState === "intro";

  return (
    <PageContainer
      backButton={showBackButton ? { onClick: handleBack, mobileOnly: isMobileOnlyBack } : undefined}
      centered
      maxWidth="5xl"
    >
      {/* Intro State */}
      {displayState === "intro" && (
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-primary-green/10 inline-flex flex-nowrap items-center gap-2 rounded-full px-4 py-2">
                <Target className="text-primary-green h-4 w-4 shrink-0" />
                <span className="text-primary-green text-sm font-medium whitespace-nowrap">{FEATURES.siapHalal.tagline}</span>
              </div>
            </div>
            <h1 className="text-text-dark mb-3 text-3xl font-bold tracking-tight">{FEATURES.siapHalal.name}</h1>
            <p className="mx-auto max-w-md text-gray-600">{FEATURES.siapHalal.description}</p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {INTRO_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className={`${feature.bg} mb-3 inline-flex rounded-xl p-3`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-text-dark mb-1 font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {FEATURES.siapHalal.benefits.map((benefit, idx) => {
              const icons = [CheckCircle2, Zap, Clock];
              const Icon = icons[idx];
              return (
                <div
                  key={benefit}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 shadow-sm sm:rounded-full"
                >
                  <Icon className="text-primary-green h-4 w-4 shrink-0" />
                  <span className="text-text-dark text-center text-sm font-medium sm:whitespace-nowrap">{benefit}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-5">
            {!isLoadingCredits && !hasCredits && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Kredit habis untuk hari ini. Reset besok pukul 00:00 WIB.</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleStartCapture}
              disabled={isLoadingCredits || !hasCredits}
              className="bg-primary-green inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:gap-3 sm:px-6 sm:text-base lg:px-8 lg:py-4 lg:text-lg"
            >
              {isLoadingCredits ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="whitespace-nowrap">Memuat...</span>
                </>
              ) : (
                <>
                  <Camera className="h-6 w-6 shrink-0" />
                  <span className="whitespace-nowrap">{FEATURES.siapHalal.cta.primary}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/siap-halal/history")}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              <History className="h-4 w-4" />
              Lihat Riwayat Analisis
            </button>
          </div>
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
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">
            {error?.includes("Kredit") ? "Kredit Habis" : "Terjadi Kesalahan"}
          </h3>
          <p className="mb-6 text-sm text-gray-600">{error || "Gagal menganalisis foto. Silakan coba lagi."}</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full cursor-pointer rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleRetry}
              className="bg-primary-green flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white hover:opacity-90 sm:w-auto"
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
          onConsultFindings={handleConsultFindings}
        />
      )}
    </PageContainer>
  );
}
