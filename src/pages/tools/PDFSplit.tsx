import { useState, useEffect } from "react";
import { Scissors, Download, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUpload, { UploadedFile } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { splitPDF, getPDFPageCount, ProcessedPDF } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";

const PDFSplit = () => {
  const seo = SEO_PAGES.pdfSplit;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [startPage, setStartPage] = useState<string>("1");
  const [endPage, setEndPage] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedPDF | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPageCount = async () => {
      if (files.length > 0) {
        try {
          const count = await getPDFPageCount(files[0].file);
          setPageCount(count);
          setEndPage(count.toString());
        } catch (error) {
          setPageCount(0);
        }
      } else {
        setPageCount(0);
      }
    };
    loadPageCount();
  }, [files]);

  const handleSplit = async () => {
    if (files.length === 0) {
      toast({ title: "No file selected", description: "Please upload a PDF file", variant: "destructive" });
      return;
    }

    const start = parseInt(startPage);
    const end = parseInt(endPage);

    if (start < 1 || end < 1 || start > pageCount || end > pageCount || start > end) {
      toast({ title: "Invalid page range", description: `Please enter a valid range (1-${pageCount})`, variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const split = await splitPDF(files[0].file, start, end);
      setResult(split);
      toast({ title: "Split complete!", description: `Extracted pages ${start}-${end}` });
    } catch (error) {
      toast({ title: "Split failed", description: "An error occurred while splitting PDF", variant: "destructive" });
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
      icon={Scissors}
      title="Split PDF"
      description="Split PDF by page range into separate files"
      category="pdf"
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Upload PDF File</h2>
          <FileUpload
            accept="application/pdf"
            files={files}
            onFilesChange={(f) => setFiles(f.slice(0, 1))}
            category="pdf"
            maxFiles={1}
            multiple={false}
          />
        </div>

        {/* Options Section */}
        {pageCount > 0 && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <h2 className="font-semibold mb-4">Page Range</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This PDF has {pageCount} page{pageCount !== 1 ? "s" : ""}. Select the range to extract.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start">Start Page</Label>
                <Input
                  id="start"
                  type="number"
                  value={startPage}
                  onChange={(e) => setStartPage(e.target.value)}
                  min={1}
                  max={pageCount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Page</Label>
                <Input
                  id="end"
                  type="number"
                  value={endPage}
                  onChange={(e) => setEndPage(e.target.value)}
                  min={1}
                  max={pageCount}
                />
              </div>
            </div>

            <Button 
              onClick={handleSplit} 
              disabled={isProcessing}
              className="mt-6 w-full gradient-primary shadow-primary"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Splitting PDF...
                </>
              ) : (
                `Extract Pages ${startPage} to ${endPage}`
              )}
            </Button>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <h2 className="font-semibold mb-4">Split PDF</h2>
            <div className="flex items-center gap-4 rounded-lg border bg-secondary/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-category-pdf/10">
                <Scissors className="h-6 w-6 text-category-pdf" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{result.name}</p>
                <p className="text-sm text-muted-foreground">
                  {result.pageCount} page{result.pageCount !== 1 ? "s" : ""} • {formatFileSize(result.newSize)}
                </p>
              </div>
              <Button onClick={downloadResult} className="gradient-primary">
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

export default PDFSplit;
