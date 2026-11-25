type ImageCompressionOptions = {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
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

export async function compressImage(file: File, { maxWidth, maxHeight, quality = 0.8 }: ImageCompressionOptions) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  const image = await loadImage(file);
  const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  if (!blob) throw new Error("Unable to optimize this image.");
  const filename = `${file.name.replace(/\.[^/.]+$/, "") || "dreambike-photo"}.webp`;
  return new File([blob], filename, { type: "image/webp", lastModified: Date.now() });
}
