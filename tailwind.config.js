/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html"],
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
      },
    },
  },
  plugins: [],
};
