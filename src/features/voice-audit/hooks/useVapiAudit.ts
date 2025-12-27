import type { Id } from "../../../../convex/_generated/dataModel";

import { useCallback, useEffect, useRef, useState } from "react";

import Vapi from "@vapi-ai/web";
import { useMutation } from "convex/react";

import { useToast } from "@shared/components/ui/Toast";

import { api } from "../../../../convex/_generated/api";

export interface TranscriptEntry {
  role: "assistant" | "user";
  text: string;
  timestamp: number;
}

export interface AuditConfig {
  focusTopic: "bahan" | "produksi" | "sop" | "umum";
  preferredTitle: "bapak" | "ibu" | "mas" | "mbak";
  userName?: string;
}

type VapiStatus = "idle" | "connecting" | "connected" | "error";

const TOPIC_LABELS: Record<AuditConfig["focusTopic"], string> = {
  bahan: "Bahan Baku dan Supplier",
  produksi: "Proses Produksi dan Fasilitas",
  sop: "SOP dan Dokumentasi Halal",
  umum: "Kesiapan Sertifikasi Halal Secara Umum",
};

const TITLE_LABELS: Record<AuditConfig["preferredTitle"], string> = {
  bapak: "Bapak",
  ibu: "Ibu",
  mas: "Mas",
  mbak: "Mbak",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

function getFirstName(name?: string): string | undefined {
  if (!name) return undefined;
  return name.trim().split(/\s+/)[0];
}

function buildSystemPrompt(config: AuditConfig): string {
  const title = TITLE_LABELS[config.preferredTitle];
  const firstName = getFirstName(config.userName);
  const fullName = firstName ? `${title} ${firstName}` : title;
  const topic = TOPIC_LABELS[config.focusTopic];
  const greeting = getGreeting();

  const topicQuestions = getTopicQuestions(config.focusTopic);

  return `Anda adalah auditor halal dari BPJPH yang sedang melakukan simulasi wawancara audit.

KONTEKS:
- Sapa pengguna dengan "${fullName}"
- Fokus wawancara: ${topic}
- Ini adalah simulasi untuk mempersiapkan UMKM menghadapi audit halal resmi
- Sapaan saat ini: "${greeting}" (gunakan ini untuk salam penutup juga)

ALUR WAWANCARA:
1. Sapa dan perkenalkan diri sebagai auditor
2. Jelaskan bahwa ini simulasi untuk persiapan
3. Tanyakan 3-5 pertanyaan HANYA dari daftar pertanyaan di bawah
4. Berikan feedback dan evaluasi di akhir
5. Tutup dengan ringkasan dan saran perbaikan
6. SETELAH salam penutup, SEGERA akhiri percakapan

PERTANYAAN YANG HARUS DITANYAKAN (pilih 3 dari daftar ini):
${topicQuestions}

GAYA KOMUNIKASI:
- Bersikap ramah, sabar, dan suportif
- Berikan pujian saat jawaban benar atau mendekati benar
- Jika jawaban kurang tepat, edukasi dengan lembut dan berikan contoh yang benar
- Gunakan bahasa Indonesia yang sopan dan hangat
- Berikan semangat dan motivasi di akhir sesi

PENTING - INTONASI SUARA:
- Saat mengajukan pertanyaan, SELALU gunakan intonasi naik di akhir kalimat
- Pastikan kalimat tanya terdengar seperti pertanyaan, bukan pernyataan
- Gunakan nada yang ekspresif dan natural, tidak monoton

PENTING - MENUNGGU JAWABAN:
- Setelah mengajukan pertanyaan, TUNGGU jawaban yang jelas dari pengguna
- Jika pengguna tidak menjawab atau hanya ada noise/keheningan, ulangi pertanyaan dengan kata-kata berbeda
- Jangan anggap noise, bunyi "um", "ah", atau keheningan sebagai jawaban
- Jika setelah mengulang 2 kali pengguna masih tidak menjawab, tanyakan apakah mereka masih di sana
- Contoh: "Maaf ${fullName}, sepertinya saya tidak mendengar jawaban Anda. Bisa diulangi?"

PENTING - MENGAKHIRI SESI:
- Setelah memberikan kesimpulan dan saran, ucapkan penutup"
- Contoh penutup: "Terima kasih atas waktunya ${fullName}. Semoga sukses dalam proses sertifikasi halal! ${greeting}"
- SETELAH salam penutup selesai, Anda HARUS mengakhiri panggilan`;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getTopicQuestions(focusTopic: AuditConfig["focusTopic"]): string {
  const allQuestions: Record<AuditConfig["focusTopic"], string[]> = {
    bahan: [
      "Dari mana saja Anda mendapatkan bahan baku untuk produksi?",
      "Apakah semua supplier bahan baku Anda memiliki sertifikat halal? Bisa sebutkan contohnya?",
      "Bagaimana cara Anda memverifikasi kehalalan bahan baku sebelum digunakan?",
      "Di mana dan bagaimana Anda menyimpan bahan baku? Apakah ada pemisahan dengan bahan non-halal?",
      "Apa yang Anda lakukan jika ada bahan baku yang meragukan kehalalannya?",
      "Bagaimana sistem pencatatan keluar-masuk bahan baku di tempat Anda?",
      "Apakah Anda memiliki daftar bahan baku beserta status kehalalannya?",
      "Berapa banyak jenis bahan baku yang Anda gunakan dalam produksi?",
      "Apakah ada bahan baku yang berasal dari hewan? Jika ya, bagaimana memastikan kehalalannya?",
      "Bagaimana Anda menangani bahan baku yang sudah kadaluarsa?",
      "Apakah Anda pernah mengganti supplier? Bagaimana proses verifikasi supplier baru?",
      "Bagaimana cara Anda memastikan tidak ada kontaminasi saat pengiriman bahan baku?",
      "Apakah ada bahan baku yang mengandung alkohol atau turunannya?",
      "Bagaimana Anda mengelola stok bahan baku agar tetap fresh dan halal?",
      "Apakah Anda memiliki kriteria khusus dalam memilih supplier bahan baku?",
      "Bagaimana prosedur penerimaan bahan baku di tempat Anda?",
      "Apakah ada pemeriksaan fisik bahan baku saat diterima?",
      "Bagaimana Anda menandai atau melabeli bahan baku yang sudah terverifikasi halal?",
      "Apakah Anda menggunakan bahan tambahan pangan? Bagaimana status kehalalannya?",
      "Bagaimana penanganan jika supplier tidak bisa menyediakan sertifikat halal?",
      "Apakah ada bahan baku impor? Bagaimana verifikasi kehalalannya?",
      "Bagaimana sistem FIFO diterapkan untuk bahan baku di tempat Anda?",
      "Apakah ruang penyimpanan bahan baku terpisah dari produk jadi?",
      "Bagaimana Anda memastikan kebersihan area penyimpanan bahan baku?",
      "Apakah ada catatan traceability untuk setiap bahan baku yang digunakan?",
    ],

    produksi: [
      "Bisa jelaskan alur proses produksi dari awal sampai produk jadi?",
      "Apakah peralatan produksi pernah digunakan untuk produk non-halal?",
      "Bagaimana prosedur pembersihan peralatan produksi sebelum dan sesudah digunakan?",
      "Apakah ada area khusus yang terpisah untuk produksi halal?",
      "Siapa yang mengawasi proses produksi untuk memastikan kehalalan?",
      "Bagaimana penanganan jika terjadi kontaminasi silang selama produksi?",
      "Apakah ada jadwal rutin untuk sanitasi area produksi?",
      "Berapa kapasitas produksi harian atau bulanan Anda?",
      "Apakah ada proses pemanasan atau pengolahan khusus dalam produksi?",
      "Bagaimana Anda memastikan peralatan bersih dari najis sebelum produksi?",
      "Apakah karyawan produksi memahami pentingnya menjaga kehalalan produk?",
      "Bagaimana penanganan produk yang gagal atau reject?",
      "Apakah ada titik kritis kehalalan dalam proses produksi Anda?",
      "Bagaimana sistem pelabelan produk selama proses produksi?",
      "Apakah ada penggunaan minyak atau lemak dalam proses produksi? Apa jenisnya?",
      "Bagaimana penanganan limbah produksi?",
      "Apakah ada proses fermentasi dalam produksi Anda?",
      "Bagaimana Anda memastikan air yang digunakan dalam produksi bersih dan halal?",
      "Apakah ada penggunaan enzim dalam proses produksi?",
      "Bagaimana prosedur jika mesin produksi mengalami kerusakan?",
      "Apakah ada shift kerja? Bagaimana serah terima antar shift terkait kehalalan?",
      "Bagaimana penanganan produk setengah jadi yang disimpan overnight?",
      "Apakah ada penggunaan pewarna atau perisa dalam produksi?",
      "Bagaimana Anda memastikan kemasan produk juga halal?",
      "Apakah ada proses quality control khusus untuk kehalalan produk?",
    ],

    sop: [
      "Siapa yang ditunjuk sebagai Penyelia Halal di perusahaan Anda?",
      "Apakah sudah ada Manual SJPH yang terdokumentasi?",
      "Bagaimana prosedur jika ditemukan ketidaksesuaian dalam proses produksi halal?",
      "Apakah karyawan sudah mendapat pelatihan tentang sistem jaminan produk halal?",
      "Bagaimana sistem audit internal untuk memastikan konsistensi kehalalan?",
      "Di mana Anda menyimpan dokumen-dokumen terkait sertifikasi halal?",
      "Bagaimana prosedur penanganan komplain terkait kehalalan produk?",
      "Apakah ada kebijakan tertulis tentang sistem jaminan produk halal?",
      "Bagaimana prosedur pelatihan karyawan baru tentang kehalalan?",
      "Apakah ada evaluasi berkala terhadap pemahaman karyawan tentang halal?",
      "Bagaimana prosedur pengembangan produk baru terkait kehalalan?",
      "Apakah ada tim khusus yang menangani sistem jaminan produk halal?",
      "Bagaimana prosedur jika ada perubahan formula atau resep produk?",
      "Apakah ada catatan meeting atau rapat terkait sistem jaminan halal?",
      "Bagaimana prosedur komunikasi dengan supplier terkait kehalalan?",
      "Apakah ada checklist harian untuk memastikan kehalalan proses?",
      "Bagaimana prosedur penanganan visitor atau tamu di area produksi?",
      "Apakah ada prosedur khusus untuk maintenance peralatan?",
      "Bagaimana sistem pelaporan jika ada potensi pelanggaran kehalalan?",
      "Apakah ada prosedur recall produk jika ditemukan masalah kehalalan?",
      "Bagaimana prosedur penyimpanan dan distribusi produk jadi?",
      "Apakah ada kontrak atau perjanjian dengan supplier terkait kehalalan?",
      "Bagaimana prosedur penanganan bahan baku yang ditolak?",
      "Apakah ada prosedur untuk transportasi produk?",
      "Bagaimana sistem dokumentasi untuk setiap batch produksi?",
    ],

    umum: [
      "Apa motivasi Anda mengajukan sertifikasi halal untuk usaha ini?",
      "Sudah berapa lama usaha ini berjalan dan apa produk utamanya?",
      "Berapa jumlah karyawan dan apakah mereka memahami pentingnya produk halal?",
      "Bagaimana komitmen manajemen dalam menjaga kehalalan produk?",
      "Apakah Anda sudah memiliki Penyelia Halal yang ditunjuk?",
      "Bagaimana pemahaman Anda tentang titik kritis kehalalan dalam proses produksi?",
      "Apa tantangan terbesar yang Anda hadapi dalam mempersiapkan sertifikasi halal?",
      "Apakah Anda sudah pernah mengikuti pelatihan tentang sistem jaminan produk halal?",
      "Bagaimana target pasar produk Anda saat ini?",
      "Apakah ada rencana ekspansi atau pengembangan produk baru?",
      "Bagaimana Anda melihat pentingnya sertifikasi halal untuk bisnis Anda?",
      "Apakah ada kendala finansial dalam proses sertifikasi halal?",
      "Bagaimana dukungan dari pemilik atau manajemen tertinggi untuk sertifikasi halal?",
      "Apakah Anda sudah mempelajari regulasi terkait sertifikasi halal?",
      "Bagaimana rencana Anda untuk mempertahankan sertifikasi halal setelah didapat?",
      "Apakah ada kompetitor yang sudah memiliki sertifikasi halal?",
      "Bagaimana Anda akan mengkomunikasikan status halal kepada konsumen?",
      "Apakah ada rencana untuk memasuki pasar ekspor dengan produk halal?",
      "Bagaimana struktur organisasi perusahaan terkait pengelolaan halal?",
      "Apakah ada anggaran khusus untuk program jaminan produk halal?",
      "Bagaimana Anda memastikan konsistensi kualitas dan kehalalan produk?",
      "Apakah ada kerjasama dengan lembaga atau konsultan halal?",
      "Bagaimana pemahaman Anda tentang proses audit sertifikasi halal?",
      "Apakah fasilitas produksi Anda sudah memenuhi standar kebersihan?",
      "Bagaimana rencana tindak lanjut jika ada temuan saat audit?",
    ],
  };

  const questions = allQuestions[focusTopic];
  const shuffled = shuffleArray(questions);
  const selected = shuffled.slice(0, 3);

  return selected.map((q, i) => `${i + 1}. ${q}`).join("\n");
}

function buildFirstMessage(config: AuditConfig): string {
  const greeting = getGreeting();
  const title = TITLE_LABELS[config.preferredTitle];
  const firstName = getFirstName(config.userName);
  const fullName = firstName ? `${title} ${firstName}` : title;
  const topic = TOPIC_LABELS[config.focusTopic];

  return `${greeting} ${fullName}, saya auditor dari BPJPH. Hari ini kita akan melakukan simulasi wawancara audit halal dengan fokus pada ${topic}. Apakah ${fullName} siap untuk memulai?`;
}

export function useVapiAudit() {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<VapiStatus>("idle");
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [sessionId, setSessionId] = useState<Id<"voice_audit_sessions"> | null>(null);
  const [callEnded, setCallEnded] = useState(false);

  // Refs for volume-based detection with debounce
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastVolumeRef = useRef<number>(0);

  const toast = useToast();

  const startSessionMutation = useMutation(api.voiceAudit.startSession);
  const updateVapiCallId = useMutation(api.voiceAudit.updateVapiCallId);
  const addTranscriptMutation = useMutation(api.voiceAudit.addTranscript);
  const completeSessionMutation = useMutation(api.voiceAudit.completeSession);
  const abandonSessionMutation = useMutation(api.voiceAudit.abandonSession);
  const consumeCredit = useMutation(api.credits.useVoiceAuditCredit);

  useEffect(() => {
    const publicKey = import.meta.env.PUBLIC_VAPI_PUBLIC_KEY;
    if (publicKey) {
      vapiRef.current = new Vapi(publicKey);
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const setupEventListeners = useCallback(
    (vapi: Vapi, currentSessionId: Id<"voice_audit_sessions">) => {
      vapi.on("call-start", () => {
        setStatus("connected");
        setIsActive(true);
        // Assistant speaks first
        setIsSpeaking(true);
      });

      vapi.on("call-end", () => {
        if (volumeTimeoutRef.current) {
          clearTimeout(volumeTimeoutRef.current);
          volumeTimeoutRef.current = null;
        }
        setIsActive(false);
        setStatus("idle");
        setIsSpeaking(false);
        setCallEnded(true);
      });

      // volume-level: Detects ASSISTANT audio output (remote participant)
      // This is the most reliable way to know if assistant is speaking
      // Volume > 0.01 means assistant is speaking
      vapi.on("volume-level", (volume: number) => {
        lastVolumeRef.current = volume;
        
        if (volume > 0.01) {
          // Assistant is speaking - clear any pending timeout
          if (volumeTimeoutRef.current) {
            clearTimeout(volumeTimeoutRef.current);
            volumeTimeoutRef.current = null;
          }
          setIsSpeaking(true);
        } else {
          // Volume is low - wait 500ms before switching to user's turn
          // This prevents flickering during brief pauses
          if (!volumeTimeoutRef.current) {
            volumeTimeoutRef.current = setTimeout(() => {
              if (lastVolumeRef.current <= 0.01) {
                setIsSpeaking(false);
              }
              volumeTimeoutRef.current = null;
            }, 500);
          }
        }
      });

      // Handle transcript for saving to database
      vapi.on("message", (message) => {
        if (message.type === "transcript" && message.transcriptType === "final") {
          const entry: TranscriptEntry = {
            role: message.role === "assistant" ? "assistant" : "user",
            text: message.transcript,
            timestamp: Date.now(),
          };
          setTranscript((prev) => [...prev, entry]);

          addTranscriptMutation({
            sessionId: currentSessionId,
            role: entry.role,
            text: entry.text,
          }).catch(console.error);
        }
      });

      vapi.on("error", (e) => {
        console.error("Vapi error:", e);

        // Check if it's a "meeting ended" error - this is expected, not an error
        const errorMsg = (e as { error?: { errorMsg?: string } })?.error?.errorMsg;
        if (errorMsg === "Meeting has ended") {
          // Treat as normal call end
          setIsActive(false);
          setStatus("idle");
          setIsSpeaking(false);
          setCallEnded(true);
          return;
        }

        toast.error("Terjadi kesalahan pada koneksi suara");
        setStatus("error");
        setIsActive(false);
        setIsSpeaking(false);
        setCallEnded(true);
      });
    },
    [addTranscriptMutation, toast],
  );

  const startSession = useCallback(
    async (config: AuditConfig) => {
      if (!vapiRef.current) {
        toast.error("Voice AI tidak tersedia. Pastikan konfigurasi Vapi sudah benar.");
        return null;
      }

      try {
        setStatus("connecting");
        setTranscript([]);

        // Use credit first
        await consumeCredit();

        // Create session in database
        const { sessionId: newSessionId } = await startSessionMutation({
          focusTopic: config.focusTopic,
          preferredTitle: config.preferredTitle,
        });

        setSessionId(newSessionId);

        // Setup event listeners
        setupEventListeners(vapiRef.current, newSessionId);

        // Set isSpeaking true initially because assistant speaks first
        setIsSpeaking(true);

        // Start Vapi call with transient assistant (no need to create in dashboard)
        const call = await vapiRef.current.start({
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: buildSystemPrompt(config),
              },
            ],
            maxTokens: 10000,
          },
          voice: {
            provider: "minimax",
            voiceId: "socialmedia_female_2_v1",
            languageBoost: "Indonesian",
            model: "speech-02-turbo",
          },
          firstMessage: buildFirstMessage(config),
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "id",
          },
          endCallPhrases: ["sesi selesai", "terima kasih atas waktunya", "semoga sukses", "sampai jumpa"],
          // Voice pipeline configuration for Indonesian language
          // Use transcription-based endpointing only
          startSpeakingPlan: {
            waitSeconds: 0.6,
            transcriptionEndpointingPlan: {
              onPunctuationSeconds: 0.3,
              onNoPunctuationSeconds: 2.5,
              onNumberSeconds: 0.8,
            },
          },
          // DISABLE interruption completely - let assistant finish speaking
          // This prevents audio cutoff on mobile where mic picks up TTS audio
          stopSpeakingPlan: {
            // Require 10 words to interrupt (effectively disabling interruption)
            numWords: 10,
            voiceSeconds: 0.5,
            backoffSeconds: 3.0,
          },
        });

        // Update session with Vapi call ID
        if (call?.id) {
          await updateVapiCallId({
            sessionId: newSessionId,
            vapiCallId: call.id,
          });
        }

        return newSessionId;
      } catch (err) {
        console.error("Failed to start session:", err);
        toast.error(err instanceof Error ? err.message : "Gagal memulai sesi");
        setStatus("error");
        return null;
      }
    },
    [startSessionMutation, updateVapiCallId, consumeCredit, setupEventListeners, toast],
  );

  const endSession = useCallback(
    async (score?: number, feedback?: string) => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }

      if (sessionId) {
        try {
          await completeSessionMutation({
            sessionId,
            score,
            feedback,
            durationSeconds: Math.floor((Date.now() - (transcript[0]?.timestamp || Date.now())) / 1000),
          });
        } catch (err) {
          console.error("Failed to complete session:", err);
        }
      }

      setIsActive(false);
      setStatus("idle");
    },
    [sessionId, completeSessionMutation, transcript],
  );

  const abandonSession = useCallback(async () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }

    if (sessionId) {
      try {
        await abandonSessionMutation({ sessionId });
      } catch (err) {
        console.error("Failed to abandon session:", err);
      }
    }

    setIsActive(false);
    setStatus("idle");
    setTranscript([]);
    setSessionId(null);
  }, [sessionId, abandonSessionMutation]);

  const resetCallEnded = useCallback(() => {
    setCallEnded(false);
  }, []);

  return {
    status,
    isActive,
    isSpeaking,
    transcript,
    sessionId,
    callEnded,
    startSession,
    endSession,
    abandonSession,
    resetCallEnded,
    isSupported: !!import.meta.env.PUBLIC_VAPI_PUBLIC_KEY,
  };
}
