import tailwindForms from '@tailwindcss/forms';
import tailwindTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./{components,contexts,data,hooks,lib,screens,services,styles}/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
        // New Homepage Palette & App Palette
        'brand-blue': '#1E293B',
        'brand-orange': '#E87C4D',
        'brand-mustard': '#F3B93C',
        'brand-off-white': '#FBF8F5', // Soft beige background
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
    tailwindForms,
    tailwindTypography,
  ],
}