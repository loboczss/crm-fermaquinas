// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  
  // Configuração do Vite para suprimir warnings
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suprimir warnings de dependências circulares
          if (warning.code === 'CIRCULAR_DEPENDENCY') {
            return
          }
          // Suprimir warnings de imports não utilizados
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
            return
          }
          warn(warning)
        }
      }
    }
  },
  
  app: {
    head: {
      title: 'CRM Fermaquinas',
      meta: [
        { name: 'description', content: 'CRM customizado para Fermaquinas' },
        { property: 'og:title', content: 'CRM Fermaquinas' },
        { property: 'og:description', content: 'Gerencie clientes e vendas com o CRM Fermaquinas.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://crm.fermaquinas.com/' },
        { property: 'og:image', content: 'https://crm.fermaquinas.com/icon-512.svg' },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:title', content: 'CRM Fermaquinas' },
        { property: 'twitter:description', content: 'Gerencie clientes e vendas com o CRM Fermaquinas.' },
        { property: 'twitter:image', content: 'https://crm.fermaquinas.com/icon-512.svg' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'CRM Fermaquinas' },
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
    
    // Suprimir todos os warnings de dependências circulares e imports não utilizados
    rollupConfig: {
      onwarn(warning, warn) {
        // Suprimir warnings de imports não utilizados do Supabase
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && 
            (warning.message?.includes('@supabase/postgrest-js') || 
             warning.message?.includes('@supabase/functions-js'))) {
          return
        }
        
        // Suprimir warnings de dependências circulares do Nitro/Nuxt (são internas do framework)
        if (warning.code === 'CIRCULAR_DEPENDENCY' && 
            (warning.message?.includes('node_modules/nitropack') ||
             warning.message?.includes('node_modules/@nuxt') ||
             warning.message?.includes('virtual:#nitro-internal') ||
             warning.message?.includes('virtual:#internal/nuxt'))) {
          return
        }
        
        // Mostrar apenas warnings relevantes do nosso código
        warn(warning)
      }
    }
  }
})