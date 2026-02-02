<template>
  <PageShell>
    <div class="max-w-7xl mx-auto py-8 px-6">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <IconCalendar :size="24" color="white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
              Calendário Artorius
            </h1>
            <p class="text-sm text-gray-500 mt-1">Gerencie eventos, aniversários e embarques</p>
          </div>
        </div>

        <div class="relative" id="calendar-selector">
          <button
            @click.stop="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl hover:border-primary transition-all text-sm font-semibold text-gray-700 min-w-[240px] shadow-sm hover:shadow-md"
            id="calendar-dropdown-btn"
          >
            <component :is="selectedCalendarIcon" :size="20" :color="'currentColor'" class="text-primary" />
            <span class="flex-1 text-left">{{ selectedCalendarLabel }}</span>
            <IconChevronDown 
              :size="18" 
              :color="'currentColor'" 
              :class="['text-gray-400 transition-transform duration-200', dropdownOpen ? 'rotate-180' : '']"
            />
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="dropdownOpen"
              v-click-outside="() => dropdownOpen = false"
              class="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-20"
              id="calendar-dropdown-menu"
            >
              <button
                v-for="option in calendarOptions"
                :key="option.value"
                @click="selectCalendar(option.value as 'birthdays' | 'shipping')"
                :class="[
                  'w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm font-medium',
                  selectedCalendar === option.value ? 'text-primary bg-primary/5' : 'text-gray-700'
                ]"
              >
                <component :is="option.icon" :size="18" :color="'currentColor'" />
                <span>{{ option.label }}</span>
                <IconCheck v-if="selectedCalendar === option.value" :size="16" :color="'currentColor'" class="ml-auto" />
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        <!-- Calendar Section -->
        <div>
          <div v-if="calendarLoading" class="flex items-center justify-center py-24 bg-white rounded-xl border border-gray-100">
            <div class="relative">
              <div class="w-12 h-12 border-3 border-gray-100 rounded-full"></div>
              <div class="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>

          <AdminCalendar
            v-else
            :month="currentMonth"
            :year="currentYear"
            :events-by-day="eventCounts"
            :highlight-color="selectedCalendar === 'birthdays' ? 'birthday' : 'shipping'"
            @prev-month="goToPrevMonthHandler"
            @next-month="goToNextMonthHandler"
            @day-click="handleDayClick"
          />
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Today's Events Card -->
          <CalendarCard
            v-if="selectedCalendar === 'birthdays'"
            title="Aniversários Hoje"
            :subtitle="todayBirthdays.length > 0 ? `${todayBirthdays.length} aniversariante(s)` : 'Nenhum evento hoje'"
            icon-bg-class="bg-gradient-to-br from-orange-400 to-pink-500"
          >
            <template #icon>
              <IconCake :size="20" color="white" />
            </template>
            
            <div v-if="todayBirthdays.length > 0" class="space-y-2">
              <button 
                v-for="person in todayBirthdays.slice(0, 5)" 
                :key="person.id"
                class="w-full bg-gray-50 hover:bg-gray-100 transition-colors p-3 rounded-lg flex items-center justify-between group"
                @click="handleDayClick(new Date().getDate())"
              >
                <span class="text-sm font-medium text-gray-700 truncate">{{ person.nome || person.nome_social }}</span>
                <IconChevronDown :size="16" color="currentColor" class="text-gray-400 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <p v-if="todayBirthdays.length > 5" class="text-xs text-center text-gray-500 pt-2 font-medium">
                +{{ todayBirthdays.length - 5 }} outros
              </p>
            </div>
            
            <div v-else class="py-8 text-center">
              <p class="text-sm text-gray-400">Nenhum aniversário hoje</p>
            </div>
          </CalendarCard>

          <!-- Legend Card -->
          <StatusCard title="Legenda">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <IconCake :size="18" color="currentColor" class="text-orange-500" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-700">Aniversários</p>
                  <p class="text-xs text-gray-400">Dados do CRM</p>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <IconPlane :size="18" color="currentColor" class="text-blue-500" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-700">Embarques</p>
                  <p class="text-xs text-gray-400">Datas de saída</p>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="bg-green-50 rounded-lg p-3 flex items-center gap-2">
                <IconActivity :size="14" color="currentColor" class="text-green-600" />
                <span class="text-xs font-medium text-green-700">Sistema Online</span>
              </div>
            </div>
          </StatusCard>

          <!-- Events Summary -->
          <WebhookEventsSummary
            v-if="!eventsLoading && webhookEvents.length > 0"
            :events="webhookEvents"
            @show-all="scrollToEvents"
          />

          <!-- Webhook Automation Card -->
          <CalendarCard
            id="webhook-events-card"
            title="Automação de Webhooks"
            :subtitle="`${activeEventsCount} evento(s) ativo(s)`"
            icon-bg-class="bg-gradient-to-br from-primary to-blue-600"
            content-class="space-y-4"
          >
            <template #icon>
              <IconZap :size="20" color="white" />
            </template>

            <template #action>
              <BaseButton
                size="sm"
                variant="primary"
                @click="openCreateModal"
                class="shadow-sm"
              >
                <span class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Criar
                </span>
              </BaseButton>
            </template>

            <!-- Events List -->
            <div v-if="eventsLoading" class="py-8 text-center">
              <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p class="text-xs text-gray-400 mt-2">Carregando eventos...</p>
            </div>
            
            <WebhookEventsOrganizer
              v-else
              :events="webhookEvents"
              @trigger="handleTriggerEvent"
              @edit="openEditModal"
              @delete="handleDeleteEvent"
            />

            <p v-if="eventsError" class="text-xs text-red-500 bg-red-50 rounded-lg p-3">{{ eventsError }}</p>
          </CalendarCard>
        </div>
      </div>

      <!-- Birthday Modal -->
      <BirthdayListModal
        v-model="modalOpen"
        :birthdays="selectedDayBirthdays"
        :selected-date="selectedDay"
        :month="currentMonth"
      />

      <!-- Embarque Modal -->
      <EmbarqueListModal
        v-model="embarqueModalOpen"
        :embarques="selectedDayEmbarques"
        :selected-date="selectedDay"
        :month="currentMonth"
      />

      <!-- Webhook Event Modal -->
      <WebhookEventModal
        v-model="eventModalOpen"
        :event="selectedEvent"
        :event-options="webhookEventOptions"
        :saving="eventsSaving"
        @save="handleSaveEventFromModal"
      />
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'
import type { WebhookEvent } from '~~/shared/types/WebhookEvent'
import { WEBHOOK_EVENT_OPTIONS, type WebhookEventType } from '~~/shared/constants/webhookEvents'
import PageShell from '~/components/PageShell.vue'
import AdminCalendar from '~/components/AdminCalendar.vue'
import BirthdayListModal from '~/components/BirthdayListModal.vue'
import EmbarqueListModal from '~/components/EmbarqueListModal.vue'
import BaseButton from '~/components/BaseButton.vue'
import CalendarCard from '~/components/CalendarCard.vue'
import StatusCard from '~/components/StatusCard.vue'
import WebhookEventsOrganizer from '~/components/WebhookEventsOrganizer.vue'
import WebhookEventModal from '~/components/WebhookEventModal.vue'
import WebhookEventsSummary from '~/components/WebhookEventsSummary.vue'
import IconCalendar from '~/components/IconCalendar.vue'
import IconCake from '~/components/IconCake.vue'
import IconPlane from '~/components/IconPlane.vue'
import IconZap from '~/components/IconZap.vue'
import IconChevronDown from '~/components/IconChevronDown.vue'
import IconCheck from '~/components/IconCheck.vue'
import IconActivity from '~/components/IconActivity.vue'
import { useCalendario } from '~/composables/useCalendario'
import { useEmbarques } from '~/composables/useEmbarques'
import { useWebhookEvents } from '~/composables/useWebhookEvents'

