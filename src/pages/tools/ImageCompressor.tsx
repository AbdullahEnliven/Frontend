import { useState } from "react";
import { Minimize2, Download, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { compressImage, downloadFile, downloadAllAsZip, ConvertedImage } from "@/lib/imageUtils";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

const ImageCompressor = () => {
  const seo = SEO_PAGES.imageCompressor;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quality, setQuality] = useState([70]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const { toast } = useToast();

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({ title: "No files selected", description: "Please upload images to compress", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const compressed: ConvertedImage[] = [];
      
      for (const uploadedFile of files) {
        const result = await compressImage(uploadedFile.file, quality[0] / 100);
        compressed.push(result);
      }

      setResults(compressed);
      
      const totalOriginal = compressed.reduce((sum, r) => sum + r.originalSize, 0);
      const totalNew = compressed.reduce((sum, r) => sum + r.newSize, 0);
      const savings = Math.round((1 - totalNew / totalOriginal) * 100);
      
      toast({ 
        title: "Compression complete!", 
        description: `Saved ${savings}% file size across ${compressed.length} image(s)` 
      });
    } catch (error) {
      toast({ title: "Compression failed", description: "An error occurred during compression", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalSavings = results.length > 0 ? 
    Math.round((1 - results.reduce((s, r) => s + r.newSize, 0) / results.reduce((s, r) => s + r.originalSize, 0)) * 100) : 0;

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
        icon={Minimize2}
        title="Image Compressor"
        description="Reduce image file size while maintaining visual quality"
        category="image"
      >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Upload Images</h2>
          <FileUpload
            accept="image/jpeg,image/png,image/webp"
            files={files}
            onFilesChange={setFiles}
            category="image"
            maxFiles={20}
          />
        </div>

        {/* Options Section */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Compression Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Compression Level</Label>
                <span className="text-sm text-muted-foreground">{quality[0]}% quality</span>
              </div>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={10}
                max={95}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCompress} 
            disabled={files.length === 0 || isProcessing}
            className="mt-6 w-full gradient-primary shadow-primary"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compressing...
              </>
            ) : (
              `Compress ${files.length} Image${files.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold">Compressed Images</h2>
                <p className="text-sm text-primary font-medium">Total savings: {totalSavings}%</p>
              </div>
              {results.length > 1 && (
                <Button variant="outline" size="sm" onClick={() => downloadAllAsZip(results)}>
                  Download All (ZIP)
                </Button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((result, index) => (
                <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-lg border bg-secondary/50 p-3 sm:p-4">
                  <img src={result.url} alt={result.name} className="h-16 w-16 rounded-md object-cover" />
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <p className="truncate text-sm font-medium">{result.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(result.originalSize)} → {formatFileSize(result.newSize)}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {Math.round((1 - result.newSize / result.originalSize) * 100)}% smaller
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" className="shrink-0" onClick={() => downloadFile(result.url, result.name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
    </>
  );
};

export default ImageCompressor;
