<template>
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
    <div class="flex items-start justify-between mb-3">
      <div>
        <h4 class="text-sm font-bold text-gray-900">Eventos Programados</h4>
        <p class="text-xs text-gray-600 mt-0.5">Automações ativas do sistema</p>
      </div>
      <div class="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
        {{ activeCount }}
      </div>
    </div>

    <!-- Timeline of Events -->
    <div class="space-y-2">
      <div
        v-for="event in sortedActiveEvents"
        :key="event.id"
        class="bg-white rounded-lg p-3 border border-blue-100 hover:border-primary transition-colors"
      >
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <IconClock :size="14" color="currentColor" class="text-primary" />
            <span class="text-sm font-bold text-gray-900">{{ event.horario_evento }}</span>
          </div>
          <div
            :class="[
              'w-2 h-2 rounded-full',
              getEventColor(event.nome_evento || '')
            ]"
          ></div>
        </div>
        <p class="text-xs text-gray-600 font-medium">{{ getEventLabel(event.nome_evento || '') }}</p>
      </div>

      <button
        v-if="inactiveCount > 0"
        @click="$emit('show-all')"
        class="w-full py-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
      >
        + {{ inactiveCount }} evento(s) inativo(s)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'
import type { WebhookEvent } from '~~/shared/types/WebhookEvent'
import { WEBHOOK_EVENT_OPTIONS } from '~~/shared/constants/webhookEvents'
import IconClock from './IconClock.vue'

const props = defineProps<{
  events: WebhookEvent[]
}>()

defineEmits<{
  'show-all': []
}>()

const activeEvents = computed(() => {
  return props.events.filter(e => e.acao_evento === 'webhook')
})

const activeCount = computed(() => activeEvents.value.length)

const inactiveCount = computed(() => {
  return props.events.filter(e => e.acao_evento !== 'webhook').length
})

const sortedActiveEvents = computed(() => {
  return [...activeEvents.value]
    .sort((a, b) => (a.horario_evento || '').localeCompare(b.horario_evento || ''))
    .slice(0, 5) // Show only first 5
})

const getEventLabel = (type: string) => {
  return WEBHOOK_EVENT_OPTIONS.find(opt => opt.value === type)?.label || type
}

const getEventColor = (type: string) => {
  if (type.includes('aniversario')) return 'bg-orange-500'
  if (type.includes('embarque')) return 'bg-blue-500'
  if (type.includes('followup')) return 'bg-green-500'
  return 'bg-purple-500'
}
</script>
