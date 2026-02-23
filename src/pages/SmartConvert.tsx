import { useState, useMemo } from "react";
import { ArrowRight, ArrowDown, Sparkles, Loader2, Download, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertPdfToWord,
  convertWordToPdf,
  convertPptToPdf,
  convertExcelToPdf,
  exportPptSlides,
  convertVideo,
  convertAudio,
  downloadAndSave,
  getFilenameFromUrl,
  ApiResponse,
} from "@/lib/apiUtils";
import { convertImage, ConvertedImage, ImageFormat } from "@/lib/imageUtils";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

type ConversionResult = ApiResponse | ConvertedImage;

interface ConversionPath {
  id: string;
  label: string;
  accept: string;
  targetFormats: { value: string; label: string }[];
  converter: (file: File, targetFormat: string) => Promise<ConversionResult>;
  isClientSide?: boolean;
}

const conversionPaths: Record<string, ConversionPath[]> = {
  pdf: [
    {
      id: "pdf-to-word",
      label: "PDF",
      accept: ".pdf,application/pdf",
      targetFormats: [{ value: "docx", label: "Word (DOCX)" }],
      converter: async (file) => convertPdfToWord(file),
    },
  ],
  docx: [
    {
      id: "word-to-pdf",
      label: "Word (DOCX)",
      accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      targetFormats: [{ value: "pdf", label: "PDF" }],
      converter: async (file) => convertWordToPdf(file),
    },
  ],
  pptx: [
    {
      id: "ppt-to-pdf",
      label: "PowerPoint (PPTX)",
      accept: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
      targetFormats: [
        { value: "pdf", label: "PDF" },
        { value: "png", label: "Images (PNG)" },
        { value: "jpg", label: "Images (JPG)" },
      ],
      converter: async (file, format) => {
        if (format === "pdf") return convertPptToPdf(file);
        return exportPptSlides(file, format);
      },
    },
  ],
  xlsx: [
    {
      id: "excel-to-pdf",
      label: "Excel (XLSX)",
      accept: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      targetFormats: [{ value: "pdf", label: "PDF" }],
      converter: async (file) => convertExcelToPdf(file),
    },
  ],
  image: [
    {
      id: "image-convert",
      label: "Image (JPG, PNG, WEBP, SVG)",
      accept: "image/*,.jpg,.jpeg,.png,.webp,.bmp,.gif",
      targetFormats: [
        { value: "jpeg", label: "JPG" },
        { value: "png", label: "PNG" },
        { value: "webp", label: "WebP" },
        { value: "svg", label: "SVG (Vector)" },
      ],
      converter: async (file, format) => {
        if (format === "svg") {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch(API_ENDPOINTS.imageToSvg, {
            method: "POST",
            body: formData,
          });
          return await response.json();
        }
        return convertImage(file, { format: format as ImageFormat, quality: 0.92 });
      },
      isClientSide: true,
    },
  ],
  video: [
    {
      id: "video-convert",
      label: "Video (MP4, AVI, MKV)",
      accept: "video/*,.mp4,.avi,.mkv,.mov,.webm",
      targetFormats: [
        { value: "mp4", label: "MP4" },
        { value: "avi", label: "AVI" },
        { value: "mkv", label: "MKV" },
        { value: "webm", label: "WebM" },
      ],
      converter: async (file, format) => convertVideo(file, format),
    },
  ],
  audio: [
    {
      id: "audio-convert",
      label: "Audio (MP3, WAV)",
      accept: "audio/*,.mp3,.wav,.aac,.flac,.ogg,.m4a",
      targetFormats: [
        { value: "mp3", label: "MP3" },
        { value: "wav", label: "WAV" },
        { value: "aac", label: "AAC" },
      ],
      converter: async (file, format) => convertAudio(file, format),
    },
  ],
};

const sourceFormats = [
  { value: "pdf", label: "PDF Document" },
  { value: "docx", label: "Word Document" },
  { value: "pptx", label: "PowerPoint" },
  { value: "xlsx", label: "Excel Spreadsheet" },
  { value: "image", label: "Image File" },
  { value: "video", label: "Video File" },
  { value: "audio", label: "Audio File" },
];

interface ProcessedFile {
  downloadUrl?: string;
  blob?: Blob;
  originalName: string;
  fileName: string;
}

