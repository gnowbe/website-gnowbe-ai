/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html", "./*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans", "sans-serif"],
        serif: ["Noto Serif", "serif"],
      },
      colors: {
        gnowbe: {
          red: "#B41F24",
          yellow: "#FFB606",
          "yellow-darker": "#EAA800",
          purple: "#935FEE",
        },
        "brand-red": "#B41F24",
        "brand-yellow": "#FFB606",
        "brand-teal": "#5EC3C5",
        "brand-purple": "#935FEE",
        "action-green": "#116D45",
        "dark-bg-start": "#111827",
        "dark-bg-end": "#2c1a4c",
      },
      fontSize: {
        "7xl": ["5.5rem", { lineHeight: "1.2" }], // 5.5rem font size with 1.2 line height
        "6.5xl": ["4.5rem", { lineHeight: "1.2" }], // Customize size and line height
      },
    },
  },
  plugins: [],
};
