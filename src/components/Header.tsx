import { useState } from "react";
import { Search, Menu, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary transition-transform duration-300 group-hover:scale-110 shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-foreground leading-tight whitespace-nowrap">
              ENLIVENAI
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider -mt-0.5 whitespace-nowrap">
              Tools Kit
            </span>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="w-full pl-10 bg-secondary border-0 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#image-tools" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap">
            Image
          </a>
          <a href="#document-tools" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap">
            Document
          </a>
          <a href="#pdf-ppt-tools" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap">
            PDF & PPT
          </a>
          <a href="#video-audio-tools" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap">
            Video & Audio
          </a>
          <Link to="/smart-convert">
            <Button size="sm" className="gradient-primary shadow-primary hover:opacity-90 transition-all duration-300 hover:scale-105 whitespace-nowrap">
              <Sparkles className="mr-1 h-3 w-3" />
              Smart Convert
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-card md:hidden animate-fade-in">
          <div className="container px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tools..."
                className="w-full pl-10 bg-secondary border-0"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <nav className="flex flex-col gap-1">
              <a href="#image-tools" className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Image Tools
              </a>
              <a href="#document-tools" className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Document Tools
              </a>
              <a href="#pdf-ppt-tools" className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                PDF & PPT Tools
              </a>
              <a href="#video-audio-tools" className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Video & Audio Tools
              </a>
              <Link
                to="/smart-convert"
                className="px-3 py-2.5 text-sm font-medium rounded-md gradient-primary text-primary-foreground text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="inline mr-1 h-3 w-3" />
                Smart Convert
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
