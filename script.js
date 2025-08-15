// THEME TOGGLE
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// PAGE INITIALIZATION
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

  // ANALYTICS INITIALIZATION
  function initializeAnalytics() {
    if (window.analytics && !window.analytics.initialized) {
      analytics.load("uC8lzaUyjmypXHvHqVZenGjApDyIIKck");
      analytics.page();
      window.analytics.initialized = true;
      console.log("Segment Analytics Initialized.");
    }
  }

  // CONSENT HANDLING
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

  // Accept All Cookies
  if (acceptCookiesButton) {
    acceptCookiesButton.onclick = function () {
      localStorage.setItem("cookie_consent", "true");
      cookieConsentBanner.classList.add("hidden");
      initializeAnalytics();
    };
  }

  // Reject All Cookies
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
        initializeAnalytics();
      } else {
        console.log("Segment Analytics blocked due to user preference.");
      }
    };
  }

  // Run consent check
  handleConsent();

  // YOUTUBE LAZY LOADING
  const lazyVideos = document.querySelectorAll(".youtube-lazy-load");

  lazyVideos.forEach(function (video) {
    const videoId = video.dataset.id;
    const thumbnailPath = video.dataset.thumbnail;

    // Set the thumbnail image from a custom path or the YouTube default
    let thumbnailUrl = thumbnailPath
      ? thumbnailPath
      : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    video.style.backgroundImage = `url(${thumbnailUrl})`;

    video.addEventListener("click", function () {
      // Create the iframe element
      const iframe = document.createElement("iframe");

      // Set its attributes
      iframe.setAttribute("class", "absolute inset-0 w-full h-full"); // Keep original classes
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      iframe.setAttribute("allowfullscreen", "");
      // Add autoplay=1 to start the video automatically
      iframe.setAttribute(
        "src",
        `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`
      );

      // Replace the placeholder div with the iframe
      this.parentNode.replaceChild(iframe, this);
    });
  });

  // EVENT TRACKING
  function trackClick(id, eventName, location) {
    const el = document.getElementById(id);
    if (el) {
      el.onclick = () => {
        if (window.analytics) {
          analytics.track(eventName, { location });
        }
      };
    }
  }

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
