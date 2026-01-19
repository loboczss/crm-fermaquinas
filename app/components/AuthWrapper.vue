<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50/50 p-6">
    <div class="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-10 md:p-12 border border-gray-100">
        <div class="mb-10 text-center">
          <NuxtLink to="/" class="inline-block group mb-6">
            <span class="text-3xl font-bold tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">
              CRM Eva<span class="text-primary text-4xl leading-none">.</span>
            </span>
          </NuxtLink>
          <h1 class="text-xl font-bold text-gray-900 tracking-tight">{{ title }}</h1>
          <p class="text-sm text-gray-500 mt-2 font-medium">{{ subtitle }}</p>
        </div>

        <slot />

        <slot name="footer-content" />

        <!-- Minimalist Alert -->
        <div v-if="message" 
             class="mt-6 p-4 rounded-xl text-center text-sm font-medium animate-in fade-in slide-in-from-top-2 border"
             :class="isError ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'">
          <div class="flex items-center justify-center gap-2">
             <div v-if="loading" class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
             {{ message }}
          </div>
        </div>
      </div>
      
      <footer class="mt-8 text-center">
        <NuxtLink to="/" class="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar para o início
        </NuxtLink>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

const props = defineProps<{
  title: string
  subtitle: string
  message?: string
  isError?: boolean
  loading?: boolean
}>()

useHead({
  title: props.title ? `${props.title} | Crm: Evastur` : 'Crm: Evastur'
})
</script>
