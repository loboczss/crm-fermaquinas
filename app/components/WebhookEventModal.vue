<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="close"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <IconZap :size="20" color="currentColor" class="text-primary" />
            <h3 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Editar' : 'Criar' }} Evento</h3>
          </div>
          <button
            @click="close"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Tipo de Evento
            </label>
            <select
              v-model="formData.nome_evento"
              class="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option v-for="option in eventOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Horário de Execução
            </label>
            <div class="relative">
              <IconClock :size="16" color="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                v-model="formData.horario_evento"
                type="time"
                class="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">
              O evento será executado diariamente neste horário
            </p>
          </div>

          <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 mt-0.5"
                :checked="formData.acao_evento === 'webhook'"
                @change="formData.acao_evento = ($event.target as HTMLInputElement).checked ? 'webhook' : 'disabled'"
              />
              <div>
                <span class="text-sm font-semibold text-gray-900 block">Ativar webhook</span>
                <span class="text-xs text-gray-600">O webhook será disparado automaticamente no horário configurado</span>
              </div>
            </label>
          </div>

          <!-- Event Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Sobre este evento</h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              {{ getEventDescription(formData.nome_evento) }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <BaseButton variant="outline" size="sm" @click="close">
            Cancelar
          </BaseButton>
          <BaseButton variant="primary" size="sm" :disabled="!isValid || saving" @click="save">
            {{ saving ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from '#imports'
import type { WebhookEvent } from '~~/shared/types/WebhookEvent'
import type { WebhookEventType } from '~~/shared/constants/webhookEvents'
import { WEBHOOK_EVENT_OPTIONS } from '~~/shared/constants/webhookEvents'
import BaseButton from './BaseButton.vue'
import IconClock from './IconClock.vue'
import IconZap from './IconZap.vue'

const props = defineProps<{
  modelValue: boolean
  event?: WebhookEvent | null
  eventOptions: Array<{ value: string; label: string }>
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [data: { nome_evento: WebhookEventType; horario_evento: string; acao_evento: string }]
}>()

const formData = ref({
  nome_evento: 'aniversario_hoje' as WebhookEventType,
  horario_evento: '12:00',
  acao_evento: 'webhook'
})

const isEdit = computed(() => !!props.event)

const isValid = computed(() => {
  return formData.value.nome_evento && formData.value.horario_evento
})

const close = () => {
  emit('update:modelValue', false)
}

const save = () => {
  if (!isValid.value) return
  emit('save', { ...formData.value })
}

const getEventDescription = (type: string | null) => {
  const descriptions: Record<string, string> = {
    aniversario_hoje: 'Envia notificação para clientes que fazem aniversário no dia atual.',
    aniversario_amanha: 'Envia notificação para clientes que farão aniversário no próximo dia.',
    embarque_hoje: 'Notifica sobre embarques programados para o dia atual.',
    embarque_d1: 'Notifica sobre embarques programados para o próximo dia.',
    followup_pendente: 'Busca clientes que compraram mas não receberam follow-up nos últimos 3 dias.',
    clientes_inativos_30d: 'Identifica clientes sem compras nos últimos 30 dias.'
  }
  return descriptions[type || ''] || 'Selecione um tipo de evento para ver a descrição.'
}

// Watch for event changes (when editing)
watch(() => props.event, (newEvent) => {
  if (newEvent) {
    formData.value = {
      nome_evento: (newEvent.nome_evento || 'aniversario_hoje') as WebhookEventType,
      horario_evento: newEvent.horario_evento || '12:00',
      acao_evento: newEvent.acao_evento || 'webhook'
    }
  } else {
    // Reset form
    formData.value = {
      nome_evento: 'aniversario_hoje' as WebhookEventType,
      horario_evento: '12:00',
      acao_evento: 'webhook'
    }
  }
}, { immediate: true })

// Reset form when modal closes
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen && !props.event) {
    formData.value = {
      nome_evento: 'aniversario_hoje' as WebhookEventType,
      horario_evento: '12:00',
      acao_evento: 'webhook'
    }
  }
})
</script>
