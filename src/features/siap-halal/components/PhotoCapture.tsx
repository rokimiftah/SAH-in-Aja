import { useRef, useState } from "react";

import imageCompression from "browser-image-compression";
import { Camera, Check, RotateCcw, X } from "lucide-react";

import { cn } from "@shared/lib";

const PHOTO_GUIDES = [
  { id: 1, area: "Area Kompor/Masak", hint: "Tampilkan kompor dan area memasak utama" },
  { id: 2, area: "Rak Bumbu & Bahan", hint: "Foto rak penyimpanan bumbu dan bahan baku" },
  { id: 3, area: "Kulkas/Penyimpanan", hint: "Buka kulkas, tampilkan isi penyimpanan bahan" },
  { id: 4, area: "Area Pencucian", hint: "Tampilkan wastafel dan area cuci peralatan" },
  { id: 5, area: "Area Produksi Umum", hint: "Foto keseluruhan ruang produksi/dapur" },
] as const;

interface PhotoCaptureProps {
  onPhotosComplete: (photos: File[]) => void;
  onCancel: () => void;
}

interface CapturedPhoto {
  id: number;
  file: File;
  preview: string;
}

export function PhotoCapture({ onPhotosComplete, onCancel }: PhotoCaptureProps) {
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentGuide = PHOTO_GUIDES[currentStep];
  const isComplete = capturedPhotos.length === PHOTO_GUIDES.length;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      const preview = URL.createObjectURL(compressed);
      const newPhoto: CapturedPhoto = {
        id: currentGuide.id,
        file: compressed,
        preview,
      };

      setCapturedPhotos((prev) => [...prev, newPhoto]);

      if (currentStep < PHOTO_GUIDES.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Compression error:", error);
    } finally {
      setIsCompressing(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRetake = (photoId: number) => {
    const photoToRemove = capturedPhotos.find((p) => p.id === photoId);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    setCapturedPhotos((prev) => prev.filter((p) => p.id !== photoId));
    const stepIndex = PHOTO_GUIDES.findIndex((g) => g.id === photoId);
    setCurrentStep(stepIndex);
  };

  const handleSubmit = () => {
    const files = PHOTO_GUIDES.map((guide) => {
      const photo = capturedPhotos.find((p) => p.id === guide.id);
      return photo?.file;
    }).filter((f): f is File => f !== undefined);

    onPhotosComplete(files);
  };

  const getPhotoForStep = (stepId: number) => {
    return capturedPhotos.find((p) => p.id === stepId);
  };

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text-dark font-medium">
            Foto {Math.min(capturedPhotos.length + 1, PHOTO_GUIDES.length)}/{PHOTO_GUIDES.length}
          </span>
          <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="bg-primary-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${(capturedPhotos.length / PHOTO_GUIDES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Photo Grid Preview */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        {PHOTO_GUIDES.map((guide, idx) => {
          const photo = getPhotoForStep(guide.id);
          const isActive = idx === currentStep && !isComplete;
          return (
            <button
              key={guide.id}
              type="button"
              onClick={() => photo && handleRetake(guide.id)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                photo ? "border-primary-green" : isActive ? "border-primary-blue border-dashed" : "border-gray-200",
              )}
            >
              {photo ? (
                <>
                  <img src={photo.preview} alt={guide.area} className="h-full w-full object-cover" />
                  <div className="bg-primary-green absolute top-0.5 right-0.5 rounded-full p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-400">{idx + 1}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Capture Area */}
      {!isComplete && currentGuide && (
        <div className="mb-6">
          <div className="bg-primary-blue/5 border-primary-blue/20 mb-4 rounded-xl border-2 border-dashed p-6 text-center">
            <Camera className="text-primary-blue mx-auto mb-3 h-12 w-12" />
            <h3 className="text-text-dark mb-1 text-lg font-semibold">{currentGuide.area}</h3>
            <p className="mb-4 text-sm text-gray-600">{currentGuide.hint}</p>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              id="photo-input"
              disabled={isCompressing}
            />
            <label
              htmlFor="photo-input"
              className={cn(
                "bg-primary-blue inline-flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all",
                isCompressing ? "cursor-wait opacity-70" : "hover:bg-primary-blue/90 active:scale-95",
              )}
            >
              {isCompressing ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Mengompresi...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5" />
                  Ambil Foto
                </>
              )}
            </label>
          </div>
        </div>
      )}

      {/* Retake hint */}
      {capturedPhotos.length > 0 && !isComplete && (
        <p className="mb-4 text-center text-xs text-gray-500">Tap foto di atas untuk mengulang</p>
      )}

      {/* Complete State */}
      {isComplete && (
        <div className="text-center">
          <div className="bg-primary-green/10 mb-4 inline-flex rounded-full p-4">
            <Check className="text-primary-green h-8 w-8" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Semua Foto Siap!</h3>
          <p className="mb-6 text-sm text-gray-600">Tap foto di atas jika ingin mengulang</p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                for (const p of capturedPhotos) {
                  URL.revokeObjectURL(p.preview);
                }
                setCapturedPhotos([]);
                setCurrentStep(0);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
              Ulang Semua
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-primary-green flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white"
            >
              Analisis Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