const {
  currentMonth,
  currentYear,
  loading,
  todayBirthdays,
  fetchBirthdays,
  getBirthdaysForDay,
  hasBirthdayOnDay
} = useCalendario()

const {
  embarquesByDay,
  loading: loadingEmbarques,
  fetchEmbarquesByMonth,
  getEmbarquesForDay,
  hasEmbarqueOnDay
} = useEmbarques()

const selectedCalendar = ref<'birthdays' | 'shipping'>('birthdays')
const dropdownOpen = ref(false)
const modalOpen = ref(false)
const embarqueModalOpen = ref(false)
const eventModalOpen = ref(false)
const selectedDay = ref(1)
const selectedDayBirthdays = ref<any[]>([])
const selectedDayEmbarques = ref<any[]>([])
const selectedEvent = ref<WebhookEvent | null>(null)

const {
  events: webhookEvents,
  loading: eventsLoading,
  saving: eventsSaving,
  error: eventsError,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  triggerEvent
} = useWebhookEvents()

const webhookEventOptions = WEBHOOK_EVENT_OPTIONS

const calendarOptions = [
  { value: 'birthdays', label: 'Aniversários', icon: IconCake },
  { value: 'shipping', label: 'Embarques', icon: IconPlane }
]

const selectedCalendarLabel = computed(() => {
  return calendarOptions.find(o => o.value === selectedCalendar.value)?.label || ''
})

