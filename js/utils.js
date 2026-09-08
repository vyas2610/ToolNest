/**
 * ToolNest - Reusable Utility Functions
 * Toast notifications, file downloads, clipboard copying, format helpers.
 */

// Format byte count to human-readable string (KB, MB, GB)
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  if (!bytes || isNaN(bytes)) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Show accessible toast notification
function showToast(message, type = "info", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
  `;

  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => removeToast(toast));

  container.appendChild(toast);

  // Auto-remove
  const timeoutId = setTimeout(() => {
    removeToast(toast);
  }, duration);

  function removeToast(elem) {
    clearTimeout(timeoutId);
    elem.classList.add("toast-hiding");
    elem.addEventListener("transitionend", () => {
      if (elem.parentNode) elem.parentNode.removeChild(elem);
    }, { once: true });
  }
}

// Copy text to clipboard safely
async function copyToClipboard(text, successMessage = "Copied to clipboard!") {
  if (!text) {
    showToast("Nothing to copy.", "warning");
    return false;
  }
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showToast(successMessage, "success");
      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("copy_clicked");
      }
      return true;
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (successful) {
        showToast(successMessage, "success");
        if (window.trackAnalyticsEvent) {
          window.trackAnalyticsEvent("copy_clicked");
        }
        return true;
      } else {
        throw new Error("Copy command failed");
      }
    }
  } catch (err) {
    console.error("Copy failed: ", err);
    showToast("Failed to copy. Please copy manually.", "error");
    return false;
  }
}

// Download a Blob as a file
function downloadBlob(blob, filename) {
  if (!blob || !filename) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  
  if (window.trackAnalyticsEvent) {
    window.trackAnalyticsEvent("file_downloaded", { file_name: filename });
  }
}

// Download a Data URL as a file
function downloadDataUrl(dataUrl, filename) {
  if (!dataUrl || !filename) return;
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (window.trackAnalyticsEvent) {
    window.trackAnalyticsEvent("file_downloaded", { file_name: filename });
  }
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Debounce helper
function debounce(func, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Read File as DataURL
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Read File as ArrayBuffer
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file as ArrayBuffer"));
    reader.readAsArrayBuffer(file);
  });
}

// Read File as Text
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file as Text"));
    reader.readAsText(file);
  });
}

// Make globally accessible
if (typeof window !== "undefined") {
  window.formatBytes = formatBytes;
  window.showToast = showToast;
  window.copyToClipboard = copyToClipboard;
  window.downloadBlob = downloadBlob;
  window.downloadDataUrl = downloadDataUrl;
  window.escapeHtml = escapeHtml;
  window.debounce = debounce;
  window.fileToDataURL = fileToDataURL;
  window.readFileAsArrayBuffer = readFileAsArrayBuffer;
  window.readFileAsText = readFileAsText;
}
