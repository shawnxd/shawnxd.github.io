import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  assetsInclude: ['**/*.md'],
  optimizeDeps: {
    include: ['gray-matter']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})