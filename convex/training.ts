import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Bank soal di server - jawaban benar tidak bisa dilihat client
const QUIZ_ANSWERS: Record<string, string> = {
  q1: "b", // Halal = diperbolehkan menurut syariat Islam
  q2: "a", // Lawan halal = Haram
  q3: "c", // Syubhat = meragukan
  q4: "b", // Najis mughallazhah = babi dan anjing
  q5: "c", // Pencucian najis mughallazhah = 7 kali dengan tanah
  q6: "b", // Najis mutawassithah = najis sedang
  q7: "b", // Mensucikan najis mutawassithah = dicuci hingga hilang warna/bau/rasa
  q8: "b", // Bahan tidak halal = lemak babi
  q9: "b", // Minuman haram = khamr
  q10: "c", // Hewan halal = sapi disembelih dengan nama Allah
  q11: "c", // Darah mengalir = haram
  q12: "b", // SJPH = Sistem Jaminan Produk Halal
  q13: "c", // Yang menerbitkan sertifikat halal = BPJPH
  q14: "a", // Dasar hukum = UU No. 33 Tahun 2014
  q15: "c", // Masa berlaku sertifikat = 4 tahun
  q16: "b", // Fungsi Penyelia Halal = mengawasi dan menjamin kehalalan
  q17: "b", // Yang wajib punya Penyelia Halal = semua pelaku usaha
  q18: "a", // Syarat Penyelia Halal = beragama Islam + sertifikat pelatihan
  q19: "b", // Titik kritis kehalalan = tahapan berisiko ketidakhalalan
  q20: "b", // Kontaminasi najis = hentikan + samak
  q21: "b", // Traceability = melacak asal-usul bahan
  q22: "c", // Memisahkan bahan = area terpisah dengan pembatas jelas
  q23: "b", // Yang diperiksa audit = bahan, proses, fasilitas, dokumentasi
  q24: "b", // Dokumen SJPH = kebijakan, SOP, daftar bahan, bukti pelatihan
  q25: "b", // Perubahan bahan = lapor BPJPH + update SJPH
};

const PASSING_SCORE = 100;

export const getMyTrainingSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("training_sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getTrainingSession = query({
  args: { sessionId: v.id("training_sessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) return null;

    return session;
  },
});

export const submitQuiz = mutation({
  args: {
    participantName: v.string(),
    quizAnswers: v.array(
      v.object({
        questionId: v.string(),
        selectedAnswer: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    // Validasi: harus ada minimal 10 jawaban
    if (args.quizAnswers.length < 10) {
      throw new ConvexError("Jawaban tidak lengkap");
    }

    // Hitung skor di server - validasi setiap jawaban
    const validatedAnswers = args.quizAnswers.map((answer) => {
      const correctAnswer = QUIZ_ANSWERS[answer.questionId];
      const isCorrect = correctAnswer !== undefined && answer.selectedAnswer === correctAnswer;
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    const correctCount = validatedAnswers.filter((a) => a.isCorrect).length;
    const quizScore = Math.round((correctCount / validatedAnswers.length) * 100);
    const passed = quizScore >= PASSING_SCORE;

    const certificateNumber = passed
      ? `SAH-TRAIN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : undefined;

    const sessionId = await ctx.db.insert("training_sessions", {
      userId,
      participantName: args.participantName,
      quizAnswers: validatedAnswers,
      quizScore,
      passed,
      certificateNumber,
      createdAt: Date.now(),
    });

    return { sessionId, certificateNumber, quizScore, passed };
  },
});

export const updateCertificatePdf = mutation({
  args: {
    sessionId: v.id("training_sessions"),
    certificatePdfUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new ConvexError("Sesi pelatihan tidak ditemukan");
    }

    await ctx.db.patch(args.sessionId, {
      certificatePdfUrl: args.certificatePdfUrl,
    });
  },
});
