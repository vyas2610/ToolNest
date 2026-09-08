/**
 * ToolNest - Main Application Controller
 * Handles theme switching, mobile drawer navigation, FAQ accordions,
 * dynamic tool card rendering, and UI interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initYear();
  initFaqAccordion();
  renderDynamicToolGrids();
  renderRelatedTools();
  initNavigation();
  initPageTransitions();
});

/* -------------------------------------------------------------------------- */
/*  1. THEME TOGGLE (Light / Dark Mode with LocalStorage)                      */
/* -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem("toolnest_theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  setTheme(initialTheme);

  // Bind all theme toggle buttons (desktop + mobile)
  const toggleButtons = document.querySelectorAll(".theme-toggle-btn");
  toggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  });

  // Listen for system theme changes if user hasn't explicitly set one
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      if (!localStorage.getItem("toolnest_theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem("toolnest_theme", theme);

  // Update theme toggle icons
  const toggleButtons = document.querySelectorAll(".theme-toggle-btn");
  toggleButtons.forEach(btn => {
    const isDark = theme === "dark";
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    btn.innerHTML = isDark
      ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  });
}

/* -------------------------------------------------------------------------- */
/*  2. MOBILE HAMBURGER MENU                                                  */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-toggle");
  const navDrawer = document.querySelector(".mobile-nav-drawer");
  const backdrop = document.querySelector(".mobile-nav-backdrop");

  if (!menuBtn || !navDrawer) return;

  function toggleMenu(isOpen) {
    const open = typeof isOpen === "boolean" ? isOpen : !navDrawer.classList.contains("active");
    navDrawer.classList.toggle("active", open);
    if (backdrop) backdrop.classList.toggle("active", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  menuBtn.addEventListener("click", () => toggleMenu());
  if (backdrop) backdrop.addEventListener("click", () => toggleMenu(false));

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navDrawer.classList.contains("active")) {
      toggleMenu(false);
    }
  });

  // Close when clicking any nav link in mobile drawer
  navDrawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => toggleMenu(false));
  });
}

/* -------------------------------------------------------------------------- */
/*  3. DYNAMIC YEAR                                                           */
/* -------------------------------------------------------------------------- */
function initYear() {
  const yearEls = document.querySelectorAll(".current-year");
  const year = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = year;
  });
}

/* -------------------------------------------------------------------------- */
/*  4. FAQ ACCORDION                                                          */
/* -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Optional: close other accordions
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains("open")) {
          other.classList.remove("open");
          const otherBtn = other.querySelector(".faq-question");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("open", !isOpen);
      questionBtn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    });
  });
}

/* -------------------------------------------------------------------------- */
/*  5. DYNAMIC TOOL CARD RENDERING (Homepage Grids)                           */
/* -------------------------------------------------------------------------- */
function createToolCardHtml(tool) {
  const targetUrl = window.resolveToolUrl ? window.resolveToolUrl(tool.url) : tool.url;
  return `
    <article class="tool-card" data-slug="${tool.slug}">
      <div class="tool-card-icon" aria-hidden="true">${tool.icon}</div>
      <div class="tool-card-body">
        <span class="tool-card-category">${escapeHtml(tool.category)}</span>
        <h3 class="tool-card-title">${escapeHtml(tool.name)}</h3>
        <p class="tool-card-desc">${escapeHtml(tool.description)}</p>
      </div>
      <div class="tool-card-footer">
        <a href="${targetUrl}" class="btn btn-primary btn-sm tool-card-btn">
          Use Tool
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </article>
  `;
}

function renderDynamicToolGrids() {
  if (!window.TOOLS_DATA) return;

  // Render Popular Tools Grid on index.html
  const popularGrid = document.getElementById("popular-tools-grid");
  if (popularGrid) {
    const popularTools = window.TOOLS_DATA.filter(t => t.popular);
    popularGrid.innerHTML = popularTools.map(createToolCardHtml).join("");
  }

  // Render Category Grids
  const categoryGrids = document.querySelectorAll(".category-tools-grid");
  categoryGrids.forEach(grid => {
    const catSlug = grid.getAttribute("data-category");
    const categoryTools = window.TOOLS_DATA.filter(t => t.categorySlug === catSlug);
    grid.innerHTML = categoryTools.map(createToolCardHtml).join("");
  });
}

