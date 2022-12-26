module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app-store/apps/**/pages/**/*.{js,ts,jsx,tsx}",
    "./app-store/apps/**/components/**/*.{js,ts,jsx,tsx}",
    "./app-store/shared/components/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
