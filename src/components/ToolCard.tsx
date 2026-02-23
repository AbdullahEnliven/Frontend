import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  category: "image" | "document" | "pdf" | "video" | "audio";
  onClick?: () => void;
}

const categoryStyles = {
  image: "hover:border-category-image/50 group-hover:bg-category-image",
  document: "hover:border-category-document/50 group-hover:bg-category-document",
  pdf: "hover:border-category-pdf/50 group-hover:bg-category-pdf",
  video: "hover:border-category-video/50 group-hover:bg-category-video",
  audio: "hover:border-category-audio/50 group-hover:bg-category-audio",
};

const iconContainerStyles = {
  image: "bg-category-image/10 text-category-image group-hover:bg-category-image group-hover:text-primary-foreground",
  document: "bg-category-document/10 text-category-document group-hover:bg-category-document group-hover:text-primary-foreground",
  pdf: "bg-category-pdf/10 text-category-pdf group-hover:bg-category-pdf group-hover:text-primary-foreground",
  video: "bg-category-video/10 text-category-video group-hover:bg-category-video group-hover:text-primary-foreground",
  audio: "bg-category-audio/10 text-category-audio group-hover:bg-category-audio group-hover:text-primary-foreground",
};

const ToolCard = ({ icon: Icon, title, description, category, onClick }: ToolCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-3 rounded-xl border bg-card p-5 text-left shadow-card",
        "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        categoryStyles[category]
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-300",
          iconContainerStyles[category]
        )}
      >
        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
      
      {/* Hover arrow indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default ToolCard;
