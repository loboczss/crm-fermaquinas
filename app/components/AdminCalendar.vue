<template>
  <div id="admin-calendar" class="w-full">
    <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <!-- Calendar Header -->
      <div class="px-6 py-5 flex items-center justify-between bg-white border-b border-gray-50">
        <div class="flex items-center gap-4">
          <h3 class="text-xl font-bold text-gray-900 tracking-tight" id="calendar-month-title">
            {{ monthName }} <span class="text-gray-300 font-medium">{{ year }}</span>
          </h3>
        </div>

        <div class="flex items-center gap-1">
          <button
            @click="$emit('prev-month')"
            class="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-primary active:scale-90"
            id="calendar-prev-month"
            aria-label="Mês anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>

          <button
            @click="$emit('next-month')"
            class="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-primary active:scale-90"
            id="calendar-next-month"
            aria-label="Próximo mês"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Days of Week -->
      <div class="grid grid-cols-7 bg-gray-50/50">
        <div 
          v-for="day in daysOfWeek" 
          :key="day"
          class="py-3 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 border-t border-gray-50">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'relative aspect-square p-2 border-r border-b border-gray-50 transition-all duration-300 group',
            day.isCurrentMonth ? 'bg-white hover:z-10 hover:shadow-2xl hover:shadow-primary/10' : 'bg-gray-50/30',
            day.hasEvent && day.isCurrentMonth ? 'cursor-pointer' : '',
          ]"
          @click="day.hasEvent && day.isCurrentMonth ? handleDayClick(day.date) : null"
        >
          <!-- Day Number -->
          <div class="flex flex-col h-full">
            <div class="flex justify-between items-start">
              <span 
                :class="[
                  'text-sm transition-all',
                  day.isToday ? 'w-7 h-7 flex items-center justify-center bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20' : 'font-semibold',
                  !day.isCurrentMonth ? 'text-gray-200' : 'text-gray-500'
                ]"
              >
                {{ day.date }}
              </span>
              
              <!-- Indicator for Desktop/Events -->
              <div v-if="day.hasEvent && day.isCurrentMonth" class="flex flex-col gap-0.5">
                <span class="text-xs grayscale opacity-80 group-hover:opacity-100 transition-opacity">
                  {{ highlightColor === 'birthday' ? '🎂' : '📦' }}
                </span>
              </div>
            </div>

            <!-- Modern Highlight Bar -->
            <div v-if="day.hasEvent && day.isCurrentMonth" class="mt-auto">
              <div 
                :class="[
                  'h-1 rounded-full w-full opacity-60 group-hover:opacity-100 transition-all',
                  highlightColor === 'birthday' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-primary to-blue-400'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'

const props = defineProps<{
  month: number
  year: number
  eventsByDay: Record<string, number>
  highlightColor?: 'birthday' | 'shipping'
}>()

const emit = defineEmits<{
  (e: 'prev-month'): void
  (e: 'next-month'): void
  (e: 'day-click', date: number): void
}>()

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const monthName = computed(() => monthNames[props.month - 1])

const calendarDays = computed(() => {
  const firstDay = new Date(props.year, props.month - 1, 1)
  const lastDay = new Date(props.year, props.month, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const days: Array<{
    date: number
    isCurrentMonth: boolean
    isToday: boolean
    hasEvent: boolean
    eventCount: number
  }> = []

  const prevMonthLastDay = new Date(props.year, props.month - 1, 0).getDate()
  
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      hasEvent: false,
      eventCount: 0
    })
  }

  const today = new Date()
  const isCurrentMonthAndYear = 
    props.month === today.getMonth() + 1 && 
    props.year === today.getFullYear()

  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0')
    const hasEvent = !!props.eventsByDay[dayStr]
    const eventCount = props.eventsByDay[dayStr] || 0

    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: isCurrentMonthAndYear && i === today.getDate(),
      hasEvent,
      eventCount
    })
  }

  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      hasEvent: false,
      eventCount: 0
    })
  }

  return days
})

const handleDayClick = (date: number) => {
  emit('day-click', date)
}
</script>
