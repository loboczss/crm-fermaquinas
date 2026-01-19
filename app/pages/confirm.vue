<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <div class="text-center">
      <div class="mb-6">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
      <h1 class="text-2xl font-bold text-text mb-2">Confirmando seu login...</h1>
      <p class="text-text-light">Por favor aguarde enquanto verificamos seu email</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useHead } from '#imports'

useHead({
  title: 'Confirmando... | Crm: Evastur'
})

const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, () => {
  if (user.value) {
    const path = redirectInfo.pluck()
    return navigateTo(path || '/')
  }
}, { immediate: true })
</script>
