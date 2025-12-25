import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export function useEligibility() {
  const eligibility = useQuery(api.eligibility.getMyEligibility);
  const submitEligibility = useMutation(api.eligibility.submitEligibility);
  const resetEligibility = useMutation(api.eligibility.resetEligibility);

  return {
    eligibility,
    isLoading: eligibility === undefined,
    hasCompleted: eligibility !== null && eligibility !== undefined,
    submitEligibility,
    resetEligibility,
  };
}
