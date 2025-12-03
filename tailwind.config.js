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
        // Enterprise Dashboard Palette
        'slate-app-bg': '#F8FAFC',
        'slate-border': '#E2E8F0',
        'slate-header': '#1E293B',
        'slate-accent': '#3B82F6',
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.25rem",
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [
    tailwindForms,
    tailwindTypography,
  ],
}