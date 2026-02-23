 import { useState } from "react";
 import { Video, Music, Download, Loader2 } from "lucide-react";
 import { useLocation } from "react-router-dom";
import ToolLayout from "@/components/ToolLayout";
 import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import {
   convertVideo,
   extractAudio,
   convertAudio,
   downloadAndSave,
  getFilenameFromUrl,
   ApiResponse,
 } from "@/lib/apiUtils";
 import { useToast } from "@/hooks/use-toast";

 interface ToolConfig {
   title: string;
   description: string;
   icon: typeof Video;
   accept: string;
   formats: string[];
   defaultFormat: string;
   converter: (file: File, format: string) => Promise<ApiResponse>;
 }
 
 const toolInfo: Record<string, ToolConfig> = {
   "video-convert": {
     title: "Video Converter",
     description: "Convert videos between MP4, AVI, MKV, MOV, and WEBM",
     icon: Video,
     accept: "video/*,.mp4,.avi,.mkv,.mov,.webm",
     formats: ["mp4", "avi", "mkv", "mov", "webm"],
     defaultFormat: "mp4",
     converter: convertVideo,
   },
   "audio-extract": {
     title: "Extract Audio",
     description: "Extract audio tracks from video files",
     icon: Music,
     accept: "video/*,.mp4,.avi,.mkv,.mov,.webm",
     formats: ["mp3", "wav", "aac", "flac"],
     defaultFormat: "mp3",
     converter: extractAudio,
   },
   "audio-convert": {
     title: "Audio Converter",
     description: "Convert audio files between different formats",
     icon: Music,
     accept: "audio/*,.mp3,.wav,.aac,.flac,.ogg,.m4a",
     formats: ["mp3", "wav", "aac", "flac", "ogg"],
     defaultFormat: "mp3",
     converter: convertAudio,
   },
};

 interface ProcessedFile {
  downloadUrl: string;
   originalName: string;
 }
 
const VideoAudioConverter = () => {
  const seoMap: Record<string, any> = {
    "video-convert": SEO_PAGES.videoConverter,
    "audio-extract": SEO_PAGES.audioExtract,
    "audio-convert": SEO_PAGES.audioConverter,
  };
  const seo = seoMap[toolId] || SEO_PAGES.videoConverter;
  const location = useLocation();
  const toolId = location.pathname.split("/").pop() || "video-convert";
   const config = toolInfo[toolId] || toolInfo["video-convert"];
   const Icon = config.icon;
 
   const [files, setFiles] = useState<UploadedFile[]>([]);
   const [outputFormat, setOutputFormat] = useState(config.defaultFormat);
   const [isProcessing, setIsProcessing] = useState(false);
   const [results, setResults] = useState<ProcessedFile[]>([]);
   const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
   const { toast } = useToast();
 
   const handleConvert = async () => {
     if (files.length === 0) {
       toast({
         title: "No files selected",
         description: "Please upload files to convert",
         variant: "destructive",
       });
       return;
     }
 
     setIsProcessing(true);
     setResults([]);
 
     try {
       const processed: ProcessedFile[] = [];
 
       for (const file of files) {
         const response = await config.converter(file.file, outputFormat);
        if (response.success && response.download_url) {
           processed.push({
            downloadUrl: response.download_url,
             originalName: file.file.name,
           });
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
      await downloadAndSave(result.downloadUrl);
      toast({ title: "Downloaded!", description: getFilenameFromUrl(result.downloadUrl) });
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
      category="video"
    >
      <div className="space-y-8">
         {/* Upload Section */}
         <div className="rounded-xl border bg-card p-4 sm:p-6">
           <h2 className="font-semibold mb-4">Upload Files</h2>
           <FileUpload
             accept={config.accept}
             files={files}
             onFilesChange={setFiles}
             category="video"
             maxFiles={5}
           />
         </div>
 
         {/* Format Selection */}
         <div className="rounded-xl border bg-card p-4 sm:p-6">
           <h2 className="font-semibold mb-4">Output Format</h2>
           <Select value={outputFormat} onValueChange={setOutputFormat}>
             <SelectTrigger className="w-full max-w-xs">
               <SelectValue placeholder="Select format" />
             </SelectTrigger>
             <SelectContent>
               {config.formats.map((format) => (
                 <SelectItem key={format} value={format}>
                   {format.toUpperCase()}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
 
         {/* Action Button */}
         <Button
           onClick={handleConvert}
           disabled={files.length === 0 || isProcessing}
           className="w-full bg-category-video hover:bg-category-video/90"
           size="lg"
         >
           {isProcessing ? (
             <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Processing...
             </>
           ) : (
             `Convert ${files.length} File${files.length !== 1 ? "s" : ""} → ${outputFormat.toUpperCase()}`
           )}
         </Button>
 
         {/* Results Section */}
         {results.length > 0 && (
           <div className="rounded-xl border bg-card p-4 sm:p-6">
             <h2 className="font-semibold mb-4">Converted Files</h2>
             <div className="space-y-3">
               {results.map((result, index) => (
                 <div
                   key={index}
                   className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-lg border bg-secondary/50 p-3 sm:p-4"
                 >
                   <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-category-video/10">
                     <Icon className="h-6 w-6 text-category-video" />
                   </div>
                   <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <p className="truncate font-medium">{getFilenameFromUrl(result.downloadUrl)}</p>
                     <p className="text-sm text-muted-foreground">
                       From: {result.originalName}
                     </p>
                   </div>
                   <Button
                     onClick={() => handleDownload(result, index)}
                     disabled={downloadingIndex === index}
                     className="bg-category-video hover:bg-category-video/90 shrink-0 w-full sm:w-auto"
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
         <div className="rounded-lg border border-category-video/20 bg-category-video/5 p-4">
           <p className="text-sm text-muted-foreground">
             <strong className="text-foreground">Note:</strong> Large files may take longer to
             process. Files are automatically deleted from the server after conversion.
           </p>
         </div>
      </div>
    </ToolLayout>
    </>
  );
};

export default VideoAudioConverter;
