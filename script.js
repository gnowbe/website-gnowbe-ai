// --- 1. TAILWIND CSS CONFIGURATION ---
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

// --- 2. THEME TOGGLE ---
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// --- 3. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", function () {
  // Apply saved theme or detect system preference
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // --- Cookie Consent Elements ---
  const cookieConsentBanner = document.getElementById("cookie-consent-banner");
  const acceptCookiesButton = document.getElementById("accept-cookies");
  const rejectCookiesButton = document.getElementById("reject-cookies");
  const savePreferencesButton = document.getElementById(
    "save-preferences-button"
  );

  // --- Analytics Initialization ---
  function initializeAnalytics() {
    if (window.analytics && !window.analytics.initialized) {
      analytics.load("uC8lzaUyjmypXHvHqVZenGjApDyIIKck");
      analytics.page();
      window.analytics.initialized = true;
      console.log("Segment Analytics Initialized.");
    }
  }

  // --- Consent Handling ---
  function handleConsent() {
    const consent = localStorage.getItem("cookie_consent");

    if (consent === "true") {
      initializeAnalytics();
    } else if (consent === "false") {
      console.log("Segment Analytics blocked due to user preference.");
    } else if (cookieConsentBanner) {
      cookieConsentBanner.classList.remove("hidden");
    }
  }

  // --- Accept All Cookies ---
  if (acceptCookiesButton) {
    acceptCookiesButton.addEventListener("click", function () {
      localStorage.setItem("cookie_consent", "true");
      cookieConsentBanner.classList.add("hidden");
      initializeAnalytics();
    });
  }

  // --- Reject All Cookies ---
  if (rejectCookiesButton) {
    rejectCookiesButton.addEventListener("click", function () {
      localStorage.setItem("cookie_consent", "false");
      cookieConsentBanner.classList.add("hidden");
      console.log("Segment Analytics blocked due to user preference.");
    });
  }

  // --- Save Preferences ---
  if (savePreferencesButton && cookieConsentBanner) {
    savePreferencesButton.addEventListener("click", function () {
      const analyticsEnabled =
        cookieConsentBanner.__x?.$data?.analytics ?? false;
      localStorage.setItem(
        "cookie_consent",
        analyticsEnabled ? "true" : "false"
      );
      cookieConsentBanner.classList.add("hidden");

      if (analyticsEnabled) {
        initializeAnalytics();
      } else {
        console.log("Segment Analytics blocked due to user preference.");
      }
    });
  }

  // --- Run consent check on page load ---
  handleConsent();

  // --- Event Tracking ---
  function trackClick(id, eventName, location) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => {
        analytics.track(eventName, { location });
      });
    }
  }

  trackClick("hero-book-demo", "Book a Demo Clicked", "hero");
  trackClick("hero-explore-ai", "Explore Gnowbe AI Clicked", "hero");
  trackClick("footer-book-demo", "Book a Demo Clicked", "footer");
  trackClick("footer-try-ai", "Try Gnowbe AI Free Clicked", "footer");
});
