<template>
  <AuthWrapper
    title="Crie sua conta"
    subtitle="Junte-se a nós e comece a gerenciar"
    :message="message"
    :is-error="isError"
    :loading="loading"
  >
    <FormRegister
      @submit="handleRegister"
    />
  </AuthWrapper>

  <AlertModal
    v-model="showSuccessModal"
    title="Verifique seu e-mail!"
    message="Enviamos um e-mail de confirmação para você. Por favor, verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta."
    button-text="Ok, entendi"
    @update:model-value="handleModalClose"
  />
</template>

<script setup lang="ts">
import { ref, watch } from '#imports'
import FormRegister from '~/components/FormRegister.vue'
import AuthWrapper from '~/components/AuthWrapper.vue'
import AlertModal from '~/components/AlertModal.vue'
import { useAuth } from '~/composables/useAuth'
import { navigateTo, useSupabaseUser } from '#imports'

const user = useSupabaseUser()
const isRegistering = ref(false)

watch(user, () => {
  if (user.value && !isRegistering.value) {
    return navigateTo('/')
  }
}, { immediate: true })

const { register } = useAuth()
const message = ref('')
const isError = ref(false)
const loading = ref(false)
const showSuccessModal = ref(false)

const handleRegister = async (formData: { name: string; email: string; password: string }) => {
  try {
    isRegistering.value = true
    loading.value = true
    message.value = 'Criando sua conta...'
    isError.value = false
    
    await register(formData.email, formData.password, formData.name)
    
    message.value = ''
    loading.value = false
    showSuccessModal.value = true
    
  } catch (error: any) {
    console.error('Registration error:', error)
    isError.value = true
    message.value = error.message || 'Erro ao criar conta. Tente novamente.'
    isRegistering.value = false
  } finally {
    loading.value = false
  }
}

const handleModalClose = (value: boolean) => {
  if (!value) {
    navigateTo('/login')
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.1); }
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 15s ease-in-out infinite;
}
</style>
