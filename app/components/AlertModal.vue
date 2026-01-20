<template>
  <ModalBase
    :model-value="modelValue"
    :title="title"
    size="xs"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="p-8 flex flex-col items-center text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      
      <div class="space-y-2">
        <p class="text-sm text-gray-600 leading-relaxed">{{ message }}</p>
      </div>

      <BaseButton
        variant="primary"
        class="w-full mt-4"
        @click="close"
      >
        {{ buttonText }}
      </BaseButton>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from '~/components/ModalBase.vue'
import BaseButton from '~/components/BaseButton.vue'

withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  message: string
  buttonText?: string
}>(), {
  title: 'Atenção',
  buttonText: 'Entendi'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>
