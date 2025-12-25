import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

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
        isCorrect: v.boolean(),
      }),
    ),
    quizScore: v.number(),
    passed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const certificateNumber = args.passed
      ? `SAH-TRAIN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : undefined;

    const sessionId = await ctx.db.insert("training_sessions", {
      userId,
      participantName: args.participantName,
      quizAnswers: args.quizAnswers,
      quizScore: args.quizScore,
      passed: args.passed,
      certificateNumber,
      createdAt: Date.now(),
    });

    return { sessionId, certificateNumber };
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