const SmartConvert = () => {
  const seo = SEO_PAGES.smartConvert;
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFormat, setSourceFormat] = useState("");
  const [targetFormat, setTargetFormat] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedFile[]>([]);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const currentPath = useMemo(() => {
    if (!sourceFormat) return null;
    return conversionPaths[sourceFormat]?.[0] || null;
  }, [sourceFormat]);

  const targetFormats = useMemo(() => {
    return currentPath?.targetFormats || [];
  }, [currentPath]);

  const handleSourceChange = (value: string) => {
    setSourceFormat(value);
    setTargetFormat("");
    setFiles([]);
    setResults([]);
  };

  const handleConvert = async () => {
    if (!currentPath || !targetFormat || files.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select formats and upload files",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const processed: ProcessedFile[] = [];

      for (const file of files) {
        const result = await currentPath.converter(file.file, targetFormat);

        if (currentPath.isClientSide && "blob" in result && result.blob) {
          processed.push({
            blob: result.blob,
            originalName: file.file.name,
            fileName: result.name,
          });
        } else if ("success" in result && result.success) {
          const apiResult = result as ApiResponse;
          if (apiResult.download_urls && apiResult.download_urls.length > 0) {
            for (const url of apiResult.download_urls) {
              processed.push({
                downloadUrl: url,
                originalName: file.file.name,
                fileName: getFilenameFromUrl(url),
              });
            }
          } else if (apiResult.download_url) {
            processed.push({
              downloadUrl: apiResult.download_url,
              originalName: file.file.name,
              fileName: getFilenameFromUrl(apiResult.download_url),
            });
          }
        }
      }

      setResults(processed);
      toast({
        title: "Conversion complete!",
        description: `Successfully converted ${processed.length} file${processed.length !== 1 ? "s" : ""}`,
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
      if (result.blob) {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (result.downloadUrl) {
        await downloadAndSave(result.downloadUrl);
      }
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
    <div className="min-h-screen bg-background">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={seo.canonical}
      />
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container py-8 sm:py-12 px-4 sm:px-6">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4 shrink-0" />
            Smart Conversion
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Convert Any File in{" "}
            <span className="text-gradient">3 Simple Steps</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
            Select your source format, choose your target format, upload your files, and we'll handle the rest.
          </p>
        </div>

        {/* Conversion Flow */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1 & 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 sm:mb-8 items-center">
            {/* Step 1: Source Format */}
            <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                  1
                </div>
                <h2 className="font-semibold">Source Format</h2>
              </div>
              <Select value={sourceFormat} onValueChange={handleSourceChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent className="bg-card border shadow-lg z-50">
                  {sourceFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Arrow - desktop only */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-primary animate-pulse" />
            </div>
            {/* Arrow - mobile between steps */}
            <div className="flex sm:hidden items-center justify-center -my-2">
              <ArrowDown className="h-5 w-5 text-primary" />
            </div>

            {/* Step 2: Target Format */}
            <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                  2
                </div>
                <h2 className="font-semibold">Target Format</h2>
              </div>
              <Select
                value={targetFormat}
                onValueChange={setTargetFormat}
                disabled={!sourceFormat}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target..." />
                </SelectTrigger>
                <SelectContent className="bg-card border shadow-lg z-50">
                  {targetFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Step 3: Upload */}
          {sourceFormat && targetFormat && (
            <div className="rounded-xl border bg-card p-5 shadow-card mb-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                  3
                </div>
                <h2 className="font-semibold">Upload Files</h2>
              </div>
              <FileUpload
                accept={currentPath?.accept || "*"}
                files={files}
                onFilesChange={setFiles}
                category="document"
                maxFiles={10}
              />
              {targetFormat === "svg" && (
                <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Images will be converted to high-quality black & white vector graphics.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Convert Button */}
          {files.length > 0 && (
            <Button
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full gradient-primary shadow-primary hover:opacity-90 transition-all duration-300"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Convert {files.length} File{files.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="rounded-xl border bg-card p-5 mt-6 animate-fade-in">
              <h2 className="font-semibold mb-4">Converted Files</h2>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-lg border bg-secondary/50 p-3 sm:p-4 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SmartConvert;
