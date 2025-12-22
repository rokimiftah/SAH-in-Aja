import { useEffect, useRef, useState } from "react";

import imageCompression from "browser-image-compression";
import { AlertCircle, Camera, Check, Package, RotateCcw, Sparkles, X } from "lucide-react";

import { cn } from "@shared/lib";

interface CapturedPhoto {
  file: File;
  preview: string;
}

interface MaterialScannerProps {
  onPhotoComplete: (photos: File[]) => void;
  onCancel: () => void;
}

type PhotoSlot = "front" | "back";

const PHOTO_SLOTS: { id: PhotoSlot; label: string; hint: string }[] = [
  { id: "front", label: "Depan", hint: "Merk produk, informasi umum" },
  { id: "back", label: "Belakang", hint: "Komposisi / Ingredients" },
];

export function MaterialScanner({ onPhotoComplete }: MaterialScannerProps) {
  const [photos, setPhotos] = useState<Record<PhotoSlot, CapturedPhoto | null>>({
    front: null,
    back: null,
  });
  const [activeSlot, setActiveSlot] = useState<PhotoSlot | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      Object.values(photos).forEach((photo) => {
        if (photo) URL.revokeObjectURL(photo.preview);
      });
    };
  }, [photos]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlot) return;

    setIsCompressing(true);
    setCompressionError(null);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      });

      const preview = URL.createObjectURL(compressed);

      if (photos[activeSlot]) {
        URL.revokeObjectURL(photos[activeSlot]!.preview);
      }

      setPhotos((prev) => ({
        ...prev,
        [activeSlot]: { file: compressed, preview },
      }));
    } catch (error) {
      console.error("Compression error:", error);
      setCompressionError("Gagal memproses foto. Silakan coba lagi.");
    } finally {
      setIsCompressing(false);
      setActiveSlot(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleTakePhoto = (slot: PhotoSlot) => {
    setActiveSlot(slot);
    inputRef.current?.click();
  };

  const handleRemovePhoto = (slot: PhotoSlot) => {
    if (photos[slot]) {
      URL.revokeObjectURL(photos[slot]!.preview);
      setPhotos((prev) => ({ ...prev, [slot]: null }));
    }
  };

  const handleSubmit = () => {
    const photoFiles = PHOTO_SLOTS.map((slot) => photos[slot.id]?.file).filter((f): f is File => f !== undefined);

    if (photoFiles.length > 0) {
      onPhotoComplete(photoFiles);
    }
  };

  const filledSlots = PHOTO_SLOTS.filter((slot) => photos[slot.id] !== null).length;
  const canSubmit = filledSlots >= 1;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <h2 className="text-text-dark text-lg font-bold">Foto Kemasan Produk</h2>
        <p className="text-sm text-gray-500">Ambil foto bagian depan dan belakang kemasan</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={isCompressing}
      />

      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-amber-100 p-3">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-text-dark font-semibold">Tips Foto Terbaik</h3>
              <p className="text-sm text-gray-500">Pastikan tulisan komposisi/ingredients terlihat jelas</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {PHOTO_SLOTS.map((slot) => {
            const photo = photos[slot.id];
            const isActive = activeSlot === slot.id && isCompressing;

            return (
              <div
                key={slot.id}
                className={cn(
                  "relative overflow-hidden rounded-xl border-2 transition-all",
                  photo ? "border-green-300 bg-green-50" : "border-dashed border-gray-200 bg-gray-50",
                )}
              >
                {photo ? (
                  <div className="flex items-center gap-4 p-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                      <img src={photo.preview} alt={slot.label} className="h-full w-full object-cover" />
                      <div className="absolute top-1 right-1 rounded-full bg-green-500 p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-text-dark font-medium">{slot.label}</p>
                      <p className="truncate text-xs text-gray-500">{slot.hint}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(slot.id)}
                      className="shrink-0 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTakePhoto(slot.id)}
                    disabled={isCompressing}
                    className="flex w-full cursor-pointer items-center gap-4 p-4 text-left transition-colors hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60"
                  >
                    <div
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
                        isActive ? "bg-cyan-100" : "bg-cyan-50",
                      )}
                    >
                      {isActive ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-300 border-t-cyan-600" />
                      ) : (
                        <Camera className="h-6 w-6 text-cyan-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-text-dark font-medium">{isActive ? "Memproses..." : `Foto ${slot.label}`}</p>
                      <p className="text-sm text-gray-500">{slot.hint}</p>
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {compressionError && (
          <div className="mx-5 mb-5 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span className="text-sm text-red-600">{compressionError}</span>
          </div>
        )}

        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">Foto terisi:</span>
            <span className={cn("font-medium", filledSlots >= 2 ? "text-green-600" : "text-amber-600")}>
              {filledSlots} / {PHOTO_SLOTS.length}
            </span>
          </div>
          <p className="text-center text-xs text-gray-500">
            {filledSlots === 0
              ? "Minimal 1 foto diperlukan untuk analisis"
              : filledSlots === 1
                ? "Tambahkan foto lagi untuk hasil lebih akurat"
                : "Siap untuk dianalisis!"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isCompressing}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 font-semibold shadow-md transition-all sm:gap-3 sm:rounded-2xl sm:text-lg",
            canSubmit && !isCompressing
              ? "bg-primary-green cursor-pointer text-white hover:shadow-xl"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          <Sparkles className="h-5 w-5" />
          Analisis {filledSlots} Foto
        </button>

        {filledSlots > 0 && (
          <button
            type="button"
            onClick={() => {
              Object.values(photos).forEach((photo) => {
                if (photo) URL.revokeObjectURL(photo.preview);
              });
              setPhotos({ front: null, back: null });
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Semua Foto
          </button>
        )}
      </div>
    </div>
  );
}
