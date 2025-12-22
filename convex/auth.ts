import type { MutationCtx } from "./_generated/server";

import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { z } from "zod";

import { internal } from "./_generated/api";
import { magicLink } from "./lib/magicLink";

interface GitHubProfile {
  id: number | string;
  email: string;
  avatar_url?: string;
  picture?: string;
  name?: string;
  login?: string;
}

interface GoogleProfile {
  id?: string | number;
  sub?: string;
  email: string;
  picture?: string;
  image?: string;
  name?: string;
}

interface AuthArgs {
  profile: {
    email: string;
    image?: string;
    name?: string;
  };
  provider?: {
    id: string;
  };
  type?: string;
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    magicLink,
    GitHub({
      allowDangerousEmailAccountLinking: true,
      profile: (params) => {
        if (typeof params.email !== "string") {
          throw new ConvexError("Email is required");
        }
        if (typeof params.id !== "string" && typeof params.id !== "number") {
          throw new ConvexError("GitHub user ID is required");
        }
        const normalizedEmail = params.email.toLowerCase().trim();
        const { error, data } = z
          .object({
            email: z.email("Invalid email address"),
          })
          .safeParse({ email: normalizedEmail });
        if (error) throw new ConvexError(error.issues[0].message);

        const raw = params as unknown as GitHubProfile;
        const image: string | undefined =
          typeof raw.avatar_url === "string" ? raw.avatar_url : typeof raw.picture === "string" ? raw.picture : undefined;

        const name: string | undefined =
          typeof raw.name === "string" && raw.name.trim() ? raw.name : typeof raw.login === "string" ? raw.login : undefined;

        return {
          id: String(params.id),
          email: data.email,
          ...(image ? { image } : {}),
          ...(name ? { name } : {}),
        };
      },
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
      profile: (params) => {
        const raw = params as unknown as GoogleProfile;
        const id: string | undefined =
          typeof raw.id === "string"
            ? raw.id
            : typeof raw.id === "number"
              ? String(raw.id)
              : typeof raw.sub === "string"
                ? raw.sub
                : undefined;
        if (!id) {
          throw new ConvexError("Google user ID is required");
        }
        if (typeof raw.email !== "string") {
          throw new ConvexError("Email is required");
        }
        const normalizedEmail = raw.email.toLowerCase().trim();
        const { error, data } = z
          .object({
            email: z.email("Invalid email address"),
          })
          .safeParse({ email: normalizedEmail });
        if (error) throw new ConvexError(error.issues[0].message);

        const image: string | undefined =
          typeof raw.picture === "string" ? raw.picture : typeof raw.image === "string" ? raw.image : undefined;
        const name: string | undefined = typeof raw.name === "string" && raw.name.trim() ? raw.name : undefined;

        return {
          id,
          email: data.email,
          ...(image ? { image } : {}),
          ...(name ? { name } : {}),
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args: unknown) {
      const typedArgs = args as AuthArgs;
      const normalizedEmail = typedArgs.profile.email.toLowerCase().trim();
      const provider =
        typeof typedArgs.provider?.id === "string" ? typedArgs.provider.id : typedArgs.type === "oauth" ? "oauth" : "magic-link";

      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
        .first();

      const image: string | undefined = typeof typedArgs.profile.image === "string" ? typedArgs.profile.image : undefined;
      const name: string | undefined =
        typeof typedArgs.profile.name === "string" && typedArgs.profile.name.trim() ? typedArgs.profile.name.trim() : undefined;

      if (existingUser) {
        const currentProviders = existingUser.linkedProviders || [];
        const updates: Record<string, unknown> = {};

        if (!currentProviders.includes(provider)) {
          updates.linkedProviders = [...currentProviders, provider];
        }
        if (typedArgs.type === "oauth" && !existingUser.emailVerificationTime) {
          updates.emailVerificationTime = Date.now();
        }
        // Only update image if user hasn't set a custom one (no storageId means using OAuth image)
        if (image && !existingUser.image && !existingUser.storageId) {
          updates.image = image;
        }
        // Only update name if user hasn't set a custom one
        if (name && !existingUser.name) {
          updates.name = name;
        }

        if (Object.keys(updates).length > 0) {
          await ctx.db.patch(existingUser._id, updates);
        }
        return existingUser._id;
      }

      const userId = await ctx.db.insert("users", {
        email: normalizedEmail,
        emailVerificationTime: typedArgs.type === "oauth" ? Date.now() : undefined,
        linkedProviders: [provider],
        credits: 3, // Free tier gets 3 credits
        tier: "free",
        createdAt: Date.now(),
        ...(name ? { name } : {}),
        ...(image ? { image } : {}),
      });

      // Create daily credits for new user
      await ctx.scheduler.runAfter(0, internal.credits.createDailyCreditsForUser, { userId });

      return userId;
    },
  },
});
