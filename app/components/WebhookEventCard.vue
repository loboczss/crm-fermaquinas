<template>
  <div class="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
    <div class="space-y-3">
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Evento</label>
        <select
          :value="modelValue.nome_evento"
          @change="updateEvent('nome_evento', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        >
          <option v-for="option in eventOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Horário</label>
        <input
          type="time"
          :value="modelValue.horario_evento"
          @input="updateEvent('horario_evento', ($event.target as HTMLInputElement).value)"
          class="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>

      <label class="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          :checked="modelValue.acao_evento === 'webhook'"
          @change="updateEvent('acao_evento', ($event.target as HTMLInputElement).checked ? 'webhook' : 'disabled')"
          class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
        />
        <span>Ativo (enviar webhook)</span>
      </label>
    </div>

    <div class="grid grid-cols-3 gap-2 mt-4">
      <BaseButton size="sm" variant="outline" :disabled="disabled" @click="$emit('save')">
        Salvar
      </BaseButton>
      <BaseButton size="sm" variant="primary" :disabled="disabled" @click="$emit('trigger')">
        Disparar
      </BaseButton>
      <BaseButton size="sm" variant="outline" class="text-red-500 hover:bg-red-50" :disabled="disabled" @click="$emit('delete')">
        Remover
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WebhookEvent } from '~~/shared/types/WebhookEvent'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  modelValue: WebhookEvent
  eventOptions: Array<{ value: string; label: string }>
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: WebhookEvent]
  'save': []
  'trigger': []
  'delete': []
}>()

const updateEvent = (field: keyof WebhookEvent, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
