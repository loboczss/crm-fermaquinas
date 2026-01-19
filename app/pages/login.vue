<template>
  <AuthWrapper
    title="Bem-vindo de volta"
    subtitle="Acesse sua conta para continuar"
    :message="message"
    :is-error="isError"
    :loading="loading"
  >
    <FormLogin
      :email="email"
      :password="password"
      @update:email="email = $event"
      @update:password="password = $event"
      @submit="handleSubmit"
    />

    <template #footer-content>
      <div class="mt-8 pt-6 border-t border-gray-50 text-center">
        <NuxtLink to="/recuperar" class="text-xs font-semibold text-primary hover:text-primary-dark transition-colors uppercase tracking-wider">
          Esqueceu sua senha?
        </NuxtLink>
      </div>
    </template>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { ref, watch } from '#imports'
import FormLogin from '~/components/FormLogin.vue'
import AuthWrapper from '~/components/AuthWrapper.vue'
import { useAuth } from '~/composables/useAuth'

const user = useSupabaseUser()
watch(user, () => {
  if (user.value) {
    return navigateTo('/')
  }
}, { immediate: true })

const { login } = useAuth()
const email = ref('')
const password = ref('')
const message = ref('')
const isError = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    message.value = 'Iniciando acesso...'
    isError.value = false
    
    await login(email.value, password.value)
  } catch (error: any) {
    console.error('Login error:', error)
    isError.value = true
    message.value = error.message || 'Erro ao realizar login. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>
