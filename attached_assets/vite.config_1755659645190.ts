import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// GitHub Pages deployment configuration
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.argv.includes('--base=/Consulting_and_services/')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: isGitHubPages ? '/Consulting_and_services/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})