/**
 * ToolNest - Central Tools Directory
 * 
 * Single source of truth for all tools on ToolNest.
 * Used for dynamic homepage cards, search indexing, category filtering,
 * and related tools recommendations.
 */

const TOOLS_DATA = [
  // --- IMAGE TOOLS ---
  {
    id: "image-compressor",
    name: "Image Compressor",
    slug: "image-compressor",
    category: "Image Tools",
    categorySlug: "image-tools",
    description: "Reduce JPG, PNG, and WebP file sizes quickly without losing visual quality.",
    url: "/tools/image-compressor.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>`,
    popular: true,
    keywords: ["compress image", "reduce image size", "jpg compressor", "png compressor", "webp compressor", "optimize photo", "shrink image"],
    relatedToolSlugs: ["image-resizer", "jpg-to-png", "png-to-jpg", "image-cropper"]
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    slug: "image-resizer",
    category: "Image Tools",
    categorySlug: "image-tools",
    description: "Resize images to custom width and height with aspect ratio lock and social media presets.",
    url: "/tools/image-resizer.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>`,
    popular: true,
    keywords: ["resize image", "scale image", "image dimensions", "photo resizer", "instagram size", "aspect ratio"],
    relatedToolSlugs: ["image-compressor", "image-cropper", "jpg-to-png", "png-to-jpg"]
  },
  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    slug: "jpg-to-png",
    category: "Image Tools",
    categorySlug: "image-tools",
    description: "Convert JPG and JPEG images to lossless PNG format directly in your browser.",
    url: "/tools/jpg-to-png.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
    popular: false,
    keywords: ["jpg to png", "jpeg to png", "convert jpg", "lossless image", "image format converter"],
    relatedToolSlugs: ["png-to-jpg", "image-compressor", "image-resizer", "jpg-to-pdf"]
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG",
    slug: "png-to-jpg",
    category: "Image Tools",
    categorySlug: "image-tools",
    description: "Convert PNG images to JPG with custom background color for transparent areas.",
    url: "/tools/png-to-jpg.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m3 16 5-5c.928-.893 2.072-.893 3 0l5 5"/><path d="m14 14 1-1c.928-.893 2.072-.893 3 0l3 3"/></svg>`,
    popular: false,
    keywords: ["png to jpg", "png to jpeg", "convert png", "transparent png to jpg", "flatten png"],
    relatedToolSlugs: ["jpg-to-png", "image-compressor", "image-resizer", "image-cropper"]
  },
  {
    id: "image-cropper",
    name: "Image Cropper",
    slug: "image-cropper",
    category: "Image Tools",
    categorySlug: "image-tools",
    description: "Crop and rotate images easily with 1:1, 4:3, 16:9, and freeform aspect ratios.",
    url: "/tools/image-cropper.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>`,
    popular: false,
    keywords: ["crop image", "image cropper", "cut photo", "aspect ratio crop", "square crop", "rotate image"],
    relatedToolSlugs: ["image-resizer", "image-compressor", "jpg-to-png", "png-to-jpg"]
  },

  // --- PDF TOOLS ---
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    slug: "jpg-to-pdf",
    category: "PDF Tools",
    categorySlug: "pdf-tools",
    description: "Combine multiple JPG, PNG, or WebP images into a single professional PDF file.",
    url: "/tools/jpg-to-pdf.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="M12 12v6"/></svg>`,
    popular: true,
    keywords: ["jpg to pdf", "images to pdf", "png to pdf", "photos to pdf", "create pdf", "pdf generator"],
    relatedToolSlugs: ["pdf-merger", "pdf-to-jpg", "pdf-compressor", "image-compressor"]
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    slug: "pdf-to-jpg",
    category: "PDF Tools",
    categorySlug: "pdf-tools",
    description: "Extract PDF pages and convert them into clear, high-quality JPG images.",
    url: "/tools/pdf-to-jpg.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1"/><path d="m14 17-2-2-4 4"/></svg>`,
    popular: false,
    keywords: ["pdf to jpg", "pdf to image", "extract pdf pages", "pdf to jpeg", "convert pdf"],
    relatedToolSlugs: ["jpg-to-pdf", "pdf-merger", "pdf-compressor", "image-compressor"]
  },
  {
    id: "pdf-merger",
    name: "PDF Merger",
    slug: "pdf-merger",
    category: "PDF Tools",
    categorySlug: "pdf-tools",
    description: "Merge multiple PDF files into one complete document in your exact preferred order.",
    url: "/tools/pdf-merger.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="16" height="18" x="4" y="4" rx="2"/><path d="M4 10h16"/><path d="M10 14h4"/></svg>`,
    popular: true,
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf combiner", "pdf binder", "unite pdf"],
    relatedToolSlugs: ["jpg-to-pdf", "pdf-compressor", "pdf-to-jpg", "word-counter"]
  },
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    slug: "pdf-compressor",
    category: "PDF Tools",
    categorySlug: "pdf-tools",
    description: "Optimize PDF internal streams and remove redundant objects right in your browser.",
    url: "/tools/pdf-compressor.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 3-3 3 3"/><path d="M12 12v6"/></svg>`,
    popular: false,
    keywords: ["compress pdf", "shrink pdf", "reduce pdf size", "optimize pdf", "smaller pdf"],
    relatedToolSlugs: ["pdf-merger", "jpg-to-pdf", "image-compressor", "pdf-to-jpg"]
  },

  // --- TEXT TOOLS ---
  {
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    category: "Text Tools",
    categorySlug: "text-tools",
    description: "Count words, characters, sentences, paragraphs, and calculate reading time in real-time.",
    url: "/tools/word-counter.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`,
    popular: true,
    keywords: ["word counter", "character count", "sentence counter", "reading time", "text counter", "word count online"],
    relatedToolSlugs: ["case-converter", "duplicate-line-remover", "json-formatter", "base64-encoder-decoder"]
  },
  {
    id: "case-converter",
    name: "Case Converter",
    slug: "case-converter",
    category: "Text Tools",
    categorySlug: "text-tools",
    description: "Convert text into UPPERCASE, lowercase, Title Case, Sentence case, and Alternating Case.",
    url: "/tools/case-converter.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 15 4-8 4 8"/><path d="M4.5 12h5"/><path d="M15 11v4a2 2 0 0 0 4 0v-4"/><path d="M19 15h.01"/><path d="M15 15h.01"/></svg>`,
    popular: false,
    keywords: ["case converter", "uppercase converter", "lowercase converter", "title case", "capitalize words", "sentence case"],
    relatedToolSlugs: ["word-counter", "duplicate-line-remover", "url-encoder-decoder", "json-formatter"]
  },
  {
    id: "duplicate-line-remover",
    name: "Duplicate Line Remover",
    slug: "duplicate-line-remover",
    category: "Text Tools",
    categorySlug: "text-tools",
    description: "Remove duplicate lines from text lists while preserving first occurrence with sorting options.",
    url: "/tools/duplicate-line-remover.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/><circle cx="19" cy="6" r="1.5"/><circle cx="19" cy="18" r="1.5"/></svg>`,
    popular: false,
    keywords: ["remove duplicate lines", "dedupe list", "unique lines", "text cleaner", "sort lines", "list deduplicator"],
    relatedToolSlugs: ["word-counter", "case-converter", "json-formatter", "base64-encoder-decoder"]
  },

  // --- DEVELOPER TOOLS ---
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    description: "Format, validate, prettify, and minify JSON data with clear syntax error locations.",
    url: "/tools/json-formatter.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>`,
    popular: true,
    keywords: ["json formatter", "format json", "json validator", "beautify json", "minify json", "json parser", "json checker"],
    relatedToolSlugs: ["base64-encoder-decoder", "url-encoder-decoder", "word-counter", "duplicate-line-remover"]
  },
  {
    id: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    slug: "base64-encoder-decoder",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    description: "Encode and decode text to and from Base64 with full UTF-8 Unicode character support.",
    url: "/tools/base64-encoder-decoder.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`,
    popular: false,
    keywords: ["base64 encoder", "base64 decoder", "base64 converter", "decode base64", "encode base64", "utf8 base64"],
    relatedToolSlugs: ["url-encoder-decoder", "json-formatter", "word-counter", "case-converter"]
  },
  {
    id: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    slug: "url-encoder-decoder",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    description: "Encode and decode URLs, query strings, and special characters safely and accurately.",
    url: "/tools/url-encoder-decoder.html",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    popular: false,
    keywords: ["url encoder", "url decoder", "uri encode", "encode uricomponent", "percent encoding", "decode url"],
    relatedToolSlugs: ["base64-encoder-decoder", "json-formatter", "case-converter", "word-counter"]
  }
];

