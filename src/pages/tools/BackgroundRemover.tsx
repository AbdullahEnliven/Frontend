import { useState } from "react";
import { Eraser, Download, Loader2, Palette, Check, RefreshCw } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

// Popular background colors
const BACKGROUND_COLORS = [
  { value: null, hex: "transparent", preview: "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)" },
  { value: "255,255,255", hex: "#FFFFFF", preview: "#FFFFFF" },
  { value: "0,0,0", hex: "#000000", preview: "#000000" },
  { value: "239,68,68", hex: "#EF4444", preview: "#EF4444" },
  { value: "249,115,22", hex: "#F97316", preview: "#F97316" },
  { value: "234,179,8", hex: "#EAB308", preview: "#EAB308" },
  { value: "34,197,94", hex: "#22C55E", preview: "#22C55E" },
  { value: "59,130,246", hex: "#3B82F6", preview: "#3B82F6" },
  { value: "168,85,247", hex: "#A855F7", preview: "#A855F7" },
  { value: "236,72,153", hex: "#EC4899", preview: "#EC4899" },
  { value: "156,163,175", hex: "#9CA3AF", preview: "#9CA3AF" },
  { value: "30,58,138", hex: "#1E3A8A", preview: "#1E3A8A" },
  { value: "20,184,166", hex: "#14B8A6", preview: "#14B8A6" },
  { value: "132,204,22", hex: "#84CC16", preview: "#84CC16" },
  { value: "56,189,248", hex: "#38BDF8", preview: "#38BDF8" },
];

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2MB

interface ProcessedImage {
  originalFile: File;
  transparentImageUrl: string;
  transparentImageBlob: Blob | null;
  currentPreviewUrl: string;
  selectedColorHex: string | null;
  selectedColorValue: string | null;
}

