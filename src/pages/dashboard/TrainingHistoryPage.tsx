import type { Doc } from "../../../convex/_generated/dataModel";

import { useState } from "react";

import { useQuery } from "convex/react";
import { ArrowLeft, Award, Calendar, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";

import { QuizResult } from "@features/training";
import { cn } from "@shared/lib";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type TrainingSession = Doc<"training_sessions">;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SessionListItem({ session, onClick }: { session: TrainingSession; onClick: () => void }) {
  const config = session.passed ? { bg: "bg-emerald-500", label: "Lulus" } : { bg: "bg-red-500", label: "Tidak Lulus" };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white sm:h-14 sm:w-14 sm:text-lg",
              config.bg,
            )}
          >
            {session.quizScore}
          </div>
          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                session.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
              )}
            >
              {config.label}
            </span>
            <p className="text-text-dark mt-1 truncate font-semibold">{session.participantName}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{formatDate(session.createdAt)}</span>
            </div>
            {session.passed && session.certificateNumber && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600">
                <Award className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{session.certificateNumber}</span>
              </div>
            )}
          </div>
        </div>
        <ArrowLeft className="h-5 w-5 shrink-0 rotate-180 text-gray-400" />
      </div>
    </button>
  );
}

export function TrainingHistoryPage() {
  const [, navigate] = useLocation();
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const sessions = useQuery(api.training.getMyTrainingSessions);

  const isLoading = sessions === undefined;

  const handleDownloadCertificate = () => {
    alert("Fitur unduh sertifikat akan segera tersedia!");
  };

  // Detail view
  if (selectedSession) {
    return (
      <PageContainer backButton={{ onClick: () => setSelectedSession(null) }} centered maxWidth="3xl">
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {formatDate(selectedSession.createdAt)}
        </div>
        <QuizResult
          answers={selectedSession.quizAnswers}
          score={selectedSession.quizScore}
          passed={selectedSession.passed}
          certificateNumber={selectedSession.certificateNumber}
          onRetry={() => navigate("/dashboard/pelatihan")}
          onDownloadCertificate={selectedSession.passed ? handleDownloadCertificate : undefined}
        />
      </PageContainer>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-cyan-500" />
      </div>
    );
  }

  // List view
  return (
    <PageContainer backButton={{ onClick: () => navigate("/dashboard/pelatihan") }} maxWidth="3xl">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-text-dark mb-2 text-2xl font-bold">Riwayat Pelatihan Halal</h1>
      </div>

      {sessions.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Belum Ada Riwayat</h3>
          <p className="mb-6 text-gray-600">Mulai quiz pertama Anda untuk melihat riwayat di sini.</p>
          <Link
            href="/dashboard/pelatihan"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white"
          >
            Mulai Quiz
          </Link>
        </div>
      )}

      {sessions.length > 0 && (
        <>
          <div className="space-y-4">
            {sessions.map((session) => (
              <SessionListItem key={session._id} session={session} onClick={() => setSelectedSession(session)} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/dashboard/pelatihan"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
            >
              Quiz Baru
            </Link>
          </div>
        </>
      )}
    </PageContainer>
  );
}
