import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

import { mutation } from "./_generated/server";

// Generate upload URL for file storage (authenticated users only)
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }
    return await ctx.storage.generateUploadUrl();
  },
});
