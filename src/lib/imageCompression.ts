/**
 * TECHLO Client-Side Adaptive WebP Image Compressor
 * Conforms to TECHLO Product Image Upload Specification:
 * - Output format: image/webp
 * - Max target size: 250 KB (256,000 bytes)
 * - Max long edge: 1,600 pixels
 * - Min long edge: 720 pixels
 * - EXIF stripped via clean canvas rasterization
 */

export const MAX_IMAGE_SIZE_BYTES = 256000; // 250 KB
export const MAX_ORIGINAL_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_LONG_EDGE = 1600;
export const MIN_LONG_EDGE = 720;

export interface CompressedImageResult {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  quality: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Validates original selected image file
 */
export function validateOriginalFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    if (file.type.includes("svg") || file.type.includes("gif") || file.type.includes("pdf")) {
      return {
        valid: false,
        error: `Unsupported format (${file.type}). Only JPG, PNG, and WebP are allowed.`,
      };
    }
    if (file.type.includes("heic") || file.type.includes("heif")) {
      return {
        valid: false,
        error: "HEIC/HEIF format is not directly supported yet. Please select a JPG, PNG, or WebP photo.",
      };
    }
    return {
      valid: false,
      error: "Please select a standard photo (JPG, PNG, or WebP).",
    };
  }

  if (file.size > MAX_ORIGINAL_SIZE_BYTES) {
    return {
      valid: false,
      error: `Original photo is too large (${formatFileSize(file.size)}). Max allowed is 10 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Adaptive WebP compressor with iterative quality and dimensional reduction
 */
export async function adaptivelyCompressToWebP(file: File): Promise<CompressedImageResult> {
  const validation = validateOriginalFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 1. Decode image into an HTMLImageElement
  const img = await loadImageFromFile(file);

  // 2. Determine initial dimensions (max long edge 1,600px)
  let { width, height } = calculateScaledDimensions(img.naturalWidth, img.naturalHeight, MAX_LONG_EDGE);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context is not supported in this browser");
  }

  const qualitySteps = [0.82, 0.72, 0.62, 0.52, 0.45];

  let currentWidth = width;
  let currentHeight = height;

  // 3. Iterative reduction loop
  while (true) {
    canvas.width = currentWidth;
    canvas.height = currentHeight;

    // Clean redraw to strip EXIF and apply smooth bicubic scaling
    ctx.clearRect(0, 0, currentWidth, currentHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

    // Try quality steps
    for (const q of qualitySteps) {
      const blob = await canvasToWebpBlob(canvas, q);
      if (blob && blob.size <= MAX_IMAGE_SIZE_BYTES) {
        return {
          blob,
          previewUrl: URL.createObjectURL(blob),
          width: currentWidth,
          height: currentHeight,
          sizeBytes: blob.size,
          quality: q,
        };
      }
    }

    // If still > 250 KB, reduce dimensions by 15%
    const nextLongEdge = Math.round(Math.max(currentWidth, currentHeight) * 0.85);

    if (nextLongEdge < MIN_LONG_EDGE) {
      // Reached minimum threshold (720px, 0.45 quality)
      // Try one final attempt at lowest quality to see if it barely fit
      const lastBlob = await canvasToWebpBlob(canvas, 0.40);
      if (lastBlob && lastBlob.size <= MAX_IMAGE_SIZE_BYTES) {
        return {
          blob: lastBlob,
          previewUrl: URL.createObjectURL(lastBlob),
          width: currentWidth,
          height: currentHeight,
          sizeBytes: lastBlob.size,
          quality: 0.40,
        };
      }

      throw new Error(
        `Unable to compress image below 250 KB (ended at ${formatFileSize(lastBlob?.size || 0)}). Please choose a simpler or lower-resolution image.`
      );
    }

    const scaled = calculateScaledDimensions(currentWidth, currentHeight, nextLongEdge);
    currentWidth = scaled.width;
    currentHeight = scaled.height;
  }
}

function calculateScaledDimensions(
  origWidth: number,
  origHeight: number,
  targetMaxLongEdge: number
): { width: number; height: number } {
  let width = origWidth;
  let height = origHeight;

  if (width >= height && width > targetMaxLongEdge) {
    height = Math.round((height * targetMaxLongEdge) / width);
    width = targetMaxLongEdge;
  } else if (height > width && height > targetMaxLongEdge) {
    width = Math.round((width * targetMaxLongEdge) / height);
    height = targetMaxLongEdge;
  }

  return { width, height };
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image. The file may be corrupt or in an unreadable format."));
    };
    img.src = url;
  });
}

function canvasToWebpBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/webp",
      quality
    );
  });
}
