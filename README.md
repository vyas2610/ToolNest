# ToolNest - Simple, Fast & Free Online Tools

ToolNest is a modern, production-ready, pure static web application providing 15 high-performance productivity utilities across images, PDFs, text, and developer tools.

Built strictly with **pure HTML5, CSS3, and Vanilla JavaScript**, ToolNest requires **zero build steps, zero node_modules, and zero backend frameworks**. It can be opened locally directly in any browser or deployed with a single push to GitHub and Netlify.

---

## 🌟 Key Features

- **100% Client-Side Privacy:** All data transformations (image compression, resizing, PDF merging, case conversions, JSON validation, and encoding) occur directly in the visitor's web browser using modern Web APIs. User files never travel across the internet.
- **Zero Frameworks or Dependencies:** No React, Vue, Vite, Next.js, or npm build pipelines.
- **Light and Dark Mode:** Full theme support with automatic system preference detection and `localStorage` persistence.
- **Mobile First & Fully Responsive:** Flawless layout across screen sizes from 320px mobile viewports to 4K desktop monitors.
- **Instant Search:** Fuzzy, client-side tool search powered by Vanilla JavaScript.
- **SEO & Search Console Ready:** Semantic HTML5, unique meta tags, Open Graph tags, canonical links, XML sitemap, and Schema.org JSON-LD structured data.
- **Google Analytics 4 & AdSense Prepared:** Pre-configured safe event tracking and respectful advertising placeholders ready for monetization.

---

## 🛠️ The 15 Built-in Tools

### 🖼️ Image Tools
1. **Image Compressor** (`/tools/image-compressor.html`): Reduce JPG, PNG, and WebP file sizes by up to 80% with an interactive quality slider and live side-by-side comparison.
2. **Image Resizer** (`/tools/image-resizer.html`): Scale images to exact pixel dimensions with aspect ratio lock and social media presets (Instagram, Twitter/X, Facebook, YouTube).
3. **JPG to PNG** (`/tools/jpg-to-png.html`): Convert JPG and JPEG images to lossless PNG format directly in memory.
4. **PNG to JPG** (`/tools/png-to-jpg.html`): Convert transparent PNGs into JPG format with custom background color fill to prevent black transparent areas.
5. **Image Cropper** (`/tools/image-cropper.html`): Interactive canvas cropping with aspect presets (1:1, 4:3, 16:9, 3:4) and 90-degree rotations.

### 📄 PDF Tools
6. **JPG to PDF** (`/tools/jpg-to-pdf.html`): Combine single or multiple images into a clean, formatted PDF document with customizable margins and page formats.
7. **PDF to JPG** (`/tools/pdf-to-jpg.html`): Extract and render PDF document pages into high-resolution JPG images using Mozilla PDF.js.
8. **PDF Merger** (`/tools/pdf-merger.html`): Reorder and concatenate multiple PDF documents into a single consolidated file using PDF-Lib.
9. **PDF Compressor** (`/tools/pdf-compressor.html`): Genuine structural stream deduplication and cross-reference optimization with transparent savings metrics.

### ✍️ Text Tools
10. **Word Counter** (`/tools/word-counter.html`): Real-time analysis of words, characters, characters without spaces, sentences, paragraphs, reading time, and speaking time.
11. **Case Converter** (`/tools/case-converter.html`): Instant conversion between UPPERCASE, lowercase, Title Case, Sentence case, Capitalize Words, and Alternating Case.
12. **Duplicate Line Remover** (`/tools/duplicate-line-remover.html`): Clean lists by removing duplicate entries with whitespace trimming and alphabetical sorting.

### 💻 Developer Tools
13. **JSON Formatter & Validator** (`/tools/json-formatter.html`): Prettify, validate, and minify JSON payloads with line-and-column syntax error indicators.
14. **Base64 Encoder / Decoder** (`/tools/base64-encoder-decoder.html`): Encode and decode text to and from Base64 with full UTF-8 Unicode support (handles emojis and non-Latin text without errors).
15. **URL Encoder / Decoder** (`/tools/url-encoder-decoder.html`): Safely encode and decode query parameters and URI special characters with malformed sequence recovery.

---

## 📁 Project Structure

