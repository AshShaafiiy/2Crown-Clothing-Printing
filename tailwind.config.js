/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      keyframes: {
        heroEnter: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'hero-enter': 'heroEnter 0.8s ease-out both',
        'hero-enter-delayed': 'heroEnter 0.8s ease-out 0.2s both',
        'hero-enter-delayed-2': 'heroEnter 0.8s ease-out 0.4s both',
      },
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

