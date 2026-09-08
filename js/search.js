/**
 * ToolNest - Instant Search
 * 
 * Provides fast, client-side fuzzy search across all tools in TOOLS_DATA
 * without any external dependencies or libraries.
 */

(function () {
  function initSearch() {
    const searchInputs = document.querySelectorAll(".tool-search-input");

    searchInputs.forEach(input => {
      const wrapper = input.closest(".search-wrapper");
      if (!wrapper) return;

      let resultsContainer = wrapper.querySelector(".search-results-dropdown");
      if (!resultsContainer) {
        resultsContainer = document.createElement("div");
        resultsContainer.className = "search-results-dropdown";
        resultsContainer.setAttribute("role", "listbox");
        resultsContainer.setAttribute("aria-label", "Search results");
        wrapper.appendChild(resultsContainer);
      }

      let activeIndex = -1;

      // Handle typing
      input.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        activeIndex = -1;

        if (!query) {
          resultsContainer.classList.remove("active");
          resultsContainer.innerHTML = "";
          return;
        }

        if (window.trackAnalyticsEvent) {
          window.trackAnalyticsEvent("search_used", { query_length: query.length });
        }

        const matches = filterTools(query);
        renderResults(matches, resultsContainer, query);
      });

      // Handle keyboard navigation
      input.addEventListener("keydown", function (e) {
        const items = resultsContainer.querySelectorAll(".search-result-item");
        if (!items.length || !resultsContainer.classList.contains("active")) return;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % items.length;
          updateActiveItem(items, activeIndex);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          updateActiveItem(items, activeIndex);
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (activeIndex >= 0 && items[activeIndex]) {
            items[activeIndex].click();
          } else if (items.length > 0) {
            items[0].click();
          }
        } else if (e.key === "Escape") {
          resultsContainer.classList.remove("active");
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", function (e) {
        if (!wrapper.contains(e.target)) {
          resultsContainer.classList.remove("active");
        }
      });

      // Reopen if input has value on focus
      input.addEventListener("focus", function () {
        if (this.value.trim() && resultsContainer.children.length > 0) {
          resultsContainer.classList.add("active");
        }
      });
    });
  }

  function filterTools(query) {
    if (!window.TOOLS_DATA) return [];
    
    return window.TOOLS_DATA.filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(query);
      const categoryMatch = tool.category.toLowerCase().includes(query);
      const descMatch = tool.description.toLowerCase().includes(query);
      const keywordMatch = tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(query));
      return nameMatch || categoryMatch || descMatch || keywordMatch;
    }).slice(0, 8); // Max 8 immediate matches
  }

  function renderResults(matches, container, query) {
    if (!matches.length) {
      container.innerHTML = `
        <div class="search-no-results">
          No tools found matching "<strong>${escapeHtml(query)}</strong>".
        </div>
      `;
      container.classList.add("active");
      return;
    }

    container.innerHTML = matches.map((tool, idx) => {
      const targetUrl = window.resolveToolUrl ? window.resolveToolUrl(tool.url) : tool.url;
      return `
      <a href="${targetUrl}" class="search-result-item" role="option" data-index="${idx}">
        <span class="search-result-icon">${tool.icon}</span>
        <div class="search-result-info">
          <div class="search-result-title">${highlightMatch(tool.name, query)}</div>
          <div class="search-result-desc">${escapeHtml(tool.description)}</div>
        </div>
        <span class="search-result-category">${escapeHtml(tool.category)}</span>
      </a>
    `;
    }).join("");

    container.classList.add("active");
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
    return escapeHtml(text).replace(regex, "<mark>$1</mark>");
  }

  function updateActiveItem(items, index) {
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("selected");
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();
