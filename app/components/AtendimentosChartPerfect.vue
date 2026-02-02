<template>
  <SurfaceCard>
    <!-- Header com Filtro -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2">
          <IconCalendar class="w-5 h-5 text-gray-400" />
          <span class="text-sm font-medium text-gray-600">Período:</span>
          <select 
            v-model="periodoSelecionado" 
            @change="atualizarDados"
            class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white w-full md:w-auto"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="15">Últimos 15 dias</option>
            <option value="30">Últimos 30 dias</option>
          </select>
        </div>
        <BaseButton
          @click="atualizarDados"
          :disabled="loading"
          variant="outline"
          size="sm"
          class="flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <IconActivity class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Atualizar
        </BaseButton>
      </div>

    <!-- Resumo Rápido -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- New Card Design -->
        <div class="group relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100 shadow-sm hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <div class="w-12 h-12 bg-emerald-500 rounded-full"></div>
          </div>
          <div class="text-sm font-medium text-emerald-600 mb-1">Novos Leads</div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-gray-900">{{ stats.novosLeadsHoje }}</span>
            <span class="text-xs font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">+ Hoje</span>
          </div>
        </div>

        <div class="group relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-violet-100 shadow-sm hover:shadow-violet-200/50 transition-all duration-300 hover:-translate-y-1">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <div class="w-12 h-12 bg-violet-500 rounded-full"></div>
          </div>
          <div class="text-sm font-medium text-violet-600 mb-1">Recorrentes</div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-gray-900">{{ stats.recorrentesHoje }}</span>
            <span class="text-xs font-semibold text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded-full">Ativos</span>
          </div>
        </div>

        <div class="group relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-100 shadow-sm hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-1">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <div class="w-12 h-12 bg-blue-500 rounded-full"></div>
          </div>
          <div class="text-sm font-medium text-blue-600 mb-1">Total Hoje</div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-gray-900">{{ stats.leadsHoje }}</span>
            <span class="text-xs font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">Leads</span>
          </div>
        </div>

        <div class="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 shadow-lg shadow-orange-200 hover:shadow-orange-300/60 transition-all duration-300 hover:-translate-y-1">
          <div class="relative z-10">
            <div class="text-sm font-medium text-orange-100 mb-1">Vendas Hoje</div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-white">{{ stats.vendasHoje }}</span>
              <span class="text-xs font-semibold text-orange-200 border border-orange-400/30 px-1.5 py-0.5 rounded-full">
                {{ formatCurrency(stats.faturamentoHoje) }}
              </span>
            </div>
          </div>
          <div class="absolute -right-2 -bottom-2 opacity-20 group-hover:scale-110 transition-transform">
            <IconActivity class="w-24 h-24 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Container do Gráfico -->
    <div class="bg-white/40 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/60 shadow-xl h-[350px] md:h-[450px] relative transition-all duration-700 animate-slide-up">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-10 rounded-2xl">
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span class="text-sm text-gray-600 font-bold tracking-tight">SINCRONIZANDO DADOS...</span>
        </div>
      </div>
      
      <div v-else-if="error" class="absolute inset-0 flex items-center justify-center bg-red-50/50 backdrop-blur-sm rounded-2xl">
        <div class="text-center p-6 bg-white shadow-xl rounded-2xl border border-red-100">
          <p class="text-red-600 font-bold mb-2">Ops! Algo deu errado</p>
          <p class="text-red-500 text-sm mb-4">{{ error }}</p>
          <BaseButton @click="atualizarDados" size="sm" variant="outline" class="!rounded-full px-6">Tentar novamente</BaseButton>
        </div>
      </div>

      <Bar v-else :data="chartData" :options="chartOptions" />
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import SurfaceCard from './SurfaceCard.vue'
import BaseButton from './BaseButton.vue'
import IconActivity from './IconActivity.vue'
import IconCalendar from './IconCalendar.vue'
import { formatCurrency } from '~/utils/formatters'

// Registrando componentes do Chart.js explicitamente
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Estado
const loading = ref(false)
const error = ref<string | null>(null)
const periodoSelecionado = ref('30')
const rawData = ref<any[]>([])
const serverStats = ref<any>(null)

const todayDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
})

// Estatísticas
const stats = computed(() => {
  if (serverStats.value) {
    return {
      totalNovos: rawData.value.reduce((acc, curr) => acc + curr.novosLeads, 0),
      totalRecorrentes: rawData.value.reduce((acc, curr) => acc + curr.recorrentes, 0),
      totalVendas: rawData.value.reduce((acc, curr) => acc + curr.vendas, 0),
      leadsHoje: serverStats.value.leadsHoje,
      novosLeadsHoje: serverStats.value.novosLeadsHoje,
      recorrentesHoje: serverStats.value.recorrentesHoje,
      vendasHoje: serverStats.value.vendasHoje,
      faturamentoHoje: serverStats.value.faturamentoHoje,
      vendasHistorico: serverStats.value.vendasHistorico,
      faturamentoHistorico: serverStats.value.faturamentoHistorico,
      mediaNovasLeadsPorDia: serverStats.value.mediaNovasLeadsPorDia
    }
  }

  if (!rawData.value.length) return { totalNovos: 0, totalRecorrentes: 0, leadsHoje: 0, novosLeadsHoje: 0, recorrentesHoje: 0, vendasHoje: 0, faturamentoHoje: 0, totalVendas: 0, vendasHistorico: 0, faturamentoHistorico: 0, mediaNovasLeadsPorDia: 0 }
  
  const totalNovos = rawData.value.reduce((acc, curr) => acc + curr.novosLeads, 0)
  const totalRecorrentes = rawData.value.reduce((acc, curr) => acc + curr.recorrentes, 0)
  const totalVendas = rawData.value.reduce((acc, curr) => acc + curr.vendas, 0)
  const leadsHoje = rawData.value[rawData.value.length - 1]?.totalAtendimentos || 0

  return { totalNovos, totalRecorrentes, leadsHoje, novosLeadsHoje: 0, recorrentesHoje: 0, vendasHoje: 0, faturamentoHoje: 0, totalVendas, vendasHistorico: 0, faturamentoHistorico: 0, mediaNovasLeadsPorDia: 0 }
})

// Configuração dos Dados do Gráfico
const chartData = computed(() => {
  const labels = rawData.value.map(d => {
    const date = new Date(d.data + 'T00:00:00')
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Vendas',
        type: 'line' as const,
        data: rawData.value.map(d => d.vendas),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#f97316',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        yAxisID: 'y1',
        order: 0,
        fill: true
      },
      {
        label: 'Novos Leads',
        type: 'bar' as const,
        data: rawData.value.map(d => d.novosLeads),
        backgroundColor: '#10b981',
        borderRadius: 6,
        stack: 'Stack 0',
        barPercentage: 0.5,
        categoryPercentage: 0.7,
        order: 1
      },
      {
        label: 'Recorrentes',
        type: 'bar' as const,
        data: rawData.value.map(d => d.recorrentes),
        backgroundColor: '#8b5cf6',
        borderRadius: 6,
        stack: 'Stack 0',
        barPercentage: 0.5,
        categoryPercentage: 0.7,
        order: 1
      }
    ] as any
  }
})

// Opções do Gráfico
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 25,
          font: { size: 12, family: "'Inter', sans-serif", weight: 500 },
          color: '#4b5563'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 16,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11, weight: 500 },
          color: '#9ca3af',
          maxRotation: 0,
          autoSkip: true,
          padding: 10
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
          lineWidth: 1
        },
        border: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          padding: 10,
          precision: 0
        },
        stacked: true
      },
      y1: {
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
        beginAtZero: true,
        grid: { display: false }
      }
    }
  }
})

// Buscar Dados
const atualizarDados = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch('/api/admin/reports/chart', {
      params: { days: periodoSelecionado.value }
    })
    
    if (response.success && response.data) {
      rawData.value = response.data
      if (response.stats) {
        serverStats.value = response.stats
      }
    }
  } catch (err: any) {
    console.error('Erro ao buscar dados do gráfico:', err)
    error.value = 'Não foi possível carregar os dados. Tente novamente.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  atualizarDados()
})
</script>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
