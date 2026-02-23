import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-10 sm:py-12">
      <div className="container px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary transition-transform duration-300 group-hover:scale-110 shrink-0">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground leading-tight">
                  ENLIVENAI
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider -mt-0.5">
                  Tools Kit
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Free online file conversion tools. Convert images, documents, PDFs, and media files
              securely in your browser. No registration required.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#image-tools" className="text-muted-foreground hover:text-primary transition-colors">Image Tools</a></li>
              <li><a href="#document-tools" className="text-muted-foreground hover:text-primary transition-colors">Document Tools</a></li>
              <li><a href="#pdf-ppt-tools" className="text-muted-foreground hover:text-primary transition-colors">PDF & PPT Tools</a></li>
              <li><a href="#video-audio-tools" className="text-muted-foreground hover:text-primary transition-colors">Video & Audio</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} ENLIVENAI Tools Kit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
