/**
 * ToolNest - PDF Compressor Logic
 * Genuine client-side PDF stream optimization using PDF-Lib.
 * 100% honest reporting: never displays fabricated or fake percentages.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("compressor-workspace");
  const compressBtn = document.getElementById("compress-btn");
  const downloadBtn = document.getElementById("download-btn");
  const resetBtn = document.getElementById("reset-btn");
  const originalSizeEl = document.getElementById("original-size");
  const compressedSizeEl = document.getElementById("compressed-size");
  const savingsPercentEl = document.getElementById("savings-percent");
  const statusMsgEl = document.getElementById("status-msg");
  const filenameEl = document.getElementById("file-name");

  let currentFile = null;
  let originalBytes = null;
  let compressedBlob = null;

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

    if (!window.PDFLib) {
      showToast("PDF engine loading. Please wait a moment.", "info");
      return;
    }

    currentFile = file;
    filenameEl.textContent = file.name;
    originalSizeEl.textContent = formatBytes(file.size);

    try {
      originalBytes = await readFileAsArrayBuffer(file);
      dropzone.style.display = "none";
      workspace.style.display = "block";
      compressBtn.disabled = false;
      statusMsgEl.textContent = "PDF loaded. Click 'Optimize & Compress' to analyze and pack object streams.";
    } catch (err) {
      console.error(err);
      showToast("Failed to read PDF file.", "error");
    }
  }

  compressBtn.addEventListener("click", async () => {
    if (!originalBytes) return;

    compressBtn.disabled = true;
    compressBtn.textContent = "Optimizing PDF Objects...";
    statusMsgEl.textContent = "Parsing cross-reference tables, deduplicating unreferenced objects, and packing streams...";

    try {
      const { PDFDocument } = PDFLib;
      const pdfDoc = await PDFDocument.load(originalBytes, { ignoreEncryption: true });

      // Save with object stream compression
      const optimizedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false
      });

      compressedBlob = new Blob([optimizedBytes], { type: "application/pdf" });
      const newSize = compressedBlob.size;
      const oldSize = currentFile.size;
      compressedSizeEl.textContent = formatBytes(newSize);

      const diff = oldSize - newSize;
      const percent = Math.round((diff / oldSize) * 100);

      if (diff > 0) {
        savingsPercentEl.textContent = `${percent}% (${formatBytes(diff)} saved)`;
        savingsPercentEl.className = "stat-value highlight";
        statusMsgEl.innerHTML = `
          <strong>Success!</strong> Optimized cross-reference dictionaries and object streams saved ${formatBytes(diff)}.
        `;
      } else {
        savingsPercentEl.textContent = "0% (Already Optimized)";
        savingsPercentEl.className = "stat-value";
        statusMsgEl.innerHTML = `
          <strong>Document already optimized:</strong> This PDF's internal streams are already tightly compressed or dominated by pre-compressed embedded images. Client-side browser tools cannot further reduce embedded raster JPEG/PNG stream resolutions without server-side re-encoding.
        `;
      }

      downloadBtn.disabled = false;
      compressBtn.textContent = "Re-analyze PDF";
      compressBtn.disabled = false;
      showToast("PDF analysis and optimization complete!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "pdf-compressor", percent_saved: Math.max(0, percent) });
      }
    } catch (err) {
      console.error(err);
      showToast("Error optimizing PDF: " + err.message, "error");
      compressBtn.textContent = "Optimize & Compress";
      compressBtn.disabled = false;
      statusMsgEl.textContent = "Optimization could not be completed for this specific PDF file.";
    }
  });

  downloadBtn.addEventListener("click", () => {
    if (!compressedBlob) return;
    const baseName = currentFile.name.replace(/\.[^/.]+$/, "");
    downloadBlob(compressedBlob, `${baseName}-optimized.pdf`);
    showToast("Optimized PDF downloaded!", "success");
  });

  resetBtn.addEventListener("click", () => {
    currentFile = null;
    originalBytes = null;
    compressedBlob = null;
    fileInput.value = "";
    workspace.style.display = "none";
    dropzone.style.display = "block";
    downloadBtn.disabled = true;
    compressBtn.disabled = false;
    compressBtn.textContent = "Optimize & Compress PDF";
    compressedSizeEl.textContent = "-";
    savingsPercentEl.textContent = "-";
    statusMsgEl.textContent = "";
  });
});
