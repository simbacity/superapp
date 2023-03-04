/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./app-store/apps/**/pages/**/*.{js,ts,jsx,tsx}",
    "./app-store/apps/**/components/**/*.{js,ts,jsx,tsx}",
    "./app-store/shared/components/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
