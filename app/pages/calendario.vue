<template>
  <PageShell>
    <div class="max-w-6xl mx-auto py-10 px-6">
      <!-- Premium Header Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Calendário <span class="text-primary">Eva</span>
          </h1>
          <p class="text-lg text-gray-500 font-medium">Acompanhe momentos importantes e operações de embarque.</p>
        </div>

        <div class="relative group" id="calendar-selector">
          <button
            @click.stop="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-4 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl hover:border-primary/20 transition-all text-sm font-bold text-gray-700 min-w-[260px] shadow-sm hover:shadow-xl hover:shadow-primary/5 active:scale-95"
            id="calendar-dropdown-btn"
          >
            <span class="text-2xl">{{ selectedCalendarIcon }}</span>
            <span class="flex-1 text-left tracking-tight">{{ selectedCalendarLabel }}</span>
            <svg 
              :class="['w-5 h-5 text-gray-300 transition-transform duration-300', dropdownOpen ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m19 9-7 7-7-7"/>
            </svg>
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2"
          >
            <div
              v-if="dropdownOpen"
              v-click-outside="() => dropdownOpen = false"
              class="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl bg-white/90"
              id="calendar-dropdown-menu"
            >
              <button
                v-for="option in calendarOptions"
                :key="option.value"
                @click="selectCalendar(option.value as 'birthdays' | 'shipping')"
                :class="[
                  'w-full px-6 py-4 text-left flex items-center gap-4 hover:bg-primary/5 transition-colors text-sm font-bold',
                  selectedCalendar === option.value ? 'text-primary' : 'text-gray-600'
                ]"
              >
                <span class="text-2xl">{{ option.icon }}</span>
                <span>{{ option.label }}</span>
                <svg v-if="selectedCalendar === option.value" class="ml-auto w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <!-- Calendar Col -->
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div v-if="calendarLoading" class="flex items-center justify-center py-32 bg-white rounded-3xl border border-gray-50 shadow-sm">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
              <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
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

        <!-- Sidebar Col -->
        <div class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
          <!-- Today's Highlight -->
          <div v-if="selectedCalendar === 'birthdays'" class="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
            <div class="flex items-center justify-between mb-6">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">
                🎂
              </div>
              <span class="text-xs font-bold uppercase tracking-widest opacity-60">Hoje</span>
            </div>
            
            <div v-if="todayBirthdays.length > 0">
              <h4 class="text-2xl font-bold mb-1">{{ todayBirthdays.length }} Aniversariante(s)</h4>
              <p class="text-sm text-blue-100 mb-6">Não deixe de enviar os parabéns!</p>
              
              <div class="space-y-2">
                <div 
                  v-for="person in todayBirthdays.slice(0, 4)" 
                  :key="person.id"
                  class="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex items-center justify-between group cursor-pointer"
                  @click="handleDayClick(new Date().getDate())"
                >
                  <span class="text-sm font-bold truncate pr-2">{{ person.nome || person.nome_social }}</span>
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m9 5 7 7-7 7"/>
                  </svg>
                </div>
                <p v-if="todayBirthdays.length > 4" class="text-[10px] text-center font-bold uppercase opacity-60 pt-2">
                  + {{ todayBirthdays.length - 4 }} Outros
                </p>
              </div>
            </div>
            
            <div v-else class="py-10 text-center opacity-60">
              <p class="text-sm font-bold uppercase tracking-widest">Nenhum evento hoje</p>
            </div>
          </div>

          <!-- Quick Legend Card -->
          <div class="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm">
            <h4 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Legenda e Status</h4>
            
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-md shadow-yellow-400/20"></div>
                <div>
                  <p class="text-sm font-bold text-gray-800">Aniversários</p>
                  <p class="text-[10px] text-gray-400 font-medium">Dados do CRM sincronizados</p>
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-blue-400 shadow-md shadow-primary/20"></div>
                <div>
                  <p class="text-sm font-bold text-gray-800">Embarques</p>
                  <p class="text-[10px] text-gray-400 font-medium">Logística e Datas de Saída</p>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-50">
              <div class="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span class="text-[10px] font-bold text-gray-500 uppercase">Sistema Online</span>
              </div>
            </div>
          </div>

          <!-- Webhook Schedule Card -->
          <div class="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm" id="webhook-scheduler-card">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Automação de Webhooks</h4>
              <span class="text-[10px] font-bold text-primary/60 uppercase">Agenda + Tempo real</span>
            </div>

            <div class="bg-gray-50 rounded-2xl p-4 mb-4">
              <p class="text-xs font-bold text-gray-700 mb-3">Criar novo evento</p>
              <div class="space-y-3">
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Evento</label>
                  <select
                    v-model="newEventType"
                    class="mt-2 w-full px-3 py-2 rounded-xl border border-gray-100 bg-white text-sm font-semibold text-gray-700"
                  >
                    <option v-for="option in webhookEventOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Horário</label>
                  <input
                    v-model="newEventTime"
                    type="time"
                    class="mt-2 w-full px-3 py-2 rounded-xl border border-gray-100 bg-white text-sm font-semibold text-gray-700"
                  />
                </div>

                <label class="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300"
                    v-model="newEventActive"
                  />
                  Ativo (enviar webhook)
                </label>
              </div>

              <BaseButton
                class="w-full mt-4"
                size="sm"
                variant="primary"
                :disabled="eventsSaving"
                @click="handleCreateEvent"
              >
                {{ eventsSaving ? 'Salvando...' : 'Adicionar evento' }}
              </BaseButton>
            </div>

            <div v-if="eventsLoading" class="py-6 text-center text-xs text-gray-400">Carregando eventos...</div>
            <div v-else-if="webhookEvents.length === 0" class="py-6 text-center text-xs text-gray-400">Nenhum evento configurado.</div>

            <div v-else class="space-y-3">
              <div
                v-for="event in webhookEvents"
                :key="event.id"
                class="border border-gray-100 rounded-2xl p-4"
              >
                <div class="space-y-3">
                  <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Evento</label>
                    <select
                      v-model="event.nome_evento"
                      class="mt-2 w-full px-3 py-2 rounded-xl border border-gray-100 bg-white text-sm font-semibold text-gray-700"
                    >
                      <option v-for="option in webhookEventOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Horário</label>
                    <input
                      v-model="event.horario_evento"
                      type="time"
                      class="mt-2 w-full px-3 py-2 rounded-xl border border-gray-100 bg-white text-sm font-semibold text-gray-700"
                    />
                  </div>

                  <label class="flex items-center gap-2 text-xs font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300"
                      :checked="event.acao_evento === 'webhook'"
                      @change="setEventActive(event, ($event.target as HTMLInputElement).checked)"
                    />
                    Ativo (enviar webhook)
                  </label>
                </div>

                <div class="grid grid-cols-3 gap-2 mt-4">
                  <BaseButton size="sm" variant="outline" :disabled="eventsSaving" @click="handleSaveEvent(event)">
                    Salvar
                  </BaseButton>
                  <BaseButton size="sm" variant="primary" :disabled="eventsSaving" @click="handleTriggerEvent(event)">
                    Disparar
                  </BaseButton>
                  <BaseButton size="sm" variant="outline" class="text-red-500" :disabled="eventsSaving" @click="handleDeleteEvent(event)">
                    Remover
                  </BaseButton>
                </div>
              </div>
            </div>

            <p v-if="eventsError" class="text-[10px] text-red-500 mt-3">{{ eventsError }}</p>
          </div>
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
const selectedDay = ref(1)
const selectedDayBirthdays = ref<any[]>([])
const selectedDayEmbarques = ref<any[]>([])

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
const newEventType = ref<WebhookEventType>('aniversario_hoje')
const newEventTime = ref('12:00')
const newEventActive = ref(true)

