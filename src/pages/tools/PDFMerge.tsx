import { useState } from "react";
import { Combine, Download, Loader2, GripVertical } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { mergePDFs, ProcessedPDF } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

const PDFMerge = () => {
  const seo = SEO_PAGES.pdfMerge;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedPDF | null>(null);
  const { toast } = useToast();

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({ title: "Need more files", description: "Please upload at least 2 PDF files to merge", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const merged = await mergePDFs(files.map(f => f.file));
      setResult(merged);
      toast({ title: "Merge complete!", description: `Created PDF with ${merged.pageCount} pages` });
    } catch (error) {
      toast({ title: "Merge failed", description: "An error occurred while merging PDFs", variant: "destructive" });
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

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
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
      icon={Combine}
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
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
            maxFiles={20}
          />
        </div>

        {/* File Order Section */}
        {files.length > 1 && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <h2 className="font-semibold mb-4">File Order</h2>
            <p className="text-sm text-muted-foreground mb-4">Drag to reorder or use arrows. Files will be merged in this order.</p>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={file.id} className="flex items-center gap-3 rounded-lg border bg-secondary/50 p-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="flex-1 truncate text-sm">{file.file.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleMerge} 
          disabled={files.length < 2 || isProcessing}
          className="w-full gradient-primary shadow-primary"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Merging PDFs...
            </>
          ) : (
            `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}`
          )}
        </Button>

        {/* Result Section */}
        {result && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <h2 className="font-semibold mb-4">Merged PDF</h2>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-lg border bg-secondary/50 p-3 sm:p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-category-pdf/10">
                <Combine className="h-6 w-6 text-category-pdf" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{result.name}</p>
                <p className="text-sm text-muted-foreground">
                  {result.pageCount} pages • {formatFileSize(result.newSize)}
                </p>
              </div>
              <Button onClick={downloadResult} className="gradient-primary shrink-0 w-full sm:w-auto" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
    </>
  );
};

export default PDFMerge;
