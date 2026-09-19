#!/bin/bash
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/shop
mkdir -p src/components/admin
mkdir -p src/pages/public
mkdir -p src/pages/admin
mkdir -p src/hooks
mkdir -p src/store
mkdir -p src/services/interfaces
mkdir -p src/services/mock
mkdir -p src/domain/models
mkdir -p src/utils
mkdir -p src/assets

# Create base configuration files
echo 'import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
' > vite.config.ts

# tsconfig.json alias update
# Note: In Vite 5 templates, there is tsconfig.json, tsconfig.app.json, tsconfig.node.json
echo '{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}' > tsconfig.app.json

echo '/** @type {import("tailwindcss").Config} */
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
' > tailwind.config.js

echo '@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-secondary font-sans antialiased;
  }
}
' > src/index.css

echo 'import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
' > src/utils/cn.ts

