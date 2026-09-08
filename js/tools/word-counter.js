/**
 * ToolNest - Word Counter Logic
 * Real-time calculation of words, characters, sentences, paragraphs, and reading time.
 */

document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("text-input");
  const wordsEl = document.getElementById("stat-words");
  const charsEl = document.getElementById("stat-chars");
  const charsNoSpaceEl = document.getElementById("stat-chars-no-space");
  const sentencesEl = document.getElementById("stat-sentences");
  const paragraphsEl = document.getElementById("stat-paragraphs");
  const readingTimeEl = document.getElementById("stat-reading-time");
  const speakingTimeEl = document.getElementById("stat-speaking-time");
  const copyBtn = document.getElementById("copy-btn");
  const clearBtn = document.getElementById("clear-btn");
  const sampleBtn = document.getElementById("sample-btn");

  if (!textInput) return;

  textInput.addEventListener("input", updateStats);

  function updateStats() {
    const text = textInput.value;

    // Characters
    const totalChars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;

    // Words
    const trimmed = text.trim();
    const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const totalWords = wordsArray.length;

    // Paragraphs
    const paragraphsArray = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
    const totalParagraphs = paragraphsArray.length;

    // Sentences (split by punctuation . ! ? followed by space or end)
    const sentencesArray = text.split(/[.!?]+(?:\s+|$)/).map(s => s.trim()).filter(Boolean);
    const totalSentences = sentencesArray.length;

    // Reading time: ~200 wpm
    const readingMinutes = Math.ceil(totalWords / 200);
    const readingStr = totalWords === 0 ? "0 min" : (readingMinutes < 1 ? "< 1 min" : `${readingMinutes} min`);

    // Speaking time: ~130 wpm
    const speakingMinutes = Math.ceil(totalWords / 130);
    const speakingStr = totalWords === 0 ? "0 min" : (speakingMinutes < 1 ? "< 1 min" : `${speakingMinutes} min`);

    wordsEl.textContent = totalWords.toLocaleString();
    charsEl.textContent = totalChars.toLocaleString();
    charsNoSpaceEl.textContent = charsNoSpace.toLocaleString();
    sentencesEl.textContent = totalSentences.toLocaleString();
    paragraphsEl.textContent = totalParagraphs.toLocaleString();
    readingTimeEl.textContent = readingStr;
    speakingTimeEl.textContent = speakingStr;
  }

  copyBtn.addEventListener("click", () => {
    copyToClipboard(textInput.value, "Text copied to clipboard!");
  });

  clearBtn.addEventListener("click", () => {
    textInput.value = "";
    updateStats();
    textInput.focus();
    showToast("Text cleared.", "info");
  });

  sampleBtn.addEventListener("click", () => {
    textInput.value = `ToolNest provides simple, fast, and privacy-focused online tools for everyday workflows.
All data transformations happen directly inside your web browser using HTML5 Canvas, Web APIs, and JavaScript.

Whether you are compressing images, formatting JSON, or converting cases, your files never leave your computer. Fast, secure, and completely free to use!`;
    updateStats();
    showToast("Sample text loaded.", "success");
  });

  // Initial calculation in case text persists in browser reload
  updateStats();
});
