/**
 * ToolNest - JPG to PDF Converter Logic
 * Combines multiple images into a clean PDF using jsPDF.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("converter-workspace");
  const imageListEl = document.getElementById("image-list");
  const pageSizeSelect = document.getElementById("page-size");
  const orientationSelect = document.getElementById("orientation");
  const marginSelect = document.getElementById("margin-select");
  const generateBtn = document.getElementById("generate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const resetBtn = document.getElementById("reset-btn");
  const addMoreBtn = document.getElementById("add-more-btn");
  const statusMsgEl = document.getElementById("status-msg");

  let uploadedImages = []; // Array of { id, file, name, dataUrl, width, height }
  let generatedPdfBlob = null;

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());
  ["dragenter", "dragover"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add("dragover"); }));
  ["dragleave", "drop"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove("dragover"); }));

  dropzone.addEventListener("drop", e => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  });

  fileInput.addEventListener("change", e => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  });

  if (addMoreBtn) {
    addMoreBtn.addEventListener("click", () => fileInput.click());
  }

  function handleFiles(files) {
    const validFiles = files.filter(f => f.type.startsWith("image/"));
    if (!validFiles.length) {
      showToast("Please upload valid image files (JPG, PNG, WebP).", "error");
      return;
    }

    let loadedCount = 0;
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          uploadedImages.push({
            id: "img-" + Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            dataUrl: e.target.result,
            width: img.naturalWidth,
            height: img.naturalHeight
          });

          loadedCount++;
          if (loadedCount === validFiles.length) {
            renderImageList();
            dropzone.style.display = "none";
            workspace.style.display = "block";
            showToast(`${validFiles.length} image(s) added!`, "success");
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderImageList() {
    if (!uploadedImages.length) {
      resetTool();
      return;
    }

    imageListEl.innerHTML = uploadedImages.map((img, idx) => `
      <div class="pdf-image-item" data-id="${img.id}">
        <div class="pdf-thumb-wrapper">
          <img src="${img.dataUrl}" alt="${escapeHtml(img.name)}" class="pdf-thumb" />
          <span class="pdf-item-number">${idx + 1}</span>
        </div>
        <div class="pdf-item-info">
          <div class="pdf-item-name" title="${escapeHtml(img.name)}">${escapeHtml(img.name)}</div>
          <div class="pdf-item-dims">${img.width} &times; ${img.height} px &bull; ${formatBytes(img.file.size)}</div>
        </div>
        <div class="pdf-item-actions">
          <button type="button" class="btn btn-outline btn-sm action-up" ${idx === 0 ? "disabled" : ""} title="Move up">&uarr;</button>
          <button type="button" class="btn btn-outline btn-sm action-down" ${idx === uploadedImages.length - 1 ? "disabled" : ""} title="Move down">&darr;</button>
          <button type="button" class="btn btn-outline btn-sm action-remove text-danger" title="Remove">&times;</button>
        </div>
      </div>
    `).join("");

    // Bind item buttons
    imageListEl.querySelectorAll(".pdf-image-item").forEach(itemEl => {
      const id = itemEl.getAttribute("data-id");
      const idx = uploadedImages.findIndex(x => x.id === id);

      const upBtn = itemEl.querySelector(".action-up");
      const downBtn = itemEl.querySelector(".action-down");
      const rmBtn = itemEl.querySelector(".action-remove");

      if (upBtn) {
        upBtn.addEventListener("click", () => {
          if (idx > 0) {
            const temp = uploadedImages[idx];
            uploadedImages[idx] = uploadedImages[idx - 1];
            uploadedImages[idx - 1] = temp;
            renderImageList();
          }
        });
      }

      if (downBtn) {
        downBtn.addEventListener("click", () => {
          if (idx < uploadedImages.length - 1) {
            const temp = uploadedImages[idx];
            uploadedImages[idx] = uploadedImages[idx + 1];
            uploadedImages[idx + 1] = temp;
            renderImageList();
          }
        });
      }

      if (rmBtn) {
        rmBtn.addEventListener("click", () => {
          uploadedImages.splice(idx, 1);
          renderImageList();
        });
      }
    });

    generateBtn.disabled = uploadedImages.length === 0;
  }

  generateBtn.addEventListener("click", async () => {
    if (!uploadedImages.length) return;

    if (!window.jspdf || !window.jspdf.jsPDF) {
      showToast("PDF generation library is loading. Please wait...", "info");
      return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating PDF...";
    if (statusMsgEl) statusMsgEl.textContent = "Building PDF document...";

    try {
      const { jsPDF } = window.jspdf;
      const pageSize = pageSizeSelect.value; // "a4", "letter", "fit"
      const orientChoice = orientationSelect.value; // "p", "l", "auto"
      const marginVal = parseInt(marginSelect.value, 10) || 0; // mm

      let doc = null;

      for (let i = 0; i < uploadedImages.length; i++) {
        const item = uploadedImages[i];
        let orient = orientChoice;
        if (orient === "auto") {
          orient = item.width >= item.height ? "l" : "p";
        }

        let docPageFormat = pageSize === "letter" ? "letter" : "a4";

        if (pageSize === "fit") {
          // Fit page to image aspect
          const imgAspect = item.width / item.height;
          const pageW = 210; // mm
          const pageH = pageW / imgAspect;
          docPageFormat = [pageW, pageH];
          orient = "p";
        }

        if (i === 0) {
          doc = new jsPDF({
            orientation: orient,
            unit: "mm",
            format: docPageFormat
          });
        } else {
          doc.addPage(docPageFormat, orient);
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const usableW = pageWidth - marginVal * 2;
        const usableH = pageHeight - marginVal * 2;

        // Compute aspect fit
        const imgRatio = item.width / item.height;
        const boxRatio = usableW / usableH;

        let renderW, renderH;
        if (imgRatio > boxRatio) {
          renderW = usableW;
          renderH = usableW / imgRatio;
        } else {
          renderH = usableH;
          renderW = usableH * imgRatio;
        }

        const renderX = marginVal + (usableW - renderW) / 2;
        const renderY = marginVal + (usableH - renderH) / 2;

        const formatType = item.file.type.includes("png") ? "PNG" : "JPEG";
        doc.addImage(item.dataUrl, formatType, renderX, renderY, renderW, renderH);
      }

      generatedPdfBlob = doc.output("blob");
      downloadBtn.disabled = false;
      generateBtn.textContent = "Re-generate PDF";
      generateBtn.disabled = false;
      if (statusMsgEl) statusMsgEl.textContent = `PDF Ready! Size: ${formatBytes(generatedPdfBlob.size)}`;
      showToast("PDF created successfully!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "jpg-to-pdf", page_count: uploadedImages.length });
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to generate PDF: " + err.message, "error");
      generateBtn.textContent = "Generate PDF";
      generateBtn.disabled = false;
    }
  });

  downloadBtn.addEventListener("click", () => {
    if (!generatedPdfBlob) return;
    downloadBlob(generatedPdfBlob, "toolnest-converted-images.pdf");
    showToast("PDF downloaded!", "success");
  });

  resetBtn.addEventListener("click", resetTool);

  function resetTool() {
    uploadedImages = [];
    generatedPdfBlob = null;
    fileInput.value = "";
    imageListEl.innerHTML = "";
    workspace.style.display = "none";
    dropzone.style.display = "block";
    downloadBtn.disabled = true;
    generateBtn.disabled = true;
    generateBtn.textContent = "Generate PDF";
    if (statusMsgEl) statusMsgEl.textContent = "";
  }
});
