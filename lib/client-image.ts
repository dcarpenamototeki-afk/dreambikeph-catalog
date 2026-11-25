type ImageCompressionOptions = {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
  targetBytes?: number;
  aspectRatio?: number;
  background?: string;
};

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const source = URL.createObjectURL(file);
    image.onload = () => { URL.revokeObjectURL(source); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(source); reject(new Error("Unable to read this image.")); };
    image.src = source;
  });
}

function renderImage(image: HTMLImageElement, width: number, height: number, aspectRatio?: number, background = "#191b20") {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to optimize this image.");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  const scale = aspectRatio
    ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
    : Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const drawHeight = Math.max(1, Math.round(image.naturalHeight * scale));
  context.drawImage(image, Math.round((width - drawWidth) / 2), Math.round((height - drawHeight) / 2), drawWidth, drawHeight);
  return canvas;
}

async function encode(canvas: HTMLCanvasElement, quality: number) {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  if (!blob) throw new Error("Unable to optimize this image.");
  return blob;
}

export async function compressImage(file: File, { maxWidth, maxHeight, quality = 0.8, targetBytes, aspectRatio, background }: ImageCompressionOptions) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  const image = await loadImage(file);
  let width = Math.min(maxWidth, image.naturalWidth);
  let height = aspectRatio ? Math.round(width / aspectRatio) : Math.min(maxHeight, image.naturalHeight);
  if (height > maxHeight) { height = maxHeight; width = aspectRatio ? Math.round(height * aspectRatio) : Math.min(maxWidth, image.naturalWidth); }
  let best: Blob | null = null;
  const qualitySteps = [quality, 0.72, 0.62, 0.52, 0.42, 0.34];
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const canvas = renderImage(image, width, height, aspectRatio, background);
    for (const currentQuality of qualitySteps) {
      const blob = await encode(canvas, currentQuality);
      if (!best || blob.size < best.size) best = blob;
      if (!targetBytes || blob.size <= targetBytes) {
        const filename = `${file.name.replace(/\.[^/.]+$/, "") || "dreambike-photo"}.webp`;
        return new File([blob], filename, { type: "image/webp", lastModified: Date.now() });
      }
    }
    width = Math.max(480, Math.round(width * 0.8));
    height = aspectRatio ? Math.max(360, Math.round(width / aspectRatio)) : Math.max(360, Math.round(height * 0.8));
  }
  if (!best) throw new Error("Unable to optimize this image.");
  const filename = `${file.name.replace(/\.[^/.]+$/, "") || "dreambike-photo"}.webp`;
  return new File([best], filename, { type: "image/webp", lastModified: Date.now() });
}
