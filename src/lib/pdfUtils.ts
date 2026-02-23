import { PDFDocument } from "pdf-lib";

export interface ProcessedPDF {
  blob: Blob;
  url: string;
  name: string;
  originalSize?: number;
  newSize: number;
  pageCount?: number;
}

export const mergePDFs = async (files: File[]): Promise<ProcessedPDF> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });

  return {
    blob,
    url: URL.createObjectURL(blob),
    name: "merged.pdf",
    newSize: blob.size,
    pageCount: mergedPdf.getPageCount(),
  };
};

export const splitPDF = async (
  file: File,
  startPage: number,
  endPage: number
): Promise<ProcessedPDF> => {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();

  // Validate page range
  const start = Math.max(0, startPage - 1);
  const end = Math.min(totalPages - 1, endPage - 1);

  if (start > end) {
    throw new Error("Invalid page range");
  }

  const newPdf = await PDFDocument.create();
  const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const pages = await newPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });

  const baseName = file.name.replace(/\.pdf$/i, "");

  return {
    blob,
    url: URL.createObjectURL(blob),
    name: `${baseName}_pages_${startPage}-${endPage}.pdf`,
    originalSize: file.size,
    newSize: blob.size,
    pageCount: newPdf.getPageCount(),
  };
};

export const compressPDF = async (file: File): Promise<ProcessedPDF> => {
  // Note: True PDF compression requires server-side processing
  // This is a basic reprocessing that can reduce size in some cases
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);

  // Save with compression options
  const pdfBytes = await pdf.save({
    useObjectStreams: true,
  });

  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const baseName = file.name.replace(/\.pdf$/i, "");

  return {
    blob,
    url: URL.createObjectURL(blob),
    name: `${baseName}_compressed.pdf`,
    originalSize: file.size,
    newSize: blob.size,
    pageCount: pdf.getPageCount(),
  };
};

export const getPDFPageCount = async (file: File): Promise<number> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
};

export const extractPDFPages = async (
  file: File,
  pageNumbers: number[]
): Promise<ProcessedPDF[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const baseName = file.name.replace(/\.pdf$/i, "");
  const results: ProcessedPDF[] = [];

  for (const pageNum of pageNumbers) {
    const pageIndex = pageNum - 1;
    if (pageIndex < 0 || pageIndex >= sourcePdf.getPageCount()) continue;

    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(sourcePdf, [pageIndex]);
    newPdf.addPage(page);

    const pdfBytes = await newPdf.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });

    results.push({
      blob,
      url: URL.createObjectURL(blob),
      name: `${baseName}_page_${pageNum}.pdf`,
      newSize: blob.size,
      pageCount: 1,
    });
  }

  return results;
};
