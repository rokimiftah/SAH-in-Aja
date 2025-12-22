import type { Id } from "../../../../convex/_generated/dataModel";

import { useState } from "react";

import { useAction, useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export type UploadStage = "idle" | "uploading" | "analyzing" | "complete" | "error";

export interface Finding {
  type: "pass" | "warning" | "critical";
  item: string;
  location: string;
  confidence: number;
}

export interface AnalysisResult {
  score: number;
  findings: Finding[];
  actionItems: string[];
  summaryPoints: string[];
  overallMessage: string;
}

interface UseSiapHalalReturn {
  stage: UploadStage;
  progress: number;
  currentPhoto: number;
  totalPhotos: number;
  result: AnalysisResult | null;
  error: string | null;
  credits: { remaining: number; limit: number } | null;
  analyzePhotos: (photos: File[]) => Promise<void>;
  reset: () => void;
}

export function useSiapHalal(): UseSiapHalalReturn {
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useQuery(api.users.getCurrentUser);
  const creditStatus = useQuery(api.credits.checkCredits, { feature: "siapHalal" });
  const deductCredit = useMutation(api.credits.useSiapHalalCredit);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const analyzeKitchen = useAction(api.analyzeHalal.analyzeKitchen);
  const saveScan = useMutation(api.halalScans.create);

  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
    const uploadUrl = await generateUploadUrl();

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const { storageId } = await response.json();
    return storageId as Id<"_storage">;
  };

  const analyzePhotos = async (photos: File[]) => {
    setStage("uploading");
    setProgress(0);
    setCurrentPhoto(0);
    setTotalPhotos(photos.length);
    setError(null);
    setResult(null);

    try {
      // Deduct credit first (atomic check on backend) - this will throw if no credits
      await deductCredit();

      const photoStorageIds: Id<"_storage">[] = [];

      // Upload photos sequentially (3G-friendly)
      for (let i = 0; i < photos.length; i++) {
        setCurrentPhoto(i + 1);
        const storageId = await uploadFile(photos[i]);
        photoStorageIds.push(storageId);
        setProgress(Math.round(((i + 1) / photos.length) * 100));
      }

      // Analyze with AI
      setStage("analyzing");
      const analysisResult = await analyzeKitchen({ photoStorageIds });

      // Normalize result (handle backward compatibility)
      const normalizedResult: AnalysisResult = {
        score: analysisResult.score ?? 0,
        findings: Array.isArray(analysisResult.findings) ? analysisResult.findings : [],
        actionItems: Array.isArray(analysisResult.actionItems) ? analysisResult.actionItems : [],
        summaryPoints: Array.isArray(analysisResult.summaryPoints) ? analysisResult.summaryPoints : [],
        overallMessage: analysisResult.overallMessage ?? "",
      };

      // Save to history if user is logged in
      if (user?._id) {
        try {
          await saveScan({
            userId: user._id,
            photoUrls: analysisResult.photoUrls ?? [],
            findings: normalizedResult.findings.map((f) => ({
              type: f.type,
              item: f.item,
              location: f.location,
              confidence: f.confidence,
            })),
            score: normalizedResult.score,
            actionItems: normalizedResult.actionItems,
            summaryPoints: normalizedResult.summaryPoints,
            overallMessage: normalizedResult.overallMessage,
            creditsUsed: 1,
          });
        } catch (saveError) {
          console.error("Failed to save scan to history:", saveError);
        }
      }

      setResult(normalizedResult);
      setStage("complete");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setStage("error");
    }
  };

  const reset = () => {
    setStage("idle");
    setProgress(0);
    setCurrentPhoto(0);
    setTotalPhotos(0);
    setResult(null);
    setError(null);
  };

  return {
    stage,
    progress,
    currentPhoto,
    totalPhotos,
    result,
    error,
    credits: creditStatus ? { remaining: creditStatus.remaining, limit: creditStatus.limit } : null,
    analyzePhotos,
    reset,
  };
}
