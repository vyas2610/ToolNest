/**
 * ToolNest - URL Encoder / Decoder Logic
 * Component encoding & full URL decoding with malformed URI sequence detection.
 */

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("text-input");
  const outputEl = document.getElementById("text-output");
  const encodeModeSelect = document.getElementById("encode-mode");
  const encodeBtn = document.getElementById("encode-btn");
  const decodeBtn = document.getElementById("decode-btn");
  const copyBtn = document.getElementById("copy-btn");
  const clearBtn = document.getElementById("clear-btn");
  const swapBtn = document.getElementById("swap-btn");
  const errorBox = document.getElementById("error-box");
  const errorMsg = document.getElementById("error-msg");

  if (!inputEl) return;

  function handleEncode() {
    hideError();
    const text = inputEl.value;
    if (!text) {
      showToast("Please enter a URL or text to encode.", "warning");
      return;
    }

    try {
      const mode = encodeModeSelect.value;
      const encoded = mode === "component" ? encodeURIComponent(text) : encodeURI(text);
      outputEl.value = encoded;
      showToast("URL encoded successfully!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "url-encoder-decoder", action: "encode" });
      }
    } catch (err) {
      showError("Encoding failed: " + err.message);
    }
  }

  function handleDecode() {
    hideError();
    const text = inputEl.value;
    if (!text) {
      showToast("Please enter encoded URL text to decode.", "warning");
      return;
    }

    try {
      // Decode replaces plus signs with space if desired, or standard decodeURIComponent
      const decoded = decodeURIComponent(text.replace(/\+/g, "%20"));
      outputEl.value = decoded;
      showToast("URL decoded successfully!", "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "url-encoder-decoder", action: "decode" });
      }
    } catch (err) {
      showError("Malformed URI sequence: The input contains invalid percent-encoded characters (e.g. '%' not followed by two valid hex digits).");
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.style.display = "flex";
    showToast("URL error: Check input syntax.", "error");
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
