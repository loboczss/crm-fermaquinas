<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseInput
        id="name"
        label="Nome completo"
        type="text"
        placeholder="Seu nome"
        v-model="name"
        required
      />

      <BaseInput
        id="email"
        label="E-mail profissional"
        type="email"
        placeholder="nome@empresa.com"
        v-model="email"
        required
      />

      <div class="space-y-1">
        <InputPassword
          id="password"
          label="Senha"
          placeholder="Crie uma senha forte"
          v-model="password"
          required
        />
      </div>

      <div class="space-y-1">
        <InputPassword
          id="confirmPassword"
          label="Confirmar senha"
          placeholder="Repita sua senha"
          v-model="confirmPassword"
          required
        />
        <p v-if="passwordError" class="text-xs text-red-500 mt-1">{{ passwordError }}</p>
      </div>

      <div class="pt-4">
        <AuthPrimaryButton type="submit">
          Criar minha conta
        </AuthPrimaryButton>
      </div>
      
      <p class="text-center text-[13px] text-gray-500 font-medium">
        Já tem uma conta? 
        <NuxtLink to="/login" class="font-semibold text-gray-900 hover:underline">Fazer login</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import BaseInput from './BaseInput.vue'
import InputPassword from './InputPassword.vue'
import AuthPrimaryButton from './AuthPrimaryButton.vue'

const emit = defineEmits<{
  (e: 'submit', data: { name: string; email: string; password: string }): void
}>()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

const handleSubmit = () => {
  passwordError.value = ''
  
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'As senhas não coincidem'
    return
  }

  if (password.value.length < 6) {
    passwordError.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  emit('submit', {
    name: name.value,
    email: email.value,
    password: password.value
  })
}
</script>
