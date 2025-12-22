import type { BusinessInfo, Ingredient, TemplateType } from "@features/dokumen-halal";

import { useEffect, useState } from "react";

import { useQuery } from "convex/react";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, History, RefreshCw, Sparkles, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";

import {
  BusinessInfoForm,
  DocumentPreview,
  GenerationProgress,
  IngredientsForm,
  TemplateSelector,
  useDokumenHalal,
} from "@features/dokumen-halal";
import { FEATURES } from "@shared/config/branding";
import { useProcessing } from "@shared/contexts";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type FlowState = "intro" | "template" | "business" | "ingredients" | "generating" | "preview" | "error";

const INTRO_FEATURES = [
  {
    icon: FileText,
    title: "5 Template SJPH",
    desc: "SOP Produksi, Perjanjian Supplier, Daftar Bahan, dan lainnya",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "Generate AI",
    desc: "Otomatis generate dokumen berdasarkan data usaha Anda",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Target,
    title: "Siap Submit",
    desc: "Dokumen sesuai standar SJPH HAS 23000 untuk BPJPH",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

const INITIAL_BUSINESS_INFO: BusinessInfo = {
  name: "",
  address: "",
  owner: "",
  productType: "",
};

const INITIAL_INGREDIENTS: Ingredient[] = [{ name: "", supplier: "", halalStatus: "perlu_verifikasi" }];

export function DokumenHalalPage() {
  const [, navigate] = useLocation();
  const [flowState, setFlowState] = useState<FlowState>("intro");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(INITIAL_BUSINESS_INFO);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);

  const { stage, result, error, generateDocument, reset } = useDokumenHalal();
  const creditStatus = useQuery(api.credits.checkCredits, { feature: "dokumenHalal" });
  const isLoadingCredits = creditStatus === undefined;
  const hasCredits = creditStatus?.hasCredits ?? false;
  const { setProcessing } = useProcessing();

  useEffect(() => {
    const isProcessing = flowState === "generating" && stage !== "complete" && stage !== "error";
    setProcessing(isProcessing, "Pembuatan dokumen sedang berjalan...");
    return () => setProcessing(false);
  }, [flowState, stage, setProcessing]);

  const handleStartCreate = () => setFlowState("template");
  const handleSelectTemplate = (template: TemplateType) => setSelectedTemplate(template);

  const handleNextFromTemplate = () => {
    if (selectedTemplate) setFlowState("business");
  };

  const handleNextFromBusiness = () => {
    if (businessInfo.name && businessInfo.owner && businessInfo.address && businessInfo.productType) {
      setFlowState("ingredients");
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    const validIngredients = ingredients.filter((i) => i.name.trim() !== "");
    if (validIngredients.length === 0) return;
    setFlowState("generating");
    await generateDocument(selectedTemplate, businessInfo, validIngredients);
  };

  const handleBack = () => {
    if (flowState === "intro") navigate("/dashboard");
    else if (flowState === "template") setFlowState("intro");
    else if (flowState === "business") setFlowState("template");
    else if (flowState === "ingredients") setFlowState("business");
    else if (flowState === "generating" && stage === "complete") {
      reset();
      setFlowState("intro");
    }
  };

  const handleReset = () => {
    reset();
    setFlowState("intro");
    setSelectedTemplate(null);
    setBusinessInfo(INITIAL_BUSINESS_INFO);
    setIngredients(INITIAL_INGREDIENTS);
  };

  const handleRetry = () => {
    reset();
    setFlowState("ingredients");
  };

  const currentFlowState = (): FlowState => {
    if (flowState === "generating") {
      if (stage === "error") return "error";
      if (stage === "complete") return "preview";
      return "generating";
    }
    return flowState;
  };

  const displayState = currentFlowState();
  const isBusinessInfoValid = businessInfo.name && businessInfo.owner && businessInfo.address && businessInfo.productType;
  const hasValidIngredients = ingredients.some((i) => i.name.trim() !== "");
  const showBackButton =
    displayState === "intro" ||
    displayState === "template" ||
    displayState === "business" ||
    displayState === "ingredients" ||
    displayState === "preview";
  const isMobileOnlyBack = displayState === "intro";

  return (
    <PageContainer
      backButton={showBackButton ? { onClick: handleBack, mobileOnly: isMobileOnlyBack } : undefined}
      centered
      maxWidth="xl"
    >
      {/* Intro State */}
      {displayState === "intro" && (
        <div>
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-primary-blue/10 inline-flex flex-nowrap items-center gap-2 rounded-full px-4 py-2">
                <FileText className="text-primary-blue h-4 w-4 shrink-0" />
                <span className="text-primary-blue text-sm font-medium whitespace-nowrap">{FEATURES.dokumenHalal.tagline}</span>
              </div>
            </div>
            <h1 className="text-text-dark mb-3 text-3xl font-bold tracking-tight">{FEATURES.dokumenHalal.name}</h1>
            <p className="mx-auto max-w-md text-gray-600">{FEATURES.dokumenHalal.description}</p>
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

          <div className="mb-8 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
            {FEATURES.dokumenHalal.benefits.map((benefit, idx) => {
              const icons = [CheckCircle2, Zap, FileText];
              const Icon = icons[idx];
              return (
                <div
                  key={benefit}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 shadow-sm sm:rounded-full"
                >
                  <Icon className="text-primary-blue h-4 w-4 shrink-0" />
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
              onClick={handleStartCreate}
              disabled={isLoadingCredits || !hasCredits}
              className="bg-primary-blue inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:gap-3 sm:px-6 sm:text-base lg:px-8 lg:py-4 lg:text-lg"
            >
              {isLoadingCredits ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="whitespace-nowrap">Memuat...</span>
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">{FEATURES.dokumenHalal.cta.primary}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/dokumen-halal/history")}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              <History className="h-4 w-4" />
              Lihat Riwayat Dokumen
            </button>
          </div>
        </div>
      )}

      {/* Template Selection */}
      {displayState === "template" && (
        <div>
          <TemplateSelector selected={selectedTemplate} onSelect={handleSelectTemplate} />
          <div className="mt-6">
            <button
              type="button"
              onClick={handleNextFromTemplate}
              disabled={!selectedTemplate}
              className="bg-primary-blue flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lanjut
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Business Info Form */}
      {displayState === "business" && (
        <div>
          <BusinessInfoForm data={businessInfo} onChange={setBusinessInfo} />
          <div className="mt-6">
            <button
              type="button"
              onClick={handleNextFromBusiness}
              disabled={!isBusinessInfoValid}
              className="bg-primary-blue flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lanjut
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Ingredients Form */}
      {displayState === "ingredients" && (
        <div>
          <IngredientsForm data={ingredients} onChange={setIngredients} />
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!hasValidIngredients}
              className="bg-primary-blue flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              Generate Dokumen
            </button>
          </div>
        </div>
      )}

      {/* Generating State */}
      {displayState === "generating" && <GenerationProgress />}

      {/* Error State */}
      {displayState === "error" && (
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">
            {error?.includes("Kredit") ? "Kredit Habis" : "Terjadi Kesalahan"}
          </h3>
          <p className="mb-6 text-sm text-gray-600">{error || "Gagal generate dokumen. Silakan coba lagi."}</p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Mulai Ulang
            </button>
            <button
              type="button"
              onClick={handleRetry}
              className="bg-primary-blue flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Preview State */}
      {displayState === "preview" && result && selectedTemplate && (
        <DocumentPreview
          content={result.content}
          templateType={selectedTemplate}
          businessName={businessInfo.name}
          onNewDocument={handleReset}
        />
      )}
    </PageContainer>
  );
}
