/**
 * ToolNest - Image Cropper Tool Logic
 * Interactive canvas crop tool with aspect presets and 90-degree rotation.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("cropper-workspace");
  const stageCanvas = document.getElementById("stage-canvas");
  const previewCanvas = document.getElementById("preview-canvas");
  const cropBtn = document.getElementById("crop-btn");
  const downloadBtn = document.getElementById("download-btn");
  const resetBtn = document.getElementById("reset-btn");
  const rotateLeftBtn = document.getElementById("rotate-left-btn");
  const rotateRightBtn = document.getElementById("rotate-right-btn");
  const aspectButtons = document.querySelectorAll(".aspect-btn");
  const cropDimensionsEl = document.getElementById("crop-dimensions");

  let currentFile = null;
  let sourceImage = null;
  let rotationDeg = 0;
  let aspectMode = "free"; // "free", "1:1", "4:3", "16:9", "3:4"

  // Crop rectangle in stage canvas display coordinates
  let cropBox = { x: 50, y: 50, w: 200, h: 200 };
  let isDragging = false;
  let isResizing = false;
  let activeHandle = null;
  let dragStart = { x: 0, y: 0 };
  let initialCrop = { ...cropBox };

  let croppedBlob = null;

  if (!dropzone || !fileInput || !stageCanvas) return;

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
        sourceImage = img;
        rotationDeg = 0;
        dropzone.style.display = "none";
        workspace.style.display = "block";
        initStageCanvas();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function getTransformedSource() {
    // Generate a temporary canvas respecting current rotation
    const tempCanvas = document.createElement("canvas");
    const rad = (rotationDeg * Math.PI) / 180;
    const isRotated90 = rotationDeg % 180 !== 0;

    tempCanvas.width = isRotated90 ? sourceImage.naturalHeight : sourceImage.naturalWidth;
    tempCanvas.height = isRotated90 ? sourceImage.naturalWidth : sourceImage.naturalHeight;

    const ctx = tempCanvas.getContext("2d");
    ctx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(sourceImage, -sourceImage.naturalWidth / 2, -sourceImage.naturalHeight / 2);

    return tempCanvas;
  }

  function initStageCanvas() {
    const transformed = getTransformedSource();
    const maxWidth = Math.min(workspace.clientWidth - 40, 700);
    const scale = maxWidth / transformed.width;

    stageCanvas.width = transformed.width * Math.min(1, scale);
    stageCanvas.height = transformed.height * Math.min(1, scale);

    // Center initial crop box
    const initW = Math.round(stageCanvas.width * 0.7);
    let initH = Math.round(stageCanvas.height * 0.7);

    if (aspectMode === "1:1") {
      const s = Math.min(initW, initH);
      initH = s;
    }

    cropBox = {
      x: Math.round((stageCanvas.width - initW) / 2),
      y: Math.round((stageCanvas.height - initH) / 2),
      w: initW,
      h: initH
    };

    enforceAspect();
    drawStage();
    executeCrop();
  }

  function enforceAspect() {
    if (aspectMode === "free") return;
    let ratio = 1;
    if (aspectMode === "1:1") ratio = 1;
    else if (aspectMode === "4:3") ratio = 4 / 3;
    else if (aspectMode === "16:9") ratio = 16 / 9;
    else if (aspectMode === "3:4") ratio = 3 / 4;

    cropBox.h = Math.round(cropBox.w / ratio);
    if (cropBox.y + cropBox.h > stageCanvas.height) {
      cropBox.h = stageCanvas.height - cropBox.y;
      cropBox.w = Math.round(cropBox.h * ratio);
    }
  }

  function drawStage() {
    const ctx = stageCanvas.getContext("2d");
    const transformed = getTransformedSource();

    ctx.clearRect(0, 0, stageCanvas.width, stageCanvas.height);
    ctx.drawImage(transformed, 0, 0, stageCanvas.width, stageCanvas.height);

    // Dim overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, stageCanvas.width, stageCanvas.height);

    // Clear inside crop box
    ctx.clearRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
    ctx.drawImage(
      transformed,
      (cropBox.x / stageCanvas.width) * transformed.width,
      (cropBox.y / stageCanvas.height) * transformed.height,
      (cropBox.w / stageCanvas.width) * transformed.width,
      (cropBox.h / stageCanvas.height) * transformed.height,
      cropBox.x,
      cropBox.y,
      cropBox.w,
      cropBox.h
    );

    // Border
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);

    // Handles (corners and center sides)
    const handleSize = 8;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#2563eb";

    const handles = [
      { x: cropBox.x, y: cropBox.y }, // top-left
      { x: cropBox.x + cropBox.w, y: cropBox.y }, // top-right
      { x: cropBox.x, y: cropBox.y + cropBox.h }, // bottom-left
      { x: cropBox.x + cropBox.w, y: cropBox.y + cropBox.h } // bottom-right
    ];

    handles.forEach(h => {
      ctx.fillRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
    });
  }

  // Pointer interactions for dragging and resizing crop box
  function getCanvasCoords(e) {
    const rect = stageCanvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      x: ((clientX - rect.left) / rect.width) * stageCanvas.width,
      y: ((clientY - rect.top) / rect.height) * stageCanvas.height
    };
  }

  function getHitHandle(pos) {
    const threshold = 16;
    const { x, y, w, h } = cropBox;
    if (Math.hypot(pos.x - x, pos.y - y) < threshold) return "tl";
    if (Math.hypot(pos.x - (x + w), pos.y - y) < threshold) return "tr";
    if (Math.hypot(pos.x - x, pos.y - (y + h)) < threshold) return "bl";
    if (Math.hypot(pos.x - (x + w), pos.y - (y + h)) < threshold) return "br";
    return null;
  }

  function isInsideBox(pos) {
    return pos.x >= cropBox.x && pos.x <= cropBox.x + cropBox.w &&
           pos.y >= cropBox.y && pos.y <= cropBox.y + cropBox.h;
  }

  stageCanvas.addEventListener("mousedown", onPointerDown);
  stageCanvas.addEventListener("touchstart", onPointerDown, { passive: false });

  function onPointerDown(e) {
    e.preventDefault();
    const pos = getCanvasCoords(e);
    activeHandle = getHitHandle(pos);

    if (activeHandle) {
      isResizing = true;
    } else if (isInsideBox(pos)) {
      isDragging = true;
    } else {
      return;
    }

    dragStart = pos;
    initialCrop = { ...cropBox };
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging && !isResizing) return;
    e.preventDefault();
    const pos = getCanvasCoords(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;

    if (isDragging) {
      let nx = initialCrop.x + dx;
      let ny = initialCrop.y + dy;
      nx = Math.max(0, Math.min(nx, stageCanvas.width - initialCrop.w));
      ny = Math.max(0, Math.min(ny, stageCanvas.height - initialCrop.h));
      cropBox.x = nx;
      cropBox.y = ny;
    } else if (isResizing) {
      const minSize = 40;
      if (activeHandle === "br") {
        let nw = Math.max(minSize, initialCrop.w + dx);
        let nh = Math.max(minSize, initialCrop.h + dy);
        nw = Math.min(nw, stageCanvas.width - cropBox.x);
        nh = Math.min(nh, stageCanvas.height - cropBox.y);
        cropBox.w = nw;
        cropBox.h = nh;
      } else if (activeHandle === "tl") {
        let nx = Math.min(initialCrop.x + dx, initialCrop.x + initialCrop.w - minSize);
        let ny = Math.min(initialCrop.y + dy, initialCrop.y + initialCrop.h - minSize);
        nx = Math.max(0, nx);
        ny = Math.max(0, ny);
        cropBox.w = initialCrop.w + (initialCrop.x - nx);
        cropBox.h = initialCrop.h + (initialCrop.y - ny);
        cropBox.x = nx;
        cropBox.y = ny;
      }
      enforceAspect();
    }

    drawStage();
  }

  function onPointerUp() {
    isDragging = false;
    isResizing = false;
    activeHandle = null;
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mouseup", onPointerUp);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchend", onPointerUp);
    executeCrop();
  }

  // Aspect ratio switch
  aspectButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      aspectButtons.forEach(b => b.classList.remove("btn-primary"));
      aspectButtons.forEach(b => b.classList.add("btn-secondary"));
      btn.classList.remove("btn-secondary");
      btn.classList.add("btn-primary");
      aspectMode = btn.getAttribute("data-aspect");
      enforceAspect();
      drawStage();
      executeCrop();
    });
  });

  // Rotation
  rotateLeftBtn.addEventListener("click", () => {
    rotationDeg = (rotationDeg - 90 + 360) % 360;
    initStageCanvas();
  });

  rotateRightBtn.addEventListener("click", () => {
    rotationDeg = (rotationDeg + 90) % 360;
    initStageCanvas();
  });

  cropBtn.addEventListener("click", executeCrop);

  function executeCrop() {
    if (!sourceImage) return;

    const transformed = getTransformedSource();
    const scaleX = transformed.width / stageCanvas.width;
    const scaleY = transformed.height / stageCanvas.height;

    const realX = Math.round(cropBox.x * scaleX);
    const realY = Math.round(cropBox.y * scaleY);
    const realW = Math.round(cropBox.w * scaleX);
    const realH = Math.round(cropBox.h * scaleY);

    previewCanvas.width = realW;
    previewCanvas.height = realH;
    const pCtx = previewCanvas.getContext("2d");
    pCtx.drawImage(transformed, realX, realY, realW, realH, 0, 0, realW, realH);

    cropDimensionsEl.textContent = `${realW} x ${realH} px`;

    previewCanvas.toBlob(blob => {
      croppedBlob = blob;
      downloadBtn.disabled = false;
    }, "image/png");
  }

  downloadBtn.addEventListener("click", () => {
    if (!croppedBlob) return;
    const baseName = currentFile.name.replace(/\.[^/.]+$/, "") || "image";
    downloadBlob(croppedBlob, `${baseName}-cropped.png`);
    showToast("Cropped image downloaded!", "success");
    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent("tool_used", { tool: "image-cropper" });
    }
  });

  resetBtn.addEventListener("click", () => {
    currentFile = null;
    sourceImage = null;
    croppedBlob = null;
    rotationDeg = 0;
    aspectMode = "free";
    fileInput.value = "";
    workspace.style.display = "none";
    dropzone.style.display = "block";
    downloadBtn.disabled = true;
  });
});
