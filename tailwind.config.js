/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D4AF37", // Gold
          dark: "#B5952F",
          light: "#F0E68C",
        },
        secondary: {
          DEFAULT: "#000000", // Black
          dark: "#111111",
          light: "#333333",
        },
        accent: {
          DEFAULT: "#F5F5F5", // Neutral White
        },
        background: "#FAFAFA",
        surface: "#FFFFFF",
      }
    },
  },
  plugins: [],
}

