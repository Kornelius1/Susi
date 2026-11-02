// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // SPA: token login disimpan di browser dan semua data datang dari API,
  // jadi render di server tidak memberi manfaat (lihat README).
  ssr: false,

  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/scss/main.scss'],

  runtimeConfig: {
    public: {
      // Bisa diganti lewat env NUXT_PUBLIC_API_BASE (saat build di hosting).
      apiBase: 'http://localhost:3001',
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        // Token SCSS (warna, radius, mixin) otomatis tersedia di semua komponen.
        scss: { additionalData: '@use "~/assets/scss/tokens" as *;\n' },
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Susi Air Pilot Hub',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0E2138' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/susiair-logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  typescript: { strict: true },
})
