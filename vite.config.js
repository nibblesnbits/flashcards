import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/flashcards",
    rollupOptions: {
      output: {
        // Force more predictable asset names
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
    // Ensure proper asset handling
    assetsInlineLimit: 0, // Disable inlining to force external files
  },
});
