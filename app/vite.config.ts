import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CARNA - كارنا',
        short_name: 'CARNA',
        description: 'سيارتك الجاية — هون',
        theme_color: '#FDB700',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-cache' },
          },
        ],
      },
    }),
  ],
})
