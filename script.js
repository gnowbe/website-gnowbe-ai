// THEME TOGGLE
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// LOAD SEGMENT ANALYTICS AFTER CONSENT
function loadSegmentAnalytics() {
  if (!window.analytics) {
    const script = document.createElement("script");
    script.src =
      "https://cdn.segment.com/analytics.js/v1/uC8lzaUyjmypXHvHqVZenGjApDyIIKck/analytics.min.js";
    script.async = true;
    script.onload = () => {
      console.log("Segment Analytics Loaded.");
      if (typeof analytics !== "undefined") {
        analytics.page();
        window.analytics.initialized = true;
      }
    };
    document.head.appendChild(script);
  } else if (!window.analytics.initialized) {
    analytics.page();
    window.analytics.initialized = true;
  }
}

// TRACK CLICKS
function trackClick(id, eventName, location) {
  const el = document.getElementById(id);
  if (el) {
    el.onclick = () => {
      if (window.analytics && window.analytics.initialized) {
        analytics.track(eventName, { location });
      }
    };
  }
}

// INITIALIZE PAGE
function initPage() {
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

  // COOKIE CONSENT ELEMENTS
  const cookieConsentBanner = document.getElementById("cookie-consent-banner");
  const acceptCookiesButton = document.getElementById("accept-cookies");
  const rejectCookiesButton = document.getElementById("reject-cookies");
  const savePreferencesButton = document.getElementById(
    "save-preferences-button"
  );

  // Consent handling
  const consent = localStorage.getItem("cookie_consent");
  if (consent === "true") {
    loadSegmentAnalytics();
  } else if (consent === "false") {
    console.log("Segment Analytics blocked due to user preference.");
  } else if (cookieConsentBanner) {
    cookieConsentBanner.classList.remove("hidden");
  }

  // Accept All
  if (acceptCookiesButton) {
    acceptCookiesButton.onclick = function () {
      localStorage.setItem("cookie_consent", "true");
      cookieConsentBanner.classList.add("hidden");
      loadSegmentAnalytics();
    };
  }

  // Reject All
  if (rejectCookiesButton) {
    rejectCookiesButton.onclick = function () {
      localStorage.setItem("cookie_consent", "false");
      cookieConsentBanner.classList.add("hidden");
      console.log("Segment Analytics blocked due to user preference.");
    };
  }

  // Save Preferences
  if (savePreferencesButton && cookieConsentBanner) {
    savePreferencesButton.onclick = function () {
      const analyticsEnabled =
        cookieConsentBanner.__x?.$data?.analytics ?? false;
      localStorage.setItem(
        "cookie_consent",
        analyticsEnabled ? "true" : "false"
      );
      cookieConsentBanner.classList.add("hidden");

      if (analyticsEnabled) {
        loadSegmentAnalytics();
      } else {
        console.log("Segment Analytics blocked due to user preference.");
      }
    };
  }

  // YOUTUBE LAZY LOADING
  const lazyVideos = document.querySelectorAll(".youtube-lazy-load");
  lazyVideos.forEach(function (video) {
    const videoId = video.dataset.id;
    const thumbnailPath = video.dataset.thumbnail;
    const thumbnailUrl =
      thumbnailPath || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    video.style.backgroundImage = `url(${thumbnailUrl})`;

    video.addEventListener("click", function () {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("class", "absolute inset-0 w-full h-full");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute(
        "src",
        `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`
      );
      this.parentNode.replaceChild(iframe, this);
    });
  });

  // EVENT TRACKING (works immediately if analytics is ready)
  trackClick("hero-book-demo", "Book a Demo Clicked", "hero");
  trackClick("hero-explore-ai", "Explore Gnowbe AI Clicked", "hero");
  trackClick("footer-book-demo", "Book a Demo Clicked", "footer");
  trackClick("footer-try-ai", "Try Gnowbe AI Free Clicked", "footer");
}

// RUN INITIALIZATION
document.addEventListener("DOMContentLoaded", initPage);

// RESTORE FROM BFCACHE
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    initPage();
  }
});
