import type { Id } from "../../../../convex/_generated/dataModel";
import type { BusinessInfo, GenerationStage, Ingredient, Product, TemplateType } from "../types";

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
  credits: { remaining: number; limit: number } | null;
  generateDocument: (
    templateType: TemplateType,
    businessInfo: BusinessInfo,
    products: Product[],
    ingredients: Ingredient[],
  ) => Promise<void>;
  reset: () => void;
}

export function useDokumenHalal(): UseDokumenHalalReturn {
  const [stage, setStage] = useState<GenerationStage>("idle");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useQuery(api.users.getCurrentUser);
  const creditStatus = useQuery(api.credits.checkCredits, { feature: "dokumenHalal" });
  const deductCredit = useMutation(api.credits.useDokumenHalalCredit);
  const generateHalalDocument = useAction(api.generateDocument.generateHalalDocument);
  const saveDocument = useMutation(api.halalDocuments.create);

  const generateDocument = async (
    templateType: TemplateType,
    businessInfo: BusinessInfo,
    products: Product[],
    ingredients: Ingredient[],
  ) => {
    setStage("generating");
    setError(null);
    setResult(null);

    try {
      // Deduct credit first (atomic check on backend) - this will throw if no credits
      await deductCredit();

      const generationResult = await generateHalalDocument({
        templateType,
        businessInfo,
        products,
        ingredients,
      });

      let documentId: Id<"halal_documents"> | undefined;

      if (user?._id) {
        try {
          // Format ingredients to string for backend backward compatibility or update backend
          // Currently backend expects productsUsedIn as string in saveDocument
          const formattedIngredients = ingredients.map((i) => ({
            ...i,
            productsUsedIn: i.productsUsedIn
              ?.map((pid) => {
                const p = products.find((p) => p.id === pid);
                return p ? p.name : "";
              })
              .filter(Boolean)
              .join(", "),
          }));

          documentId = await saveDocument({
            userId: user._id,
            templateType,
            businessInfo,
            ingredients: formattedIngredients,
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
    credits: creditStatus ? { remaining: creditStatus.remaining, limit: creditStatus.limit } : null,
    generateDocument,
    reset,
  };
}
