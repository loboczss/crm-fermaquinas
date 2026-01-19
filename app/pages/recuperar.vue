<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50/50 p-6">
    <div class="w-full max-w-[440px]">
      <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10 md:p-12 text-center">
        <div class="mb-10">
          <NuxtLink to="/" class="inline-block text-3xl font-bold tracking-tight text-gray-900 mb-2">
            CRM Eva<span class="text-primary text-4xl leading-none">.</span>
          </NuxtLink>
          <h1 class="text-xl font-semibold text-gray-900">Recuperar Senha</h1>
          <p class="text-sm text-gray-500 mt-2">Digite seu e-mail para receber o link de recuperação</p>
        </div>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <BaseInput
            id="email"
            label="E-mail de recuperação"
            type="email"
            placeholder="seu@email.com"
            :model-value="email"
            @update:model-value="email = $event.toString()"
            required
            :disabled="loading"
          />

          <BaseButton 
            type="submit" 
            variant="primary" 
            size="lg" 
            class="w-full"
            :disabled="loading"
          >
            {{ loading ? 'Enviando link...' : 'Enviar link de recuperação' }}
          </BaseButton>
        </form>

        <div v-if="message" class="mt-6 p-4 rounded-xl text-center text-sm font-medium animate-in fade-in slide-in-from-top-2" :class="isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'">
          {{ message }}
        </div>
      </div>
      
      <footer class="mt-8 text-center">
        <NuxtLink to="/login" class="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar para o login
        </NuxtLink>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, navigateTo, useHead } from '#imports'
import { useSupabaseClient } from '#imports'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'

useHead({
  title: 'Recuperar Senha | Crm: Evastur'
})

const supabase = useSupabaseClient()
const email = ref('')
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const handleResetPassword = async () => {
  try {
    loading.value = true
    message.value = ''
    isError.value = false
    
    // Simplificando o redirecionamento para o origen
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/login`,
    })
    
    if (error) throw error
    
    message.value = 'E-mail de recuperação enviado! Verifique sua caixa de entrada.'
  } catch (error: any) {
    console.error('Reset password error:', error)
    isError.value = true
    message.value = error.message || 'Erro ao enviar e-mail de recuperação.'
  } finally {
    loading.value = false
  }
}
</script>
