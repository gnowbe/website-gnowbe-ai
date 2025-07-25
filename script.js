// --- 1. TAILWIND CSS CONFIGURATION ---
// Extends the default Tailwind configuration with custom brand colors and fonts.
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans", "sans-serif"],
      },
      colors: {
        gnowbe: {
          red: "#B41F24",
          yellow: "#FFB606",
          "yellow-darker": "#EAA800",
          purple: "#935FEE",
          "purple-darker": "#814EE5",
          "purple-light": "#A77CFF",
        },
      },
    },
  },
};

// --- 2. THEME MANAGEMENT ---

/**
 * Toggles the theme between 'light' and 'dark' on the <html> element
 * and persists the user's preference in localStorage.
 */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// --- 3. INITIALIZATION ON PAGE LOAD ---
document.addEventListener("DOMContentLoaded", function () {
  // --- Initialize Theme ---
  // Applies the stored theme or detects the user's system preference on first visit.
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // --- Cookie Consent & Analytics ---
  const cookieConsentBanner = document.getElementById("cookie-consent-banner");
  const acceptCookiesButton = document.getElementById("accept-cookies");
  const declineCookiesButton = document.getElementById("decline-cookies");

  /**
   * Loads the Segment analytics script and fires the initial 'page' view.
   * This function is called only after consent is given.
   */
  function initializeAnalytics() {
    // Check if the Segment library is on the page and hasn't been initialized yet.
    if (window.analytics && !window.analytics.initialized) {
      analytics.load("uC8lzaUyjmypXHvHqVZenGjApDyIIKck");
      analytics.page();
      // Set a flag to prevent re-initialization.
      window.analytics.initialized = true;
      console.log("Segment Analytics Initialized.");
    }
  }

  /**
   * Checks the user's stored consent decision and acts accordingly.
   * - If consent was given, initialize analytics.
   * - If consent was denied, do nothing.
   * - If no decision was made, show the consent banner.
   */
  function handleConsent() {
    const consent = localStorage.getItem("cookie_consent");

    if (consent === "true") {
      initializeAnalytics();
    } else if (consent === "false") {
      // Analytics are intentionally not loaded.
      console.log("Segment Analytics blocked due to user preference.");
    } else {
      // Show the banner if it exists.
      if (cookieConsentBanner) {
        cookieConsentBanner.classList.remove("hidden");
      }
    }
  }

  // Attach event listener to the 'Accept' button.
  if (acceptCookiesButton) {
    acceptCookiesButton.addEventListener("click", function () {
      localStorage.setItem("cookie_consent", "true");
      cookieConsentBanner.classList.add("hidden");
      initializeAnalytics();
    });
  }

  // Attach event listener to the 'Decline' button.
  if (declineCookiesButton) {
    declineCookiesButton.addEventListener("click", function () {
      localStorage.setItem("cookie_consent", "false");
      cookieConsentBanner.classList.add("hidden");
    });
  }

  // Check the user's consent status as soon as the page loads.
  handleConsent();

  // --- Event Tracking ---

  // Track "Book a Demo" button click in the hero section
  const heroBookDemo = document.getElementById("hero-book-demo");
  if (heroBookDemo) {
    heroBookDemo.addEventListener("click", () => {
      analytics.track("Book a Demo Clicked", {
        location: "hero",
      });
    });
  }

  // Track "Explore Gnowbe AI" button click in the hero section
  const heroExploreAi = document.getElementById("hero-explore-ai");
  if (heroExploreAi) {
    heroExploreAi.addEventListener("click", () => {
      analytics.track("Explore Gnowbe AI Clicked", {
        location: "hero",
      });
    });
  }

  // Track "Request a Live Demo" button click in the footer
  const footerBookDemo = document.getElementById("footer-book-demo");
  if (footerBookDemo) {
    footerBookDemo.addEventListener("click", () => {
      analytics.track("Book a Demo Clicked", {
        location: "footer",
      });
    });
  }

  // Track "Try Gnowbe AI Free" button click in the footer
  const footerTryAi = document.getElementById("footer-try-ai");
  if (footerTryAi) {
    footerTryAi.addEventListener("click", () => {
      analytics.track("Try Gnowbe AI Free Clicked", {
        location: "footer",
      });
    });
  }
});
