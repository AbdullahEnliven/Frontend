import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolSectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  category: "image" | "document" | "pdf" | "video" | "audio";
  children: ReactNode;
}

const categoryBadgeStyles = {
  image: "bg-category-image/10 text-category-image",
  document: "bg-category-document/10 text-category-document",
  pdf: "bg-category-pdf/10 text-category-pdf",
  video: "bg-category-video/10 text-category-video",
  audio: "bg-category-audio/10 text-category-audio",
};

const ToolSection = ({ id, icon: Icon, title, description, category, children }: ToolSectionProps) => {
  return (
    <section id={id} className="scroll-mt-20 py-16">
      <div className="container">
        <div className="flex items-center gap-3 mb-3 animate-fade-in">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-110",
            categoryBadgeStyles[category]
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-display">{title}</h2>
          </div>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {description}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {children}
        </div>
      </div>
    </section>
  );
};

export default ToolSection;