export type ImageFormat = "jpeg" | "png" | "webp" | "bmp";

export interface ConversionOptions {
  format: ImageFormat;
  quality: number; // 0-1
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

export interface ConvertedImage {
  blob: Blob;
  url: string;
  name: string;
  originalSize: number;
  newSize: number;
}

export const formatMimeTypes: Record<ImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  bmp: "image/bmp",
};

export const formatExtensions: Record<ImageFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  bmp: "bmp",
};

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const convertImage = async (
  file: File,
  options: ConversionOptions
): Promise<ConvertedImage> => {
  const img = await loadImage(file);
  
  let targetWidth = options.width || img.width;
  let targetHeight = options.height || img.height;

  // Calculate dimensions while maintaining aspect ratio
  if (options.maintainAspectRatio !== false && (options.width || options.height)) {
    const aspectRatio = img.width / img.height;
    
    if (options.width && !options.height) {
      targetHeight = Math.round(options.width / aspectRatio);
    } else if (options.height && !options.width) {
      targetWidth = Math.round(options.height * aspectRatio);
    } else if (options.width && options.height) {
      // Fit within bounds while maintaining ratio
      const scaleX = options.width / img.width;
      const scaleY = options.height / img.height;
      const scale = Math.min(scaleX, scaleY);
      targetWidth = Math.round(img.width * scale);
      targetHeight = Math.round(img.height * scale);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // For PNG with transparency, we need to not fill background
  if (options.format !== "png") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const mimeType = formatMimeTypes[options.format];
  const quality = options.format === "png" ? undefined : options.quality;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }

        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const extension = formatExtensions[options.format];

        resolve({
          blob,
          url: URL.createObjectURL(blob),
          name: `${baseName}.${extension}`,
          originalSize: file.size,
          newSize: blob.size,
        });

        // Cleanup
        URL.revokeObjectURL(img.src);
      },
      mimeType,
      quality
    );
  });
};

export const compressImage = async (
  file: File,
  quality: number // 0-1
): Promise<ConvertedImage> => {
  const img = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(img, 0, 0);

  // Determine output format based on input
  let mimeType = "image/jpeg";
  let extension = "jpg";
  
  if (file.type === "image/png") {
    // For PNG, we can still compress by reducing colors or converting to JPEG
    mimeType = "image/jpeg";
    extension = "jpg";
    ctx.fillStyle = "#FFFFFF";
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (file.type === "image/webp") {
    mimeType = "image/webp";
    extension = "webp";
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }

        const baseName = file.name.replace(/\.[^/.]+$/, "");

        resolve({
          blob,
          url: URL.createObjectURL(blob),
          name: `${baseName}_compressed.${extension}`,
          originalSize: file.size,
          newSize: blob.size,
        });

        URL.revokeObjectURL(img.src);
      },
      mimeType,
      quality
    );
  });
};

export const resizeImage = async (
  file: File,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<ConvertedImage> => {
  const img = await loadImage(file);

  let targetWidth = width;
  let targetHeight = height;

  if (maintainAspectRatio) {
    const aspectRatio = img.width / img.height;
    const scaleX = width / img.width;
    const scaleY = height / img.height;
    const scale = Math.min(scaleX, scaleY);
    targetWidth = Math.round(img.width * scale);
    targetHeight = Math.round(img.height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Preserve original format
  let mimeType = file.type || "image/jpeg";
  let extension = file.name.split(".").pop() || "jpg";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }

        const baseName = file.name.replace(/\.[^/.]+$/, "");

        resolve({
          blob,
          url: URL.createObjectURL(blob),
          name: `${baseName}_${targetWidth}x${targetHeight}.${extension}`,
          originalSize: file.size,
          newSize: blob.size,
        });

        URL.revokeObjectURL(img.src);
      },
      mimeType,
      0.92
    );
  });
};

export const downloadFile = (url: string, filename: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadAllAsZip = async (files: ConvertedImage[]) => {
  const JSZip = (await import("jszip")).default;
  const { saveAs } = await import("file-saver");
  
  const zip = new JSZip();
  
  files.forEach((file) => {
    zip.file(file.name, file.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "converted_images.zip");
};
