import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // No trailing slash — works at /guides and /guides/ in dev and on GitHub Pages
  base: '/guides',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/i18n/locales/en/')) return 'i18n-en'
          if (id.includes('/i18n/locales/pl/')) return 'i18n-pl'
          if (id.includes('/guides/shared/ua-property-sale/')) return 'ua-tax'
          if (id.includes('/guides/poland-money/')) return 'poland-guide'
        },
      },
    },
  },
})
