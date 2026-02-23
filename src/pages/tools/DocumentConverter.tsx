import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FileText, Presentation, FileSpreadsheet, Download, Loader2, Image } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";
import { downloadAndSave, getFilenameFromUrl, ApiResponse } from "@/lib/apiUtils";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

interface ToolConfig {
  title: string;
  description: string;
  icon: typeof FileText;
  accept: string;
  endpoint: string;
  outputLabel: string;
  category: "image" | "document" | "pdf" | "video" | "audio";
  multipleOutputs?: boolean;
}

const toolConfigs: Record<string, ToolConfig> = {
  "pdf-to-word": {
    title: "PDF to Word",
    description: "Convert PDF documents to editable Word format",
    icon: FileText,
    accept: ".pdf,application/pdf",
    endpoint: API_ENDPOINTS.pdfToWord,
    outputLabel: "Word Document",
    category: "document",
  },
  "word-to-pdf": {
    title: "Word to PDF",
    description: "Convert Word documents to PDF format",
    icon: FileText,
    accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    endpoint: API_ENDPOINTS.wordToPdf,
    outputLabel: "PDF Document",
    category: "document",
  },
  "ppt-to-pdf": {
    title: "PPT to PDF",
    description: "Convert PowerPoint presentations to PDF",
    icon: Presentation,
    accept: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    endpoint: API_ENDPOINTS.pptToPdf,
    outputLabel: "PDF Document",
    category: "document",
  },
  "excel-to-pdf": {
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF format",
    icon: FileSpreadsheet,
    accept: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    endpoint: API_ENDPOINTS.excelToPdf,
    outputLabel: "PDF Document",
    category: "document",
  },
  "ppt-to-images": {
    title: "PPT to Images",
    description: "Export PowerPoint slides as PNG or JPG images",
    icon: Image,
    accept: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    endpoint: API_ENDPOINTS.exportPptSlides,
    outputLabel: "Image Files",
    category: "pdf",
    multipleOutputs: true,
  },
};

interface ProcessedFile {
  downloadUrl: string;
  fileName: string;
  originalName: string;
}

const DocumentConverter = () => {
  const location = useLocation();
  const toolId = location.pathname.split("/").pop() || "pdf-to-word";
  const config = toolConfigs[toolId] || toolConfigs["pdf-to-word"];
  const Icon = config.icon;

  const seoMap: Record<string, any> = {
    "pdf-to-word":   SEO_PAGES.pdfToWord,
    "word-to-pdf":   SEO_PAGES.wordToPdf,
    "ppt-to-pdf":    SEO_PAGES.pptToPdf,
    "excel-to-pdf":  SEO_PAGES.excelToPdf,
    "ppt-to-images": SEO_PAGES.pptToImages,
  };
  const seo = seoMap[toolId] || SEO_PAGES.pdfToWord;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedFile[]>([]);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload a file to convert",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const processed: ProcessedFile[] = [];

      for (const uploadedFile of files) {
        const formData = new FormData();
        formData.append("file", uploadedFile.file);

        // For PPT to images, also send format
        if (toolId === "ppt-to-images") {
          formData.append("format", "png");
        }

        const response = await fetch(config.endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server error: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Conversion failed");
        }

        // Handle multiple output URLs (e.g. PPT to images — one per slide)
        if (result.download_urls && result.download_urls.length > 0) {
          for (const url of result.download_urls) {
            processed.push({
              downloadUrl: url,
              fileName: getFilenameFromUrl(url),
              originalName: uploadedFile.file.name,
            });
          }
        } else if (result.download_url) {
          processed.push({
            downloadUrl: result.download_url,
            fileName: getFilenameFromUrl(result.download_url),
            originalName: uploadedFile.file.name,
          });
        }
      }

      setResults(processed);
      toast({
        title: "Conversion complete!",
        description: `Successfully converted ${files.length} file${files.length !== 1 ? "s" : ""}`,
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (result: ProcessedFile, index: number) => {
    setDownloadingIndex(index);
    try {
      await downloadAndSave(result.downloadUrl);
      toast({ title: "Downloaded!", description: result.fileName });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setDownloadingIndex(null);
    }
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
      icon={Icon}
      title={config.title}
      description={config.description}
      category={config.category}
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Upload File</h2>
          <FileUpload
            accept={config.accept}
            files={files}
            onFilesChange={setFiles}
            category={config.category}
            maxFiles={10}
            multiple={true}
          />
        </div>

        {/* Convert Button */}
        <Button
          onClick={handleConvert}
          disabled={files.length === 0 || isProcessing}
          className="w-full gradient-primary shadow-primary"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            `Convert ${files.length > 0 ? files.length : ""} File${files.length !== 1 ? "s" : ""}`
          )}
        </Button>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <h2 className="font-semibold mb-4">
              Converted Files{" "}
              <span className="text-muted-foreground font-normal text-sm">
                ({results.length} file{results.length !== 1 ? "s" : ""})
              </span>
            </h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-lg border bg-secondary/50 p-3 sm:p-4 hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <p className="truncate font-medium text-sm sm:text-base">{result.fileName}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      From: {result.originalName}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDownload(result, index)}
                    disabled={downloadingIndex === index}
                    className="gradient-primary hover:opacity-90 shrink-0 w-full sm:w-auto"
                    size="sm"
                  >
                    {downloadingIndex === index ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Files are processed securely on the
            server and automatically deleted after conversion.
          </p>
        </div>
      </div>
    </ToolLayout>
    </>
  );
};

export default DocumentConverter;
