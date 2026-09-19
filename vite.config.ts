import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname || __dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  test: {
    exclude: ['node_modules', 'dist', 'backend/**/*']
  }
} as any);
