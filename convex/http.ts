// convex/http.ts

import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Vapi.ai webhook endpoint
http.route({
  path: "/vapi-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const messageType = body?.message?.type;

      if (messageType === "end-of-call-report") {
        const callId = body.message?.call?.id;
        const transcript = body.message?.transcript || [];
        const summary = body.message?.summary;
        const durationSeconds = body.message?.durationSeconds || 0;

        // Transform transcript to our format
        const formattedTranscript = transcript.map((entry: { role: string; message: string; timestamp?: number }) => ({
          role: entry.role === "bot" ? "assistant" : "user",
          text: entry.message || "",
          timestamp: entry.timestamp || Date.now(),
        }));

        await ctx.runMutation(internal.voiceAudit.saveSessionFromWebhook, {
          vapiCallId: callId,
          transcript: formattedTranscript,
          summary: summary,
          durationSeconds: durationSeconds,
        });
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Vapi webhook error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
