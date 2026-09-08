/**
 * ToolNest - JSON Formatter & Validator Logic
 * Formats, prettifies, minifies, and validates JSON with line & column error pinpointing.
 * Pure native browser client-side execution.
 */

document.addEventListener("DOMContentLoaded", () => {
  const jsonInput = document.getElementById("json-input");
  const indentSelect = document.getElementById("indent-select");
  const formatBtn = document.getElementById("format-btn");
  const minifyBtn = document.getElementById("minify-btn");
  const validateBtn = document.getElementById("validate-btn");
  const copyBtn = document.getElementById("copy-btn");
  const downloadBtn = document.getElementById("download-btn");
  const clearBtn = document.getElementById("clear-btn");
  const sampleBtn = document.getElementById("sample-btn");
  const errorBox = document.getElementById("json-error-box");
  const errorMsg = document.getElementById("json-error-msg");
  const statSizeEl = document.getElementById("stat-size");
  const statKeysEl = document.getElementById("stat-keys");

  if (!jsonInput) return;

  function countKeys(obj) {
    if (typeof obj !== "object" || obj === null) return 0;
    let count = 0;
    if (Array.isArray(obj)) {
      count = obj.length;
    } else {
      count = Object.keys(obj).length;
    }
    return count;
  }

  function formatJSON(indentValue) {
    const raw = jsonInput.value.trim();
    hideError();

    if (!raw) {
      showToast("Please enter or paste JSON to format.", "warning");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const indent = indentValue === "tab" ? "\t" : parseInt(indentValue, 10);
      const formatted = JSON.stringify(parsed, null, indent);
      jsonInput.value = formatted;

      statSizeEl.textContent = formatBytes(new Blob([formatted]).size);
      statKeysEl.textContent = countKeys(parsed).toLocaleString();
      showToast("JSON formatted successfully!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "json-formatter", action: "format" });
      }
    } catch (err) {
      displayError(err, raw);
    }
  }

  function minifyJSON() {
    const raw = jsonInput.value.trim();
    hideError();

    if (!raw) {
      showToast("Please enter JSON to minify.", "warning");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const minified = JSON.stringify(parsed);
      jsonInput.value = minified;

      statSizeEl.textContent = formatBytes(new Blob([minified]).size);
      statKeysEl.textContent = countKeys(parsed).toLocaleString();
      showToast("JSON minified successfully!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "json-formatter", action: "minify" });
      }
    } catch (err) {
      displayError(err, raw);
    }
  }

  function validateJSON() {
    const raw = jsonInput.value.trim();
    hideError();

    if (!raw) {
      showToast("Please enter JSON to validate.", "warning");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      statSizeEl.textContent = formatBytes(new Blob([raw]).size);
      statKeysEl.textContent = countKeys(parsed).toLocaleString();
      showToast("Valid JSON! No syntax errors found.", "success");
    } catch (err) {
      displayError(err, raw);
    }
  }

  function displayError(err, text) {
    let positionInfo = "";
    // Attempt to extract position from browser error message
    const match = err.message.match(/at position (\d+)/i) || err.message.match(/line (\d+) column (\d+)/i);

    if (match) {
      if (match[2]) {
        positionInfo = ` (Line: ${match[1]}, Column: ${match[2]})`;
      } else {
        const charIndex = parseInt(match[1], 10);
        const upToError = text.substring(0, charIndex);
        const lines = upToError.split("\n");
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        positionInfo = ` (Line: ${line}, Column: ${col})`;
      }
    }

    errorMsg.textContent = `${err.message}${positionInfo}`;
    errorBox.style.display = "flex";
    showToast("Invalid JSON syntax: " + err.message, "error");
  }

  function hideError() {
    errorBox.style.display = "none";
    errorMsg.textContent = "";
  }

  formatBtn.addEventListener("click", () => formatJSON(indentSelect.value));
  minifyBtn.addEventListener("click", minifyJSON);
  validateBtn.addEventListener("click", validateJSON);

  copyBtn.addEventListener("click", () => {
    copyToClipboard(jsonInput.value, "JSON copied to clipboard!");
  });

  downloadBtn.addEventListener("click", () => {
    const content = jsonInput.value;
    if (!content) {
      showToast("No JSON to download.", "warning");
      return;
    }
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    downloadBlob(blob, "data.json");
  });

  clearBtn.addEventListener("click", () => {
    jsonInput.value = "";
    hideError();
    statSizeEl.textContent = "0 Bytes";
    statKeysEl.textContent = "0";
    jsonInput.focus();
    showToast("Cleared JSON input.", "info");
  });

  sampleBtn.addEventListener("click", () => {
    const sample = {
      name: "ToolNest",
      tagline: "Simple, Fast & Free Online Tools",
      version: "1.0.0",
      features: [
        "100% Client-Side Processing",
        "Zero Framework Overhead",
        "Total Privacy Guaranteed",
        "Mobile Friendly"
      ],
      categories: {
        images: 5,
        pdf: 4,
        text: 3,
        developer: 3
      },
      openSource: true
    };
    jsonInput.value = JSON.stringify(sample, null, 2);
    hideError();
    statSizeEl.textContent = formatBytes(new Blob([jsonInput.value]).size);
    statKeysEl.textContent = Object.keys(sample).length.toString();
    showToast("Sample JSON loaded.", "success");
  });
});
