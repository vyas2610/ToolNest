/**
 * ToolNest - Image Resizer Tool Logic
 * Resize images client-side by exact pixels or preset ratios.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("resizer-workspace");
  const previewImg = document.getElementById("preview-image");
  const widthInput = document.getElementById("target-width");
  const heightInput = document.getElementById("target-height");
  const lockAspectCheckbox = document.getElementById("lock-aspect");
  const presetSelect = document.getElementById("preset-select");
  const formatSelect = document.getElementById("format-select");
  const resizeBtn = document.getElementById("resize-btn");
  const downloadBtn = document.getElementById("download-btn");
  const resetBtn = document.getElementById("reset-btn");
  const originalDimensionsEl = document.getElementById("original-dimensions");
  const newDimensionsEl = document.getElementById("new-dimensions");
  const newSizeEl = document.getElementById("new-size");

  let currentFile = null;
  let originalImage = null;
  let aspectRatio = 1;
  let resizedBlob = null;

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
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (JPG, PNG, WebP).", "error");
      return;
    }

    currentFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        aspectRatio = img.naturalWidth / img.naturalHeight;
        widthInput.value = img.naturalWidth;
        heightInput.value = img.naturalHeight;
        originalDimensionsEl.textContent = `${img.naturalWidth} x ${img.naturalHeight} px`;
        newDimensionsEl.textContent = `${img.naturalWidth} x ${img.naturalHeight} px`;
        previewImg.src = e.target.result;

        dropzone.style.display = "none";
        workspace.style.display = "block";
        processResize();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Aspect ratio synchronization
  widthInput.addEventListener("input", () => {
    presetSelect.value = "custom";
    if (lockAspectCheckbox.checked && aspectRatio) {
      const w = parseInt(widthInput.value, 10);
      if (w > 0) {
        heightInput.value = Math.round(w / aspectRatio);
      }
    }
  });

  heightInput.addEventListener("input", () => {
    presetSelect.value = "custom";
    if (lockAspectCheckbox.checked && aspectRatio) {
      const h = parseInt(heightInput.value, 10);
      if (h > 0) {
        widthInput.value = Math.round(h * aspectRatio);
      }
    }
  });

  // Preset selector
  presetSelect.addEventListener("change", () => {
    const val = presetSelect.value;
    if (val === "custom") return;

    const [pw, ph] = val.split("x").map(Number);
    if (pw && ph) {
      lockAspectCheckbox.checked = false; // Presets enforce explicit target dimensions
      widthInput.value = pw;
      heightInput.value = ph;
    }
  });

  resizeBtn.addEventListener("click", processResize);

  function processResize() {
    if (!originalImage) return;

    const targetWidth = parseInt(widthInput.value, 10);
    const targetHeight = parseInt(heightInput.value, 10);

    if (!targetWidth || targetWidth <= 0 || !targetHeight || targetHeight <= 0) {
      showToast("Please specify valid positive pixel dimensions.", "warning");
      return;
    }

    if (targetWidth > 12000 || targetHeight > 12000) {
      showToast("Dimensions cannot exceed 12,000 pixels for browser memory safety.", "warning");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    let outFormat = formatSelect.value;
    if (outFormat === "auto") {
      outFormat = currentFile.type || "image/jpeg";
    }

    if (outFormat === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);

    canvas.toBlob(blob => {
      if (!blob) {
        showToast("Resize operation failed.", "error");
        return;
      }
      resizedBlob = blob;
      previewImg.src = URL.createObjectURL(blob);
      newDimensionsEl.textContent = `${targetWidth} x ${targetHeight} px`;
      newSizeEl.textContent = formatBytes(blob.size);
      downloadBtn.disabled = false;
      showToast("Image resized successfully!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "image-resizer", target_width: targetWidth });
      }
    }, outFormat, 0.92);
  }

  // Download
  downloadBtn.addEventListener("click", () => {
    if (!resizedBlob) return;
    const w = widthInput.value;
    const h = heightInput.value;
    let ext = "jpg";
    if (formatSelect.value === "image/png") ext = "png";
    else if (formatSelect.value === "image/webp") ext = "webp";
    else if (currentFile.name.endsWith(".png")) ext = "png";

    const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf(".")) || "image";
    downloadBlob(resizedBlob, `${baseName}-${w}x${h}.${ext}`);
  });

  // Reset
  resetBtn.addEventListener("click", () => {
    currentFile = null;
    originalImage = null;
    resizedBlob = null;
    fileInput.value = "";
    previewImg.src = "";
    workspace.style.display = "none";
    dropzone.style.display = "block";
    downloadBtn.disabled = true;
    presetSelect.value = "custom";
    lockAspectCheckbox.checked = true;
  });
});
