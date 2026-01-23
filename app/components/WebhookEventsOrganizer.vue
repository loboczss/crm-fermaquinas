<template>
  <div class="space-y-4">
    <!-- Events Summary Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-gray-900">Eventos Programados</h3>
        <p class="text-xs text-gray-500 mt-0.5">{{ totalEvents }} evento(s) ativo(s)</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="selectedFilter = filter.value"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            selectedFilter === filter.value
              ? 'bg-primary text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Events by Type -->
    <div v-if="filteredEventsByType.length > 0" class="space-y-4">
      <div
        v-for="group in filteredEventsByType"
        :key="group.type"
        class="border border-gray-200 rounded-xl overflow-hidden"
      >
        <!-- Group Header -->
        <button
          @click="toggleGroup(group.type)"
          class="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between hover:from-gray-100 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-2 h-2 rounded-full',
                group.type.includes('aniversario') ? 'bg-orange-500' :
                group.type.includes('embarque') ? 'bg-blue-500' :
                group.type.includes('followup') ? 'bg-green-500' :
                'bg-purple-500'
              ]"
            ></div>
            <div class="text-left">
              <p class="text-sm font-semibold text-gray-900">{{ group.label }}</p>
              <p class="text-xs text-gray-500">{{ group.events.length }} evento(s)</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-gray-400">{{ group.events[0]?.horario_evento || '--:--' }}</span>
            <IconChevronDown
              :size="16"
              color="currentColor"
              :class="[
                'text-gray-400 transition-transform',
                expandedGroups.includes(group.type) ? 'rotate-180' : ''
              ]"
            />
          </div>
        </button>

        <!-- Group Events -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="expandedGroups.includes(group.type)" class="border-t border-gray-100">
            <div class="p-3 space-y-2">
              <div
                v-for="event in group.events"
                :key="event.id"
                class="bg-white border border-gray-100 rounded-lg p-3 hover:border-primary/30 transition-all group"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <IconClock :size="14" color="currentColor" class="text-gray-400" />
                    <span class="text-sm font-bold text-gray-900">{{ event.horario_evento }}</span>
                  </div>
                  <div
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      event.acao_evento === 'webhook'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    ]"
                  >
                    {{ event.acao_evento === 'webhook' ? 'Ativo' : 'Inativo' }}
                  </div>
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="$emit('trigger', event)"
                    class="flex-1 px-2 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    Disparar
                  </button>
                  <button
                    @click="$emit('edit', event)"
                    class="flex-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    @click="$emit('delete', event)"
                    class="px-2 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-12 text-center">
      <IconClock :size="40" color="currentColor" class="text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500 font-medium">Nenhum evento {{ selectedFilter !== 'all' ? 'neste filtro' : 'configurado' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'
import type { WebhookEvent } from '~~/shared/types/WebhookEvent'
import { WEBHOOK_EVENT_OPTIONS } from '~~/shared/constants/webhookEvents'
import IconClock from './IconClock.vue'
import IconChevronDown from './IconChevronDown.vue'

const props = defineProps<{
  events: WebhookEvent[]
}>()

const emit = defineEmits<{
  'trigger': [event: WebhookEvent]
  'edit': [event: WebhookEvent]
  'delete': [event: WebhookEvent]
}>()

const selectedFilter = ref<'all' | 'active' | 'inactive'>('all')
const expandedGroups = ref<string[]>([])

const filters: Array<{ value: 'all' | 'active' | 'inactive'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' }
]

const totalEvents = computed(() => {
  return props.events.filter(e => e.acao_evento === 'webhook').length
})

const filteredEvents = computed(() => {
  if (selectedFilter.value === 'active') {
    return props.events.filter(e => e.acao_evento === 'webhook')
  }
  if (selectedFilter.value === 'inactive') {
    return props.events.filter(e => e.acao_evento !== 'webhook')
  }
  return props.events
})

const filteredEventsByType = computed(() => {
  const groups = new Map<string, WebhookEvent[]>()

  filteredEvents.value.forEach(event => {
    const type = event.nome_evento || 'outros'
    if (!groups.has(type)) {
      groups.set(type, [])
    }
    groups.get(type)!.push(event)
  })

  return Array.from(groups.entries())
    .map(([type, events]) => {
      const option = WEBHOOK_EVENT_OPTIONS.find(opt => opt.value === type)
      return {
        type,
        label: option?.label || type,
        events: events.sort((a, b) => {
          return (a.horario_evento || '').localeCompare(b.horario_evento || '')
        })
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))
})

const toggleGroup = (type: string) => {
  const index = expandedGroups.value.indexOf(type)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(type)
  }
}

// Expand all groups by default
if (filteredEventsByType.value.length > 0) {
  expandedGroups.value = filteredEventsByType.value.map(g => g.type)
}
</script>
