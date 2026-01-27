<template>
  <ChartCard 
    :title="title" 
    :subtitle="subtitle" 
    :height="height"
  >
    <template #filters>
      <select
        :id="`${chartId}-month`"
        v-model="selectedMonth"
        class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
      <select
        :id="`${chartId}-year`"
        v-model="selectedYear"
        class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </template>

    <template #summary>
      <div v-for="stat in summaryStats" :key="stat.label" class="flex flex-col">
        <span class="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">{{ stat.label }}</span>
        <span class="text-sm font-bold text-gray-700">{{ stat.value }}</span>
      </div>
    </template>

    <div v-if="loading" class="h-full flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
    <Line v-else :data="chartData" :options="chartOptions" class="w-full h-full" />
  </ChartCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import ChartCard from './ChartCard.vue'
import { formatCurrency } from '../utils/formatters'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = withDefaults(defineProps<{
  chartId?: string
  title?: string
  subtitle?: string
  height?: number
  vendas: Array<{ created_at: string; valor_venda: number | null }>
  loading?: boolean
}>(), {
  chartId: 'sales-value-chart',
  title: 'Valor Vendido por Dia',
  subtitle: 'Total de vendas em R$',
  height: 280
})

const currentDate = new Date()
const selectedMonth = ref(currentDate.getMonth())
const selectedYear = ref(currentDate.getFullYear())

const months = [
  { value: 0, label: 'Janeiro' },
  { value: 1, label: 'Fevereiro' },
  { value: 2, label: 'Março' },
  { value: 3, label: 'Abril' },
  { value: 4, label: 'Maio' },
  { value: 5, label: 'Junho' },
  { value: 6, label: 'Julho' },
  { value: 7, label: 'Agosto' },
  { value: 8, label: 'Setembro' },
  { value: 9, label: 'Outubro' },
  { value: 10, label: 'Novembro' },
  { value: 11, label: 'Dezembro' }
]

const years = computed(() => {
  const current = currentDate.getFullYear()
  return [current - 2, current - 1, current, current + 1]
})

const getDaysToShow = (month: number, year: number) => {
  const now = new Date()
  const totalDays = new Date(year, month + 1, 0).getDate()
  
  // Se for o mês e ano atual, mostrar apenas até hoje
  if (month === now.getMonth() && year === now.getFullYear()) {
    return now.getDate()
  }
  
  // Se for um mês futuro (mesmo ano), mostrar zero
  if (year === now.getFullYear() && month > now.getMonth()) {
    return 0
  }

  // Se for ano futuro, mostrar zero
  if (year > now.getFullYear()) {
    return 0
  }

  return totalDays
}


// Para os charts, vendas só têm created_at
const filteredVendas = computed(() => {
  return props.vendas.filter(venda => {
    let dateObj: Date | null = null
    if (venda.created_at && /^\d{2}\/\d{2}\/\d{4}$/.test(venda.created_at)) {
      // dd/mm/aaaa
      const [dd, mm, yyyy] = venda.created_at.split('/')
      dateObj = new Date(`${yyyy}-${mm}-${dd}`)
    } else if (venda.created_at) {
      dateObj = new Date(venda.created_at)
    }
    if (!dateObj || isNaN(dateObj.getTime())) return false
    return dateObj.getMonth() === selectedMonth.value && dateObj.getFullYear() === selectedYear.value
  })
})

const dailyData = computed(() => {
  const daysToShow = getDaysToShow(selectedMonth.value, selectedYear.value)
  const dailyValues: number[] = new Array(daysToShow).fill(0)

  filteredVendas.value.forEach(venda => {
    const day = new Date(venda.created_at).getDate()
    const index = day - 1
    if (index >= 0 && index < dailyValues.length && venda.valor_venda !== null) {
      dailyValues[index] = dailyValues[index]! + venda.valor_venda
    }
  })

  return dailyValues
})

const summaryStats = computed(() => {
  const data = dailyData.value
  const total = data.reduce((acc, curr) => acc + curr, 0)
  const count = filteredVendas.value.length
  const max = Math.max(...(data.length > 0 ? data : [0]))
  const bestDayIndex = data.lastIndexOf(max)
  
  return [
    { label: 'Total no Período', value: formatCurrency(total) },
    { label: 'Ticket Médio', value: count > 0 ? formatCurrency(total / count) : 'R$ 0,00' },
    { label: 'Melhor Faturamento', value: max > 0 ? `Dia ${bestDayIndex + 1} (${formatCurrency(max)})` : '-' }
  ]
})

const chartData = computed<ChartData<'line'>>(() => {
  const daysToShow = getDaysToShow(selectedMonth.value, selectedYear.value)
  const labels = Array.from({ length: daysToShow }, (_, i) => `${i + 1}`)

  return {
    labels,
    datasets: [
      {
        label: 'Valor (R$)',
        data: dailyData.value,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(16, 185, 129)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }
    ]
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleFont: { size: 12, weight: 'bold' },
      bodyFont: { size: 11 },
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: (items: any[]) => `Dia ${items[0]?.label} de ${months[selectedMonth.value]?.label}`,
        label: (item: any) => `Faturamento: ${formatCurrency(item.raw as number)}`
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Dias do Mês',
        font: { size: 10, weight: 'bold' },
        color: '#9CA3AF'
      },
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { size: 10 },
        color: '#9CA3AF',
        maxRotation: 0
      }
    },
    y: {
      title: {
        display: true,
        text: 'Valor (R$)',
        font: { size: 10, weight: 'bold' },
        color: '#9CA3AF'
      },
      beginAtZero: true,
      grid: {
        color: 'rgba(243, 244, 246, 1)'
      },
      border: { display: false },
      ticks: {
        font: { size: 10 },
        color: '#9CA3AF',
        callback: (value: any) => {
          if (typeof value === 'number') {
            return value >= 1000 ? `R$ ${(value / 1000).toFixed(0)}k` : `R$ ${value}`
          }
          return value
        }
      }
    }
  }
}))
</script>
