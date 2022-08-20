module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app-store/apps/**/pages/**/*.{js,ts,jsx,tsx}",
    "./app-store/apps/**/components/**/*.{js,ts,jsx,tsx}",
    "./app-store/shared/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
