// convex/http.ts

import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Mayar.id webhook endpoint
http.route({
  path: "/mayar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Extract token from query parameter for verification
      const url = new URL(request.url);
      const token = url.searchParams.get("token");

      const body = await request.json();
      const eventType = body?.event;

      console.log("Mayar webhook received:", eventType);

      // Verify webhook request
      const { verifyWebhookRequest } = await import("./mayar");
      const verification = verifyWebhookRequest(token, body);
      if (!verification.valid) {
        console.error("Webhook verification failed:", verification.error);
        return new Response(JSON.stringify({ error: verification.error }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      switch (eventType) {
        case "payment.received": {
          const result = await ctx.runMutation(internal.mayar.handlePaymentReceived, {
            webhookData: body,
          });
          console.log("Payment received processed:", result);
          break;
        }
        case "payment.reminder": {
          const result = await ctx.runMutation(internal.mayar.handlePaymentReminder, {
            webhookData: body,
          });
          console.log("Payment reminder processed:", result);
          break;
        }
        default:
          console.log("Unknown Mayar webhook event:", eventType);
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Mayar webhook error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

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
