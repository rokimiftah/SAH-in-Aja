import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

// Start a new voice audit session
export const startSession = mutation({
  args: {
    focusTopic: v.union(v.literal("bahan"), v.literal("produksi"), v.literal("sop"), v.literal("umum")),
    preferredTitle: v.union(v.literal("bapak"), v.literal("ibu"), v.literal("mas"), v.literal("mbak")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const sessionId = await ctx.db.insert("voice_audit_sessions", {
      userId,
      auditorType: "ramah",
      focusTopic: args.focusTopic,
      preferredTitle: args.preferredTitle,
      transcript: [],
      status: "active",
      creditsUsed: 1,
      createdAt: Date.now(),
    });

    return { sessionId };
  },
});

// Update session with Vapi call ID
export const updateVapiCallId = mutation({
  args: {
    sessionId: v.id("voice_audit_sessions"),
    vapiCallId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new ConvexError("Sesi tidak ditemukan");
    }

    await ctx.db.patch(args.sessionId, {
      vapiCallId: args.vapiCallId,
    });
  },
});

// Add transcript entry (called during session)
export const addTranscript = mutation({
  args: {
    sessionId: v.id("voice_audit_sessions"),
    role: v.union(v.literal("assistant"), v.literal("user")),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new ConvexError("Sesi tidak ditemukan");
    }

    if (session.status !== "active") {
      throw new ConvexError("Sesi sudah berakhir");
    }

    await ctx.db.patch(args.sessionId, {
      transcript: [
        ...session.transcript,
        {
          role: args.role,
          text: args.text,
          timestamp: Date.now(),
        },
      ],
    });
  },
});

// Complete session (called when call ends)
export const completeSession = mutation({
  args: {
    sessionId: v.id("voice_audit_sessions"),
    summary: v.optional(v.string()),
    durationSeconds: v.optional(v.number()),
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new ConvexError("Sesi tidak ditemukan");
    }

    await ctx.db.patch(args.sessionId, {
      status: "completed",
      summary: args.summary,
      durationSeconds: args.durationSeconds,
      score: args.score,
      feedback: args.feedback,
      completedAt: Date.now(),
    });
  },
});

// Abandon session (user cancelled)
export const abandonSession = mutation({
  args: {
    sessionId: v.id("voice_audit_sessions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new ConvexError("Sesi tidak ditemukan");
    }

    if (session.status === "completed") {
      return; // Already completed, don't change
    }

    await ctx.db.patch(args.sessionId, {
      status: "abandoned",
      completedAt: Date.now(),
    });
  },
});

// Get session by ID
export const getSession = query({
  args: {
    sessionId: v.id("voice_audit_sessions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      return null;
    }

    return session;
  },
});

// Get user's session history
export const getMyHistory = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const sessions = await ctx.db
      .query("voice_audit_sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 20);

    return sessions;
  },
});

// Get active session (if any)
export const getActiveSession = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const sessions = await ctx.db
      .query("voice_audit_sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);

    return sessions.find((s) => s.status === "active") ?? null;
  },
});

// Internal mutation for webhook to save session data
export const saveSessionFromWebhook = internalMutation({
  args: {
    vapiCallId: v.string(),
    transcript: v.array(
      v.object({
        role: v.union(v.literal("assistant"), v.literal("user")),
        text: v.string(),
        timestamp: v.number(),
      }),
    ),
    summary: v.optional(v.string()),
    durationSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    // Find session by Vapi call ID
    const sessions = await ctx.db.query("voice_audit_sessions").collect();
    const session = sessions.find((s) => s.vapiCallId === args.vapiCallId);

    if (!session) {
      console.error(`Session not found for Vapi call ID: ${args.vapiCallId}`);
      return { success: false, error: "Session not found" };
    }

    await ctx.db.patch(session._id, {
      transcript: args.transcript,
      summary: args.summary,
      durationSeconds: args.durationSeconds,
      status: "completed",
      completedAt: Date.now(),
    });

    return { success: true, sessionId: session._id };
  },
});

// Update user's preferred title
export const updatePreferredTitle = mutation({
  args: {
    preferredTitle: v.union(v.literal("bapak"), v.literal("ibu"), v.literal("mas"), v.literal("mbak")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Silakan login terlebih dahulu");

    await ctx.db.patch(userId, {
      preferredTitle: args.preferredTitle,
    });
  },
});

// Get user's preferred title
export const getPreferredTitle = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user?.preferredTitle ?? null;
  },
});
