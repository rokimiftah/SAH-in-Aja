import type { Id } from "../../../../convex/_generated/dataModel";

import { useCallback, useEffect, useState } from "react";

import { useAction, useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { findOfflineFAQ, initializeOfflineCache, isOnline } from "../lib/offlineKnowledgeBase";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  source?: "faq" | "llm" | "error";
}

interface UseAsistenHalalReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  consultationId: Id<"halal_consultations"> | null;
  isOffline: boolean;
  credits: { remaining: number; limit: number } | null;
  sendMessage: (message: string) => Promise<void>;
  startNewChat: () => Promise<void>;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: `Halo! Saya Asisten Halal dari SAH-in Aja! 👋

Saya siap membantu Anda dengan pertanyaan seputar:
• Proses sertifikasi halal BPJPH
• Persyaratan dokumen SJPH
• Cara perbaiki temuan dari Siap Halal
• Rekomendasi bahan baku halal

Silakan tanya apa saja!`,
  timestamp: Date.now(),
  source: "faq",
};

export function useAsistenHalal(): UseAsistenHalalReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState<Id<"halal_consultations"> | null>(null);
  const [isOffline, setIsOffline] = useState(!isOnline());

  const user = useQuery(api.users.getCurrentUser);
  const creditStatus = useQuery(api.credits.checkCredits, { feature: "asistenHalal" });
  const deductCredit = useMutation(api.credits.useAsistenHalalCredit);
  const chatAction = useAction(api.consultHalal.chat);
  const createConsultation = useMutation(api.halalConsultations.create);
  const addMessage = useMutation(api.halalConsultations.addMessage);

  // Initialize offline cache and listen for online/offline events
  useEffect(() => {
    initializeOfflineCache();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: message.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Check if offline - use local FAQ cache
        if (isOffline) {
          const offlineMatch = findOfflineFAQ(message.trim());
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: offlineMatch
              ? `${offlineMatch.answer}\n\n_📴 Mode Offline - Jawaban dari knowledge base lokal_`
              : "Maaf, tidak dapat menemukan jawaban yang cocok di mode offline. Silakan coba lagi saat terhubung ke internet, atau hubungi BPJPH di 1500-363.",
            timestamp: Date.now(),
            source: offlineMatch ? "faq" : "error",
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }

        // Create consultation if first user message (uses credit)
        let currentConsultationId = consultationId;

        if (!currentConsultationId) {
          // Wait for user to be loaded
          if (!user?._id) {
            throw new Error("Silakan tunggu sebentar, sedang memuat data pengguna...");
          }

          // Check and use credit for new chat
          if (!creditStatus?.hasCredits) {
            throw new Error("Kredit chat Asisten Halal habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
          }

          await deductCredit();

          currentConsultationId = await createConsultation({
            userId: user._id,
            initialMessage: message.trim(),
          });
          setConsultationId(currentConsultationId);
        }

        // Build conversation history for context
        const conversationHistory = messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-10) // Last 10 messages for context
          .map((m) => ({ role: m.role, content: m.content }));

        // Call AI
        const response = await chatAction({
          message: message.trim(),
          conversationHistory,
        });

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.response,
          timestamp: Date.now(),
          source: response.source as "faq" | "llm" | "error",
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);

        // Save assistant message to DB (non-blocking for UI)
        if (currentConsultationId) {
          addMessage({
            consultationId: currentConsultationId,
            role: "assistant",
            content: response.response,
          }).catch((err) => console.error("Failed to save message to DB:", err));
        }
      } catch (err) {
        console.error("Chat error:", err);
        setIsLoading(false);

        // Fallback to offline FAQ on network error
        const offlineMatch = findOfflineFAQ(message.trim());
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: offlineMatch
            ? `${offlineMatch.answer}\n\n_⚠️ Koneksi terputus - Jawaban dari knowledge base lokal_`
            : "Maaf, terjadi kesalahan koneksi. Silakan coba lagi atau hubungi BPJPH di 1500-363.",
          timestamp: Date.now(),
          source: offlineMatch ? "faq" : "error",
        };
        setMessages((prev) => [...prev, errorMessage]);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      }
    },
    [
      isLoading,
      isOffline,
      consultationId,
      user,
      messages,
      chatAction,
      createConsultation,
      addMessage,
      creditStatus,
      deductCredit,
    ],
  );

  const startNewChat = useCallback(async () => {
    // Check if user has credits for new chat
    if (!creditStatus?.hasCredits) {
      setError("Kredit chat Asisten Halal habis untuk hari ini. Kredit akan reset besok pukul 00:00 WIB.");
      return;
    }

    setMessages([{ ...WELCOME_MESSAGE, timestamp: Date.now() }]);
    setConsultationId(null);
    setError(null);
  }, [creditStatus]);

  return {
    messages,
    isLoading,
    error,
    consultationId,
    isOffline,
    credits: creditStatus ? { remaining: creditStatus.remaining, limit: creditStatus.limit } : null,
    sendMessage,
    startNewChat,
  };
}
