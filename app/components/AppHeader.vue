<template>
  <header id="app-header" class="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex flex-col">
        <NuxtLink to="/" class="text-2xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
          CRM Eva<span class="text-primary text-4xl leading-none">.</span>
        </NuxtLink>
        <p class="hidden sm:block text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          Management System
        </p>
      </div>

      <!-- Desktop Nav -->
      <nav id="desktop-nav" class="hidden md:block">
        <ul class="flex items-center gap-8">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink 
              :to="item.path" 
              class="text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200 relative group"
              active-class="text-primary"
            >
              {{ item.label }}
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" :class="{ 'w-full': $route.path === item.path }"></span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Desktop Button -->
      <div class="hidden md:flex items-center gap-4">
        <AppNotifications />
        <ClientOnly>
          <div v-if="!user" class="flex items-center gap-3">
             <NuxtLink to="/cadastro" class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
              Criar conta
            </NuxtLink>
            <BaseButton 
              id="auth-button-desktop"
              variant="outline" 
              size="sm" 
              @click="handleAuthAction"
            >
              Entrar
            </BaseButton>
          </div>
          <div v-else class="flex items-center gap-3">
            <NuxtLink 
              to="/perfil"
              class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Meu Perfil
            </NuxtLink>
            <BaseButton 
              id="auth-button-desktop"
              variant="outline" 
              size="sm" 
              @click="handleAuthAction"
            >
              Sair
            </BaseButton>
          </div>
        </ClientOnly>
      </div>

      <div class="flex items-center gap-2">
        <div class="md:hidden flex items-center gap-2">
          <AppNotifications />
        </div>
        <!-- Mobile Menu Button -->
        <button 
          id="mobile-menu-toggle"
          @click="isMenuOpen = !isMenuOpen" 
          class="md:hidden p-2 text-gray-600 hover:text-primary focus:outline-none"
          aria-label="Menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="isMenuOpen" id="mobile-menu" class="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-4 shadow-lg">
      <nav>
        <ul class="flex flex-col space-y-4">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink 
              :to="item.path" 
              class="block text-base font-medium text-gray-600 hover:text-primary transition-colors duration-200"
              active-class="text-primary"
              @click="isMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
          <li v-if="user">
            <NuxtLink 
              to="/perfil"
              class="block text-base font-medium text-gray-600 hover:text-primary transition-colors duration-200 flex items-center gap-2"
              active-class="text-primary"
              @click="isMenuOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Meu Perfil
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="pt-4 border-t border-gray-100">
        <ClientOnly>
          <div v-if="!user" class="space-y-2">
            <NuxtLink 
              to="/cadastro"
              class="block w-full text-center px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
              @click="isMenuOpen = false"
            >
              Criar conta
            </NuxtLink>
          </div>
        </ClientOnly>
        <BaseButton 
          id="auth-button-mobile"
          variant="outline" 
          size="sm" 
          class="w-full justify-center mt-2"
          @click="handleAuthAction"
        >
          <ClientOnly>
            {{ user ? 'Sair' : 'Entrar' }}
            <template #fallback>Entrar</template>
          </ClientOnly>
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'
import { navigateTo, useRoute } from '#imports'
import BaseButton from './BaseButton.vue'
import AppNotifications from './AppNotifications.vue'
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
const user = computed(() => auth.user.value)
const isMenuOpen = ref(false)
const $route = useRoute()

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Vendas', path: '/vendas' },
  { label: 'Calendário', path: '/calendario' },
  { label: 'Relatórios', path: '/relatorios' },
  { label: 'Privacidade', path: '/privacidade' },
]

const handleAuthAction = async () => {
  isMenuOpen.value = false
  if (user.value) {
    await auth.logout()
  } else {
    await navigateTo('/login')
  }
}
</script>
