/**
 * ToolNest - Duplicate Line Remover Logic
 * High performance line deduplication with sorting, whitespace trimming, and metrics.
 */

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("text-input");
  const outputEl = document.getElementById("text-output");
  const trimCheckbox = document.getElementById("opt-trim");
  const caseCheckbox = document.getElementById("opt-case");
  const emptyCheckbox = document.getElementById("opt-empty");
  const sortSelect = document.getElementById("sort-select");
  const removeBtn = document.getElementById("remove-btn");
  const copyBtn = document.getElementById("copy-btn");
  const downloadBtn = document.getElementById("download-btn");
  const clearBtn = document.getElementById("clear-btn");
  const sampleBtn = document.getElementById("sample-btn");

  const statOriginalEl = document.getElementById("stat-original");
  const statUniqueEl = document.getElementById("stat-unique");
  const statRemovedEl = document.getElementById("stat-removed");

  if (!inputEl) return;

  function processLines() {
    const rawText = inputEl.value;
    if (!rawText) {
      outputEl.value = "";
      updateStats(0, 0, 0);
      return;
    }

    const trim = trimCheckbox.checked;
    const caseSensitive = caseCheckbox.checked;
    const removeEmpty = emptyCheckbox.checked;
    const sortMode = sortSelect.value; // "none", "asc", "desc"

    let lines = rawText.split(/\r?\n/);
    const originalCount = lines.length;

    const seen = new Set();
    const resultLines = [];

    for (let line of lines) {
      if (trim) line = line.trim();
      if (removeEmpty && line.length === 0) continue;

      const compareKey = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(compareKey)) {
        seen.add(compareKey);
        resultLines.push(line);
      }
    }

    if (sortMode === "asc") {
      resultLines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseSensitive ? "case" : "base" }));
    } else if (sortMode === "desc") {
      resultLines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: caseSensitive ? "case" : "base" }));
    }

    outputEl.value = resultLines.join("\n");
    const uniqueCount = resultLines.length;
    const removedCount = originalCount - uniqueCount;

    updateStats(originalCount, uniqueCount, removedCount);
  }

  function updateStats(orig, uniq, rm) {
    statOriginalEl.textContent = orig.toLocaleString();
    statUniqueEl.textContent = uniq.toLocaleString();
    statRemovedEl.textContent = rm.toLocaleString();
  }

  removeBtn.addEventListener("click", () => {
    processLines();
    showToast("Duplicates removed!", "success");
    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent("tool_used", { tool: "duplicate-line-remover" });
    }
  });

  [trimCheckbox, caseCheckbox, emptyCheckbox, sortSelect].forEach(el => {
    el.addEventListener("change", processLines);
  });

  inputEl.addEventListener("input", debounce(processLines, 400));

  copyBtn.addEventListener("click", () => {
    copyToClipboard(outputEl.value, "Unique lines copied to clipboard!");
  });

  downloadBtn.addEventListener("click", () => {
    if (!outputEl.value) {
      showToast("No content to download.", "warning");
      return;
    }
    const blob = new Blob([outputEl.value], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, "toolnest-deduped-list.txt");
  });

  clearBtn.addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    updateStats(0, 0, 0);
    inputEl.focus();
    showToast("Cleared.", "info");
  });

  sampleBtn.addEventListener("click", () => {
    inputEl.value = `apple
banana
orange
Apple
apple
grape
banana
orange
mango
pineapple
grape`;
    processLines();
    showToast("Sample list loaded.", "success");
  });
});
