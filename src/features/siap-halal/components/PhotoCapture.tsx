import type { LucideIcon } from "lucide-react";

import { useRef, useState } from "react";

import imageCompression from "browser-image-compression";
import { Camera, Check, Droplets, Factory, Flame, Package, RotateCcw, Snowflake, Sparkles, X } from "lucide-react";

import { cn } from "@shared/lib";

const PHOTO_GUIDES: {
  id: number;
  area: string;
  short: string;
  hint: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}[] = [
  {
    id: 1,
    area: "Area Kompor/Masak",
    short: "Kompor",
    hint: "Tampilkan kompor dan area memasak utama",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-100",
  },
  {
    id: 2,
    area: "Rak Bumbu & Bahan",
    short: "Bumbu",
    hint: "Foto rak penyimpanan bumbu dan bahan baku",
    icon: Package,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    id: 3,
    area: "Kulkas/Penyimpanan",
    short: "Kulkas",
    hint: "Buka kulkas, tampilkan isi penyimpanan bahan",
    icon: Snowflake,
    color: "text-sky-500",
    bg: "bg-sky-100",
  },
  {
    id: 4,
    area: "Area Pencucian",
    short: "Cuci",
    hint: "Tampilkan wastafel dan area cuci peralatan",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  {
    id: 5,
    area: "Area Produksi Umum",
    short: "Produksi",
    hint: "Foto keseluruhan ruang produksi/dapur",
    icon: Factory,
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
];

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
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-text-dark text-lg font-bold">Foto Area Produksi</h2>
          <p className="text-sm text-gray-500">
            {capturedPhotos.length}/{PHOTO_GUIDES.length} foto diambil
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="hidden rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 lg:block"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="bg-primary-green h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(capturedPhotos.length / PHOTO_GUIDES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Photo Grid Preview - Enhanced */}
      <div className="mb-6 grid grid-cols-5 gap-3">
        {PHOTO_GUIDES.map((guide, idx) => {
          const photo = getPhotoForStep(guide.id);
          const isActive = idx === currentStep && !isComplete;
          return (
            <div key={guide.id} className="group/tooltip relative">
              <button
                type="button"
                onClick={() => photo && handleRetake(guide.id)}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-xl border-2 transition-all duration-200",
                  photo
                    ? "border-primary-green shadow-sm"
                    : isActive
                      ? "border-primary-blue border-dashed shadow-md"
                      : "border-gray-200 hover:border-gray-300",
                )}
              >
                {photo ? (
                  <>
                    <img src={photo.preview} alt={guide.area} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover/tooltip:bg-black/10" />
                    <div className="bg-primary-green absolute top-1 right-1 rounded-full p-1 shadow-sm">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </>
                ) : (
                  <div
                    className={cn("flex h-full items-center justify-center p-1", isActive ? "bg-primary-blue/10" : "bg-gray-50")}
                  >
                    <span
                      className={cn(
                        "text-md text-center leading-tight font-medium",
                        isActive ? "text-primary-blue" : "text-gray-400",
                      )}
                    >
                      {guide.short}
                    </span>
                  </div>
                )}
              </button>
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 scale-95 rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-200 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100">
                {guide.area}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Capture Area */}
      {!isComplete && currentGuide && (
        <div className="mb-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Area Header */}
            <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-5 py-4">
              <div className="flex items-center gap-4">
                <div className={cn("rounded-xl p-3", currentGuide.bg)}>
                  <currentGuide.icon className={cn("h-6 w-6", currentGuide.color)} />
                </div>
                <div>
                  <h3 className="text-text-dark font-semibold">{currentGuide.area}</h3>
                  <p className="text-sm text-gray-500">{currentGuide.hint}</p>
                </div>
              </div>
            </div>

            {/* Capture Button Area */}
            <div className="p-6 text-center">
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
                  "group relative inline-flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-12 py-8 transition-all",
                  isCompressing
                    ? "border-gray-200 bg-gray-50"
                    : "border-primary-blue/30 bg-primary-blue/5 hover:border-primary-blue hover:bg-primary-blue/10",
                )}
              >
                {isCompressing ? (
                  <>
                    <div className="border-t-primary-blue h-12 w-12 animate-spin rounded-full border-4 border-gray-300" />
                    <span className="text-sm font-medium text-gray-600">Mengompresi foto...</span>
                  </>
                ) : (
                  <>
                    <div className="bg-primary-blue rounded-full p-4 shadow-md transition-shadow group-hover:shadow-xl">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <span className="text-primary-blue text-lg font-semibold">Ambil Foto</span>
                      <p className="mt-1 text-xs text-gray-500">Ketuk untuk membuka galeri</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Retake hint */}
      {capturedPhotos.length > 0 && !isComplete && (
        <p className="mb-4 text-center text-sm text-gray-500">
          <span className="rounded-full bg-gray-100 px-3 py-1">Ketuk foto di atas untuk mengulang</span>
        </p>
      )}

      {/* Complete State */}
      {isComplete && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 text-center">
            <div className="bg-primary-green mx-auto mb-4 inline-flex rounded-full p-4 shadow-lg">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-text-dark mb-2 text-xl font-bold">Semua Foto Siap!</h3>
            <p className="text-sm text-gray-600">Ketuk foto di atas jika ingin mengulang pengambilan</p>
          </div>

          <div className="space-y-3 p-5">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-primary-green flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl px-4 py-4 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
            >
              <Sparkles className="h-5 w-5" />
              Analisis Sekarang
            </button>
            <button
              type="button"
              onClick={() => {
                for (const p of capturedPhotos) {
                  URL.revokeObjectURL(p.preview);
                }
                setCapturedPhotos([]);
                setCurrentStep(0);
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Ulang Semua Foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
