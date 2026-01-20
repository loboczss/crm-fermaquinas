<template>
  <ModalBase
    :model-value="modelValue"
    title="Confirmar Exclusão"
    size="xs"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="p-6 flex flex-col items-center text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>
      
      <div class="space-y-2">
        <h3 class="text-xl font-bold text-gray-900">Excluir Venda?</h3>
        <p class="text-sm text-gray-500 leading-relaxed">
          Tem certeza que deseja excluir esta venda? Esta ação é irreversível e removerá todos os dados permanentemente.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 w-full pt-4">
        <BaseButton
          variant="secondary"
          @click="close"
        >
          Cancelar
        </BaseButton>
        <button
          @click="confirm"
          class="px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md hover:shadow-lg shadow-red-200"
        >
          Excluir
        </button>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from '~/components/ModalBase.vue'
import BaseButton from '~/components/BaseButton.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
  close()
}
</script>
