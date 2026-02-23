 import { useState } from "react";
 import { FileText, FileImage, Download, Loader2 } from "lucide-react";
 import { useLocation } from "react-router-dom";
import ToolLayout from "@/components/ToolLayout";
 import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";
 import {
   extractPdfImages,
   convertPdfToTxt,
   downloadAndSave,
  getFilenameFromUrl,
   ApiResponse,
 } from "@/lib/apiUtils";
 import { useToast } from "@/hooks/use-toast";

 interface ToolConfig {
   title: string;
   description: string;
   converter: (file: File) => Promise<ApiResponse>;
 }
 
 const toolInfo: Record<string, ToolConfig> = {
   "pdf-extract-images": {
     title: "Extract Images from PDF",
     description: "Extract all images from PDF documents",
     converter: extractPdfImages,
   },
   "pdf-extract-text": {
     title: "Extract Text from PDF",
     description: "Extract text content from PDF files",
     converter: convertPdfToTxt,
   },
};

 interface ProcessedFile {
  downloadUrl: string;
   originalName: string;
 }
 
const PDFExtract = () => {
  const seo = SEO_PAGES.pdfExtract;
  const location = useLocation();
  const toolId = location.pathname.split("/").pop() || "pdf-extract-images";
   const config = toolInfo[toolId] || toolInfo["pdf-extract-images"];
  const isImageExtract = toolId === "pdf-extract-images";

   const [files, setFiles] = useState<UploadedFile[]>([]);
   const [isProcessing, setIsProcessing] = useState(false);
   const [results, setResults] = useState<ProcessedFile[]>([]);
   const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
   const { toast } = useToast();
 
   const handleExtract = async () => {
     if (files.length === 0) {
       toast({
         title: "No files selected",
         description: "Please upload PDF files to extract from",
         variant: "destructive",
       });
       return;
     }
 
     setIsProcessing(true);
     setResults([]);
 
     try {
       const processed: ProcessedFile[] = [];
 
       for (const file of files) {
         const response = await config.converter(file.file);
        if (response.success) {
          // Handle multiple files (for image extraction - multiple download URLs)
          if (response.download_urls && response.download_urls.length > 0) {
            for (const downloadUrl of response.download_urls) {
               processed.push({
                downloadUrl,
                 originalName: file.file.name,
               });
             }
          } else if (response.download_url) {
             processed.push({
              downloadUrl: response.download_url,
               originalName: file.file.name,
             });
           }
         }
       }
 
       setResults(processed);
       toast({
         title: "Extraction complete!",
         description: `Extracted ${processed.length} file${processed.length !== 1 ? "s" : ""}`,
       });
     } catch (error) {
       toast({
         title: "Extraction failed",
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
      icon={isImageExtract ? FileImage : FileText}
       title={config.title}
       description={config.description}
      category="pdf"
    >
      <div className="space-y-8">
         {/* Upload Section */}
         <div className="rounded-xl border bg-card p-4 sm:p-6">
           <h2 className="font-semibold mb-4">Upload PDF Files</h2>
           <FileUpload
             accept=".pdf,application/pdf"
             files={files}
             onFilesChange={setFiles}
             category="pdf"
             maxFiles={10}
           />
        </div>

         {/* Action Button */}
         <Button
           onClick={handleExtract}
           disabled={files.length === 0 || isProcessing}
           className="w-full bg-category-pdf hover:bg-category-pdf/90"
           size="lg"
         >
           {isProcessing ? (
             <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Extracting...
             </>
           ) : (
             `Extract from ${files.length} PDF${files.length !== 1 ? "s" : ""}`
           )}
         </Button>
 
         {/* Results Section */}
         {results.length > 0 && (
           <div className="rounded-xl border bg-card p-4 sm:p-6">
             <h2 className="font-semibold mb-4">Extracted Files</h2>
             <div className="space-y-3">
               {results.map((result, index) => (
                 <div
                   key={index}
                   className="flex items-center gap-4 rounded-lg border bg-secondary/50 p-4"
                 >
                   <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-category-pdf/10">
                     {isImageExtract ? (
                       <FileImage className="h-6 w-6 text-category-pdf" />
                     ) : (
                       <FileText className="h-6 w-6 text-category-pdf" />
                     )}
                   </div>
                   <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{getFilenameFromUrl(result.downloadUrl)}</p>
                     <p className="text-sm text-muted-foreground">
                       From: {result.originalName}
                     </p>
                   </div>
                   <Button
                     onClick={() => handleDownload(result, index)}
                     disabled={downloadingIndex === index}
                     className="bg-category-pdf hover:bg-category-pdf/90"
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
         <div className="rounded-lg border border-category-pdf/20 bg-category-pdf/5 p-4">
           <p className="text-sm text-muted-foreground">
             <strong className="text-foreground">Note:</strong>{" "}
             {isImageExtract
               ? "All embedded images will be extracted and provided as separate files."
               : "Text will be extracted preserving the document structure where possible."}
           </p>
         </div>
      </div>
    </ToolLayout>
    </>
  );
};

export default PDFExtract;
