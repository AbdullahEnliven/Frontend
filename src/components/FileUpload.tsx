import { useCallback, useState } from "react";
import { Upload, X, FileIcon, ImageIcon, FileText, Video, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface UploadedFile {
  file: File;
  preview?: string;
  id: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesChange: (files: UploadedFile[]) => void;
  files: UploadedFile[];
  category?: "image" | "document" | "pdf" | "video" | "audio";
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  if (type.includes("pdf")) return FileText;
  return FileIcon;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileUpload = ({
  accept = "*",
  multiple = true,
  maxFiles = 10,
  maxSize = 50,
  onFilesChange,
  files,
  category = "image",
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const validFiles: UploadedFile[] = [];
      const maxSizeBytes = maxSize * 1024 * 1024;

      Array.from(newFiles).forEach((file) => {
        if (file.size > maxSizeBytes) {
          console.warn(`File ${file.name} exceeds ${maxSize}MB limit`);
          return;
        }

        const uploadedFile: UploadedFile = {
          file,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        if (file.type.startsWith("image/")) {
          uploadedFile.preview = URL.createObjectURL(file);
        }

        validFiles.push(uploadedFile);
      });

      const totalFiles = [...files, ...validFiles].slice(0, maxFiles);
      onFilesChange(totalFiles);
    },
    [files, maxFiles, maxSize, onFilesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      onFilesChange(files.filter((f) => f.id !== id));
    },
    [files, onFilesChange]
  );

  const clearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    onFilesChange([]);
  }, [files, onFilesChange]);

  const categoryStyles = {
    image: "border-category-image/30 hover:border-category-image/50",
    document: "border-category-document/30 hover:border-category-document/50",
    pdf: "border-category-pdf/30 hover:border-category-pdf/50",
    video: "border-category-video/30 hover:border-category-video/50",
    audio: "border-category-audio/30 hover:border-category-audio/50",
  };

  const dragStyles = {
    image: "border-category-image bg-category-image/5",
    document: "border-category-document bg-category-document/5",
    pdf: "border-category-pdf bg-category-pdf/5",
    video: "border-category-video bg-category-video/5",
    audio: "border-category-audio bg-category-audio/5",
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 sm:p-8 transition-all duration-200 cursor-pointer",
          categoryStyles[category],
          isDragging && dragStyles[category]
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-secondary">
            <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm sm:text-base">
              Drop files here or <span className="text-primary">browse</span>
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {multiple ? `Up to ${maxFiles} files` : "Single file"}, max {maxSize}MB each
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 min-w-0">
            {files.map((uploadedFile) => {
              const Icon = getFileIcon(uploadedFile.file.type);
              return (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-2 sm:gap-3 rounded-lg border bg-card p-2.5 sm:p-3 min-w-0 overflow-hidden"
                >
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-md bg-secondary shrink-0">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="truncate text-xs sm:text-sm font-medium w-full">{uploadedFile.file.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(uploadedFile.id);
                    }}
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
