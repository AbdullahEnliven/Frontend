import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import SmartConvert from "./pages/SmartConvert";
import NotFound from "./pages/NotFound";

// Tool Pages
import ImageConverter from "./pages/tools/ImageConverter";
import ImageCompressor from "./pages/tools/ImageCompressor";
import ImageResizer from "./pages/tools/ImageResizer";
import BackgroundRemover from "./pages/tools/BackgroundRemover";
import ImageToSVGConverter from "./pages/tools/ImageToSVGConverter";  // NEW
import PDFMerge from "./pages/tools/PDFMerge";
import PDFSplit from "./pages/tools/PDFSplit";
import PDFCompress from "./pages/tools/PDFCompress";
import PDFExtract from "./pages/tools/PDFExtract";
import DocumentConverter from "./pages/tools/DocumentConverter";
import VideoAudioConverter from "./pages/tools/VideoAudioConverter";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/smart-convert" element={<SmartConvert />} />
            
            {/* Image Tools */}
            <Route path="/tools/image-convert" element={<ImageConverter />} />
            <Route path="/tools/image-compress" element={<ImageCompressor />} />
            <Route path="/tools/image-resize" element={<ImageResizer />} />
            <Route path="/tools/bg-remove" element={<BackgroundRemover />} />
            <Route path="/tools/image-to-svg" element={<ImageToSVGConverter />} /> {/* NEW */}
            
            {/* PDF & PPT Tools */}
            <Route path="/tools/pdf-merge" element={<PDFMerge />} />
            <Route path="/tools/pdf-split" element={<PDFSplit />} />
            <Route path="/tools/pdf-compress" element={<PDFCompress />} />
            <Route path="/tools/pdf-extract-images" element={<PDFExtract />} />
            <Route path="/tools/pdf-extract-text" element={<PDFExtract />} />
            <Route path="/tools/ppt-to-images" element={<DocumentConverter />} />
            
            {/* Document Tools */}
            <Route path="/tools/pdf-to-word" element={<DocumentConverter />} />
            <Route path="/tools/word-to-pdf" element={<DocumentConverter />} />
            <Route path="/tools/ppt-to-pdf" element={<DocumentConverter />} />
            <Route path="/tools/excel-to-pdf" element={<DocumentConverter />} />
            
            {/* Video & Audio Tools */}
            <Route path="/tools/video-convert" element={<VideoAudioConverter />} />
            <Route path="/tools/audio-extract" element={<VideoAudioConverter />} />
            <Route path="/tools/audio-convert" element={<VideoAudioConverter />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;