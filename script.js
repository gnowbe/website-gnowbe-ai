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

// Simple script to apply dark mode based on user preference or saved setting
if (
  localStorage.getItem("theme") === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

function toggleTheme() {
  const html = document.documentElement;
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const cookieConsentBanner = document.getElementById("cookie-consent-banner");
  const acceptCookiesButton = document.getElementById("accept-cookies");

  // Function to initialize analytics
  function initializeAnalytics() {
    if (window.analytics && !window.analytics.initialized) {
      analytics.load("uC8lzaUyjmypXHvHqVZenGjApDyIIKck");
      analytics.page();
    }
  }

  // Check if consent has already been given
  if (!localStorage.getItem("cookie_consent")) {
    cookieConsentBanner.classList.remove("hidden");
  } else {
    initializeAnalytics();
  }

  // Event listener for the accept button
  acceptCookiesButton.addEventListener("click", function () {
    localStorage.setItem("cookie_consent", "true");
    cookieConsentBanner.classList.add("hidden");
    initializeAnalytics();
  });
});
