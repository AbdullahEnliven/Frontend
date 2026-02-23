import { ReactNode } from "react";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  category: "image" | "document" | "pdf" | "video" | "audio";
  children: ReactNode;
}

const categoryStyles = {
  image: "bg-category-image/10 text-category-image",
  document: "bg-category-document/10 text-category-document",
  pdf: "bg-category-pdf/10 text-category-pdf",
  video: "bg-category-video/10 text-category-video",
  audio: "bg-category-audio/10 text-category-audio",
};

const ToolLayout = ({ icon: Icon, title, description, category, children }: ToolLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center gap-3 px-4 sm:px-6">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", categoryStyles[category])}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-foreground truncate">{title}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block truncate">{description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-6 sm:py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
};

export default ToolLayout;
