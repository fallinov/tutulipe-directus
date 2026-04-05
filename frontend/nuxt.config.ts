// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts',
  ],

  // Désactiver Google Fonts — polices locales uniquement
  fonts: {
    providers: {
      google: false,
    },
  },

  css: ['~/assets/css/main.css'],

  // SSG pur
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  // SEO de base
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Tutulipe — L\'art floral au naturel',
      meta: [
        { name: 'description', content: 'Tutulipe, artisan fleuriste. Compositions florales pour mariages, deuils et décorations.' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL || 'http://localhost:8055',
    },
  },

  image: {
    providers: {
      directus: {
        name: 'directus',
        provider: '~/providers/directus-image.ts',
      },
    },
  },
})
