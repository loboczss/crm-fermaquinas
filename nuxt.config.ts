// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Crm: Evastur',
      meta: [
        { name: 'description', content: 'CRM customizado para Evastur' },
        { property: 'og:title', content: 'Crm: Evastur' },
        { property: 'og:description', content: 'Gerencie clientes e vendas com o CRM Eva.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://crm.evastur.cloud/' },
        { property: 'og:image', content: 'https://crm.evastur.cloud/icon-512.svg' },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:title', content: 'Crm: Evastur' },
        { property: 'twitter:description', content: 'Gerencie clientes e vendas com o CRM Eva.' },
        { property: 'twitter:image', content: 'https://crm.evastur.cloud/icon-512.svg' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'CRM Eva' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' }
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  supabase: {
    url: process.env.NUXT_SUPABASE_URL,
    key: process.env.NUXT_SUPABASE_KEY,
    types: false, // Disabling to fix persistent path warning
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/confirm', '/recuperar', '/cadastro', '/privacidade', '/'],
      saveRedirectToCookie: true
    }
  },
  runtimeConfig: {
    public: {
      webhookBirthdayUrl: process.env.NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL,
      webhookEmbarqueUrl: process.env.NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL
    }
  },
  nitro: {
    // scheduledTasks: {
    //   '*/1 * * * *': ['webhook-events']
    // }
  }
})