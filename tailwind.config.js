/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.tsx",
    "./{components,contexts,data,hooks,lib,screens,services,styles}/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#F58A5C",
        "background-light": "#FFFBF8",
        "background-dark": "#121212",
        "card-light": "#FFFFFF",
        "card-dark": "#1E1E1E",
        "text-light": "#1C1C1E",
        "text-dark": "#EAEAEA",
        "subtext-light": "#555555",
        "subtext-dark": "#A0A0A0",
        "border-light": "#F0EAE4",
        "border-dark": "#333333",
        'vibrant-purple': '#7C3AED',
        'vibrant-green': '#34D399',
        'heading-text': '#111827',
        'body-text': '#374151',
        // New Homepage Palette
        'brand-blue': '#1E293B',
        'brand-orange': '#E87C4D',
        'brand-mustard': '#F3B93C',
        'brand-off-white': '#F8FAFC',
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.25rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}