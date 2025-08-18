/***************
 * THEME TOGGLE
 ***************/
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

/*************************
 * ANALYTICS LOADERS (GDPR)
 *************************/
function loadSegmentAnalytics() {
  if (
    window.segmentLoading ||
    (window.analytics && window.analytics.initialized)
  )
    return;
  window.segmentLoading = true;

  const script = document.createElement("script");
  script.src =
    "https://cdn.segment.com/analytics.js/v1/uC8lzaUyjmypXHvHqVZenGjApDyIIKck/analytics.min.js";
  script.async = true;
  script.onload = () => {
    try {
      if (typeof analytics !== "undefined") {
        analytics.page(); // Segment page call
        window.analytics.initialized = true;
        console.log("[Analytics] Segment loaded & page() sent");
      }
    } catch (e) {
      console.warn("[Analytics] Segment onload error:", e);
    }
  };
  script.onerror = () => {
    console.warn(
      "[Analytics] Segment script failed to load (possibly blocked by an extension)."
    );
  };
  document.head.appendChild(script);
}

function loadGA(measurementId) {
  if (window.gtagLoaded) return;

  // Loader
  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  s.async = true;
  s.onload = () => {
    console.log("[Analytics] GA script loaded:", measurementId);
  };
  s.onerror = () => {
    console.warn(
      "[Analytics] GA script failed to load (possibly blocked by an extension)."
    );
  };
  document.head.appendChild(s);

  // Bootstrap gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId); // sends page_view
  window.gtagLoaded = true;
  console.log("[Analytics] GA initialized & page_view sent", measurementId);
}

/*********************************
 * UNIFIED EVENT SEND (SEGMENT+GA)
 *********************************/
function sendEvent(eventName, props = {}) {
  // Segment track
  try {
    if (window.analytics && window.analytics.initialized) {
      analytics.track(eventName, props);
      // console.debug("[Track] Segment:", eventName, props);
    }
  } catch (e) {
    // no-op
  }

  // GA4 event
  try {
    if (typeof window.gtag === "function" && window.gtagLoaded) {
      // GA event names typically snake_case; keep your custom name as-is
      window.gtag("event", eventName, props);
      // console.debug("[Track] GA4:", eventName, props);
    }
  } catch (e) {
    // no-op
  }
}

/*****************
 * CLICK BINDINGS
 *****************/
function trackClick(id, eventName, props = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", () => {
    sendEvent(eventName, { element_id: id, ...props });
  });
}

/*****************
 * PAGE INITIALIZE
 *****************/
function initPage() {
  // Theme on first paint
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Cookie banner + consent
  const cookieConsentBanner = document.getElementById("cookie-consent-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");
  const savePrefsBtn = document.getElementById("save-preferences-button");

  const consent = localStorage.getItem("cookie_consent");
  if (consent === "true") {
    // Load analytics immediately
    loadSegmentAnalytics();
    loadGA("G-XVJPB7R5S9"); // <-- your GA4 Measurement ID
  } else if (consent === "false") {
    console.log("[Analytics] Disabled by user preference.");
  } else if (cookieConsentBanner) {
    // Show banner if no choice yet
    cookieConsentBanner.classList.remove("hidden");
  }

  // Accept All
  if (acceptBtn) {
    acceptBtn.onclick = function () {
      localStorage.setItem("cookie_consent", "true");
      cookieConsentBanner?.classList.add("hidden");
      loadSegmentAnalytics();
      loadGA("G-XVJPB7R5S9");
    };
  }

  // Reject All
  if (rejectBtn) {
    rejectBtn.onclick = function () {
      localStorage.setItem("cookie_consent", "false");
      cookieConsentBanner?.classList.add("hidden");
      console.log("[Analytics] Disabled by user preference.");
    };
  }

  // Save Preferences (reads Alpine's x-data 'analytics' toggle if present)
  if (savePrefsBtn && cookieConsentBanner) {
    savePrefsBtn.onclick = function () {
      const analyticsEnabled =
        cookieConsentBanner.__x?.$data?.analytics ?? false;
      localStorage.setItem(
        "cookie_consent",
        analyticsEnabled ? "true" : "false"
      );
      cookieConsentBanner.classList.add("hidden");
      if (analyticsEnabled) {
        loadSegmentAnalytics();
        loadGA("G-XVJPB7R5S9");
      } else {
        console.log("[Analytics] Disabled by user preference.");
      }
    };
  }

  /***********************
   * YouTube Lazy Loading
   ***********************/
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
      iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
      this.parentNode.replaceChild(iframe, this);
    });
  });

  /***********************
   * CTA EVENT BINDINGS
   ***********************/
  // Header
  trackClick("header-book-demo", "Book a Demo Clicked", { location: "header" });

  // Hero
  trackClick("hero-book-demo", "Book a Demo Clicked", { location: "hero" });
  trackClick("hero-explore-ai", "Explore Gnowbe AI Clicked", {
    location: "hero",
  });

  // Footer (binds only if present)
  trackClick("footer-book-demo", "Book a Demo Clicked", { location: "footer" });
  trackClick("footer-try-ai", "Try Gnowbe AI Free Clicked", {
    location: "footer",
  });
}

/*****************
 * BOOTSTRAP PAGE
 *****************/
document.addEventListener("DOMContentLoaded", initPage);

// Restore after bfcache
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initPage();
});

// Expose toggleTheme globally if button uses onclick
window.toggleTheme = toggleTheme;
