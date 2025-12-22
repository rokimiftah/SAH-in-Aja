import type { Id } from "../../../../convex/_generated/dataModel";

import { useState } from "react";

import { useAction, useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export type ScanStage = "idle" | "uploading" | "analyzing" | "complete" | "error";

export interface IngredientAnalysis {
  ingredient: string;
  status: "aman" | "meragukan" | "tidak_halal";
  reason: string;
  action?: string;
}

export interface MaterialScanResult {
  halalCertificate?: {
    detected: boolean;
    number?: string;
    issuer?: string;
  };
  positiveListDetected?: boolean;
  extractedIngredients: string[];
  analysis: IngredientAnalysis[];
  overallStatus: "aman" | "meragukan" | "tidak_halal";
  summary: string;
  photoUrls: string[];
}

interface UseCekBahanReturn {
  stage: ScanStage;
  progress: number;
  result: MaterialScanResult | null;
  error: string | null;
  credits: { remaining: number; limit: number } | null;
  scanMaterial: (photos: File[]) => Promise<void>;
  reset: () => void;
}

const MAX_PHOTOS = 3;

export function useCekBahan(): UseCekBahanReturn {
  const [stage, setStage] = useState<ScanStage>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<MaterialScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useQuery(api.users.getCurrentUser);
  const creditStatus = useQuery(api.credits.checkCredits, { feature: "cekBahan" });
  const deductCredit = useMutation(api.credits.useCekBahanCredit);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const analyzeMaterial = useAction(api.analyzeMaterial.analyzeMaterial);
  const saveScan = useMutation(api.materialScans.create);

  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
    const uploadUrl = await generateUploadUrl();

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Gagal mengunggah foto");
    }

    const { storageId } = await response.json();
    return storageId as Id<"_storage">;
  };

  const scanMaterial = async (photos: File[]) => {
    if (photos.length === 0) {
      setError("Minimal 1 foto diperlukan");
      setStage("error");
      return;
    }

    if (photos.length > MAX_PHOTOS) {
      setError(`Maksimal ${MAX_PHOTOS} foto yang dapat dianalisis`);
      setStage("error");
      return;
    }

    setStage("uploading");
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const progressPerPhoto = 30 / photos.length;
      const storageIds: Id<"_storage">[] = [];

      for (let i = 0; i < photos.length; i++) {
        const storageId = await uploadFile(photos[i]);
        storageIds.push(storageId);
        setProgress(Math.round((i + 1) * progressPerPhoto));
      }

      setStage("analyzing");
      setProgress(50);

      const analysisResult = await analyzeMaterial({ photoStorageIds: storageIds });

      setProgress(80);

      await deductCredit();

      setProgress(90);

      if (user?._id) {
        try {
          await saveScan({
            userId: user._id,
            photoUrls: analysisResult.photoUrls,
            extractedIngredients: analysisResult.extractedIngredients,
            analysis: analysisResult.analysis,
            overallStatus: analysisResult.overallStatus,
            summary: analysisResult.summary,
            halalCertificate: analysisResult.halalCertificate,
            positiveListDetected: analysisResult.positiveListDetected,
            creditsUsed: 1,
          });
        } catch (saveError) {
          console.error("Failed to save scan to history:", saveError);
        }
      }

      setResult(analysisResult);
      setProgress(100);
      setStage("complete");
    } catch (err) {
      console.error("Material scan error:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setStage("error");
    }
  };

  const reset = () => {
    setStage("idle");
    setProgress(0);
    setResult(null);
    setError(null);
  };

  return {
    stage,
    progress,
    result,
    error,
    credits: creditStatus ? { remaining: creditStatus.remaining, limit: creditStatus.limit } : null,
    scanMaterial,
    reset,
  };
}
