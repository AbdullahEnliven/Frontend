import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Image, FileText, FileType2, Video } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ToolSection from "@/components/ToolSection";
import ToolCard from "@/components/ToolCard";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { SEO_PAGES } from "@/config/seo";
import { imageTools, documentTools, pdfPptTools, videoAudioTools, allTools } from "@/data/tools";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const seo = SEO_PAGES.home;

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return allTools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((keyword) => keyword.includes(query))
    );
  }, [searchQuery]);

  const handleToolClick = (toolId: string) => {
    navigate(`/tools/${toolId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={seo.canonical}
        structuredData={seo.structuredData}
      />

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main>
        <Hero />

        {filteredTools && (
          <section className="py-12 border-b">
            <div className="container">
              <h2 className="text-xl font-semibold mb-6">
                Search Results{" "}
                <span className="text-muted-foreground font-normal">
                  ({filteredTools.length} tools found)
                </span>
              </h2>
              {filteredTools.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      icon={tool.icon}
                      title={tool.title}
                      description={tool.description}
                      category={tool.category}
                      onClick={() => handleToolClick(tool.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No tools found for "{searchQuery}". Try a different search term.
                </p>
              )}
            </div>
          </section>
        )}

        {!filteredTools && (
          <>
            <ToolSection
              id="image-tools"
              icon={Image}
              title="Image Tools"
              description="Convert, compress, resize, and edit your images with powerful browser-based tools."
              category="image"
            >
              {imageTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  category={tool.category}
                  onClick={() => handleToolClick(tool.id)}
                />
              ))}
            </ToolSection>

            <div className="border-t" />

            <ToolSection
              id="document-tools"
              icon={FileText}
              title="Document Tools"
              description="Convert documents between Word, PDF, Excel, and PowerPoint formats."
              category="document"
            >
              {documentTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  category={tool.category}
                  onClick={() => handleToolClick(tool.id)}
                />
              ))}
            </ToolSection>

            <div className="border-t" />

            <ToolSection
              id="pdf-ppt-tools"
              icon={FileType2}
              title="PDF & PPT Tools"
              description="Extract, split, merge, compress PDFs and export PowerPoint slides as images."
              category="pdf"
            >
              {pdfPptTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  category={tool.category}
                  onClick={() => handleToolClick(tool.id)}
                />
              ))}
            </ToolSection>

            <div className="border-t" />

            <ToolSection
              id="video-audio-tools"
              icon={Video}
              title="Video & Audio Tools"
              description="Convert video formats and extract audio from your media files."
              category="video"
            >
              {videoAudioTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  category={tool.category}
                  onClick={() => handleToolClick(tool.id)}
                />
              ))}
            </ToolSection>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
