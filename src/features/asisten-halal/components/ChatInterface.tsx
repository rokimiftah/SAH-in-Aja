import { useEffect, useMemo, useRef } from "react";

import { useQuery } from "convex/react";
import { RefreshCw, Sparkles, Wifi, WifiOff } from "lucide-react";

import { api } from "../../../../convex/_generated/api";
import { useAsistenHalal } from "../hooks/useAsistenHalal";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

const QUICK_QUESTIONS = [
  "Bagaimana cara daftar sertifikasi halal?",
  "Apa saja dokumen yang diperlukan?",
  "Berapa biaya sertifikasi halal?",
  "Bahan apa saja yang haram?",
];

export function ChatInterface() {
  const { messages, isLoading, isOffline, sendMessage, startNewChat } = useAsistenHalal();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useQuery(api.users.getCurrentUser);

  // Compute user avatar
  const userAvatar = useMemo(() => {
    const name = (user?.name ?? "").trim();
    const email = (user?.email ?? "").trim();
    const image = typeof user?.image === "string" ? user.image : undefined;

    if (image) return image;

    // Generate initials-based avatar
    const src = (name || email || "?").trim();
    const parts = src.includes("@")
      ? src
          .split("@")[0]
          .split(/[.\s_+-]+/)
          .filter(Boolean)
      : src.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "?";
    const b = parts[1]?.[0] ?? "";
    const initials = (a + b).toUpperCase();

    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=525252`;
  }, [user]);

  // Auto scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally trigger on messages.length change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const showQuickQuestions = messages.length <= 1;

  return (
    <div className="flex h-full flex-col">
      {/* Header with new chat button */}
      <div className="relative shrink-0 overflow-hidden border-b border-orange-100 bg-linear-to-r from-orange-50 via-amber-50 to-orange-50">
        {/* Background decoration - hidden on small screens for performance */}
        <div className="absolute -top-10 -right-10 hidden h-32 w-32 rounded-full bg-orange-100/50 blur-2xl sm:block" />
        <div className="absolute -bottom-10 -left-10 hidden h-24 w-24 rounded-full bg-amber-100/50 blur-2xl sm:block" />

        <div className="relative flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-orange-500 to-rose-500 p-1.5 shadow-md shadow-orange-200 sm:h-11 sm:w-11 sm:rounded-xl sm:p-2 sm:shadow-lg">
                <img src="/favicon.avif" alt="Asisten Halal" className="h-full w-full object-contain" />
              </div>
              {/* Online/Offline indicator */}
              <div
                className={`absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white sm:h-4 sm:w-4 ${
                  isOffline ? "bg-yellow-400" : "bg-green-500"
                }`}
              >
                {isOffline ? (
                  <WifiOff className="h-1.5 w-1.5 text-white sm:h-2 sm:w-2" />
                ) : (
                  <Wifi className="h-1.5 w-1.5 text-white sm:h-2 sm:w-2" />
                )}
              </div>
            </div>

            {/* Title */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-text-dark truncate text-sm font-bold sm:text-base">Asisten Halal</h2>
                <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-linear-to-r from-orange-500 to-rose-500 px-1.5 py-0.5 sm:gap-1 sm:px-2">
                  <Sparkles className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                  <span className="text-[9px] font-semibold text-white sm:text-[10px]">AI</span>
                </div>
              </div>
              {/* Status - simplified on mobile */}
              <p className="text-[10px] text-gray-500 sm:text-xs">
                {isOffline ? (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                    <span className="truncate">Offline</span>
                    <span className="hidden sm:inline">- knowledge base lokal</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600">
                    <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-500" />
                    <span className="truncate">Online</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={startNewChat}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-orange-200 bg-white px-2 py-1.5 text-xs font-medium text-orange-600 shadow-sm transition-all hover:border-orange-300 hover:bg-orange-50 hover:shadow-md sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
          >
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline md:hidden">Baru</span>
            <span className="hidden md:inline">Chat Baru</span>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        <div className="mx-auto max-w-2xl space-y-3 sm:space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={`${message.timestamp}-${index}`} message={message} userAvatar={userAvatar} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2 sm:gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 p-1 sm:h-8 sm:w-8">
                <img src="/favicon.avif" alt="Asisten" className="h-full w-full object-contain" />
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                  <span>Sedang mengetik</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick questions */}
      {showQuickQuestions && (
        <div className="shrink-0 border-t border-gray-100 px-3 py-2 sm:px-4 sm:py-3">
          <p className="mb-2 text-[10px] font-medium text-gray-500 sm:text-xs">Pertanyaan populer:</p>
          {/* Horizontal scroll on mobile, wrap on larger screens */}
          <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:overflow-x-visible sm:px-0">
            <div className="flex gap-2 pb-1 sm:flex-wrap sm:pb-0">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  disabled={isLoading}
                  className="shrink-0 cursor-pointer rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] whitespace-nowrap text-orange-700 transition-colors hover:bg-orange-100 active:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-50 sm:shrink sm:text-xs sm:whitespace-normal"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-3">
        <div className="mx-auto max-w-2xl">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
          <p className="mt-1.5 text-center text-[10px] text-gray-400 sm:mt-2 sm:text-xs">
            <span className="sm:hidden">Jawaban AI bersifat informatif.</span>
            <span className="hidden sm:inline">
              Jawaban AI bersifat informatif. Untuk kepastian, konsultasikan dengan LPH atau BPJPH.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