const calendarOptions = [
  { value: 'birthdays', label: 'Aniversários', icon: '🎂' },
  { value: 'shipping', label: 'Embarques', icon: '📦' }
]

const selectedCalendarLabel = computed(() => {
  return calendarOptions.find(o => o.value === selectedCalendar.value)?.label || ''
})

const selectedCalendarIcon = computed(() => {
  return calendarOptions.find(o => o.value === selectedCalendar.value)?.icon || ''
})

const calendarLoading = computed(() => {
  return selectedCalendar.value === 'birthdays' ? loading.value : loadingEmbarques.value
})

const eventCounts = computed(() => {
  const counts: Record<string, number> = {}
  
  if (selectedCalendar.value === 'shipping') {
    Object.entries(embarquesByDay.value).forEach(([day, items]) => {
      counts[day] = items.length
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

const setEventActive = (event: WebhookEvent, active: boolean) => {
  event.acao_evento = active ? 'webhook' : 'disabled'
}

const handleCreateEvent = async () => {
  if (!newEventTime.value) return

  await createEvent({
    nome_evento: newEventType.value,
    horario_evento: newEventTime.value,
    acao_evento: newEventActive.value ? 'webhook' : 'disabled'
  })
}

const handleSaveEvent = async (event: WebhookEvent) => {
  if (!event.nome_evento || !event.horario_evento) return

  await updateEvent(event.id, {
    nome_evento: event.nome_evento as WebhookEventType,
    horario_evento: event.horario_evento,
    acao_evento: event.acao_evento || 'webhook'
  })
}

const handleDeleteEvent = async (event: WebhookEvent) => {
  await deleteEvent(event.id)
}

const handleTriggerEvent = async (event: WebhookEvent) => {
  if (!event.nome_evento) return
  
  try {
    console.log('[Calendario] Disparando evento:', event.nome_evento)
    await triggerEvent(event.nome_evento as WebhookEventType)
    console.log('[Calendario] Evento disparado com sucesso!')
    alert('Webhook disparado com sucesso!')
  } catch (e: any) {
    console.error('[Calendario] Erro ao disparar:', e)
    alert(`Erro ao disparar webhook: ${e.message || e}`)
  }
}
</script>