// Helper functions for tools data
function getToolBySlug(slug) {
  return TOOLS_DATA.find(tool => tool.slug === slug);
}

function getToolsByCategory(category) {
  return TOOLS_DATA.filter(tool => tool.category === category || tool.categorySlug === category);
}

function getPopularTools() {
  return TOOLS_DATA.filter(tool => tool.popular);
}

function getRelatedTools(currentSlug) {
  const current = getToolBySlug(currentSlug);
  if (!current || !current.relatedToolSlugs) {
    return TOOLS_DATA.filter(t => t.slug !== currentSlug).slice(0, 4);
  }
  return current.relatedToolSlugs
    .map(slug => getToolBySlug(slug))
    .filter(Boolean);
}

// Adapt URLs for local file:/// opening as well as Netlify web server deployment
function resolveToolUrl(rawUrl) {
  const path = window.location.pathname.replace(/\\/g, "/");
  const cleanUrl = rawUrl.replace(/^\//, ""); // e.g. "tools/image-compressor.html"

  if (path.includes("/tools/")) {
    // We are inside /tools/
    return cleanUrl.replace(/^tools\//, "");
  } else if (path.includes("/blog/")) {
    // We are inside /blog/
    return "../" + cleanUrl;
  }
  // We are at root
  return cleanUrl;
}

// Make globally accessible
if (typeof window !== "undefined") {
  window.TOOLS_DATA = TOOLS_DATA;
  window.getToolBySlug = getToolBySlug;
  window.getToolsByCategory = getToolsByCategory;
  window.getPopularTools = getPopularTools;
  window.getRelatedTools = getRelatedTools;
  window.resolveToolUrl = resolveToolUrl;
}
