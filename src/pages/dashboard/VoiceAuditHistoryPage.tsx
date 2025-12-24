import type { Doc } from "../../../convex/_generated/dataModel";

import { useQuery } from "convex/react";
import { Calendar, MessageSquare, Mic } from "lucide-react";
import { Link, useLocation } from "wouter";

import { FEATURES } from "@shared/config/branding";
import { cn } from "@shared/lib";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SessionListItem({ session }: { session: Doc<"voice_audit_sessions"> }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-2xl sm:h-14 sm:w-14">
            😊
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2">
              <h3 className="text-text-dark truncate font-semibold capitalize">Topik: {session.focusTopic}</h3>
            </div>

            {session.summary && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{session.summary}</p>}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{formatDate(session.createdAt)}</span>
              </div>
            </div>

            {session.score !== undefined && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">Skor:</span>
                <span
                  className={cn(
                    "font-semibold",
                    session.score >= 70 ? "text-green-600" : session.score >= 50 ? "text-yellow-600" : "text-red-600",
                  )}
                >
                  {session.score}/100
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VoiceAuditHistoryPage() {
  const [, navigate] = useLocation();
  const sessions = useQuery(api.voiceAudit.getMyHistory, { limit: 20 });
  const isLoading = sessions === undefined;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-rose-500" />
      </div>
    );
  }

  return (
    <PageContainer backButton={{ onClick: () => navigate("/dashboard/voice-audit") }} maxWidth="3xl">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-text-dark mb-2 text-2xl font-bold">Riwayat {FEATURES.voiceAudit.name}</h1>
      </div>

      {sessions.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Belum Ada Riwayat</h3>
          <p className="mb-6 text-gray-600">Mulai sesi simulasi audit pertama Anda.</p>
          <Link
            href="/dashboard/voice-audit"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
          >
            <Mic className="h-5 w-5" />
            Mulai Simulasi
          </Link>
        </div>
      )}

      {sessions.length > 0 && (
        <>
          <div className="space-y-4">
            {sessions.map((session) => (
              <SessionListItem key={session._id} session={session} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/dashboard/voice-audit"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
            >
              <Mic className="h-5 w-5" />
              Simulasi Baru
            </Link>
          </div>
        </>
      )}
    </PageContainer>
  );
}
