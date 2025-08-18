/***************
 * THEME TOGGLE
 ***************/
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

/*************************
 * SEGMENT (v5) LOADER (GDPR)
 *************************/
function loadSegmentAnalytics() {
  if (window.segmentLoaded) return;
  window.segmentLoaded = true;

  // --- SEGMENT v5 SNIPPET (unchanged, just wrapped) ---
  !(function () {
    var i = "analytics",
      analytics = (window[i] = window[i] || []);
    if (!analytics.initialize) {
      if (analytics.invoked) {
        window.console &&
          console.error &&
          console.error("Segment snippet included twice.");
      } else {
        analytics.invoked = !0;
        analytics.methods = [
          "trackSubmit",
          "trackClick",
          "trackLink",
          "trackForm",
          "pageview",
          "identify",
          "reset",
          "group",
          "track",
          "ready",
          "alias",
          "debug",
          "page",
          "screen",
          "once",
          "off",
          "on",
          "addSourceMiddleware",
          "addIntegrationMiddleware",
          "setAnonymousId",
          "addDestinationMiddleware",
          "register",
        ];
        analytics.factory = function (e) {
          return function () {
            if (window[i].initialized)
              return window[i][e].apply(window[i], arguments);
            var n = Array.prototype.slice.call(arguments);
            if (
              ["track", "screen", "alias", "group", "page", "identify"].indexOf(
                e
              ) > -1
            ) {
              var c = document.querySelector("link[rel='canonical']");
              n.push({
                __t: "bpc",
                c: (c && c.getAttribute("href")) || void 0,
                p: location.pathname,
                u: location.href,
                s: location.search,
                t: document.title,
                r: document.referrer,
              });
            }
            n.unshift(e);
            analytics.push(n);
            return analytics;
          };
        };
        for (var n = 0; n < analytics.methods.length; n++) {
          var key = analytics.methods[n];
          analytics[key] = analytics.factory(key);
        }
        analytics.load = function (key, n) {
          var t = document.createElement("script");
          t.type = "text/javascript";
          t.async = !0;
          t.setAttribute("data-global-segment-analytics-key", i);
          t.src =
            "https://cdn.segment.com/analytics.js/v1/" +
            key +
            "/analytics.min.js";
          var r = document.getElementsByTagName("script")[0];
          r.parentNode.insertBefore(t, r);
          analytics._loadOptions = n;
        };
        analytics._writeKey = "uC8lzaUyjmypXHvHqVZenGjApDyIIKck";
        analytics.SNIPPET_VERSION = "5.2.0";

        // Load + queue a page() immediately (as Segment recommends)
        analytics.load("uC8lzaUyjmypXHvHqVZenGjApDyIIKck");
        analytics.page();
      }
    }
  })();
  // --- end Segment snippet wrapper ---

  console.log("[Analytics] Segment snippet injected");
}

/***********************
 * GA4 LOADER (GDPR)
 ***********************/
function loadGA(measurementId) {
  if (window.gtagLoaded) return;

  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  s.async = true;
  s.onload = () => console.log("[Analytics] GA script loaded:", measurementId);
  s.onerror = () =>
    console.warn("[Analytics] GA script failed to load (blocked?)");
  document.head.appendChild(s);

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
  // Segment: OK to call even before analytics.js fully loads; the snippet queues it.
  try {
    window.analytics &&
      window.analytics.track &&
      window.analytics.track(eventName, props);
  } catch {}

  // GA4
  try {
    if (window.gtagLoaded) window.gtag("event", eventName, props);
  } catch {}
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
  // Theme
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Cookie consent
  const banner = document.getElementById("cookie-consent-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");
  const savePrefsBtn = document.getElementById("save-preferences-button");

  const consent = localStorage.getItem("cookie_consent");
  if (consent === "true") {
    loadSegmentAnalytics();
    loadGA("G-XVJPB7R5S9");
  } else if (consent === "false") {
    console.log("[Analytics] Disabled by user preference.");
  } else if (banner) {
    banner.classList.remove("hidden");
  }

  if (acceptBtn) {
    acceptBtn.onclick = function () {
      localStorage.setItem("cookie_consent", "true");
      banner?.classList.add("hidden");
      loadSegmentAnalytics();
      loadGA("G-XVJPB7R5S9");
    };
  }

  if (rejectBtn) {
    rejectBtn.onclick = function () {
      localStorage.setItem("cookie_consent", "false");
      banner?.classList.add("hidden");
      console.log("[Analytics] Disabled by user preference.");
    };
  }

  if (savePrefsBtn && banner) {
    savePrefsBtn.onclick = function () {
      const analyticsEnabled = banner.__x?.$data?.analytics ?? false;
      localStorage.setItem(
        "cookie_consent",
        analyticsEnabled ? "true" : "false"
      );
      banner.classList.add("hidden");
      if (analyticsEnabled) {
        loadSegmentAnalytics();
        loadGA("G-XVJPB7R5S9");
      } else {
        console.log("[Analytics] Disabled by user preference.");
      }
    };
  }

  // YouTube lazy
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

  // CTA bindings
  trackClick("header-book-demo", "Book a Demo Clicked", { location: "header" });
  trackClick("hero-book-demo", "Book a Demo Clicked", { location: "hero" });
  trackClick("hero-explore-ai", "Explore Gnowbe AI Clicked", {
    location: "hero",
  });
  trackClick("footer-book-demo", "Book a Demo Clicked", { location: "footer" });
  trackClick("footer-try-ai", "Try Gnowbe AI Free Clicked", {
    location: "footer",
  });
}

/*****************
 * BOOTSTRAP PAGE
 *****************/
document.addEventListener("DOMContentLoaded", initPage);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initPage();
});
window.toggleTheme = toggleTheme;
