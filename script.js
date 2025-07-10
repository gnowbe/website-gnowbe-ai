// 🔄 Gnowbe Website Script - Final Version

// --- 1. Configuration ---
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
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

// --- 2. Core Functions ---

/**
 * Manages which video should be playing based on the current theme.
 * This function is called on page load and when the theme is toggled.
 */
function manageVideoPlayback() {
  const lightVideo = document.getElementById("lightModeVideo");
  const darkVideo = document.getElementById("darkModeVideo");

  if (!lightVideo || !darkVideo) {
    return;
  }

  const isDarkMode = document.documentElement.classList.contains("dark");

  if (isDarkMode) {
    lightVideo.pause();
    darkVideo
      .play()
      .catch((e) => console.error("Dark video failed to play:", e));
  } else {
    darkVideo.pause();
    lightVideo
      .play()
      .catch((e) => console.error("Light video failed to play:", e));
  }
}

/**
 * Toggles the theme between light and dark and saves the preference.
 */
function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  manageVideoPlayback();
}

// --- 3. Initialization on Page Load ---
document.addEventListener("DOMContentLoaded", function () {
  // --- Theme Initialization ---
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // --- Video Playback Initialization ---
  manageVideoPlayback();

  // --- Cookie Consent Handling ---
  const cookieConsentBanner = document.getElementById("cookie-consent-banner");
  const acceptCookiesButton = document.getElementById("accept-cookies");
  const declineCookiesButton = document.getElementById("decline-cookies");

  function initializeAnalytics() {
    // This function can be expanded to load analytics scripts dynamically
    if (window.analytics && !window.analytics.initialized) {
      // NOTE: This assumes a Segment shim is on the page. For full compliance,
      // the script tag itself should be created and injected here.
      analytics.load("uC8lzaUyjmypXHvHqVZenGjApDyIIKck");
      analytics.page();
      window.analytics.initialized = true;
      console.log("Analytics Initialized");
    }
  }

  function handleConsent() {
    const consent = localStorage.getItem("cookie_consent");

    if (consent === "true") {
      initializeAnalytics();
    } else if (consent === "false") {
      // User has declined, do nothing.
    } else {
      if (cookieConsentBanner) {
        cookieConsentBanner.classList.remove("hidden");
      }
    }
  }

  if (acceptCookiesButton) {
    acceptCookiesButton.addEventListener("click", function () {
      localStorage.setItem("cookie_consent", "true");
      cookieConsentBanner.classList.add("hidden");
      initializeAnalytics();
    });
  }

  if (declineCookiesButton) {
    declineCookiesButton.addEventListener("click", function () {
      localStorage.setItem("cookie_consent", "false");
      cookieConsentBanner.classList.add("hidden");
    });
  }

  handleConsent();

  // --- Enforce Video Looping ---
  const lightVideo = document.getElementById("lightModeVideo");
  if (lightVideo) {
    lightVideo.addEventListener("ended", function () {
      this.play();
    });
  }

  const darkVideo = document.getElementById("darkModeVideo");
  if (darkVideo) {
    darkVideo.addEventListener("ended", function () {
      this.play();
    });
  }
});
