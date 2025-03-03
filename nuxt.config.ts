// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  },

  nitro: {
    preset: "cloudflare-pages"
  },

  modules: ["nitro-cloudflare-dev", "@nuxt/content"]
})