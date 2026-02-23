import { useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import { Sparkles, Download, Loader2, AlertCircle } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";


interface ConversionResult {
  success: boolean;
  output_filename: string;
  download_url: string;
  session_id: string;
  input_size?: number;
  output_size?: number;
}

const ImageToSVGConverter = () => {
  const seo = SEO_PAGES.imageToSVG;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({ 
        title: "No files selected", 
        description: "Please upload images to convert to SVG", 
        variant: "destructive" 
      });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const converted: ConversionResult[] = [];
      
      for (const uploadedFile of files) {
        const formData = new FormData();
        formData.append("file", uploadedFile.file);

        const response = await fetch(API_ENDPOINTS.imageToSvg, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          converted.push(result);
        } else {
          toast({
            title: "Conversion failed",
            description: result.error || "An error occurred",
            variant: "destructive",
          });
        }
      }

      setResults(converted);
      
      if (converted.length > 0) {
        toast({ 
          title: "Conversion complete!", 
          description: `${converted.length} image(s) converted to SVG successfully` 
        });
      }
    } catch (error) {
      toast({ 
        title: "Conversion failed", 
        description: "Network error or server unavailable", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (result: ConversionResult) => {
    const downloadUrl = `${API_BASE_URL}${result.download_url}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = result.output_filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      icon={Sparkles}
      title="Image to SVG Converter"
      description="Convert images to high-quality black & white vector graphics"
      category="image"
    >
      <div className="space-y-8">
        {/* Info Alert */}
        <Alert className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <AlertCircle className="h-4 w-4 text-purple-400" />
          <AlertDescription className="text-sm">
            <strong>Vector Conversion:</strong> This tool traces your raster images and converts them to scalable SVG format.
            Best results with simple graphics, logos, and icons. Complex photos may produce large SVG files.
          </AlertDescription>
        </Alert>

        {/* Upload Section */}
        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="font-semibold mb-4 text-white">Upload Images</h2>
          <FileUpload
            accept="image/*"
            files={files}
            onFilesChange={setFiles}
            category="image"
            maxFiles={10}
          />
        </div>

        {/* Convert Button */}
        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm">
          <Button 
            onClick={handleConvert} 
            disabled={files.length === 0 || isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 shadow-lg shadow-purple-500/30 transition-all duration-300"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Converting to SVG...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Convert {files.length} Image{files.length !== 1 ? "s" : ""} to SVG
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Converted SVG Files</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 rounded-lg border border-purple-500/20 bg-slate-800/50 p-4 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                    <Sparkles className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white">{result.output_filename}</p>
                    {result.input_size && result.output_size && (
                      <p className="text-xs text-slate-400">
                        {formatFileSize(result.input_size)} → {formatFileSize(result.output_size)}
                      </p>
                    )}
                    <p className="text-xs text-purple-400 mt-1">Vector format (scalable)</p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDownload(result)}
                    className="hover:bg-purple-500/20"
                  >
                    <Download className="h-4 w-4 text-purple-400" />
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

export default ImageToSVGConverter;