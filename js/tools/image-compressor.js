/**
 * ToolNest - Image Compressor Tool Logic
 * Pure client-side image compression using HTML5 Canvas.
 * No server uploads, total privacy.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("compressor-workspace");
  const originalPreview = document.getElementById("original-preview");
  const compressedPreview = document.getElementById("compressed-preview");
  const originalSizeEl = document.getElementById("original-size");
  const compressedSizeEl = document.getElementById("compressed-size");
  const savingsEl = document.getElementById("savings-percent");
  const qualitySlider = document.getElementById("quality-slider");
  const qualityValEl = document.getElementById("quality-val");
  const formatSelect = document.getElementById("format-select");
  const downloadBtn = document.getElementById("download-btn");
  const resetBtn = document.getElementById("reset-btn");

  let currentFile = null;
  let originalImage = null;
  let compressedBlob = null;

  if (!dropzone || !fileInput) return;

  // Drag & drop events
  ["dragenter", "dragover"].forEach(evt => {
    dropzone.addEventListener(evt, e => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach(evt => {
    dropzone.addEventListener(evt, e => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", e => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", e => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      showToast("Please select a valid JPG, PNG, or WebP image.", "error");
      return;
    }

    currentFile = file;
    originalSizeEl.textContent = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        originalPreview.src = e.target.result;
        dropzone.style.display = "none";
        workspace.style.display = "block";
        if (window.trackAnalyticsEvent) {
          window.trackAnalyticsEvent("file_uploaded", { tool: "image-compressor", format: file.type });
        }
        compressImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Quality slider change
  qualitySlider.addEventListener("input", () => {
    qualityValEl.textContent = qualitySlider.value + "%";
  });
  qualitySlider.addEventListener("change", compressImage);
  formatSelect.addEventListener("change", compressImage);

  function compressImage() {
    if (!originalImage) return;

    const canvas = document.createElement("canvas");
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let outputType = formatSelect.value;
    if (outputType === "auto") {
      outputType = currentFile.type || "image/jpeg";
    }

    // Fill white background if converting to JPEG to prevent black transparent areas
    if (outputType === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(originalImage, 0, 0);

    const quality = parseFloat(qualitySlider.value) / 100;

    canvas.toBlob(
      blob => {
        if (!blob) {
          showToast("Compression failed. Please try a different format.", "error");
          return;
        }

        compressedBlob = blob;
        compressedPreview.src = URL.createObjectURL(blob);
        compressedSizeEl.textContent = formatBytes(blob.size);

        // Calculate savings
        const diff = currentFile.size - blob.size;
        const percent = Math.round((diff / currentFile.size) * 100);

        if (percent > 0) {
          savingsEl.textContent = `${percent}% Saved`;
          savingsEl.className = "stat-value highlight";
        } else {
          savingsEl.textContent = "0% (Optimized)";
          savingsEl.className = "stat-value";
        }

        downloadBtn.disabled = false;
        if (window.trackAnalyticsEvent) {
          window.trackAnalyticsEvent("tool_used", { tool: "image-compressor", percent_saved: percent });
        }
      },
      outputType,
      quality
    );
  }

  // Download
  downloadBtn.addEventListener("click", () => {
    if (!compressedBlob) return;
    let ext = "jpg";
    if (formatSelect.value === "image/png") ext = "png";
    else if (formatSelect.value === "image/webp") ext = "webp";
    else if (currentFile.name.endsWith(".png")) ext = "png";
    else if (currentFile.name.endsWith(".webp")) ext = "webp";

    const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf(".")) || "image";
    downloadBlob(compressedBlob, `${baseName}-compressed.${ext}`);
    showToast("Image downloaded successfully!", "success");
  });

  // Reset
  resetBtn.addEventListener("click", resetTool);

  function resetTool() {
    currentFile = null;
    originalImage = null;
    compressedBlob = null;
    fileInput.value = "";
    originalPreview.src = "";
    compressedPreview.src = "";
    workspace.style.display = "none";
    dropzone.style.display = "block";
    qualitySlider.value = 80;
    qualityValEl.textContent = "80%";
    formatSelect.value = "auto";
    savingsEl.textContent = "0%";
    downloadBtn.disabled = true;
  }
});
