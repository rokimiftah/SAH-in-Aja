import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export type EligibilityAnswers = {
  hasSlaughteredMeat: boolean;
  hasHighTechProcess: boolean;
  hasAnimalDerivatives: boolean;
  productionScale: "mikro" | "kecil" | "menengah";
};

export type CertificationPath = "self_declare" | "reguler";
export type RiskLevel = "low" | "medium" | "high";

const DISQUALIFYING_FACTORS = {
  hasSlaughteredMeat: "Produk mengandung daging sembelihan (wajib jalur Reguler)",
  hasHighTechProcess: "Proses produksi menggunakan teknologi tinggi (wajib jalur Reguler)",
  hasAnimalDerivatives: "Produk mengandung turunan hewan (wajib jalur Reguler)",
} as const;

function determineEligibility(answers: EligibilityAnswers): {
  certificationPath: CertificationPath;
  riskLevel: RiskLevel;
  disqualifyingFactors: string[];
} {
  const disqualifyingFactors: string[] = [];

  if (answers.hasSlaughteredMeat) {
    disqualifyingFactors.push(DISQUALIFYING_FACTORS.hasSlaughteredMeat);
  }
  if (answers.hasHighTechProcess) {
    disqualifyingFactors.push(DISQUALIFYING_FACTORS.hasHighTechProcess);
  }
  if (answers.hasAnimalDerivatives) {
    disqualifyingFactors.push(DISQUALIFYING_FACTORS.hasAnimalDerivatives);
  }

  const hasDisqualifyingFactor = disqualifyingFactors.length > 0;
  const certificationPath: CertificationPath = hasDisqualifyingFactor ? "reguler" : "self_declare";

  let riskLevel: RiskLevel = "low";
  if (disqualifyingFactors.length >= 2) {
    riskLevel = "high";
  } else if (disqualifyingFactors.length === 1) {
    riskLevel = "medium";
  } else if (answers.productionScale === "menengah") {
    riskLevel = "medium";
  }

  return { certificationPath, riskLevel, disqualifyingFactors };
}

export const getMyEligibility = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("certification_eligibility")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const submitEligibility = mutation({
  args: {
    eligibilityAnswers: v.object({
      hasSlaughteredMeat: v.boolean(),
      hasHighTechProcess: v.boolean(),
      hasAnimalDerivatives: v.boolean(),
      productionScale: v.union(v.literal("mikro"), v.literal("kecil"), v.literal("menengah")),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const { certificationPath, riskLevel, disqualifyingFactors } = determineEligibility(args.eligibilityAnswers);

    const existing = await ctx.db
      .query("certification_eligibility")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        certificationPath,
        riskLevel,
        disqualifyingFactors,
        eligibilityAnswers: args.eligibilityAnswers,
        updatedAt: Date.now(),
      });
      return { eligibilityId: existing._id, certificationPath, riskLevel, disqualifyingFactors };
    }

    const eligibilityId = await ctx.db.insert("certification_eligibility", {
      userId,
      certificationPath,
      riskLevel,
      disqualifyingFactors,
      eligibilityAnswers: args.eligibilityAnswers,
      createdAt: Date.now(),
    });

    return { eligibilityId, certificationPath, riskLevel, disqualifyingFactors };
  },
});

export const resetEligibility = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Silakan login terlebih dahulu");
    }

    const existing = await ctx.db
      .query("certification_eligibility")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
