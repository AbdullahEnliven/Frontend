import { useState } from "react";
import { FileDown, Download, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// ✅ Import API endpoints from your config
// File location: src/config/api.ts
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

// Backend API call for PDF compression (uses api.ts)
const compressPdf = async (file: File, level: string = "ebook") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("level", level);

  const res = await fetch(API_ENDPOINTS.compressPdf, {
    method: "POST",
    body: formData,
  });

  // If backend returns non-JSON sometimes, this prevents crashing
  let data: any = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    throw new Error(text || "Compression failed");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.error || "Compression failed");
  }

  return data; // expected: { success, name, before_bytes, after_bytes, download_url, ... }
};

const PDFCompress = () => {
  const seo = SEO_PAGES.pdfCompress;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [level, setLevel] = useState("ebook");
  const { toast } = useToast();

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload PDF files to compress",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const compressed: any[] = [];

      for (const file of files) {
        const result = await compressPdf(file.file, level);
        compressed.push(result);
      }

      setResults(compressed);

      const totalOriginal = compressed.reduce(
        (sum, r) => sum + (r.before_bytes || 0),
        0
      );
      const totalNew = compressed.reduce((sum, r) => sum + (r.after_bytes || 0), 0);
      const savings =
        totalOriginal > 0 ? Math.round((1 - totalNew / totalOriginal) * 100) : 0;

      toast({
        title: "Compression complete!",
        description: savings > 0 ? `Reduced file size by ${savings}%` : "Files optimized",
      });
    } catch (error: any) {
      toast({
        title: "Compression failed",
        description: error?.message || "An error occurred during compression",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const downloadFile = (result: any) => {
    const url = result.download_url;

    // ✅ Handle both absolute and relative download URLs
    const finalUrl =
      typeof url === "string" && url.startsWith("http")
        ? url
        : `${API_BASE_URL}${url}`;

    const a = document.createElement("a");
    a.href = finalUrl;
    a.download = result.name || "compressed.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={seo.canonical}
        structuredData={(seo as any).structuredData}
      />
      <ToolLayout
      icon={FileDown}
      title="Compress PDF"
      description="Reduce PDF file size while preserving quality"
      category="pdf"
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Upload PDF Files</h2>
          <FileUpload
            accept="application/pdf"
            files={files}
            onFilesChange={setFiles}
            category="pdf"
            maxFiles={10}
          />
        </div>

        {/* Action Button */}
        <Button
          onClick={handleCompress}
          disabled={files.length === 0 || isProcessing}
          className="w-full gradient-primary shadow-primary"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Compressing...
            </>
          ) : (
            `Compress ${files.length} PDF${files.length !== 1 ? "s" : ""}`
          )}
        </Button>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <h2 className="font-semibold mb-4">Compressed PDFs</h2>

            <div className="space-y-3">
              {results.map((result, index) => {
                const savings =
                  result.before_bytes && result.after_bytes
                    ? Math.round((1 - result.after_bytes / result.before_bytes) * 100)
                    : 0;

                return (
                  <div
                    key={index}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-lg border bg-secondary/50 p-3 sm:p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-category-pdf/10">
                      <FileDown className="h-6 w-6 text-category-pdf" />
                    </div>

                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <p className="truncate font-medium">{result.name || "Compressed PDF"}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.before_bytes
                          ? `${formatFileSize(result.before_bytes)} → `
                          : ""}
                        {formatFileSize(result.after_bytes || 0)}
                        {savings > 0 && (
                          <span className="ml-2 text-primary font-medium">
                            {savings}% smaller
                          </span>
                        )}
                      </p>
                    </div>

                    <Button onClick={() => downloadFile(result)} className="gradient-primary shrink-0 w-full sm:w-auto" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> This tool optimizes PDF structure.
            For maximum compression of PDFs with many images, consider using our Image Compressor
            first.
          </p>
        </div>
      </div>
    </ToolLayout>
    </>
  );
};

export default PDFCompress;
