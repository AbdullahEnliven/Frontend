import { useState } from "react";
import { Image, Download, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { resizeImage, downloadFile, downloadAllAsZip, ConvertedImage } from "@/lib/imageUtils";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

const ImageResizer = () => {
  const seo = SEO_PAGES.imageResizer;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [width, setWidth] = useState<string>("800");
  const [height, setHeight] = useState<string>("600");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const { toast } = useToast();

  const handleResize = async () => {
    if (files.length === 0) {
      toast({ title: "No files selected", description: "Please upload images to resize", variant: "destructive" });
      return;
    }

    const w = parseInt(width) || 800;
    const h = parseInt(height) || 600;

    if (w < 1 || h < 1 || w > 10000 || h > 10000) {
      toast({ title: "Invalid dimensions", description: "Please enter valid dimensions (1-10000)", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const resized: ConvertedImage[] = [];
      
      for (const uploadedFile of files) {
        const result = await resizeImage(uploadedFile.file, w, h, maintainAspect);
        resized.push(result);
      }

      setResults(resized);
      toast({ title: "Resize complete!", description: `${resized.length} image(s) resized successfully` });
    } catch (error) {
      toast({ title: "Resize failed", description: "An error occurred during resizing", variant: "destructive" });
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
      icon={Image}
      title="Image Resizer"
      description="Resize images to specific dimensions with aspect ratio control"
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
          <h2 className="font-semibold mb-4">Resize Options</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min={1}
                max={10000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min={1}
                max={10000}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="aspect-ratio">Maintain Aspect Ratio</Label>
              <p className="text-sm text-muted-foreground">Keep original proportions</p>
            </div>
            <Switch
              id="aspect-ratio"
              checked={maintainAspect}
              onCheckedChange={setMaintainAspect}
            />
          </div>

          <Button 
            onClick={handleResize} 
            disabled={files.length === 0 || isProcessing}
            className="mt-6 w-full gradient-primary shadow-primary"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resizing...
              </>
            ) : (
              `Resize ${files.length} Image${files.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Resized Images</h2>
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
                      {formatFileSize(result.newSize)}
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

export default ImageResizer;
