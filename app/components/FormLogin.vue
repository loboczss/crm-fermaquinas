<template>
  <div class="w-full">
    <form @submit.prevent="$emit('submit')" class="space-y-6">
      <BaseInput
        id="email"
        label="E-mail"
        type="email"
        placeholder="exemplo@empresa.com"
        :model-value="email"
        @update:model-value="$emit('update:email', $event)"
        required
      />

      <div class="space-y-1">
        <InputPassword
          id="password"
          label="Senha"
          placeholder="Digite sua senha"
          :model-value="password"
          @update:model-value="$emit('update:password', $event)"
          required
        />
      </div>

      <div class="pt-2">
        <AuthPrimaryButton type="submit">
          Entrar
        </AuthPrimaryButton>
      </div>
      
      <p class="text-center text-xs text-gray-500">
        Não tem uma conta? 
        <NuxtLink to="/cadastro" class="font-semibold text-gray-900 hover:underline">Crie uma conta</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import BaseInput from './BaseInput.vue'
import InputPassword from './InputPassword.vue'
import AuthPrimaryButton from './AuthPrimaryButton.vue'

interface Props {
  email?: string
  password?: string
}

defineProps<Props>()

defineEmits<{
  (e: 'submit'): void
  (e: 'update:email', value: string): void
  (e: 'update:password', value: string): void
}>()
</script>
