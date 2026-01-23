<template>
  <ModalBase
    v-model="isOpen"
    title="Aniversariantes"
    :subtitle="`${selectedDate} de ${monthName} de ${year}`"
    size="sm"
    id="birthday-list-modal"
  >
    <div class="px-6 py-8">
      <div v-if="birthdays.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4 grayscale">
          🎂
        </div>
        <p class="text-sm text-gray-400 font-bold uppercase tracking-widest">Nenhum evento</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="person in birthdays"
          :key="person.id"
          class="bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary/20 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary/5"
          :id="`birthday-card-${person.id}`"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🎉
              </div>
              <div>
                <h4 class="text-base font-bold text-gray-900 leading-tight">
                  {{ person.nome || person.nome_social || 'Sem nome' }}
                </h4>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  ID: {{ person.contato_id }}
                </p>
              </div>
            </div>
          </div>

          <button
            @click="handleUnifiedAction(person)"
            :disabled="webhookLoading[person.id]"
            class="w-full bg-primary hover:bg-blue-700 text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 group-hover:translate-y-[-2px]"
            :id="`unified-action-btn-${person.id}`"
          >
            <div v-if="webhookLoading[person.id]" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <svg v-else class="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <span>Parabenizar Cliente</span>
          </button>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'
import type { CrmEvastur } from '~~/shared/types/CrmEvastur'
import ModalBase from './ModalBase.vue'
import { useCalendario } from '~/composables/useCalendario'

const props = defineProps<{
  modelValue: boolean
  birthdays: CrmEvastur[]
  selectedDate: number
  month: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { triggerWebhook: triggerWebhookAPI, currentYear: year } = useCalendario()
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

const handleUnifiedAction = async (person: CrmEvastur) => {
  webhookLoading.value[person.id] = true

  try {
    // Trigger Webhook Only
    const dia_aniversario = person.data_nascimento || ''
    const nome = person.nome || person.nome_social || 'Sem nome'
    const contato_id = (person.contato_id as string) || 'unknown'
    
    await triggerWebhookAPI(nome, dia_aniversario, contato_id)
    
    alert(`Parabéns enviados para ${nome} via Webhook!`)

  } catch (error) {
    console.error('Erro ao disparar webhook:', error)
    alert('Erro ao processar a ação.')
  } finally {
    webhookLoading.value[person.id] = false
  }
}
</script>
