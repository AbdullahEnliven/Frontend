// ============================================================
// ENLIVENAI Tools Kit — Central SEO Configuration
// All page titles, descriptions, keywords, and structured data
// ============================================================

const BASE_URL = "https://YOUR_DOMAIN";
const SITE_NAME = "ENLIVENAI Tools Kit";
const CURRENT_DATE = "2026-02-19";

// ── Reusable schema builders ─────────────────────────────────

export const buildWebAppSchema = (
  name: string,
  description: string,
  url: string,
  keywords: string[]
) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name,
  url: `${BASE_URL}${url}`,
  description,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: { "@type": "Organization", name: "ENLIVENAI", url: BASE_URL },
  keywords: keywords.join(", "),
  dateModified: CURRENT_DATE,
});

export const buildBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.url}`,
  })),
});

export const buildFAQSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
});

export const buildHowToSchema = (
  name: string,
  description: string,
  steps: { name: string; text: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name,
  description,
  step: steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
});

// ── Per-page SEO configs ──────────────────────────────────────

export const SEO_PAGES = {

  // ── Home ───────────────────────────────────────────────────
  home: {
    title: "ENLIVENAI Tools Kit – Free Online File Converter | Image, PDF, Video & Document Tools",
    description:
      "Free online tools to convert, compress, resize, and edit images, PDFs, documents, videos, and audio. No signup needed. Works in browser. Fast, secure, and 100% free — powered by ENLIVENAI.",
    keywords: [
      "free online file converter", "image converter", "pdf converter", "document converter",
      "video converter", "audio converter", "compress image", "resize image", "merge pdf",
      "split pdf", "background remover", "image to svg", "jpg to png", "png to jpg",
      "webp converter", "pdf to word", "word to pdf", "ppt to pdf", "excel to pdf",
      "convert files online", "online tools", "file conversion tool", "no signup",
      "free tools", "image compressor", "remove background", "bg remover",
      "ENLIVENAI tools", "enlivenai", "AI file converter", "smart convert",
    ].join(", "),
    canonical: "/",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: BASE_URL,
        description:
          "Free online file conversion tools — convert images, PDFs, documents, videos, and audio instantly in your browser.",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/?search={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
        publisher: { "@type": "Organization", name: "ENLIVENAI", url: BASE_URL },
        inLanguage: "en-US",
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ENLIVENAI",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description:
          "ENLIVENAI provides free AI-powered file conversion tools for images, PDFs, documents, and media files.",
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          availableLanguage: "English",
        },
      },
      buildFAQSchema([
        {
          q: "What is ENLIVENAI Tools Kit?",
          a: "ENLIVENAI Tools Kit is a free online platform offering 25+ tools to convert, compress, resize, and transform images, PDFs, documents, videos, and audio files. No signup or payment required.",
        },
        {
          q: "Is ENLIVENAI Tools Kit free?",
          a: "Yes, all tools are completely free. There is no subscription, no account, and no hidden fees.",
        },
        {
          q: "Is my data safe with ENLIVENAI?",
          a: "Yes. Many tools process files locally in your browser. For server-side tools, all uploaded files are automatically deleted immediately after conversion.",
        },
        {
          q: "What file formats does ENLIVENAI support?",
          a: "ENLIVENAI supports JPG, PNG, WEBP, BMP, GIF, SVG (images), PDF, DOCX, PPTX, XLSX (documents), MP4, AVI, MKV, MOV, WEBM (video), and MP3, WAV, AAC, FLAC (audio).",
        },
        {
          q: "Do I need to install anything?",
          a: "No. ENLIVENAI Tools Kit works entirely in your browser. No installation, no app, no plugin needed.",
        },
      ]),
    ],
  },

  // ── Smart Convert ──────────────────────────────────────────
  smartConvert: {
    title: "Smart Convert – Convert Any File Instantly | ENLIVENAI",
    description:
      "Convert any file in 3 easy steps. Select your source format, choose the target, upload and convert. Supports images, PDFs, Word, Excel, PowerPoint, video, and audio.",
    keywords: [
      "smart file converter", "convert any file", "universal file converter",
      "convert pdf to word", "convert image online", "convert video online",
      "automatic file converter", "AI file conversion", "quick file convert",
      "convert document online", "convert audio online", "smart convert tool",
    ].join(", "),
    canonical: "/smart-convert",
  },

  // ── Image Converter ────────────────────────────────────────
  imageConverter: {
    title: "Image Converter – Convert JPG, PNG, WEBP, BMP Online Free | ENLIVENAI",
    description:
      "Convert images between JPG, PNG, WEBP, BMP formats instantly online. Free, no signup, works in browser. Bulk convert up to 20 images at once. Fast and high-quality image format conversion.",
    keywords: [
      "image converter", "convert image online", "jpg to png", "png to jpg",
      "jpeg to png", "png to jpeg", "webp to jpg", "jpg to webp",
      "png to webp", "webp to png", "bmp to jpg", "jpg to bmp",
      "convert jpg online", "convert png online", "image format converter",
      "bulk image converter", "free image converter", "online image converter",
      "change image format", "image type converter", "photo converter",
      "picture format change", "convert photo format",
    ].join(", "),
    canonical: "/tools/image-convert",
    structuredData: [
      buildWebAppSchema(
        "Image Converter",
        "Convert images between JPG, PNG, WEBP and BMP formats online for free.",
        "/tools/image-convert",
        ["image converter", "jpg to png", "png to webp", "image format"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Image Tools", url: "/#image-tools" },
        { name: "Image Converter", url: "/tools/image-convert" },
      ]),
      buildHowToSchema(
        "How to Convert an Image Format Online",
        "Convert your image from JPG, PNG, WEBP, or BMP to any other format in seconds.",
        [
          { name: "Upload your image", text: "Click 'Browse' or drag and drop your image file (JPG, PNG, WEBP, BMP) into the upload area." },
          { name: "Select output format", text: "Choose your desired output format — JPG, PNG, WebP, or BMP — from the dropdown menu." },
          { name: "Convert and download", text: "Click Convert and download your converted image instantly. No signup needed." },
        ]
      ),
      buildFAQSchema([
        { q: "Can I convert JPG to PNG online for free?", a: "Yes. Use ENLIVENAI's free Image Converter to convert JPG to PNG instantly with no signup required." },
        { q: "Does converting JPG to PNG reduce quality?", a: "PNG is lossless, so converting JPG to PNG does not reduce quality. It may increase file size." },
        { q: "Can I convert multiple images at once?", a: "Yes, ENLIVENAI supports bulk image conversion — upload up to 20 images and convert them all at once." },
        { q: "What image formats are supported?", a: "JPG/JPEG, PNG, WebP, and BMP. Support for TIFF and HEIC coming soon." },
      ]),
    ],
  },

  // ── Image Compressor ───────────────────────────────────────
  imageCompressor: {
    title: "Image Compressor – Compress JPG, PNG, WEBP Online Free | ENLIVENAI",
    description:
      "Compress and reduce image file size online without losing quality. Free JPG, PNG, and WebP compressor. No upload limits, no signup. Reduce image size by up to 90% while keeping visual quality.",
    keywords: [
      "image compressor", "compress image online", "reduce image size",
      "compress jpg", "compress png", "compress webp", "image optimizer",
      "reduce photo size", "shrink image", "compress image without quality loss",
      "online image compressor", "free image compressor", "bulk image compressor",
      "compress image for web", "image size reducer", "photo compressor",
      "compress picture online", "optimize image", "reduce file size image",
      "image compression tool",
    ].join(", "),
    canonical: "/tools/image-compress",
    structuredData: [
      buildWebAppSchema(
        "Image Compressor",
        "Compress JPG, PNG and WebP images online for free without losing quality.",
        "/tools/image-compress",
        ["image compressor", "compress image", "reduce image size", "optimize image"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Image Tools", url: "/#image-tools" },
        { name: "Image Compressor", url: "/tools/image-compress" },
      ]),
      buildFAQSchema([
        { q: "How do I compress an image without losing quality?", a: "ENLIVENAI's Image Compressor uses smart compression algorithms to reduce file size while preserving visual quality. Set the quality slider to 80–90% for the best balance." },
        { q: "What is the maximum image size I can compress?", a: "You can compress images up to 50MB each. Bulk compress up to 10 images at once." },
        { q: "Will compressing reduce my image resolution?", a: "No. Compression only reduces file size data, not image dimensions or resolution unless you explicitly choose to resize." },
      ]),
    ],
  },

  // ── Image Resizer ──────────────────────────────────────────
  imageResizer: {
    title: "Image Resizer – Resize Images Online Free | Change Width & Height | ENLIVENAI",
    description:
      "Resize images to exact pixel dimensions online for free. Change width and height, maintain aspect ratio, bulk resize up to 20 images. No signup needed. Perfect for social media, websites, and more.",
    keywords: [
      "image resizer", "resize image online", "change image size", "resize photo",
      "image resize tool", "resize jpg online", "resize png online",
      "resize image to specific size", "crop image online", "image dimension changer",
      "resize image for instagram", "resize image for facebook", "resize image for twitter",
      "resize image for web", "bulk image resizer", "free image resizer",
      "change image dimensions", "scale image online", "image width height changer",
      "resize picture online",
    ].join(", "),
    canonical: "/tools/image-resize",
    structuredData: [
      buildWebAppSchema(
        "Image Resizer",
        "Resize images to specific dimensions online for free. Maintain aspect ratio or set custom width and height.",
        "/tools/image-resize",
        ["image resizer", "resize image", "change image dimensions"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Image Tools", url: "/#image-tools" },
        { name: "Image Resizer", url: "/tools/image-resize" },
      ]),
    ],
  },

  // ── Background Remover ─────────────────────────────────────
  backgroundRemover: {
    title: "Background Remover – Remove Image Background Free Online | ENLIVENAI",
    description:
      "Remove image background instantly online for free using AI. Get transparent PNG or choose a custom background color. No signup, no watermark. Perfect for product photos, profile pictures, and more.",
    keywords: [
      "background remover", "remove background", "background remove",
      "remove image background", "bg remover", "bg remove", "remove bg",
      "transparent background", "remove background from image",
      "background eraser", "photo background remover", "free background remover",
      "ai background remover", "online background remover", "cut out background",
      "transparent png maker", "remove white background", "product photo editor",
      "background changer", "photo cutout tool", "remove background free",
      "auto background remove", "instant background remover",
    ].join(", "),
    canonical: "/tools/bg-remove",
    structuredData: [
      buildWebAppSchema(
        "AI Background Remover",
        "Remove image backgrounds instantly using AI. Export as transparent PNG or add a custom color background.",
        "/tools/bg-remove",
        ["background remover", "remove background", "transparent png", "bg remove"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Image Tools", url: "/#image-tools" },
        { name: "Background Remover", url: "/tools/bg-remove" },
      ]),
      buildHowToSchema(
        "How to Remove Image Background Online",
        "Remove any image background and get a transparent PNG in seconds using AI.",
        [
          { name: "Upload your image", text: "Click Browse or drag and drop your photo. Supports JPG, PNG, WEBP." },
          { name: "AI removes background", text: "Our AI automatically detects and removes the background from your image." },
          { name: "Choose background color (optional)", text: "Pick a solid background color from the palette, or keep the transparent background." },
          { name: "Download", text: "Download your image as a transparent PNG or with your chosen background color instantly." },
        ]
      ),
      buildFAQSchema([
        { q: "How do I remove a background from an image for free?", a: "Upload your image to ENLIVENAI's free Background Remover. The AI automatically removes the background in seconds. No signup or payment required." },
        { q: "What is bg remove or bg remover?", a: "Bg remove (or background remove) is the process of erasing the background from a photo to leave only the subject. ENLIVENAI's free AI tool does this automatically." },
        { q: "Can I add a custom background color after removing?", a: "Yes. After background removal, you can click any color in the palette to apply a solid background color and download the result." },
        { q: "Does background removal work on product photos?", a: "Yes. ENLIVENAI's AI background remover works great on product images, profile photos, logos, and any image with a clear subject." },
      ]),
    ],
  },

  // ── Image to SVG ───────────────────────────────────────────
  imageToSVG: {
    title: "Image to SVG Converter – Convert PNG/JPG to SVG Vector Free | ENLIVENAI",
    description:
      "Convert raster images (PNG, JPG, WEBP) to scalable SVG vector graphics online for free. Perfect for logos, icons, and illustrations. No signup needed. High-quality vectorization instantly.",
    keywords: [
      "image to svg", "convert to svg", "png to svg", "jpg to svg",
      "jpeg to svg", "webp to svg", "svg converter", "image to vector",
      "raster to vector", "vectorize image", "svg vectorizer",
      "free svg converter", "online svg converter", "image vectorization",
      "convert image to vector", "bitmap to svg", "photo to svg",
      "logo to svg", "icon to svg", "svg maker",
      "image to scalable vector graphic", "trace image to svg",
    ].join(", "),
    canonical: "/tools/image-to-svg",
    structuredData: [
      buildWebAppSchema(
        "Image to SVG Converter",
        "Convert PNG, JPG, and WEBP images to scalable SVG vector graphics online for free.",
        "/tools/image-to-svg",
        ["image to svg", "png to svg", "jpg to svg", "vectorize image"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Image Tools", url: "/#image-tools" },
        { name: "Image to SVG", url: "/tools/image-to-svg" },
      ]),
      buildFAQSchema([
        { q: "How do I convert a PNG to SVG?", a: "Upload your PNG to ENLIVENAI's Image to SVG converter. The tool automatically traces and vectorizes your image into a scalable SVG file, ready to download." },
        { q: "What is the difference between PNG and SVG?", a: "PNG is a raster image format made of pixels. SVG is a vector format made of mathematical paths, so it scales to any size without losing quality." },
        { q: "Is the SVG converter free?", a: "Yes, ENLIVENAI's Image to SVG converter is completely free with no signup required." },
      ]),
    ],
  },

  // ── PDF Merge ──────────────────────────────────────────────
  pdfMerge: {
    title: "Merge PDF Files Online Free – Combine PDFs | ENLIVENAI",
    description:
      "Combine multiple PDF files into one document online for free. Reorder pages before merging. No signup, no watermark, no file size limit. Fast and secure PDF merger tool.",
    keywords: [
      "merge pdf", "combine pdf", "merge pdf files", "join pdf", "pdf merger",
      "combine pdf files online", "merge multiple pdfs", "pdf joiner",
      "merge pdf online free", "combine pdf online", "free pdf merger",
      "pdf combiner", "merge pdf documents", "join pdf files online",
      "pdf merge tool", "how to merge pdf", "unite pdf files",
    ].join(", "),
    canonical: "/tools/pdf-merge",
    structuredData: [
      buildWebAppSchema(
        "PDF Merger",
        "Merge multiple PDF files into one document online for free. Reorder and combine PDFs instantly.",
        "/tools/pdf-merge",
        ["merge pdf", "combine pdf", "pdf merger", "join pdf files"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "PDF Tools", url: "/#pdf-ppt-tools" },
        { name: "Merge PDF", url: "/tools/pdf-merge" },
      ]),
    ],
  },

  // ── PDF Split ──────────────────────────────────────────────
  pdfSplit: {
    title: "Split PDF Online Free – Extract PDF Pages | ENLIVENAI",
    description:
      "Split a PDF into separate pages or extract a specific page range online for free. No signup required. Fast, secure, and easy PDF splitter tool.",
    keywords: [
      "split pdf", "pdf splitter", "extract pdf pages", "pdf page extractor",
      "divide pdf", "separate pdf pages", "split pdf online free",
      "cut pdf", "pdf cutter", "remove pages from pdf",
      "extract pages from pdf", "pdf split tool", "how to split pdf",
      "split pdf into multiple files", "pdf page separator",
    ].join(", "),
    canonical: "/tools/pdf-split",
    structuredData: [
      buildWebAppSchema(
        "PDF Splitter",
        "Split PDF files by page range or extract specific pages online for free.",
        "/tools/pdf-split",
        ["split pdf", "pdf splitter", "extract pdf pages"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "PDF Tools", url: "/#pdf-ppt-tools" },
        { name: "Split PDF", url: "/tools/pdf-split" },
      ]),
    ],
  },

  // ── PDF Compress ───────────────────────────────────────────
  pdfCompress: {
    title: "Compress PDF Online Free – Reduce PDF File Size | ENLIVENAI",
    description:
      "Reduce PDF file size online for free without losing quality. Compress large PDFs for email, web, or storage. No signup needed. Supports multiple files.",
    keywords: [
      "compress pdf", "reduce pdf size", "pdf compressor", "pdf optimizer",
      "compress pdf online free", "shrink pdf", "reduce pdf file size",
      "pdf compression tool", "make pdf smaller", "compress pdf without quality loss",
      "pdf file reducer", "how to compress pdf", "pdf size reducer",
      "compress large pdf", "pdf compress online",
    ].join(", "),
    canonical: "/tools/pdf-compress",
    structuredData: [
      buildWebAppSchema(
        "PDF Compressor",
        "Compress and reduce PDF file size online for free while preserving quality.",
        "/tools/pdf-compress",
        ["compress pdf", "reduce pdf size", "pdf optimizer"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "PDF Tools", url: "/#pdf-ppt-tools" },
        { name: "Compress PDF", url: "/tools/pdf-compress" },
      ]),
    ],
  },

  // ── PDF Extract ────────────────────────────────────────────
  pdfExtract: {
    title: "Extract Images & Text from PDF Online Free | ENLIVENAI",
    description:
      "Extract all images or text content from any PDF file online for free. Download extracted images as a ZIP or copy text instantly. No signup required.",
    keywords: [
      "extract images from pdf", "pdf image extractor", "extract text from pdf",
      "pdf text extractor", "pdf content extractor", "get images from pdf",
      "save images from pdf", "extract pdf images online", "pdf to images",
      "pull images from pdf", "copy text from pdf", "extract pdf content",
    ].join(", "),
    canonical: "/tools/pdf-extract-images",
    structuredData: [
      buildWebAppSchema(
        "PDF Image & Text Extractor",
        "Extract images and text from PDF files online for free. No signup needed.",
        "/tools/pdf-extract-images",
        ["extract images from pdf", "pdf extractor", "pdf image extractor"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "PDF Tools", url: "/#pdf-ppt-tools" },
        { name: "Extract from PDF", url: "/tools/pdf-extract-images" },
      ]),
    ],
  },

  // ── PDF to Word ────────────────────────────────────────────
  pdfToWord: {
    title: "PDF to Word Converter Online Free – Convert PDF to DOCX | ENLIVENAI",
    description:
      "Convert PDF to editable Word documents (DOCX) online for free. Accurate text, formatting, and layout preservation. No signup required. Fast PDF to Word conversion.",
    keywords: [
      "pdf to word", "convert pdf to word", "pdf to docx", "pdf to word converter",
      "pdf to word online free", "pdf to word online", "convert pdf to docx",
      "pdf to editable word", "pdf converter to word", "how to convert pdf to word",
      "free pdf to word converter", "pdf to doc", "pdf to microsoft word",
      "extract text from pdf to word",
    ].join(", "),
    canonical: "/tools/pdf-to-word",
    structuredData: [
      buildWebAppSchema(
        "PDF to Word Converter",
        "Convert PDF files to editable DOCX Word documents online for free.",
        "/tools/pdf-to-word",
        ["pdf to word", "pdf to docx", "pdf to word converter"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Document Tools", url: "/#document-tools" },
        { name: "PDF to Word", url: "/tools/pdf-to-word" },
      ]),
    ],
  },

  // ── Word to PDF ────────────────────────────────────────────
  wordToPdf: {
    title: "Word to PDF Converter Online Free – Convert DOCX to PDF | ENLIVENAI",
    description:
      "Convert Word documents (DOC, DOCX) to PDF online for free. Preserve formatting, fonts, and layout. No signup required. Instantly download your PDF.",
    keywords: [
      "word to pdf", "convert word to pdf", "docx to pdf", "doc to pdf",
      "word to pdf converter", "word to pdf online free", "convert docx to pdf",
      "microsoft word to pdf", "word document to pdf", "save word as pdf",
      "free word to pdf converter", "how to convert word to pdf",
    ].join(", "),
    canonical: "/tools/word-to-pdf",
    structuredData: [
      buildWebAppSchema(
        "Word to PDF Converter",
        "Convert Word DOCX documents to PDF online for free with preserved formatting.",
        "/tools/word-to-pdf",
        ["word to pdf", "docx to pdf", "convert word to pdf"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Document Tools", url: "/#document-tools" },
        { name: "Word to PDF", url: "/tools/word-to-pdf" },
      ]),
    ],
  },

  // ── PPT to PDF ─────────────────────────────────────────────
  pptToPdf: {
    title: "PPT to PDF Converter Online Free – PowerPoint to PDF | ENLIVENAI",
    description:
      "Convert PowerPoint presentations (PPT, PPTX) to PDF online for free. All slides converted with perfect layout. No signup required.",
    keywords: [
      "ppt to pdf", "powerpoint to pdf", "convert ppt to pdf", "pptx to pdf",
      "ppt to pdf converter", "ppt to pdf online free", "powerpoint to pdf converter",
      "convert powerpoint to pdf", "slides to pdf", "presentation to pdf",
      "pptx to pdf online", "free ppt to pdf", "how to convert ppt to pdf",
    ].join(", "),
    canonical: "/tools/ppt-to-pdf",
    structuredData: [
      buildWebAppSchema(
        "PowerPoint to PDF Converter",
        "Convert PowerPoint PPT and PPTX files to PDF online for free.",
        "/tools/ppt-to-pdf",
        ["ppt to pdf", "powerpoint to pdf", "pptx to pdf"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Document Tools", url: "/#document-tools" },
        { name: "PPT to PDF", url: "/tools/ppt-to-pdf" },
      ]),
    ],
  },

  // ── Excel to PDF ───────────────────────────────────────────
  excelToPdf: {
    title: "Excel to PDF Converter Online Free – Convert XLSX to PDF | ENLIVENAI",
    description:
      "Convert Excel spreadsheets (XLS, XLSX) to PDF online for free. Preserves tables, formatting, and data. No signup required.",
    keywords: [
      "excel to pdf", "xlsx to pdf", "xls to pdf", "excel to pdf converter",
      "convert excel to pdf", "spreadsheet to pdf", "excel to pdf online free",
      "convert xlsx to pdf", "microsoft excel to pdf", "how to convert excel to pdf",
      "free excel to pdf converter",
    ].join(", "),
    canonical: "/tools/excel-to-pdf",
    structuredData: [
      buildWebAppSchema(
        "Excel to PDF Converter",
        "Convert Excel XLS and XLSX spreadsheets to PDF online for free.",
        "/tools/excel-to-pdf",
        ["excel to pdf", "xlsx to pdf", "spreadsheet to pdf"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Document Tools", url: "/#document-tools" },
        { name: "Excel to PDF", url: "/tools/excel-to-pdf" },
      ]),
    ],
  },

  // ── PPT to Images ──────────────────────────────────────────
  pptToImages: {
    title: "PPT to Images – Export PowerPoint Slides as PNG/JPG | ENLIVENAI",
    description:
      "Export every PowerPoint slide as a high-quality PNG or JPG image online for free. Perfect for presentations, thumbnails, and social media. No signup required.",
    keywords: [
      "ppt to images", "powerpoint to images", "convert ppt to png", "pptx to images",
      "export slides as images", "powerpoint to jpg", "ppt to jpg", "pptx to png",
      "slide to image converter", "presentation to images", "ppt to picture",
      "convert powerpoint slides to images", "screenshot slides",
    ].join(", "),
    canonical: "/tools/ppt-to-images",
    structuredData: [
      buildWebAppSchema(
        "PPT to Images Converter",
        "Export PowerPoint slides as PNG or JPG images online for free.",
        "/tools/ppt-to-images",
        ["ppt to images", "powerpoint to images", "slides to png"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "PDF & PPT Tools", url: "/#pdf-ppt-tools" },
        { name: "PPT to Images", url: "/tools/ppt-to-images" },
      ]),
    ],
  },

  // ── Video Converter ────────────────────────────────────────
  videoConverter: {
    title: "Video Converter Online Free – Convert MP4, AVI, MKV, MOV | ENLIVENAI",
    description:
      "Convert video files between MP4, AVI, MKV, MOV, and WEBM formats online for free. No signup, no watermark. Fast video format conversion.",
    keywords: [
      "video converter", "convert video online", "mp4 converter", "avi to mp4",
      "mkv to mp4", "mov to mp4", "webm to mp4", "convert mp4 online",
      "video format converter", "free video converter", "online video converter",
      "convert video free", "change video format", "video file converter",
      "mp4 to avi", "mp4 to mkv", "convert mkv online", "convert avi online",
    ].join(", "),
    canonical: "/tools/video-convert",
    structuredData: [
      buildWebAppSchema(
        "Video Converter",
        "Convert video files between MP4, AVI, MKV, MOV, and WEBM formats online for free.",
        "/tools/video-convert",
        ["video converter", "mp4 converter", "convert video online"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Video & Audio Tools", url: "/#video-audio-tools" },
        { name: "Video Converter", url: "/tools/video-convert" },
      ]),
    ],
  },

  // ── Audio Extractor ────────────────────────────────────────
  audioExtract: {
    title: "Extract Audio from Video Online Free – MP3 from MP4 | ENLIVENAI",
    description:
      "Extract audio from any video file online for free. Convert MP4, AVI, MKV to MP3, WAV, AAC, or FLAC. No signup required. Download audio instantly.",
    keywords: [
      "extract audio from video", "video to mp3", "mp4 to mp3",
      "audio extractor", "extract mp3 from video", "video to audio converter",
      "get audio from video", "rip audio from video", "convert video to audio",
      "mp4 to audio", "extract sound from video", "video audio extractor",
      "online audio extractor", "free audio extractor",
    ].join(", "),
    canonical: "/tools/audio-extract",
    structuredData: [
      buildWebAppSchema(
        "Audio Extractor",
        "Extract audio tracks from video files online for free. Convert MP4 to MP3 instantly.",
        "/tools/audio-extract",
        ["extract audio from video", "video to mp3", "mp4 to mp3"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Video & Audio Tools", url: "/#video-audio-tools" },
        { name: "Extract Audio", url: "/tools/audio-extract" },
      ]),
    ],
  },

  // ── Audio Converter ────────────────────────────────────────
  audioConverter: {
    title: "Audio Converter Online Free – Convert MP3, WAV, AAC, FLAC | ENLIVENAI",
    description:
      "Convert audio files between MP3, WAV, AAC, FLAC, and OGG formats online for free. No signup required. Fast and high-quality audio format conversion.",
    keywords: [
      "audio converter", "convert audio online", "mp3 converter", "wav to mp3",
      "mp3 to wav", "aac to mp3", "flac to mp3", "ogg to mp3",
      "audio format converter", "free audio converter", "online audio converter",
      "convert audio free", "change audio format", "music converter",
      "mp3 to flac", "audio file converter",
    ].join(", "),
    canonical: "/tools/audio-convert",
    structuredData: [
      buildWebAppSchema(
        "Audio Converter",
        "Convert audio files between MP3, WAV, AAC, FLAC, and OGG formats online for free.",
        "/tools/audio-convert",
        ["audio converter", "mp3 converter", "convert audio online"]
      ),
      buildBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Video & Audio Tools", url: "/#video-audio-tools" },
        { name: "Audio Converter", url: "/tools/audio-convert" },
      ]),
    ],
  },
};
