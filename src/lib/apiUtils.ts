 import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";
 
 export interface ApiResponse {
   success: boolean;
   message?: string;
  download_url?: string;
  download_urls?: string[];
   error?: string;
 }
 
 // Generic file upload function
 export const uploadFile = async (
   endpoint: string,
   file: File,
   additionalData?: Record<string, string>
 ): Promise<ApiResponse> => {
   const formData = new FormData();
   formData.append("file", file);
   
   if (additionalData) {
     Object.entries(additionalData).forEach(([key, value]) => {
       formData.append(key, value);
     });
   }
   
   const response = await fetch(endpoint, {
     method: "POST",
     body: formData,
   });
   
   if (!response.ok) {
     const errorData = await response.json().catch(() => ({}));
     throw new Error(errorData.error || `Server error: ${response.status}`);
   }
   
   return response.json();
 };
 
// Build full download URL from relative path
export const getFullDownloadUrl = (downloadUrl: string): string => {
  // If already absolute URL, return as-is
  if (downloadUrl.startsWith("http")) {
    return downloadUrl;
  }
  // Otherwise, prepend base URL
  return `${API_BASE_URL}${downloadUrl}`;
};

// Extract filename from download URL
export const getFilenameFromUrl = (downloadUrl: string): string => {
  const parts = downloadUrl.split("/");
  return parts[parts.length - 1] || "download";
};

// Trigger download using the download_url from API response
// Option A: Auto-download by redirecting
export const triggerDownload = (downloadUrl: string): void => {
  const fullUrl = getFullDownloadUrl(downloadUrl);
  window.location.href = fullUrl;
};

// Option B: Open in new tab (for multiple files or user preference)
export const openDownloadInNewTab = (downloadUrl: string): void => {
  const fullUrl = getFullDownloadUrl(downloadUrl);
  window.open(fullUrl, "_blank", "noopener,noreferrer");
};

// Download file via fetch and trigger browser download (for programmatic control)
export const downloadAndSave = async (downloadUrl: string): Promise<void> => {
  const fullUrl = getFullDownloadUrl(downloadUrl);
  const filename = getFilenameFromUrl(downloadUrl);
  
  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }
  
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
 };
 
 // === Specific API Functions ===
 
 // Background Remover
 export const removeBackground = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.removeBackground, file);
 };
 
 // Document Conversions
 export const convertPdfToWord = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.pdfToWord, file);
 };
 
 export const convertWordToPdf = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.wordToPdf, file);
 };
 
 export const convertPptToPdf = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.pptToPdf, file);
 };
 
 export const convertPptToWord = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.pptToWord, file);
 };
 
 export const convertExcelToPdf = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.excelToPdf, file);
 };
 
 export const convertExcelToWord = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.excelToWord, file);
 };
 
 export const convertWordToTxt = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.wordToTxt, file);
 };
 
 export const convertPdfToTxt = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.pdfToTxt, file);
 };
 
 // Extraction Tools
 export const extractPdfImages = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.extractPdfImages, file);
 };
 
 export const extractPptImages = async (file: File): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.extractPptImages, file);
 };
 
 export const exportPptSlides = async (
   file: File,
   format: string = "png"
 ): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.exportPptSlides, file, { format });
 };
 
 // Video & Audio
 export const convertVideo = async (
   file: File,
   outputFormat: string
 ): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.convertVideo, file, { format: outputFormat });
 };
 
 export const extractAudio = async (
   file: File,
   outputFormat: string = "mp3"
 ): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.extractAudio, file, { format: outputFormat });
 };
 
 export const convertAudio = async (
   file: File,
   outputFormat: string
 ): Promise<ApiResponse> => {
   return uploadFile(API_ENDPOINTS.convertAudio, file, { format: outputFormat });
 };

 export { API_BASE_URL, API_ENDPOINTS } from "@/config/api";