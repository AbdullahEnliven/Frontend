import { ArrowDown, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-12 md:py-24">
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-radial from-primary/5 to-transparent blur-2xl" />
      </div>

      <div className="container relative px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Free Online File Conversion Tools</span>
          </div>

          <h1 className="animate-fade-in text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl break-words">
            <span className="text-gradient">ENLIVENAI</span>{" "}
            <span className="text-foreground">Tools Kit</span>
          </h1>

          <p className="mt-6 animate-fade-in text-base text-muted-foreground md:text-xl max-w-2xl mx-auto px-2" style={{ animationDelay: "0.1s" }}>
            Convert, compress, and transform your files instantly.
            Images, documents, PDFs, videos — all processed securely in your browser.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in px-4" style={{ animationDelay: "0.2s" }}>
            <Link to="/smart-convert" className="w-full sm:w-auto">
              <Button size="lg" className="gradient-primary shadow-primary hover:opacity-90 transition-all duration-300 hover:scale-105 gap-2 w-full sm:w-auto">
                <Sparkles className="h-4 w-4" />
                Smart Convert
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto" asChild>
              <a href="#image-tools">
                Browse All Tools
                <ArrowDown className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Features */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in px-0" style={{ animationDelay: "0.3s" }}>
            <div className="rounded-xl bg-card/50 backdrop-blur-sm p-3 sm:p-4 shadow-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 text-primary mx-auto mb-2">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">25+</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Tools Available</div>
            </div>
            <div className="rounded-xl bg-card/50 backdrop-blur-sm p-3 sm:p-4 shadow-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 text-primary mx-auto mb-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">100%</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Secure & Private</div>
            </div>
            <div className="rounded-xl bg-card/50 backdrop-blur-sm p-3 sm:p-4 shadow-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 text-primary mx-auto mb-2">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">Free</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-tight">No Sign Up</div>
            </div>
            <div className="rounded-xl bg-card/50 backdrop-blur-sm p-3 sm:p-4 shadow-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 text-primary mx-auto mb-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">AI</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Powered Tools</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
