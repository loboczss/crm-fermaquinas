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

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const filteredVendas = computed(() => {
  return props.vendas.filter(venda => {
    const date = new Date(venda.created_at)
    return date.getMonth() === selectedMonth.value && date.getFullYear() === selectedYear.value
  })
})

const dailyData = computed(() => {
  const daysInMonth = getDaysInMonth(selectedMonth.value, selectedYear.value)
  const dailyValues: number[] = new Array(daysInMonth).fill(0)

  filteredVendas.value.forEach(venda => {
    const day = new Date(venda.created_at).getDate()
    const index = day - 1
    if (index >= 0 && index < dailyValues.length && venda.valor_venda !== null) {
      dailyValues[index] = dailyValues[index]! + venda.valor_venda
    }
  })

  return dailyValues
})

const chartData = computed<ChartData<'line'>>(() => {
  const daysInMonth = getDaysInMonth(selectedMonth.value, selectedYear.value)
  const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)

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

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleFont: { size: 12, weight: 'bold' as const },
      bodyFont: { size: 11 },
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: (items: any[]) => `Dia ${items[0]?.label}`,
        label: (item: any) => formatCurrency(Number(item.raw))
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { size: 10 },
        color: '#9CA3AF',
        maxRotation: 0
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(243, 244, 246, 1)'
      },
      border: { display: false },
      ticks: {
        font: { size: 10 },
        color: '#9CA3AF',
        callback: (value: string | number) => {
          if (typeof value === 'number') {
            return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toFixed(0)
          }
          return value
        }
      }
    }
  }
}))
</script>
