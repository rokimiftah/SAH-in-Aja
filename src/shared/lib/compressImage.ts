// Check AVIF support (cached)
let avifSupported: boolean | null = null;

async function checkAvifSupport(): Promise<boolean> {
  if (avifSupported !== null) return avifSupported;

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    canvas.toBlob(
      (blob) => {
        avifSupported = blob !== null && blob.type === "image/avif";
        resolve(avifSupported);
      },
      "image/avif",
      0.5,
    );
  });
}

interface CompressOptions {
  /** Maximum width/height in pixels (default: 800) */
  maxSize?: number;
  /** Target max file size in KB (default: 100) */
  maxSizeKB?: number;
  /** Initial quality 0-1 (default: 0.7) */
  quality?: number;
  /** Minimum quality to try (default: 0.3) */
  minQuality?: number;
}

/**
 * Compress and resize image to AVIF format (with WebP fallback)
 * Iteratively reduces quality to achieve target file size
 */
export async function compressImage(file: File, options: CompressOptions = {}): Promise<Blob> {
  const { maxSize = 800, maxSizeKB = 100, quality: initialQuality = 0.7, minQuality = 0.3 } = options;

  const supportsAvif = await checkAvifSupport();
  const mimeType = supportsAvif ? "image/avif" : "image/webp";

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Iteratively reduce quality until target size is reached
      let quality = initialQuality;
      let blob: Blob | null = null;
      const targetBytes = maxSizeKB * 1024;

      while (quality >= minQuality) {
        blob = await new Promise<Blob | null>((res) => {
          canvas.toBlob((b) => res(b), mimeType, quality);
        });

        if (blob && blob.size <= targetBytes) {
          break;
        }
        quality -= 0.1;
      }

      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to compress image"));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
  });
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use compressImage with options object instead
 */
export async function compressImageLegacy(file: File, maxSize = 256, quality = 0.8): Promise<Blob> {
  return compressImage(file, { maxSize, quality, maxSizeKB: 500 });
}
