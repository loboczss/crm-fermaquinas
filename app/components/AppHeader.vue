<template>
  <header id="app-header" class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
    <div class="container mx-auto px-6 h-16 flex items-center">
      
      <!-- Left Section: Logo -->
      <div class="flex-1 flex items-center">
        <NuxtLink to="/" class="group flex items-center gap-2">
          <div class="relative flex items-center">
            <span class="text-xl font-black tracking-tighter text-gray-900 group-hover:scale-105 transition-transform duration-300 block uppercase">
              CRM Eva
            </span>
            <span class="ml-0.5 text-primary text-2xl leading-none animate-pulse">.</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Center Section: Desktop Navigation -->
      <div class="hidden lg:flex flex-[2] justify-center items-center">
        <nav id="desktop-nav">
          <ul class="flex items-center gap-10">
            <li v-for="item in navItems" :key="item.path">
              <NuxtLink
                :to="item.path"
                class="nav-link group flex items-center gap-2.5 py-2"
                active-class="active"
              >
                <div class="icon-wrapper text-gray-400 group-hover:text-primary group-[.active]:text-primary transition-all duration-300 transform group-hover:scale-125">
                  <component :is="item.icon" class="w-4 h-4" />
                </div>
                <span class="text-[11px] font-extrabold tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-900 group-[.active]:text-gray-900 transition-colors duration-300 relative pb-1">
                  {{ item.label }}
                  <span class="nav-underline"></span>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Right Section: Desktop Auth/Profile -->
      <div class="flex-1 flex justify-end items-center gap-6">
        <div class="hidden md:flex items-center gap-6">
          <AppNotifications v-if="user" />
          <ClientOnly>
            <div v-if="!user" class="flex items-center gap-5">
              <NuxtLink to="/cadastro" class="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                Criar conta
              </NuxtLink>
              <BaseButton
                id="auth-button-desktop"
                variant="primary"
                size="sm"
                class="rounded-full px-6 h-9 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                @click="handleAuthAction"
              >
                Entrar
              </BaseButton>
            </div>
            <div v-else class="flex items-center gap-6">
              <NuxtLink
                to="/perfil"
                class="group flex items-center gap-3 pr-2"
                active-class="active"
              >
                <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span class="hidden xl:block text-[11px] font-extrabold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">
                  PERFIL
                </span>
              </NuxtLink>
              <button
                @click="handleAuthAction"
                class="text-[11px] font-bold uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
              >
                SAIR
              </button>
            </div>
          </ClientOnly>
        </div>

        <!-- Mobile Logic -->
        <div class="flex items-center gap-3">
          <div class="md:hidden flex items-center gap-3" v-if="user">
            <AppNotifications />
          </div>
          <!-- Mobile Menu Button -->
          <button 
            id="mobile-menu-toggle"
            @click="isMenuOpen = !isMenuOpen" 
            class="md:hidden p-2 text-gray-500 hover:text-primary focus:outline-none transition-all active:scale-90"
            aria-label="Menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0 -translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-300 ease-[cubic-bezier(0.7,0,0.84,0)]"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-8"
    >
      <div v-if="isMenuOpen" id="mobile-menu" class="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-2xl px-8 py-8 space-y-8 shadow-2xl absolute w-full left-0 z-50">
        <nav>
          <ul class="flex flex-col space-y-7">
            <li v-for="item in navItems" :key="item.path">
              <NuxtLink 
                :to="item.path" 
                class="flex items-center gap-5 text-[14px] font-black uppercase tracking-[0.25em] text-gray-500 hover:text-primary transition-all active:scale-95"
                active-class="text-primary"
                @click="isMenuOpen = false"
              >
                <div class="w-8 flex justify-center">
                  <component :is="item.icon" class="w-5 h-5" />
                </div>
                {{ item.label }}
              </NuxtLink>
            </li>
            <li v-if="user">
              <NuxtLink 
                to="/perfil"
                class="flex items-center gap-5 text-[14px] font-black uppercase tracking-[0.25em] text-gray-500 hover:text-primary transition-all active:scale-95"
                active-class="text-primary"
                @click="isMenuOpen = false"
              >
                <div class="w-8 flex justify-center">
                  <div class="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
                MEU PERFIL
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="pt-8 border-t border-gray-100 flex flex-col gap-5">
          <ClientOnly>
            <div v-if="!user" class="space-y-4">
              <NuxtLink 
                to="/cadastro"
                class="block w-full text-center py-2 text-[12px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                @click="isMenuOpen = false"
              >
                CRIAR CONTA
              </NuxtLink>
            </div>
          </ClientOnly>
          <BaseButton 
            id="auth-button-mobile"
            variant="primary" 
            size="md" 
            class="w-full justify-center rounded-2xl text-[12px] font-black uppercase tracking-widest h-14 shadow-xl shadow-primary/20"
            @click="handleAuthAction"
          >
            <ClientOnly>
              {{ user ? 'SAIR DO SISTEMA' : 'ENTRAR NA CONTA' }}
              <template #fallback>ENTRAR NA CONTA</template>
            </ClientOnly>
          </BaseButton>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav-link {
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2.5px;
  background-color: var(--color-primary, #3b82f6);
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center;
  opacity: 0.8;
}

.nav-link:hover .nav-underline,
.nav-link.active .nav-underline {
  transform: scaleX(1);
}

.nav-link:hover .icon-wrapper {
  transform: translateY(-4px) scale(1.2);
}

/* Disney+ specific tracking and font weight */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

header {
  font-family: 'Inter', sans-serif;
}
</style>

<script setup lang="ts">
import { ref, computed, markRaw, h } from '#imports'
import { navigateTo } from '#imports'
import BaseButton from './BaseButton.vue'
import AppNotifications from './AppNotifications.vue'
import { useAuth } from '~/composables/useAuth'

// Icon Components using h() for better reliability and performance
const createIcon = (d: string) => ({
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [h('path', { d })])
})

const HomeIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
    h('polyline', { points: '9 22 9 12 15 12 15 22' })
  ])
}

const UsersIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
    h('circle', { cx: '9', cy: '7', r: '4' }),
    h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
    h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
  ])
}

const SalesIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('line', { x1: '12', y1: '1', x2: '12', y2: '23' }),
    h('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' })
  ])
}

const CalendarIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
    h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
    h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
    h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
  ])
}

const ReportsIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('line', { x1: '18', y1: '20', x2: '18', y2: '10' }),
    h('line', { x1: '12', y1: '20', x2: '12', y2: '4' }),
    h('line', { x1: '6', y1: '20', x2: '6', y2: '14' })
  ])
}

const PrivacyIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
  ])
}

const auth = useAuth()
const user = computed(() => auth.user.value)
const isMenuOpen = ref(false)

const navItems = computed(() => {
  const items = [
    { label: 'Início', path: '/', icon: markRaw(HomeIcon) },
    { label: 'Clientes', path: '/clientes', auth: true, icon: markRaw(UsersIcon) },
    { label: 'Vendas', path: '/vendas', auth: true, icon: markRaw(SalesIcon) },
    { label: 'Calendário', path: '/calendario', auth: true, icon: markRaw(CalendarIcon) },
    { label: 'Relatórios', path: '/relatorios', auth: true, icon: markRaw(ReportsIcon) },
    { label: 'Privacidade', path: '/privacidade', icon: markRaw(PrivacyIcon) },
  ]

  return items.filter((i) => {
    return !i.auth || user.value
  })
})

const handleAuthAction = async () => {
  isMenuOpen.value = false
  if (user.value) {
    await auth.logout()
  } else {
    await navigateTo('/login')
  }
}
</script>
