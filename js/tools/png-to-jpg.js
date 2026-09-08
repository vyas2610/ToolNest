/**
 * ToolNest - PNG to JPG Converter
 * Converts PNG files to JPG with custom background color fill for transparent areas.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("converter-workspace");
  const previewImg = document.getElementById("preview-image");
  const bgColorInput = document.getElementById("bg-color");
  const qualitySlider = document.getElementById("quality-slider");
  const qualityValEl = document.getElementById("quality-val");
  const convertBtn = document.getElementById("convert-btn");
  const downloadBtn = document.getElementById("download-btn");
  const resetBtn = document.getElementById("reset-btn");
  const originalSizeEl = document.getElementById("original-size");
  const jpgSizeEl = document.getElementById("jpg-size");

  let currentFile = null;
  let originalImage = null;
  let convertedBlob = null;

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

  function handleFile(file) {
    if (!file.type.includes("png") && !file.name.match(/\.png$/i)) {
      showToast("Please upload a PNG image.", "error");
      return;
    }

    currentFile = file;
    originalSizeEl.textContent = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        previewImg.src = e.target.result;
        dropzone.style.display = "none";
        workspace.style.display = "block";
        processConversion();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  qualitySlider.addEventListener("input", () => {
    qualityValEl.textContent = qualitySlider.value + "%";
  });
  qualitySlider.addEventListener("change", processConversion);
  bgColorInput.addEventListener("input", processConversion);
  convertBtn.addEventListener("click", processConversion);

  function processConversion() {
    if (!originalImage) return;

    const canvas = document.createElement("canvas");
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    const ctx = canvas.getContext("2d");

    // Fill background color for transparent pixels
    ctx.fillStyle = bgColorInput.value || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the PNG onto the canvas
    ctx.drawImage(originalImage, 0, 0);

    const quality = parseFloat(qualitySlider.value) / 100;

    canvas.toBlob(blob => {
      if (!blob) {
        showToast("Conversion to JPG failed.", "error");
        return;
      }
      convertedBlob = blob;
      previewImg.src = URL.createObjectURL(blob);
      jpgSizeEl.textContent = formatBytes(blob.size);
      downloadBtn.disabled = false;

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "png-to-jpg" });
      }
    }, "image/jpeg", quality);
  }

  downloadBtn.addEventListener("click", () => {
    if (!convertedBlob) return;
    const baseName = currentFile.name.replace(/\.[^/.]+$/, "") || "image";
    downloadBlob(convertedBlob, `${baseName}.jpg`);
  });

  resetBtn.addEventListener("click", () => {
    currentFile = null;
    originalImage = null;
    convertedBlob = null;
    fileInput.value = "";
    previewImg.src = "";
    workspace.style.display = "none";
    dropzone.style.display = "block";
    downloadBtn.disabled = true;
    jpgSizeEl.textContent = "-";
  });
});
