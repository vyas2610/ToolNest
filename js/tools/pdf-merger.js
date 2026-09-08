/**
 * ToolNest - PDF Merger Logic
 * Client-side PDF concatenation using PDF-Lib.
 * Fully private: no files uploaded to any server.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("merger-workspace");
  const fileListEl = document.getElementById("file-list");
  const addMoreBtn = document.getElementById("add-more-btn");
  const mergeBtn = document.getElementById("merge-btn");
  const downloadBtn = document.getElementById("download-btn");
  const resetBtn = document.getElementById("reset-btn");
  const totalFilesEl = document.getElementById("total-files");
  const totalPagesEl = document.getElementById("total-pages");
  const statusMsgEl = document.getElementById("status-msg");

  let pdfFiles = []; // Array of { id, file, name, size, arrayBuffer, pageCount }
  let mergedPdfBlob = null;

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());
  ["dragenter", "dragover"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add("dragover"); }));
  ["dragleave", "drop"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove("dragover"); }));

  dropzone.addEventListener("drop", e => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(Array.from(e.dataTransfer.files));
  });

  fileInput.addEventListener("change", e => {
    if (e.target.files && e.target.files.length > 0) handleFiles(Array.from(e.target.files));
  });

  if (addMoreBtn) addMoreBtn.addEventListener("click", () => fileInput.click());

  async function handleFiles(files) {
    const valid = files.filter(f => f.type === "application/pdf" || f.name.match(/\.pdf$/i));
    if (!valid.length) {
      showToast("Please select valid PDF files.", "error");
      return;
    }

    if (!window.PDFLib) {
      showToast("PDF engine loading. Please wait a moment.", "info");
      return;
    }

    showToast(`Loading ${valid.length} PDF(s)...`, "info");

    for (const file of valid) {
      try {
        const buffer = await readFileAsArrayBuffer(file);
        const doc = await PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = doc.getPageCount();

        pdfFiles.push({
          id: "pdf-" + Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          arrayBuffer: buffer,
          pageCount: count
        });
      } catch (err) {
        console.warn("Could not load PDF: " + file.name, err);
        showToast(`Skipped encrypted or corrupted file: ${file.name}`, "warning");
      }
    }

    renderFileList();
    dropzone.style.display = "none";
    workspace.style.display = "block";
  }

  function renderFileList() {
    if (!pdfFiles.length) {
      resetTool();
      return;
    }

    let pagesSum = 0;
    pdfFiles.forEach(f => pagesSum += f.pageCount);

    totalFilesEl.textContent = `${pdfFiles.length} file(s)`;
    totalPagesEl.textContent = `${pagesSum} page(s)`;

    fileListEl.innerHTML = pdfFiles.map((item, idx) => `
      <div class="pdf-file-row" data-id="${item.id}">
        <div class="pdf-row-order">${idx + 1}</div>
        <div class="pdf-row-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="pdf-row-details">
          <div class="pdf-row-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
          <div class="pdf-row-meta">${formatBytes(item.size)} &bull; ${item.pageCount} page(s)</div>
        </div>
        <div class="pdf-row-controls">
          <button type="button" class="btn btn-outline btn-sm action-up" ${idx === 0 ? "disabled" : ""} title="Move up">&uarr;</button>
          <button type="button" class="btn btn-outline btn-sm action-down" ${idx === pdfFiles.length - 1 ? "disabled" : ""} title="Move down">&darr;</button>
          <button type="button" class="btn btn-outline btn-sm action-del text-danger" title="Remove">&times;</button>
        </div>
      </div>
    `).join("");

    // Bind controls
    fileListEl.querySelectorAll(".pdf-file-row").forEach(rowEl => {
      const id = rowEl.getAttribute("data-id");
      const idx = pdfFiles.findIndex(x => x.id === id);

      const up = rowEl.querySelector(".action-up");
      const dn = rowEl.querySelector(".action-down");
      const del = rowEl.querySelector(".action-del");

      if (up) up.addEventListener("click", () => {
        if (idx > 0) {
          const t = pdfFiles[idx];
          pdfFiles[idx] = pdfFiles[idx - 1];
          pdfFiles[idx - 1] = t;
          renderFileList();
        }
      });

      if (dn) dn.addEventListener("click", () => {
        if (idx < pdfFiles.length - 1) {
          const t = pdfFiles[idx];
          pdfFiles[idx] = pdfFiles[idx + 1];
          pdfFiles[idx + 1] = t;
          renderFileList();
        }
      });

      if (del) del.addEventListener("click", () => {
        pdfFiles.splice(idx, 1);
        renderFileList();
      });
    });

    mergeBtn.disabled = pdfFiles.length < 2;
  }

  mergeBtn.addEventListener("click", async () => {
    if (pdfFiles.length < 2) {
      showToast("Please add at least 2 PDF files to merge.", "warning");
      return;
    }

    mergeBtn.disabled = true;
    mergeBtn.textContent = "Merging PDFs...";
    if (statusMsgEl) statusMsgEl.textContent = "Combining PDF documents into one...";

    try {
      const { PDFDocument } = PDFLib;
      const mergedDoc = await PDFDocument.create();

      for (const item of pdfFiles) {
        const doc = await PDFDocument.load(item.arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach(page => mergedDoc.addPage(page));
      }

      const mergedPdfBytes = await mergedDoc.save();
      mergedPdfBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });

      downloadBtn.disabled = false;
      mergeBtn.disabled = false;
      mergeBtn.textContent = "Merge Again";
      if (statusMsgEl) statusMsgEl.textContent = `Merged successfully! File size: ${formatBytes(mergedPdfBlob.size)}`;
      showToast("PDFs merged successfully!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "pdf-merger", file_count: pdfFiles.length });
      }
    } catch (err) {
      console.error(err);
      showToast("Error merging PDFs: " + err.message, "error");
      mergeBtn.disabled = false;
      mergeBtn.textContent = "Merge PDFs";
    }
  });

  downloadBtn.addEventListener("click", () => {
    if (!mergedPdfBlob) return;
    downloadBlob(mergedPdfBlob, "toolnest-merged.pdf");
    showToast("Merged PDF downloaded!", "success");
  });

  resetBtn.addEventListener("click", resetTool);

  function resetTool() {
    pdfFiles = [];
    mergedPdfBlob = null;
    fileInput.value = "";
    fileListEl.innerHTML = "";
    workspace.style.display = "none";
    dropzone.style.display = "block";
    downloadBtn.disabled = true;
    mergeBtn.disabled = true;
    mergeBtn.textContent = "Merge PDFs";
    if (statusMsgEl) statusMsgEl.textContent = "";
  }
});
