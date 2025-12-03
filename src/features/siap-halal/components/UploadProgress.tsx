import { Cloud, Loader2, Sparkles } from "lucide-react";

type UploadStage = "uploading" | "analyzing";

interface UploadProgressProps {
  stage: UploadStage;
  progress: number; // 0-100 for uploading, ignored for analyzing
  currentPhoto?: number;
  totalPhotos?: number;
}

export function UploadProgress({ stage, progress, currentPhoto = 0, totalPhotos = 5 }: UploadProgressProps) {
  return (
    <div className="mx-auto max-w-sm py-12 text-center">
      {stage === "uploading" ? (
        <>
          <div className="bg-primary-blue/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <Cloud className="text-primary-blue h-10 w-10 animate-pulse" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Mengunggah Foto</h3>
          <p className="mb-4 text-sm text-gray-600">
            Foto {currentPhoto}/{totalPhotos}
          </p>
          <div className="mx-auto mb-2 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
            <div className="bg-primary-blue h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-500">{progress}%</p>
        </>
      ) : (
        <>
          <div className="bg-primary-green/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <Sparkles className="text-primary-green h-10 w-10 animate-pulse" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Menganalisis dengan AI</h3>
          <p className="mb-4 text-sm text-gray-600">Memeriksa kesiapan halal berdasarkan SJPH HAS 23000...</p>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="text-primary-green h-5 w-5 animate-spin" />
            <span className="text-sm text-gray-600">Mohon tunggu sebentar</span>
          </div>
        </>
      )}
    </div>
  );
}
