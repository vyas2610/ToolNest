/**
 * ToolNest - Central Website Configuration
 * 
 * Update these settings to customize your brand, analytics, search verification,
 * and future AdSense monetization. No framework or build process required.
 */

const CONFIG = {
  // Brand Configuration
  SITE_NAME: "ToolNest",
  TAGLINE: "Simple, Fast & Free Online Tools",
  SITE_URL: "https://toolnestonline.netlify.app",
  CONTACT_EMAIL: "deepakvyas261092@gmail.com",

  // Google Analytics 4
  // Replace G-XXXXXXXXXX with your actual GA4 Measurement ID when ready.
  // The analytics script will automatically remain inactive until a real ID is provided.
  GA4_MEASUREMENT_ID: "G-XXXXXXXXXX",

  // Google Search Console Verification
  // Replace YOUR_VERIFICATION_CODE with the code provided by Google Search Console.
  GOOGLE_SITE_VERIFICATION: "YOUR_VERIFICATION_CODE",

  // Google AdSense
  // Replace ca-pub-XXXXXXXXXXXXXXXX with your approved AdSense Publisher ID.
  ADSENSE_CLIENT_ID: "ca-pub-XXXXXXXXXXXXXXXX"
};

// Make config globally accessible
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