const selectedCalendarIcon = computed(() => {
  return calendarOptions.find(o => o.value === selectedCalendar.value)?.icon || IconCalendar
})

const calendarLoading = computed(() => {
  return selectedCalendar.value === 'birthdays' ? loading.value : loadingEmbarques.value
})


const activeEventsCount = computed(() => {
  return webhookEvents.value.filter(e => e.acao_evento === 'webhook').length
})
const eventCounts = computed(() => {
  const counts: Record<string, number> = {}
  if (selectedCalendar.value === 'shipping') {
    // Suporte a datas dd/mm/aaaa
    Object.entries(embarquesByDay.value).forEach(([day, items]) => {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(day)) {
        // Usa apenas o dia
        const dia = day.slice(0, 2)
        counts[dia] = (counts[dia] || 0) + items.length
      } else {
        counts[day] = items.length
      }
    })
    return counts
  }
  for (let day = 1; day <= 31; day++) {
    if (hasBirthdayOnDay(day)) {
      const birthdays = getBirthdaysForDay(day)
      counts[String(day).padStart(2, '0')] = birthdays.length
    }
  }
  return counts
})

const selectCalendar = (value: 'birthdays' | 'shipping') => {
  selectedCalendar.value = value
  dropdownOpen.value = false
  
  if (value === 'birthdays') {
    fetchBirthdays()
  } else {
    fetchEmbarquesByMonth(currentMonth.value, currentYear.value)
  }
}

const handleDayClick = (day: number) => {
  selectedDay.value = day

  if (selectedCalendar.value === 'birthdays') {
    selectedDayBirthdays.value = getBirthdaysForDay(day)
    modalOpen.value = true
    return
  }

  selectedDayEmbarques.value = getEmbarquesForDay(day)
  embarqueModalOpen.value = true
}

const goToNextMonthHandler = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }

  if (selectedCalendar.value === 'birthdays') {
    fetchBirthdays()
  } else {
    fetchEmbarquesByMonth(currentMonth.value, currentYear.value)
  }
}

const goToPrevMonthHandler = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }

  if (selectedCalendar.value === 'birthdays') {
    fetchBirthdays()
  } else {
    fetchEmbarquesByMonth(currentMonth.value, currentYear.value)
  }
}

onMounted(() => {
  fetchBirthdays()
  fetchEvents()
})

const openCreateModal = () => {
  selectedEvent.value = null
  eventModalOpen.value = true
}

const openEditModal = (event: WebhookEvent) => {
  selectedEvent.value = event
  eventModalOpen.value = true
}

const handleSaveEventFromModal = async (payload: { nome_evento: WebhookEventType; horario_evento: string; acao_evento: string }) => {
  if (selectedEvent.value) {
    await updateEvent(selectedEvent.value.id, payload)
  } else {
    await createEvent(payload)
  }

  eventModalOpen.value = false
  selectedEvent.value = null
}

const handleDeleteEvent = async (event: WebhookEvent) => {
  await deleteEvent(event.id)
}

const handleTriggerEvent = async (event: WebhookEvent) => {
  if (!event.nome_evento) return

  // Build a YYYY-MM-DD date to send with the webhook. Use today as fallback.
  const dt = new Date()
  const year = dt.getFullYear()
  const month = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`

  try {
    console.log('[Calendario] Disparando evento:', event.nome_evento, 'data:', formattedDate)
    await triggerEvent(event.nome_evento as WebhookEventType, '', formattedDate, '')
    console.log('[Calendario] Evento disparado com sucesso!')
    alert('Webhook disparado com sucesso!')
  } catch (e: any) {
    console.error('[Calendario] Erro ao disparar:', e)
    alert(`Erro ao disparar webhook: ${e.message || e}`)
  }
}

const scrollToEvents = () => {
  const element = document.getElementById('webhook-events-card')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
