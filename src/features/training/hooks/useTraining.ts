import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export function useTraining() {
  const sessions = useQuery(api.training.getMyTrainingSessions) ?? [];
  const submitQuiz = useMutation(api.training.submitQuiz);
  const updateCertificatePdf = useMutation(api.training.updateCertificatePdf);

  return {
    sessions,
    isLoading: sessions === undefined,
    submitQuiz,
    updateCertificatePdf,
  };
}
