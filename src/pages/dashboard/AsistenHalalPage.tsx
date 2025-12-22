import { useState } from "react";

import { useQuery } from "convex/react";
import { AlertCircle, History, MessageCircle, Sparkles, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";

import { ChatInterface } from "@features/asisten-halal";
import { FEATURES } from "@shared/config/branding";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type FlowState = "intro" | "chat";

const INTRO_FEATURES = [
  {
    icon: MessageCircle,
    title: "Tanya Bebas",
    desc: "Tanya apa saja seputar sertifikasi halal",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Sparkles,
    title: "AI + Knowledge Base",
    desc: "Jawaban akurat dari database SJPH HAS 23000",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Target,
    title: "Solusi Praktis",
    desc: "Langkah-langkah actionable untuk usaha Anda",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export function AsistenHalalPage() {
  const [, navigate] = useLocation();
  const [flowState, setFlowState] = useState<FlowState>("intro");

  const creditStatus = useQuery(api.credits.checkCredits, { feature: "asistenHalal" });
  const isLoadingCredits = creditStatus === undefined;
  const hasCredits = creditStatus?.hasCredits ?? false;

  const handleStartChat = () => setFlowState("chat");

  const handleBack = () => {
    if (flowState === "intro") {
      navigate("/dashboard");
    } else {
      setFlowState("intro");
    }
  };

  // Chat state - full screen without PageContainer
  if (flowState === "chat") {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <ChatInterface />
      </div>
    );
  }

  // Intro state with PageContainer
  return (
    <PageContainer backButton={{ onClick: handleBack, mobileOnly: true }} centered maxWidth="xl">
      {/* Intro State */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-primary-orange/10 inline-flex flex-nowrap items-center gap-2 rounded-full px-4 py-2">
            <MessageCircle className="text-primary-orange h-4 w-4 shrink-0" />
            <span className="text-primary-orange text-sm font-medium whitespace-nowrap">{FEATURES.asistenHalal.tagline}</span>
          </div>
        </div>
        <h1 className="text-text-dark mb-3 text-3xl font-bold tracking-tight">{FEATURES.asistenHalal.name}</h1>
        <p className="mx-auto max-w-md text-gray-600">{FEATURES.asistenHalal.description}</p>
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
        {FEATURES.asistenHalal.benefits.map((benefit, idx) => {
          const icons = [MessageCircle, Zap, Target];
          const Icon = icons[idx];
          return (
            <div
              key={benefit}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 shadow-sm sm:rounded-full"
            >
              <Icon className="text-primary-orange h-4 w-4 shrink-0" />
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
          onClick={handleStartChat}
          disabled={isLoadingCredits || !hasCredits}
          className="bg-primary-orange inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:gap-3 sm:px-6 sm:text-base lg:px-8 lg:py-4 lg:text-lg"
        >
          {isLoadingCredits ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="whitespace-nowrap">Memuat...</span>
            </>
          ) : (
            <>
              <MessageCircle className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap">{FEATURES.asistenHalal.cta.primary}</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard/asisten-halal/history")}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
        >
          <History className="h-4 w-4" />
          Lihat Riwayat Konsultasi
        </button>
      </div>
    </PageContainer>
  );
}
