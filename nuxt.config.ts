// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
    '/admin/**': { appMiddleware: 'admin' }
  },
  runtimeConfig: {
    public: {
      adminPassword: process.env.ADMIN_PASSWORD
    }
  },
  compatibilityDate: '2025-02-05',
})