/* -------------------------------------------------------------------------- */
/*  6. RELATED TOOLS RENDERING (Tool Pages)                                   */
/* -------------------------------------------------------------------------- */
function renderRelatedTools() {
  const container = document.getElementById("related-tools-grid");
  if (!container || !window.TOOLS_DATA) return;

  const currentSlug = container.getAttribute("data-current-slug");
  const related = window.getRelatedTools ? window.getRelatedTools(currentSlug) : [];

  if (related.length > 0) {
    container.innerHTML = related.slice(0, 4).map(createToolCardHtml).join("");
  }
}

/* -------------------------------------------------------------------------- */
/*  7. ACTIVE NAVIGATION & INTERACTIVE SCROLL SPY                             */
/* -------------------------------------------------------------------------- */
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-links a, .mobile-nav-drawer a");
  if (!navLinks.length) return;

  const pathname = window.location.pathname.toLowerCase();

  // Strictly identify if we are on the homepage
  const isHomePage =
    !pathname.includes("/blog") &&
    !pathname.includes("/tools") &&
    !pathname.includes("/about") &&
    !pathname.includes("/contact") &&
    !pathname.includes("/privacy") &&
    !pathname.includes("/terms") &&
    !pathname.includes("/disclaimer") &&
    !pathname.includes("/404");

  let isManualNav = false;
  let manualNavTimer = null;

  function setManualNavLock(duration = 900) {
    isManualNav = true;
    clearTimeout(manualNavTimer);
    manualNavTimer = setTimeout(() => {
      isManualNav = false;
    }, duration);
  }

  // Activate matching navigation links across desktop & mobile, deactivating others
  function setActiveLink(identifier) {
    if (!identifier) return;

    const key = identifier.toLowerCase().replace(/^#/, "").trim();
    navLinks.forEach(link => link.classList.remove("active"));

    navLinks.forEach(link => {
      const text = (link.textContent || "").trim().toLowerCase();
      const href = (link.getAttribute("href") || "").toLowerCase();

      let isMatch = false;

      if (key === "home") {
        isMatch = (text === "home");
      } else if (key === "image-tools" || key === "image tools") {
        isMatch = (text === "image tools" || href.includes("#image-tools"));
      } else if (key === "pdf-tools" || key === "pdf tools") {
        isMatch = (text === "pdf tools" || href.includes("#pdf-tools"));
      } else if (key === "text-tools" || key === "text tools") {
        isMatch = (text === "text tools" || href.includes("#text-tools"));
      } else if (key === "developer-tools" || key === "developer tools") {
        isMatch = (text === "developer tools" || href.includes("#developer-tools"));
      } else if (key === "blog") {
        isMatch = (text === "blog" || href.includes("/blog") || href.endsWith("blog/index.html"));
      } else if (key === "about") {
        isMatch = (text === "about" || href.includes("about.html"));
      } else if (key === "contact") {
        isMatch = (text === "contact" || href.includes("contact.html"));
      } else {
        isMatch = (text === key || href.includes(key));
      }

      if (isMatch) {
        link.classList.add("active");
      }
    });
  }

  // Bind click handlers to all navigation links
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const text = (link.textContent || "").trim().toLowerCase();
      const href = (link.getAttribute("href") || "").trim();
      if (!href) return;

      const hasHash = href.includes("#");
      const hash = hasHash ? "#" + href.split("#")[1] : "";

      // 1. In-page section anchor clicked on homepage
      if (hasHash && isHomePage) {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          e.preventDefault();
          setActiveLink(hash);
          setManualNavLock();

          targetEl.scrollIntoView({ behavior: "smooth" });
          if (window.history.pushState) {
            window.history.pushState(null, "", hash);
          } else {
            window.location.hash = hash;
          }
          return;
        }
      }

      // 2. Home clicked while already on homepage
      if (isHomePage && text === "home") {
        e.preventDefault();
        setActiveLink("home");
        setManualNavLock();

        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.history.pushState) {
          window.history.pushState(null, "", window.location.pathname);
        }
        return;
      }

      // 3. Other link clicked: activate immediately
      if (text) {
        setActiveLink(text);
      } else if (hasHash) {
        setActiveLink(hash);
      }
    });
  });

  // Home brand logo click on homepage
  const brandLogo = document.querySelector(".brand-logo");
  if (brandLogo && isHomePage) {
    brandLogo.addEventListener("click", e => {
      e.preventDefault();
      setActiveLink("home");
      setManualNavLock();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.history.pushState) {
        window.history.pushState(null, "", window.location.pathname);
      }
    });
  }

  // Set initial active state based on current page URL
  if (pathname.includes("/blog")) {
    setActiveLink("blog");
  } else if (pathname.includes("/about")) {
    setActiveLink("about");
  } else if (pathname.includes("/contact")) {
    setActiveLink("contact");
  } else if (pathname.includes("/tools/")) {
    if (/image|jpg-to-png|png-to-jpg|crop|resize|compress/i.test(pathname) && !/pdf/i.test(pathname)) {
      setActiveLink("image-tools");
    } else if (/pdf/i.test(pathname)) {
      setActiveLink("pdf-tools");
    } else if (/word|case|duplicate/i.test(pathname)) {
      setActiveLink("text-tools");
    } else if (/json|base64|url/i.test(pathname)) {
      setActiveLink("developer-tools");
    }
  } else if (isHomePage) {
    if (window.location.hash && document.querySelector(window.location.hash)) {
      setActiveLink(window.location.hash);
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setActiveLink("home");
    }

    // Homepage scroll-spy to keep navigation in sync with visible section
    const categorySectionIds = [
      "image-tools",
      "pdf-tools",
      "text-tools",
      "developer-tools"
    ];
    const sectionElements = categorySectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    function handleScrollSpy() {
      if (isManualNav) return;

      const scrollY = window.scrollY || window.pageYOffset;
      // If near the top (Hero, Search, Popular Tools), Home is active
      if (scrollY < 260) {
        setActiveLink("home");
        return;
      }

      const offset = 140;
      let activeSectionId = null;

      for (let i = 0; i < sectionElements.length; i++) {
        const sec = sectionElements[i];
        const top = sec.offsetTop - offset;
        const bottom = top + sec.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
          activeSectionId = sec.id;
          break;
        }
      }

      if (activeSectionId) {
        setActiveLink("#" + activeSectionId);
      }
    }

    let isScrolling = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!isScrolling) {
          window.requestAnimationFrame(() => {
            handleScrollSpy();
            isScrolling = false;
          });
          isScrolling = true;
        }
      },
      { passive: true }
    );
  }

  // Listen for browser back / forward buttons
  window.addEventListener("hashchange", () => {
    if (window.location.hash && document.querySelector(window.location.hash)) {
      setActiveLink(window.location.hash);
    } else if (isHomePage) {
      setActiveLink("home");
    }
  });
}

/* -------------------------------------------------------------------------- */
/*  8. SMOOTH PAGE TRANSITIONS (Prevent Flash of White / Unstyled Content)   */
/* -------------------------------------------------------------------------- */
function initPageTransitions() {
  // Clear any transition lock on load and when restored from bfcache
  document.body.classList.remove("page-leaving");
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-leaving");
  });

  // Intercept internal page navigations for a smooth exit animation
  document.addEventListener("click", e => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // Ignore anchor jumps, javascript/email links, downloads, new tabs, or keyboard modifiers
    if (
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.hasAttribute("download") ||
      link.getAttribute("target") === "_blank" ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    try {
      const targetUrl = new URL(link.href, window.location.href);

      // Only handle same-origin navigations
      if (targetUrl.origin !== window.location.origin) return;

      // Ignore if clicking a hash on the current page
      if (
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search
      ) {
        return;
      }

      // Trigger smooth exit transition before navigating
      e.preventDefault();
      document.body.classList.add("page-leaving");

      setTimeout(() => {
        window.location.href = link.href;
      }, 160);
    } catch (err) {
      // Allow default browser navigation on any error
    }
  });
}


