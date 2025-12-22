import { v } from "convex/values";

import { internalMutation } from "./_generated/server";

// Run this from dashboard to promote a user to admin
export const promoteToAdmin = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      role: "admin",
    });

    return `User ${args.email} promoted to admin`;
  },
});
