<template>
  <ModalBase
    v-model="isOpen"
    title="Embarques"
    :subtitle="`${selectedDate} de ${monthName} de ${year}`"
    size="sm"
    id="embarque-list-modal"
  >
    <div class="px-6 py-8">
      <div v-if="embarques.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4 grayscale">
          📦
        </div>
        <p class="text-sm text-gray-400 font-bold uppercase tracking-widest">Nenhum embarque</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="embarque in embarques"
          :key="embarque.id"
          class="bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary/20 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary/5"
          :id="`embarque-card-${embarque.id}`"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📦
              </div>
              <div>
                <h4 class="text-base font-bold text-gray-900 leading-tight">
                  {{ embarque.contact_name || 'Sem nome' }}
                </h4>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  {{ formatDate(embarque.embarque) }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="embarque.fornecedor || embarque.obs_pendencias || embarque.observacao" class="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1">
            <p v-if="embarque.fornecedor"><strong>Fornecedor:</strong> {{ embarque.fornecedor }}</p>
            <p v-if="embarque.obs_pendencias"><strong>Observações:</strong> {{ embarque.obs_pendencias }}</p>
            <p v-if="embarque.observacao"><strong>Observações:</strong> {{ embarque.observacao }}</p>
          </div>

          <button
            @click="handleWebhook(embarque)"
            :disabled="webhookLoading[embarque.id]"
            class="w-full bg-primary hover:bg-blue-700 text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 group-hover:translate-y-[-2px] mt-5"
            :id="`embarque-webhook-btn-${embarque.id}`"
          >
            <div v-if="webhookLoading[embarque.id]" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <svg v-else class="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <span>Enviar Webhook</span>
          </button>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { computed, ref } from '#imports'
import ModalBase from './ModalBase.vue'
import { formatDate } from '~/utils/formatters'
import { useCalendario } from '~/composables/useCalendario'
import { useEmbarques } from '~/composables/useEmbarques'
import type { EmbarqueItem } from '~/composables/useEmbarques'

const props = defineProps<{
  modelValue: boolean
  embarques: EmbarqueItem[]
  selectedDate: number
  month: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { currentYear: year } = useCalendario()
const { triggerWebhook } = useEmbarques()
const webhookLoading = ref<Record<number, boolean>>({})

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const monthName = computed(() => monthNames[props.month - 1])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleWebhook = async (embarque: EmbarqueItem) => {
  webhookLoading.value[embarque.id] = true

  try {
    const nome = embarque.contact_name || 'Sem nome'
    const data_embarque = embarque.embarque || ''
    const contato_id = embarque.contato_id || 'unknown'
    const observacoes = [embarque.obs_pendencias, embarque.observacao].filter(Boolean).join(' | ')

    await triggerWebhook(nome, data_embarque, contato_id, observacoes)
    alert(`Webhook enviado para ${nome}.`)
  } catch (error) {
    console.error('Erro ao disparar webhook:', error)
    alert('Erro ao processar a ação.')
  } finally {
    webhookLoading.value[embarque.id] = false
  }
}
</script>
