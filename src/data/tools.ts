import {
  Image,
  FileImage,
  Minimize2,
  FileText,
  FileSpreadsheet,
  Presentation,
  FilePlus,
  Scissors,
  Combine,
  FileDown,
  Eraser,
  Video,
  Music,
  FileAudio,
  ArrowLeftRight,
  Sparkles,  // NEW: For Image to SVG
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  category: "image" | "document" | "pdf" | "video" | "audio";
  keywords: string[];
}

export const imageTools: Tool[] = [
  {
    id: "image-convert",
    icon: ArrowLeftRight,
    title: "Image Converter",
    description: "Convert images between JPG, PNG, WEBP, BMP, TIFF, and HEIC formats",
    category: "image",
    keywords: ["convert", "jpg", "png", "webp", "bmp", "tiff", "heic", "format"],
  },
  {
    id: "image-compress",
    icon: Minimize2,
    title: "Image Compressor",
    description: "Reduce image file size while maintaining visual quality",
    category: "image",
    keywords: ["compress", "reduce", "size", "optimize", "smaller"],
  },
  {
    id: "image-resize",
    icon: Image,
    title: "Image Resizer",
    description: "Resize images to specific dimensions with aspect ratio control",
    category: "image",
    keywords: ["resize", "dimensions", "width", "height", "scale"],
  },
  {
    id: "bg-remove",
    icon: Eraser,
    title: "Background Remover",
    description: "Remove image backgrounds and export transparent PNGs",
    category: "image",
    keywords: ["background", "remove", "transparent", "cutout", "extract"],
  },
  {
    id: "image-to-svg",  // NEW TOOL
    icon: Sparkles,
    title: "Image to SVG",
    description: "Convert raster images to scalable vector graphics (SVG)",
    category: "image",
    keywords: ["svg", "vector", "convert", "scalable", "trace", "vectorize"],
  },
];

export const documentTools: Tool[] = [
  {
    id: "pdf-to-word",
    icon: FileText,
    title: "PDF to Word",
    description: "Convert PDF documents to editable Word format",
    category: "document",
    keywords: ["pdf", "word", "docx", "convert", "edit"],
  },
  {
    id: "word-to-pdf",
    icon: FileText,
    title: "Word to PDF",
    description: "Convert Word documents to PDF format",
    category: "document",
    keywords: ["word", "pdf", "docx", "convert"],
  },
  {
    id: "ppt-to-pdf",
    icon: Presentation,
    title: "PPT to PDF",
    description: "Convert PowerPoint presentations to PDF",
    category: "document",
    keywords: ["ppt", "powerpoint", "pdf", "convert", "slides"],
  },
  {
    id: "excel-to-pdf",
    icon: FileSpreadsheet,
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF format",
    category: "document",
    keywords: ["excel", "xlsx", "pdf", "convert", "spreadsheet"],
  },
];

// PDF & PPT Tools - includes PPT to Images
export const pdfPptTools: Tool[] = [
  {
    id: "pdf-extract-images",
    icon: FileImage,
    title: "Extract Images from PDF",
    description: "Extract all images from PDF documents",
    category: "pdf",
    keywords: ["pdf", "extract", "images", "pictures", "photos"],
  },
  {
    id: "pdf-extract-text",
    icon: FileText,
    title: "Extract Text from PDF",
    description: "Extract text content from PDF files",
    category: "pdf",
    keywords: ["pdf", "extract", "text", "content", "copy"],
  },
  {
    id: "pdf-split",
    icon: Scissors,
    title: "Split PDF",
    description: "Split PDF by page range into separate files",
    category: "pdf",
    keywords: ["pdf", "split", "pages", "separate", "divide"],
  },
  {
    id: "pdf-merge",
    icon: Combine,
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document",
    category: "pdf",
    keywords: ["pdf", "merge", "combine", "join", "multiple"],
  },
  {
    id: "pdf-compress",
    icon: FileDown,
    title: "Compress PDF",
    description: "Reduce PDF file size while preserving quality",
    category: "pdf",
    keywords: ["pdf", "compress", "reduce", "size", "smaller"],
  },
  {
    id: "ppt-to-images",
    icon: Presentation,
    title: "PPT to Images",
    description: "Export PowerPoint slides as PNG or JPG images",
    category: "pdf",
    keywords: ["ppt", "powerpoint", "images", "export", "slides", "png", "jpg"],
  },
];

export const videoAudioTools: Tool[] = [
  {
    id: "video-convert",
    icon: Video,
    title: "Video Converter",
    description: "Convert videos between MP4, AVI, MKV, MOV, and WEBM",
    category: "video",
    keywords: ["video", "convert", "mp4", "avi", "mkv", "mov", "webm"],
  },
  {
    id: "audio-extract",
    icon: Music,
    title: "Extract Audio",
    description: "Extract audio tracks from video files",
    category: "video",
    keywords: ["audio", "extract", "video", "soundtrack", "music"],
  },
  {
    id: "audio-convert",
    icon: FileAudio,
    title: "Audio Converter",
    description: "Convert audio files between MP3 and WAV formats",
    category: "audio",
    keywords: ["audio", "convert", "mp3", "wav", "format"],
  },
];

// Legacy export for backward compatibility
export const pdfTools = pdfPptTools;

export const allTools = [...imageTools, ...documentTools, ...pdfPptTools, ...videoAudioTools];