```text
/
├── index.html                     # Homepage with Hero, Search, Categories, FAQs
├── about.html                     # About page & mission
├── contact.html                   # Contact page (Netlify Forms ready)
├── privacy-policy.html            # GDPR/CCPA compliant privacy policy
├── terms.html                     # Terms & conditions of service
├── disclaimer.html                # General utility disclaimer
├── 404.html                       # Custom 404 error page with search
├── sitemap.xml                    # Complete XML sitemap
├── robots.txt                     # Crawler directives pointing to sitemap
├── netlify.toml                   # Netlify configuration with security headers
├── README.md                      # Project documentation
│
├── css/
│   ├── style.css                  # Core CSS variables, typography, layouts, components
│   └── responsive.css             # Responsive breakpoints (320px to 1920px)
│
├── js/
│   ├── config.js                  # Central configuration (Brand, GA4, AdSense, Email)
│   ├── tools.js                   # Central tools directory & metadata
│   ├── utils.js                   # Toast notifications, downloads, formatters, copy
│   ├── search.js                  # Instant client-side fuzzy search logic
│   ├── analytics.js               # Safe GA4 event tracking wrapper
│   └── main.js                    # Theme toggling, mobile drawer, dynamic grids
│
├── js/tools/                      # 15 modular tool controller scripts
│   ├── image-compressor.js
│   ├── image-resizer.js
│   ├── jpg-to-png.js
│   ├── png-to-jpg.js
│   ├── image-cropper.js
│   ├── jpg-to-pdf.js
│   ├── pdf-to-jpg.js
│   ├── pdf-merger.js
│   ├── pdf-compressor.js
│   ├── word-counter.js
│   ├── case-converter.js
│   ├── duplicate-line-remover.js
│   ├── json-formatter.js
│   ├── base64.js
│   └── url-encoder.js
│
├── tools/                         # 15 tool HTML pages with unified SEO layout
│   ├── image-compressor.html
│   ├── image-resizer.html
│   ├── jpg-to-png.html
│   ├── png-to-jpg.html
│   ├── image-cropper.html
│   ├── jpg-to-pdf.html
│   ├── pdf-to-jpg.html
│   ├── pdf-merger.html
│   ├── pdf-compressor.html
│   ├── word-counter.html
│   ├── case-converter.html
│   ├── duplicate-line-remover.html
│   ├── json-formatter.html
│   ├── base64-encoder-decoder.html
│   └── url-encoder-decoder.html
│
├── blog/                          # 10 comprehensive SEO guides & tutorials
│   ├── index.html                 # Blog hub
│   ├── image-compression-guide.html
│   ├── jpg-vs-png-vs-webp.html
│   ├── reduce-image-file-size.html
│   ├── jpg-to-pdf-guide.html
│   ├── resize-images-social-media.html
│   ├── reduce-pdf-size.html
│   ├── json-formatting-guide.html
│   ├── base64-explained.html
│   ├── remove-duplicate-lines.html
│   └── best-image-formats.html
│
└── assets/
    └── favicon.svg                # Brand icon vector
```

---

## 🚀 How to Run Locally

Because ToolNest has **no build step**, you can run it immediately using any of the following methods:

### Option 1: Direct File Opening
Double-click `index.html` in your file explorer to open it in Google Chrome, Firefox, Safari, or Microsoft Edge.

### Option 2: Python Simple HTTP Server
If you have Python installed:
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Option 3: Node.js `serve` or `npx`
If you have Node installed:
```bash
npx serve .
```

---

## ☁️ How to Upload to GitHub

1. Initialize git in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ToolNest static tools platform"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Connect your local repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ToolNest.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 How to Deploy to Netlify

### Option A: One-Click Git Deployment (Recommended)
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** &rarr; **"Import an existing project"**.
3. Choose **GitHub** and select your `ToolNest` repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command:** *(Leave empty)*
   - **Publish directory:** `.`
5. Click **"Deploy site"**. Your website will be live in seconds at `https://YOUR-SITE.netlify.app`.

### Option B: Drag and Drop (Netlify Drop)
1. Navigate to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the entire `ToolNest` folder directly into the browser window.

---

## ⚙️ Customization & Central Configuration

### Changing Brand Name & Contact Email
Open `js/config.js`:
```javascript
const CONFIG = {
  SITE_NAME: "ToolNest", // Change to your preferred brand name
  TAGLINE: "Simple, Fast & Free Online Tools",
  SITE_URL: "https://yourcustomdomain.com",
  CONTACT_EMAIL: "support@yourdomain.com",
  // ...
};
```

### Configuring Google Analytics 4 (GA4)
1. Open `js/config.js`.
2. Replace `"G-XXXXXXXXXX"` with your Google Analytics 4 Measurement ID:
   ```javascript
   GA4_MEASUREMENT_ID: "G-1234567890"
   ```
3. The tracking script in `js/analytics.js` will automatically activate and start recording events safely without leaking user data.

### Configuring Google Search Console
1. Obtain your HTML verification tag from Google Search Console.
2. In `js/config.js`, update:
   ```javascript
   GOOGLE_SITE_VERIFICATION: "your-actual-verification-string"
   ```
3. Update the `<meta name="google-site-verification">` tag in `index.html` and other HTML templates.
4. Update `sitemap.xml` with your actual domain URL.

### Adding Google AdSense Later
1. In `js/config.js`, replace `"ca-pub-XXXXXXXXXXXXXXXX"` with your approved AdSense publisher ID.
2. Every page already includes clean `.ad-placeholder` containers safely placed away from interactive buttons in full accordance with Google AdSense quality guidelines.
3. Replace the placeholder content with your responsive AdSense script snippet when approved.

---

## ➕ How to Add a New Tool

1. **Add Metadata:** Open `js/tools.js` and add a new tool object to the `TOOLS_DATA` array.
2. **Create the Controller:** Create `js/tools/my-new-tool.js` containing your tool logic.
3. **Create the HTML Page:** Duplicate any existing file in `tools/` (e.g. `tools/word-counter.html`), rename it to `tools/my-new-tool.html`, and update the tool markup and script reference.
4. **Update Sitemap:** Add the new URL to `sitemap.xml`.

---

## 📄 License

This project is open-source and free to use for personal, educational, and commercial projects.
