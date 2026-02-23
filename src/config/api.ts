export const API_BASE_URL =
  "https://fileconverterbackend-production.up.railway.app";

export const API_ENDPOINTS = {
  // Image Tools
  removeBackground: `${API_BASE_URL}/api/remove-background`,

  // Document Conversions
  pdfToWord: `${API_BASE_URL}/api/convert/pdf-to-word`,
  wordToPdf: `${API_BASE_URL}/api/convert/word-to-pdf`,
  pptToPdf: `${API_BASE_URL}/api/convert/ppt-to-pdf`,
  pptToWord: `${API_BASE_URL}/api/convert/ppt-to-word`,
  excelToPdf: `${API_BASE_URL}/api/convert/excel-to-pdf`,
  excelToWord: `${API_BASE_URL}/api/convert/excel-to-word`,
  wordToTxt: `${API_BASE_URL}/api/convert/word-to-txt`,
  pdfToTxt: `${API_BASE_URL}/api/convert/pdf-to-txt`,

  // Extraction Tools
  extractPdfImages: `${API_BASE_URL}/api/extract/pdf-images`,
  extractPptImages: `${API_BASE_URL}/api/extract/ppt-images`,
  exportPptSlides: `${API_BASE_URL}/api/export/ppt-slides`,

  // Video & Audio
  convertVideo: `${API_BASE_URL}/api/convert/video`,
  extractAudio: `${API_BASE_URL}/api/extract/audio`,
  convertAudio: `${API_BASE_URL}/api/convert/audio`,

  // PDF Tools
  compressPdf: `${API_BASE_URL}/api/compress/pdf`,

  // Image to SVG
  imageToSvg: `${API_BASE_URL}/api/convert/image-to-svg`,

  // Download
  download: (sessionId: string, filename: string) =>
    `${API_BASE_URL}/api/download/${sessionId}/${filename}`,
};