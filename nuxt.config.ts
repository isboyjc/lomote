import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare-pages"
  },
  content: {
    database: {
      type: 'd1',
      bindingName: 'DB'
    },
    preview: {
      api: 'https://api.nuxt.studio'
    },
    build: {
      markdown: {
        toc: {
          depth: 3,
        },
        highlight: {
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml'],
          theme: {
            default: 'github-light',
            dark: 'github-dark',
            sepia: 'monokai',
          },
        },
      },
    },
  },
  shadcn: {
    prefix: 'Ui',
    componentDir: join(currentDir, './components/ui'),
  },
  components: {
    dirs: [
      {
        path: './components',
        ignore: ['**/*.ts'],
      },
    ],
  },
  css: [
    join(currentDir, './assets/css/themes.css'),
  ],
  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 512,
    },
    customCollections: [
      {
        prefix: '4agi',
        dir: './assets/icons',
      },
    ],
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },
  
  modules: [
    "nitro-cloudflare-dev",
    "@nuxtjs/tailwindcss",
    '@nuxtjs/color-mode',
    "@nuxt/content",
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    'nuxt-og-image',
    "shadcn-nuxt",
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
})