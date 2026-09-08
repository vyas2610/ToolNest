/**
 * ToolNest - Case Converter Logic
 * High-accuracy case transformations for text.
 */

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("text-input");
  const outputEl = document.getElementById("text-output");
  const copyBtn = document.getElementById("copy-btn");
  const clearBtn = document.getElementById("clear-btn");
  const swapBtn = document.getElementById("swap-btn");
  const caseButtons = document.querySelectorAll(".case-action-btn");

  if (!inputEl || !outputEl) return;

  function toTitleCase(str) {
    const minorWords = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "with"]);
    return str.toLowerCase().replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (match, index, fullStr) => {
      if (index > 0 && index + match.length !== fullStr.length && minorWords.has(match)) {
        return match.toLowerCase();
      }
      return match.charAt(0).toUpperCase() + match.slice(1);
    });
  }

  function toSentenceCase(str) {
    return str.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z\u00C0-\u00FF])/g, (match, prefix, char) => {
      return prefix + char.toUpperCase();
    });
  }

  function toCapitalizeWords(str) {
    return str.replace(/\b([a-z\u00C0-\u00FF])/g, char => char.toUpperCase());
  }

  function toAlternatingCase(str) {
    let toUpper = false;
    return str.split("").map(char => {
      if (/[a-zA-Z\u00C0-\u00FF]/.test(char)) {
        toUpper = !toUpper;
        return toUpper ? char.toUpperCase() : char.toLowerCase();
      }
      return char;
    }).join("");
  }

  caseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-case");
      const text = inputEl.value;

      if (!text) {
        showToast("Please enter some text to convert.", "warning");
        return;
      }

      let result = text;
      switch (mode) {
        case "upper":
          result = text.toUpperCase();
          break;
        case "lower":
          result = text.toLowerCase();
          break;
        case "title":
          result = toTitleCase(text);
          break;
        case "sentence":
          result = toSentenceCase(text);
          break;
        case "capitalize":
          result = toCapitalizeWords(text);
          break;
        case "alternating":
          result = toAlternatingCase(text);
          break;
      }

      outputEl.value = result;
      showToast(`Converted to ${btn.textContent.trim()}!`, "success");

      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent("tool_used", { tool: "case-converter", mode });
      }
    });
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(outputEl.value, "Output copied to clipboard!");
  });

  clearBtn.addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    inputEl.focus();
    showToast("Cleared text.", "info");
  });

  swapBtn.addEventListener("click", () => {
    const temp = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = temp;
    showToast("Swapped input and output text.", "info");
  });
});
