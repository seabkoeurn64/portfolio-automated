import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Removed `base` since Vercel serves from root
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
