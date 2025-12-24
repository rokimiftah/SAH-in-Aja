import type { Doc } from "../../../convex/_generated/dataModel";

import { useQuery } from "convex/react";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";

import { FEATURES } from "@shared/config/branding";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

export function VoiceAuditHistoryPage() {
  const [, navigate] = useLocation();
  const sessions = useQuery(api.voiceAudit.getMyHistory, { limit: 20 });
  const isLoading = sessions === undefined;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <PageContainer backButton={{ onClick: () => navigate("/dashboard/voice-audit") }} centered maxWidth="2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mb-2 text-4xl">{FEATURES.voiceAudit.emoji}</div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Simulasi</h1>
          <p className="mt-1 text-gray-600">Riwayat sesi simulasi audit</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Belum Ada Riwayat</h2>
            <p className="mb-6 text-gray-600">Mulai sesi simulasi audit pertama Anda.</p>
            <button
              onClick={() => navigate("/dashboard/voice-audit")}
              className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Mulai Simulasi
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session: Doc<"voice_audit_sessions">) => (
              <div
                key={session._id}
                className="rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">😊</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">Topik: {session.focusTopic}</h3>
                      <p className="text-sm text-gray-500">Simulasi Audit</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      session.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : session.status === "abandoned"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {session.status === "completed" ? "Selesai" : session.status === "abandoned" ? "Dibatalkan" : "Aktif"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(session.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(session.durationSeconds)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{session.transcript.length} pesan</span>
                  </div>
                </div>

                {session.summary && <p className="mt-3 line-clamp-2 text-sm text-gray-600">{session.summary}</p>}

                {session.score !== undefined && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Skor:</span>
                    <span
                      className={`font-semibold ${
                        session.score >= 70 ? "text-green-600" : session.score >= 50 ? "text-yellow-600" : "text-red-600"
                      }`}
                    >
                      {session.score}/100
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
