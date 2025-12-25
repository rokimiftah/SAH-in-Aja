import type { QuizAnswer } from "@features/training";

import { useEffect, useState } from "react";

import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  History,
  Loader2,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";

import { QuizForm, QuizResult, useTraining } from "@features/training";
import { useProcessing } from "@shared/contexts";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type View = "intro" | "register" | "quiz" | "result";

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const INTRO_FEATURES = [
  {
    icon: BookOpen,
    title: "10 Pertanyaan",
    desc: "Pilihan ganda seputar kehalalan produk dan standar SJPH",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Target,
    title: "Nilai Minimum 100%",
    desc: "Harus benar semua untuk mendapat sertifikat",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Award,
    title: "Sertifikat Otomatis",
    desc: "Bukti pelatihan untuk dokumentasi SJPH perusahaan",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const BENEFITS = [
  { icon: CheckCircle2, text: "Bukti Pelatihan SJPH" },
  { icon: Zap, text: "Hasil Instan" },
  { icon: Clock, text: "Dapat Diulang" },
];

export function TrainingPage() {
  const [, navigate] = useLocation();
  const [view, setView] = useState<View>("intro");
  const [participantName, setParticipantName] = useState("");
  const [quizResult, setQuizResult] = useState<{
    answers: QuizAnswer[];
    score: number;
    passed: boolean;
    certificateNumber?: string;
  } | null>(null);

  const { isLoading, submitQuiz } = useTraining();
  const creditStatus = useQuery(api.credits.checkCredits, { feature: "training" });
  const useCreditMutation = useMutation(api.credits.useTrainingCredit);
  const isLoadingCredits = creditStatus === undefined;
  const hasCredits = creditStatus?.hasCredits ?? false;
  const { setProcessing } = useProcessing();

  // Protect quiz state from navigation
  useEffect(() => {
    const isQuizActive = view === "quiz";
    setProcessing(isQuizActive, "Quiz sedang berlangsung...");
    return () => setProcessing(false);
  }, [view, setProcessing]);

  const handleStartQuiz = async () => {
    if (!participantName.trim()) return;
    try {
      // biome-ignore lint/correctness/useHookAtTopLevel: useCreditMutation is a Convex mutation function, not a React hook
      await useCreditMutation();
      setView("quiz");
    } catch (error) {
      console.error("Failed to use credit:", error);
    }
  };

  const handleQuizComplete = async (answers: QuizAnswer[], score: number, passed: boolean) => {
    try {
      const result = await submitQuiz({
        participantName: toTitleCase(participantName.trim()),
        quizAnswers: answers,
        quizScore: score,
        passed,
      });

      setQuizResult({
        answers,
        score,
        passed,
        certificateNumber: result.certificateNumber ?? undefined,
      });
      setView("result");
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  const handleRetry = () => {
    setQuizResult(null);
    setView("register");
  };

  const handleDownloadCertificate = () => {
    // TODO: Implement certificate PDF generation
    alert("Fitur unduh sertifikat akan segera tersedia!");
  };

  const isMobileOnlyBack = view === "intro";
  const showBackButton = view !== "quiz"; // Hide back button during quiz

  if (isLoading) {
    return (
      <PageContainer centered maxWidth="2xl">
        <div className="flex min-h-100 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      backButton={
        showBackButton
          ? {
              onClick: () => navigate("/dashboard"),
              label: "Kembali",
              mobileOnly: isMobileOnlyBack,
            }
          : undefined
      }
      centered
      maxWidth="2xl"
      scrollResetKey={view}
    >
      {view === "intro" && (
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="inline-flex flex-nowrap items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2">
                <BookOpen className="h-4 w-4 shrink-0 text-cyan-600" />
                <span className="text-sm font-medium whitespace-nowrap text-cyan-600">Dokumentasi SJPH</span>
              </div>
            </div>
            <h1 className="text-text-dark mb-3 text-2xl font-bold tracking-tight sm:text-3xl">Pelatihan Kesadaran Halal</h1>
            <p className="mx-auto max-w-md text-sm text-gray-600 sm:text-base">
              Quiz untuk karyawan sebagai bukti pelatihan internal sesuai persyaratan SJPH
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {INTRO_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
                <div className={`${feature.bg} mb-3 inline-flex rounded-xl p-2.5 sm:p-3`}>
                  <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
                </div>
                <h3 className="text-text-dark mb-1 text-sm font-semibold sm:text-base">{feature.title}</h3>
                <p className="text-xs text-gray-500 sm:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 shadow-sm sm:rounded-full"
              >
                <benefit.icon className="h-4 w-4 shrink-0 text-cyan-500" />
                <span className="text-text-dark text-center text-sm font-medium sm:whitespace-nowrap">{benefit.text}</span>
              </div>
            ))}
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
              onClick={() => setView("register")}
              disabled={isLoadingCredits || !hasCredits}
              className="inline-flex w-full min-w-70 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:bg-cyan-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:min-w-75 sm:gap-3 sm:px-6 sm:text-base lg:min-w-85 lg:px-8 lg:py-4 lg:text-lg"
            >
              {isLoadingCredits ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="whitespace-nowrap">Memuat...</span>
                </>
              ) : (
                <>
                  <BookOpen className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                  <span className="whitespace-nowrap">Mulai Quiz Pelatihan</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/pelatihan/history")}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              <History className="h-4 w-4" />
              Lihat Riwayat Pelatihan
            </button>
          </div>
        </div>
      )}

      {view === "register" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-100 to-blue-100 sm:h-16 sm:w-16">
              <Users className="h-7 w-7 text-cyan-600 sm:h-8 sm:w-8" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Data Peserta</h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">Masukkan nama peserta untuk sertifikat</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="participantName" className="block text-sm font-medium text-gray-700">
                Nama Lengkap Peserta
              </label>
              <input
                id="participantName"
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">Nama ini akan tercantum di sertifikat jika lulus</p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setView("intro")}
                className="flex-1 cursor-pointer rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleStartQuiz}
                disabled={!participantName.trim()}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mulai Quiz
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "quiz" && <QuizForm participantName={participantName} onComplete={handleQuizComplete} />}

      {view === "result" && quizResult && (
        <QuizResult
          answers={quizResult.answers}
          score={quizResult.score}
          passed={quizResult.passed}
          certificateNumber={quizResult.certificateNumber}
          onRetry={handleRetry}
          onDownloadCertificate={quizResult.passed ? handleDownloadCertificate : undefined}
        />
      )}
    </PageContainer>
  );
}
