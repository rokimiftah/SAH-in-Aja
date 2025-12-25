import type { AuditConfig } from "@features/voice-audit";

import { useEffect, useState } from "react";

import { useQuery } from "convex/react";
import { AlertCircle, CheckCircle2, Clock, History, Mic, Phone, PhoneOff, Volume2, Zap } from "lucide-react";
import { useLocation } from "wouter";

import { useVapiAudit } from "@features/voice-audit";
import { TitleSelector, TopicSelector } from "@features/voice-audit/components";
import { FEATURES } from "@shared/config/branding";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type FlowState = "intro" | "config" | "active" | "completed" | "error";

const INTRO_FEATURES = [
  {
    icon: Mic,
    title: "Wawancara Suara",
    desc: "Jawab pertanyaan auditor dengan suara langsung",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Volume2,
    title: "Auditor AI Ramah",
    desc: "AI yang sabar dan suportif untuk latihan Anda",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: Phone,
    title: "Feedback Langsung",
    desc: "Evaluasi jawaban dengan referensi SJPH",
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

export function VoiceAuditPage() {
  const [, navigate] = useLocation();
  const [flowState, setFlowState] = useState<FlowState>("intro");
  const [isEnding, setIsEnding] = useState(false);
  const [config, setConfig] = useState<AuditConfig>({
    focusTopic: "umum",
    preferredTitle: "bapak",
  });

  const { status, isSpeaking, isSupported, callEnded, startSession, endSession, resetCallEnded } = useVapiAudit();

  const user = useQuery(api.users.getCurrentUser);
  const creditStatus = useQuery(api.credits.checkCredits, { feature: "voiceAudit" });
  const isLoadingCredits = creditStatus === undefined;
  const hasCredits = creditStatus?.hasCredits ?? false;

  // Set userName from user profile
  useEffect(() => {
    if (user?.name) {
      setConfig((prev) => ({ ...prev, userName: user.name }));
    }
  }, [user?.name]);

  // Handle call ended from Vapi (e.g., meeting ended by server)
  useEffect(() => {
    if (callEnded && flowState === "active") {
      setFlowState("completed");
      resetCallEnded();
    }
  }, [callEnded, flowState, resetCallEnded]);

  const handleGoToConfig = () => setFlowState("config");

  const handleStartSession = async () => {
    const sessionId = await startSession(config);
    if (sessionId) {
      setFlowState("active");
    }
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    await endSession();
    setFlowState("completed");
    setIsEnding(false);
  };

  const handleReset = () => setFlowState("intro");

  const handleBack = () => {
    if (flowState === "intro") navigate("/dashboard");
    else if (flowState === "config") setFlowState("intro");
    else if (flowState === "active") {
      endSession();
      setFlowState("intro");
    } else {
      setFlowState("intro");
    }
  };

  const showBackButton = flowState !== "active";
  const isMobileOnlyBack = flowState === "intro";

  if (!isSupported) {
    return (
      <PageContainer centered maxWidth="5xl" scrollResetKey="not-supported">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Fitur Belum Tersedia</h2>
          <p className="max-w-md text-gray-600">
            Simulasi Audit Suara memerlukan konfigurasi. Silakan hubungi admin untuk mengaktifkan fitur ini.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      backButton={showBackButton ? { onClick: handleBack, mobileOnly: isMobileOnlyBack } : undefined}
      centered
      maxWidth="5xl"
      scrollResetKey={flowState}
    >
      {flowState === "intro" && (
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="inline-flex flex-nowrap items-center gap-2 rounded-full bg-rose-50 px-4 py-2">
                <Mic className="h-4 w-4 shrink-0 text-rose-600" />
                <span className="text-sm font-medium whitespace-nowrap text-rose-600">{FEATURES.voiceAudit.tagline}</span>
              </div>
            </div>
            <h1 className="text-text-dark mb-3 text-3xl font-bold tracking-tight">{FEATURES.voiceAudit.name}</h1>
            <p className="mx-auto max-w-md text-gray-600">{FEATURES.voiceAudit.description}</p>
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
            {FEATURES.voiceAudit.benefits.map((benefit, idx) => {
              const icons = [CheckCircle2, Zap, Clock];
              const Icon = icons[idx];
              return (
                <div
                  key={benefit}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 shadow-sm sm:rounded-full"
                >
                  <Icon className="h-4 w-4 shrink-0 text-rose-600" />
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
              onClick={handleGoToConfig}
              disabled={isLoadingCredits || !hasCredits}
              className="inline-flex w-full min-w-70 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:min-w-75 sm:gap-3 sm:px-6 sm:text-base lg:min-w-85 lg:px-8 lg:py-4 lg:text-lg"
            >
              {isLoadingCredits ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="whitespace-nowrap">Memuat...</span>
                </>
              ) : (
                <>
                  <Phone className="h-6 w-6 shrink-0" />
                  <span className="whitespace-nowrap">{FEATURES.voiceAudit.cta.primary}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/voice-audit/history")}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              <History className="h-4 w-4" />
              <span>Lihat Riwayat Sesi</span>
            </button>
          </div>
        </div>
      )}

      {flowState === "config" && (
        <div className="mx-auto w-full max-w-md px-4 sm:px-0">
          <div className="mb-5 text-center sm:mb-6">
            <div className="mb-3 flex justify-center sm:mb-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 sm:h-16 sm:w-16">
                <Mic className="h-7 w-7 text-rose-600 sm:h-8 sm:w-8" />
              </div>
            </div>
            <h1 className="text-text-dark mb-1.5 text-xl font-bold tracking-tight sm:mb-2 sm:text-2xl">Pengaturan Simulasi</h1>
            <p className="text-sm text-gray-600 sm:text-base">Sesuaikan preferensi sebelum memulai sesi</p>
          </div>

          <div className="mb-5 space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:mb-6 sm:space-y-5 sm:p-5">
            <TitleSelector
              value={config.preferredTitle}
              onChange={(preferredTitle) => setConfig((prev) => ({ ...prev, preferredTitle }))}
            />
            <TopicSelector value={config.focusTopic} onChange={(focusTopic) => setConfig((prev) => ({ ...prev, focusTopic }))} />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleStartSession}
              disabled={status === "connecting"}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:px-6 sm:py-4 sm:text-base"
            >
              {status === "connecting" ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-5 sm:w-5" />
                  <span>Menghubungkan...</span>
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Mulai Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {flowState === "active" && (
        <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center gap-12 px-4 sm:gap-14 md:gap-16">
          {/* Status Text - Above Mic */}
          {!isEnding && (
            <div className="text-center">
              <p
                className={`text-lg font-semibold transition-colors sm:text-xl ${isSpeaking ? "text-rose-600" : "text-gray-800"}`}
              >
                {isSpeaking ? "Auditor berbicara..." : "Giliran Anda..."}
              </p>
            </div>
          )}

          {/* Main Mic Button */}
          <div className="relative">
            {/* Pulse Animation Rings */}
            <div className="absolute inset-0 animate-ping rounded-full bg-rose-400 opacity-15" />
            <div className="absolute -inset-3 animate-pulse rounded-full bg-rose-200 opacity-40 sm:-inset-4" />
            <div
              className="absolute -inset-6 animate-pulse rounded-full bg-rose-100 opacity-20 sm:-inset-8"
              style={{ animationDelay: "0.5s" }}
            />

            {/* Mic Circle */}
            <div
              className={`relative flex h-32 w-32 items-center justify-center rounded-full shadow-2xl transition-all duration-300 sm:h-36 sm:w-36 md:h-40 md:w-40 ${
                isSpeaking ? "scale-105 bg-linear-to-br from-rose-500 to-pink-600" : "bg-linear-to-br from-rose-400 to-pink-500"
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="h-14 w-14 animate-pulse text-white sm:h-16 sm:w-16 md:h-18 md:w-18" />
              ) : (
                <Mic className="h-14 w-14 text-white sm:h-16 sm:w-16 md:h-18 md:w-18" />
              )}
            </div>
          </div>

          {/* Topic Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 sm:px-5 sm:py-2">
            <span className="text-xs text-gray-500 sm:text-sm">Topik:</span>
            <span className="text-xs font-medium text-gray-700 capitalize sm:text-sm">{config.focusTopic}</span>
          </div>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            disabled={isEnding}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-red-50 px-5 py-2.5 text-red-600 shadow-sm transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3"
          >
            <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm font-medium sm:text-base">{isEnding ? "Mengakhiri..." : "Akhiri Sesi"}</span>
          </button>
        </div>
      )}

      {flowState === "completed" && (
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
            <CheckCircle2 className="h-10 w-10 text-rose-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Sesi Selesai!</h2>
          <p className="mb-6 max-w-sm text-gray-600">
            Terima kasih telah berlatih. Periksa riwayat untuk melihat transkrip lengkap dan evaluasi.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleReset}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
            >
              <Phone className="h-5 w-5" />
              <span>Mulai Sesi Baru</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/voice-audit/history")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              <History className="h-5 w-5" />
              <span>Lihat Riwayat</span>
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
