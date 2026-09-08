/**
 * ToolNest - Safe Google Analytics 4 Wrapper
 * 
 * Only initializes and fires if a genuine GA4 Measurement ID (not default placeholder)
 * is provided in js/config.js.
 * Privacy rule: NEVER send user file data, text content, image pixels, or personal info.
 */

(function () {
  const measurementId = window.CONFIG?.GA4_MEASUREMENT_ID;

  // Check if GA4 is configured with a real ID
  const isConfigured = measurementId && measurementId !== "G-XXXXXXXXXX" && measurementId.startsWith("G-");

  if (isConfigured) {
    try {
      // Inject GA4 script tag asynchronously
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      gtag("js", new Date());
      gtag("config", measurementId, {
        anonymize_ip: true,
        send_page_view: true
      });
    } catch (e) {
      console.warn("Analytics initialization skipped:", e);
    }
  }

  // Safe wrapper for tracking events
  window.trackAnalyticsEvent = function (eventName, eventParams = {}) {
    if (!isConfigured || typeof window.gtag !== "function") {
      // Silently return without error if not configured or blocked
      return;
    }

    try {
      // Sanitize params - do not transmit sensitive contents
      const safeParams = {};
      for (const [key, value] of Object.entries(eventParams)) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          // Truncate values to prevent accidental data leak
          safeParams[key] = String(value).substring(0, 100);
        }
      }
      window.gtag("event", eventName, safeParams);
    } catch (err) {
      // Prevent any error in analytics from affecting tool execution
      console.debug("Analytics event dispatch error:", err);
    }
  };
})();
