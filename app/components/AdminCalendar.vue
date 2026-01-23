<template>
  <div id="admin-calendar" class="w-full">
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <!-- Calendar Header -->
      <div class="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div class="flex items-center gap-3">
          <IconCalendar :size="20" color="currentColor" class="text-primary" />
          <div>
            <h3 class="text-lg font-bold text-gray-900" id="calendar-month-title">
              {{ monthName }} <span class="text-gray-400 font-medium">{{ year }}</span>
            </h3>
            <p v-if="totalEventsInMonth > 0" class="text-xs text-gray-500 mt-0.5">
              {{ totalEventsInMonth }} evento(s) este mês
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="$emit('prev-month')"
            class="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-primary border border-transparent hover:border-gray-200"
            id="calendar-prev-month"
            aria-label="Mês anterior"
          >
            <IconChevronLeft :size="18" color="currentColor" />
          </button>

          <button
            @click="$emit('next-month')"
            class="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-primary border border-transparent hover:border-gray-200"
            id="calendar-next-month"
            aria-label="Próximo mês"
          >
            <IconChevronRight :size="18" color="currentColor" />
          </button>
        </div>
      </div>

      <!-- Days of Week -->
      <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        <div 
          v-for="day in daysOfWeek" 
          :key="day"
          class="py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'relative aspect-square p-3 border-r border-b border-gray-100 transition-all group',
            day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50',
            day.hasEvent && day.isCurrentMonth ? 'cursor-pointer hover:shadow-inner' : '',
            index % 7 === 6 ? 'border-r-0' : '',
            index >= 35 ? 'border-b-0' : ''
          ]"
          @click="day.hasEvent && day.isCurrentMonth ? handleDayClick(day.date) : null"
        >
          <!-- Day Content -->
          <div class="flex flex-col h-full justify-between">
            <div class="flex justify-between items-start">
              <span 
                :class="[
                  'text-sm font-medium transition-all',
                  day.isToday ? 'w-7 h-7 flex items-center justify-center bg-primary text-white rounded-lg font-bold shadow-md' : '',
                  !day.isCurrentMonth ? 'text-gray-300' : day.isToday ? '' : 'text-gray-700'
                ]"
              >
                {{ day.date }}
              </span>
              
              <!-- Event Count Badge -->
              <div v-if="day.hasEvent && day.isCurrentMonth && day.eventCount > 0">
                <span 
                  :class="[
                    'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold',
                    highlightColor === 'birthday' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  ]"
                >
                  {{ day.eventCount }}
                </span>
              </div>
            </div>

            <!-- Event Indicator Icon -->
            <div v-if="day.hasEvent && day.isCurrentMonth" class="mt-auto flex items-center gap-1">
              <component 
                :is="highlightColor === 'birthday' ? IconCake : IconPlane" 
                :size="14" 
                :color="'currentColor'" 
                :class="[
                  'opacity-40 group-hover:opacity-100 transition-opacity',
                  highlightColor === 'birthday' ? 'text-orange-500' : 'text-blue-500'
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'
import IconCalendar from './IconCalendar.vue'
import IconCake from './IconCake.vue'
import IconPlane from './IconPlane.vue'
import IconChevronLeft from './IconChevronLeft.vue'
import IconChevronRight from './IconChevronRight.vue'

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

const totalEventsInMonth = computed(() => {
  return Object.values(props.eventsByDay).reduce((sum, count) => sum + count, 0)
})

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