// Compress image client-side to stay under 2MB before sending to backend
const compressToLimit = (file: File, maxBytes: number): Promise<File> => {
  return new Promise((resolve) => {
    if (file.size <= maxBytes) {
      resolve(file); // Already small enough, skip
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Try reducing quality in steps until under limit
      const qualities = [0.85, 0.75, 0.65, 0.5, 0.4];
      let attemptIndex = 0;

      const tryQuality = () => {
        if (attemptIndex >= qualities.length) {
          // Still too big — shrink dimensions by 75% and retry
          canvas.width = Math.round(canvas.width * 0.75);
          canvas.height = Math.round(canvas.height * 0.75);
          const ctx2 = canvas.getContext("2d")!;
          ctx2.drawImage(img, 0, 0, canvas.width, canvas.height);
          attemptIndex = 0;
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= maxBytes || attemptIndex >= qualities.length - 1) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              attemptIndex++;
              tryQuality();
            }
          },
          "image/jpeg",
          qualities[attemptIndex]
        );
      };

      tryQuality();
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

const BackgroundRemover = () => {
  const seo = SEO_PAGES.backgroundRemover;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const { toast } = useToast();

  const handleRemoveBackground = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload images to remove backgrounds",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const processed: ProcessedImage[] = [];

      for (const uploadedFile of files) {
        // Silently compress to 2MB if needed before sending to backend
        const fileToSend = await compressToLimit(uploadedFile.file, MAX_UPLOAD_BYTES);

        const formData = new FormData();
        formData.append("file", fileToSend);

        const response = await fetch(API_ENDPOINTS.removeBackground, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.download_url) {
          const transparentUrl = `${API_BASE_URL}${result.download_url}`;

          // Fetch transparent image as blob for client-side color application
          const imageResponse = await fetch(transparentUrl);
          const imageBlob = await imageResponse.blob();

          processed.push({
            originalFile: uploadedFile.file,
            transparentImageUrl: transparentUrl,
            transparentImageBlob: imageBlob,
            currentPreviewUrl: transparentUrl,
            selectedColorHex: null,
            selectedColorValue: null,
          });
        } else {
          throw new Error(result.error || "Processing failed");
        }
      }

      setResults(processed);
      toast({
        title: "Background removed!",
        description: `Successfully processed ${processed.length} image${processed.length !== 1 ? "s" : ""}`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Client-side color application using Canvas — instant, no backend call
  const applyColorToImage = async (imageBlob: Blob, colorHex: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) { reject(new Error("Could not get canvas context")); return; }

        ctx.fillStyle = colorHex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(imageBlob);
    });
  };

  const handleApplyColor = async (index: number, colorHex: string | null, colorValue: string | null) => {
    const result = results[index];

    if (colorHex === null) {
      setResults(prev => prev.map((r, i) =>
        i === index
          ? { ...r, currentPreviewUrl: r.transparentImageUrl, selectedColorHex: null, selectedColorValue: null }
          : r
      ));
      return;
    }

    try {
      if (result.transparentImageBlob) {
        const coloredImageUrl = await applyColorToImage(result.transparentImageBlob, colorHex);
        setResults(prev => prev.map((r, i) =>
          i === index
            ? { ...r, currentPreviewUrl: coloredImageUrl, selectedColorHex: colorHex, selectedColorValue: colorValue }
            : r
        ));
      }
    } catch (error) {
      console.error("Error applying color:", error);
      toast({
        title: "Color application failed",
        description: "Could not apply color to image",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (result: ProcessedImage) => {
    try {
      let downloadUrl: string;
      let filename: string;

      if (result.selectedColorHex && result.transparentImageBlob) {
        const coloredDataUrl = await applyColorToImage(result.transparentImageBlob, result.selectedColorHex);
        const response = await fetch(coloredDataUrl);
        const blob = await response.blob();
        downloadUrl = URL.createObjectURL(blob);
        filename = "image_with_background.png";
      } else {
        downloadUrl = result.transparentImageUrl;
        filename = "image_no_bg.png";
      }

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (result.selectedColorHex) {
        URL.revokeObjectURL(downloadUrl);
      }

      toast({
        title: "Downloaded!",
        description: result.selectedColorHex ? "Image with colored background" : "Transparent background image"
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Could not download image",
        variant: "destructive",
      });
    }
  };

  const resetImage = (index: number) => {
    setResults(prev => prev.map((r, i) =>
      i === index
        ? { ...r, currentPreviewUrl: r.transparentImageUrl, selectedColorHex: null, selectedColorValue: null }
        : r
    ));
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
      icon={Eraser}
      title="Background Remover"
      description="Remove backgrounds from images using AI"
      category="image"
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Upload Images</h2>
          <FileUpload
            accept="image/*"
            files={files}
            onFilesChange={setFiles}
            category="image"
            maxFiles={5}
          />
        </div>

        {/* Remove Background Button */}
        {files.length > 0 && results.length === 0 && (
          <Button
            onClick={handleRemoveBackground}
            disabled={isProcessing}
            className="w-full gradient-primary shadow-primary"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing Background...
              </>
            ) : (
              <>
                <Eraser className="mr-2 h-5 w-5" />
                Remove Background from {files.length} Image{files.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        )}

        {/* Results Section with Live Preview */}
        {results.length > 0 && (
          <div className="space-y-8">
            {results.map((result, index) => (
              <div key={index} className="rounded-xl border bg-card p-6 space-y-6">
                {/* Preview Image */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Preview</h3>
                    <div className="flex gap-2">
                      {result.selectedColorHex && (
                        <Button onClick={() => resetImage(index)} variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset
                        </Button>
                      )}
                      <Button onClick={() => handleDownload(result)} className="gradient-primary" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div
                    className="relative rounded-lg overflow-hidden border-2 border-border"
                    style={{
                      background: result.selectedColorHex
                        ? result.selectedColorHex
                        : "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)",
                      backgroundSize: result.selectedColorHex ? "cover" : "20px 20px",
                      backgroundPosition: result.selectedColorHex ? "0 0" : "0 0, 10px 10px",
                    }}
                  >
                    <img
                      src={result.currentPreviewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain mx-auto"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                      result.selectedColorHex ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-500"
                    }`}>
                      <div className={`h-2 w-2 rounded-full ${result.selectedColorHex ? "bg-primary" : "bg-green-500"}`} />
                      {result.selectedColorHex ? "Colored Background" : "Transparent"}
                    </div>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Apply Background Color</h3>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-3">
                    {BACKGROUND_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => handleApplyColor(index, color.hex === "transparent" ? null : color.hex, color.value)}
                        className={`relative h-14 w-14 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                          result.selectedColorHex === color.hex || (result.selectedColorHex === null && color.hex === "transparent")
                            ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{
                          background: color.preview,
                          backgroundSize: color.hex === "transparent" ? "10px 10px" : "cover",
                          backgroundPosition: "0 0, 5px 5px"
                        }}
                      >
                        {(result.selectedColorHex === color.hex || (result.selectedColorHex === null && color.hex === "transparent")) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className={`h-6 w-6 drop-shadow-lg ${
                              color.hex === "#000000" || color.hex === "#1E3A8A" ? "text-white" : "text-gray-900"
                            }`} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Start Over Button */}
        {results.length > 0 && (
          <Button
            onClick={() => { setResults([]); setFiles([]); }}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Process New Images
          </Button>
        )}

        {/* Info Note */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">How it works:</strong> Upload → Remove background → Click any color → Download instantly
          </p>
        </div>
      </div>
    </ToolLayout>
    </>
  );
};

export default BackgroundRemover;