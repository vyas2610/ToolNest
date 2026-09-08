/**
 * ToolNest - PDF to JPG Converter Logic
 * Renders PDF pages onto Canvas using Mozilla PDF.js client-side.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("converter-workspace");
  const pagesContainer = document.getElementById("pages-container");
  const scaleSelect = document.getElementById("scale-select");
  const qualitySelect = document.getElementById("quality-select");
  const renderBtn = document.getElementById("render-btn");
  const downloadAllBtn = document.getElementById("download-all-btn");
  const resetBtn = document.getElementById("reset-btn");
  const pageCountEl = document.getElementById("page-count");
  const docNameEl = document.getElementById("doc-name");
  const statusEl = document.getElementById("render-status");

  let currentFile = null;
  let pdfDoc = null;
  let renderedPages = []; // Array of { pageNum, blob, dataUrl }

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());
  ["dragenter", "dragover"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add("dragover"); }));
  ["dragleave", "drop"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove("dragover"); }));

  dropzone.addEventListener("drop", e => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener("change", e => {
    if (e.target.files && e.target.files.length > 0) handleFile(e.target.files[0]);
  });

  async function handleFile(file) {
    if (file.type !== "application/pdf" && !file.name.match(/\.pdf$/i)) {
      showToast("Please upload a valid PDF document.", "error");
      return;
    }

    if (!window.pdfjsLib) {
      showToast("PDF rendering engine is still loading. Please wait 2 seconds.", "info");
      return;
    }

    currentFile = file;
    docNameEl.textContent = file.name;

    try {
      showToast("Loading PDF document...", "info");
      const arrayBuffer = await readFileAsArrayBuffer(file);
      
      // Setup PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      pdfDoc = await loadingTask.promise;

      pageCountEl.textContent = `${pdfDoc.numPages} Page(s)`;
      dropzone.style.display = "none";
      workspace.style.display = "block";

      if (pdfDoc.numPages > 50) {
        showToast("Large PDF detected. Processing first 50 pages for browser safety.", "warning");
      }

      await renderPages();
    } catch (err) {
      console.error(err);
      showToast("Error opening PDF: " + err.message, "error");
    }
  }

  renderBtn.addEventListener("click", renderPages);

  async function renderPages() {
    if (!pdfDoc) return;

    renderBtn.disabled = true;
    pagesContainer.innerHTML = `<div class="loading-spinner">Rendering pages to JPG...</div>`;
    renderedPages = [];

    const scale = parseFloat(scaleSelect.value) || 1.5;
    const quality = parseFloat(qualitySelect.value) || 0.9;
    const maxPages = Math.min(pdfDoc.numPages, 50);

    pagesContainer.innerHTML = "";

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      statusEl.textContent = `Rendering page ${pageNum} of ${maxPages}...`;
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Fill white background (PDF pages can be transparent)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      await page.render(renderContext).promise;

      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
      const dataUrl = canvas.toDataURL("image/jpeg", quality);

      renderedPages.push({ pageNum, blob, dataUrl, width: canvas.width, height: canvas.height });

      // Create page card in gallery
      const pageCard = document.createElement("div");
      pageCard.className = "pdf-page-card";
      pageCard.innerHTML = `
        <div class="pdf-page-preview">
          <img src="${dataUrl}" alt="Page ${pageNum}" />
        </div>
        <div class="pdf-page-meta">
          <strong>Page ${pageNum}</strong>
          <span>${canvas.width} &times; ${canvas.height} px &bull; ${formatBytes(blob.size)}</span>
        </div>
        <div class="pdf-page-card-actions">
          <button type="button" class="btn btn-primary btn-sm download-single-btn">Download JPG</button>
        </div>
      `;

      pageCard.querySelector(".download-single-btn").addEventListener("click", () => {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, "");
        downloadBlob(blob, `${baseName}-page-${pageNum}.jpg`);
      });

      pagesContainer.appendChild(pageCard);
    }

    statusEl.textContent = `Successfully rendered ${maxPages} page(s).`;
    renderBtn.disabled = false;
    downloadAllBtn.disabled = false;
    showToast("PDF pages converted to JPG!", "success");

    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent("tool_used", { tool: "pdf-to-jpg", page_count: maxPages });
    }
  }

  // Download all pages sequentially
  downloadAllBtn.addEventListener("click", () => {
    if (!renderedPages.length) return;
    const baseName = currentFile.name.replace(/\.[^/.]+$/, "");

    renderedPages.forEach((p, idx) => {
      setTimeout(() => {
        downloadBlob(p.blob, `${baseName}-page-${p.pageNum}.jpg`);
      }, idx * 400); // Stagger downloads slightly to prevent browser blocking
    });

    showToast(`Downloading ${renderedPages.length} image(s)...`, "info");
  });

  resetBtn.addEventListener("click", () => {
    currentFile = null;
    pdfDoc = null;
    renderedPages = [];
    fileInput.value = "";
    pagesContainer.innerHTML = "";
    workspace.style.display = "none";
    dropzone.style.display = "block";
    downloadAllBtn.disabled = true;
    statusEl.textContent = "";
  });
});
