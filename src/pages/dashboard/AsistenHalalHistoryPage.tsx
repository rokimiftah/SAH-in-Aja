import type { Doc } from "../../../convex/_generated/dataModel";

import { useState } from "react";

import { useQuery } from "convex/react";
import { ArrowLeft, Calendar, Clock, Download, MessageCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

import { FEATURES } from "@shared/config/branding";
import { cn } from "@shared/lib";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type Consultation = Doc<"halal_consultations">;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

function getFirstUserMessage(consultation: Consultation): string {
  const userMsg = consultation.messages.find((m) => m.role === "user");
  if (!userMsg) return "Konsultasi";
  return userMsg.content.length > 60 ? `${userMsg.content.slice(0, 60)}...` : userMsg.content;
}

function ConsultationListItem({ consultation, onClick }: { consultation: Consultation; onClick: () => void }) {
  const messageCount = consultation.messages.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 sm:h-14 sm:w-14">
            <MessageCircle className="h-6 w-6 text-orange-600 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-dark truncate font-semibold">{getFirstUserMessage(consultation)}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {formatShortDate(consultation.createdAt)}
              </span>
              <span>{messageCount} pesan</span>
              {consultation.resolved && <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">Selesai</span>}
            </div>
          </div>
        </div>
        <ArrowLeft className="h-5 w-5 shrink-0 rotate-180 text-gray-400" />
      </div>
    </button>
  );
}

function ChatBubble({ message }: { message: Consultation["messages"][0] }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2 sm:gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-8 sm:w-8",
          isUser ? "bg-gray-200" : "bg-orange-100 p-1",
        )}
      >
        {isUser ? (
          <span className="text-[10px] font-semibold text-gray-600 sm:text-xs">U</span>
        ) : (
          <img src="/favicon.avif" alt="Asisten" className="h-full w-full object-contain" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 sm:max-w-[80%] sm:px-4 sm:py-3",
          isUser ? "bg-primary-orange text-white" : "border border-gray-200 bg-gray-50 text-gray-800",
        )}
      >
        <div className="text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">{message.content}</div>
        <div className={cn("mt-1 text-[10px] sm:text-xs", isUser ? "text-white/70" : "text-gray-400")}>
          {new Date(message.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

function exportChatToText(consultation: Consultation): void {
  const lines = [
    `Riwayat Konsultasi - ${FEATURES.asistenHalal.name}`,
    `Tanggal: ${formatDate(consultation.createdAt)}`,
    `Status: ${consultation.resolved ? "Selesai" : "Aktif"}`,
    "",
    "=".repeat(50),
    "",
  ];

  for (const msg of consultation.messages) {
    const role = msg.role === "user" ? "Anda" : "Asisten Halal";
    const time = new Date(msg.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    lines.push(`[${time}] ${role}:`);
    lines.push(msg.content);
    lines.push("");
  }

  lines.push("=".repeat(50));
  lines.push("");
  lines.push("Digenerate oleh SAH-in Aja! - https://sahin.biz.id");
  lines.push("Untuk sertifikasi halal resmi, kunjungi https://halal.go.id");

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `konsultasi-halal-${new Date(consultation.createdAt).toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AsistenHalalHistoryPage() {
  const [, navigate] = useLocation();
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const user = useQuery(api.users.getCurrentUser);
  const consultations = useQuery(api.halalConsultations.getByUser, user?._id ? { userId: user._id } : "skip");

  const isLoading = consultations === undefined;

  // Detail view
  if (selectedConsultation) {
    return (
      <PageContainer backButton={{ onClick: () => setSelectedConsultation(null) }} maxWidth="2xl">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 text-center sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-text-dark text-base font-bold sm:text-lg">Detail Konsultasi</h2>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-gray-500 sm:gap-2 sm:text-sm">
              <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">{formatDate(selectedConsultation.createdAt)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportChatToText(selectedConsultation)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto sm:rounded-xl sm:px-4 sm:text-sm"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Export Chat
          </button>
        </div>

        {/* Chat messages */}
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-3 sm:space-y-4 sm:rounded-2xl sm:p-4">
          {selectedConsultation.messages.map((message, idx) => (
            <ChatBubble key={idx} message={message} />
          ))}
        </div>

        {/* Bottom action */}
        <div className="mt-4 sm:mt-6 sm:text-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard/asisten-halal")}
            className="bg-primary-orange flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-xl sm:inline-flex sm:w-auto sm:px-6 sm:text-base"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Lanjutkan Konsultasi
          </button>
        </div>
      </PageContainer>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
      </div>
    );
  }

  // List view
  return (
    <PageContainer backButton={{ onClick: () => navigate("/dashboard/asisten-halal") }} maxWidth="3xl">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-text-dark mb-2 text-2xl font-bold">Riwayat Konsultasi {FEATURES.asistenHalal.name}</h1>
      </div>

      {(!consultations || consultations.length === 0) && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Belum Ada Riwayat</h3>
          <p className="mb-6 text-gray-600">Mulai konsultasi pertama Anda untuk melihat riwayat di sini.</p>
          <Link
            href="/dashboard/asisten-halal"
            className="bg-primary-orange inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white"
          >
            Mulai Konsultasi
          </Link>
        </div>
      )}

      {consultations && consultations.length > 0 && (
        <>
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <ConsultationListItem
                key={consultation._id}
                consultation={consultation}
                onClick={() => setSelectedConsultation(consultation)}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/dashboard/asisten-halal"
              className="bg-primary-orange inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
            >
              Konsultasi Baru
            </Link>
          </div>
        </>
      )}
    </PageContainer>
  );
}
