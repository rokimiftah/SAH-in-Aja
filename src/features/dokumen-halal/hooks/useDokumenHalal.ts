import type { Id } from "../../../../convex/_generated/dataModel";
import type { BusinessInfo, GenerationStage, Ingredient, TemplateType } from "../types";

import { useState } from "react";

import { useAction, useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

interface GenerationResult {
  content: string;
  documentId?: Id<"halal_documents">;
}

interface UseDokumenHalalReturn {
  stage: GenerationStage;
  result: GenerationResult | null;
  error: string | null;
  generateDocument: (templateType: TemplateType, businessInfo: BusinessInfo, ingredients: Ingredient[]) => Promise<void>;
  reset: () => void;
}

export function useDokumenHalal(): UseDokumenHalalReturn {
  const [stage, setStage] = useState<GenerationStage>("idle");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useQuery(api.users.getCurrentUser);
  const generateHalalDocument = useAction(api.generateDocument.generateHalalDocument);
  const saveDocument = useMutation(api.halalDocuments.create);

  const generateDocument = async (templateType: TemplateType, businessInfo: BusinessInfo, ingredients: Ingredient[]) => {
    setStage("generating");
    setError(null);
    setResult(null);

    try {
      const generationResult = await generateHalalDocument({
        templateType,
        businessInfo,
        ingredients,
      });

      let documentId: Id<"halal_documents"> | undefined;

      if (user?._id) {
        try {
          documentId = await saveDocument({
            userId: user._id,
            templateType,
            businessInfo,
            ingredients,
            generatedContent: generationResult.content,
            creditsUsed: 1,
          });
        } catch (saveError) {
          console.error("Failed to save document:", saveError);
        }
      }

      setResult({
        content: generationResult.content,
        documentId,
      });
      setStage("complete");
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat generate dokumen");
      setStage("error");
    }
  };

  const reset = () => {
    setStage("idle");
    setResult(null);
    setError(null);
  };

  return {
    stage,
    result,
    error,
    generateDocument,
    reset,
  };
}
