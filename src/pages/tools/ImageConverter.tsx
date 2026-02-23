import { useState } from "react";
import { ArrowLeftRight, Download, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertImage, downloadFile, downloadAllAsZip, ImageFormat, ConvertedImage } from "@/lib/imageUtils";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

const ImageConverter = () => {
  const seo = SEO_PAGES.imageConverter;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [format, setFormat] = useState<ImageFormat>("jpeg");
  const [quality, setQuality] = useState([85]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({ title: "No files selected", description: "Please upload images to convert", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const converted: ConvertedImage[] = [];
      
      for (const uploadedFile of files) {
        const result = await convertImage(uploadedFile.file, {
          format,
          quality: quality[0] / 100,
        });
        converted.push(result);
      }

      setResults(converted);
      toast({ title: "Conversion complete!", description: `${converted.length} image(s) converted successfully` });
    } catch (error) {
      toast({ title: "Conversion failed", description: "An error occurred during conversion", variant: "destructive" });
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
      icon={ArrowLeftRight}
      title="Image Converter"
      description="Convert images between JPG, PNG, WEBP, and BMP formats"
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
            maxFiles={20}
          />
        </div>

        {/* Options Section */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Conversion Options</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as ImageFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPG (JPEG)</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="bmp">BMP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quality: {quality[0]}%</Label>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={10}
                max={100}
                step={5}
                disabled={format === "png" || format === "bmp"}
              />
              {(format === "png" || format === "bmp") && (
                <p className="text-xs text-muted-foreground">Quality setting not applicable for {format.toUpperCase()}</p>
              )}
            </div>
          </div>

          <Button 
            onClick={handleConvert} 
            disabled={files.length === 0 || isProcessing}
            className="mt-6 w-full gradient-primary shadow-primary"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              `Convert ${files.length} Image${files.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Converted Images</h2>
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
                    <p className="text-xs text-primary">
                      {result.newSize < result.originalSize ? 
                        `${Math.round((1 - result.newSize / result.originalSize) * 100)}% smaller` :
                        `${Math.round((result.newSize / result.originalSize - 1) * 100)}% larger`
                      }
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

export default ImageConverter;
