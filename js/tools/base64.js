/**
 * ToolNest - Base64 Encoder / Decoder Logic
 * Complete UTF-8 Unicode support with robust error handling.
 */

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("text-input");
  const outputEl = document.getElementById("text-output");
  const encodeBtn = document.getElementById("encode-btn");
  const decodeBtn = document.getElementById("decode-btn");
  const copyBtn = document.getElementById("copy-btn");
  const clearBtn = document.getElementById("clear-btn");
  const swapBtn = document.getElementById("swap-btn");
  const errorBox = document.getElementById("error-box");
  const errorMsg = document.getElementById("error-msg");

  if (!inputEl) return;

  // UTF-8 Unicode safe Base64 encoding
  function utf8ToBase64(str) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // UTF-8 Unicode safe Base64 decoding
  function base64ToUtf8(str) {
    // Sanitize string (strip whitespace/newlines)
    const sanitized = str.replace(/\s+/g, "");
    const binary = window.atob(sanitized);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8", { fatal: true });
    return decoder.decode(bytes);
  }

  function handleEncode() {
    hideError();
    const text = inputEl.value;
    if (!text) {
      showToast("Please enter text to encode.", "warning");
      return;
    }

    try {
      const encoded = utf8ToBase64(text);
      outputEl.value = encoded;
      showToast("Encoded to Base64!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "base64", action: "encode" });
      }
    } catch (err) {
      showError("Encoding error: " + err.message);
    }
  }

  function handleDecode() {
    hideError();
    const text = inputEl.value.trim();
    if (!text) {
      showToast("Please enter Base64 to decode.", "warning");
      return;
    }

    try {
      const decoded = base64ToUtf8(text);
      outputEl.value = decoded;
      showToast("Decoded from Base64!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "base64", action: "decode" });
      }
    } catch (err) {
      showError("Invalid Base64 string. Please check for missing characters, extra spaces, or invalid padding.");
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.style.display = "flex";
    showToast(msg, "error");
  }

  function hideError() {
    errorBox.style.display = "none";
    errorMsg.textContent = "";
  }

  encodeBtn.addEventListener("click", handleEncode);
  decodeBtn.addEventListener("click", handleDecode);

  copyBtn.addEventListener("click", () => {
    copyToClipboard(outputEl.value, "Output copied to clipboard!");
  });

  clearBtn.addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    hideError();
    inputEl.focus();
    showToast("Cleared.", "info");
  });

  swapBtn.addEventListener("click", () => {
    const temp = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = temp;
    hideError();
    showToast("Swapped input and output.", "info");
  });
});
