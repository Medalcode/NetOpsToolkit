/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./stitch.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0070F3",
        "signal-green": "#10B981",
        "background-light": "#f5f7f8",
        "background-dark": "#000000",
        "surface-dark": "#0A0A0A",
        "border-dark": "#222222",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
