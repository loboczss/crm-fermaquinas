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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div class="bg-green-50 rounded-lg p-3 border border-green-100">
          <div class="text-2xl font-bold text-green-700">{{ stats.novosLeadsHoje }}</div>
          <div class="text-xs text-green-600 font-medium">Novos Leads ({{ todayDate }})</div>
        </div>
        <div class="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div class="text-2xl font-bold text-blue-700">{{ stats.recorrentesHoje }}</div>
          <div class="text-xs text-blue-600 font-medium">Recorrentes ({{ todayDate }})</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div class="text-2xl font-bold text-gray-700">{{ stats.leadsHoje }}</div>
          <div class="text-xs text-gray-600 font-medium">Leads Hoje ({{ todayDate }})</div>
        </div>
        <div class="bg-orange-50 rounded-lg p-3 border border-orange-100 flex flex-col justify-between">
          <div>
            <div class="text-2xl font-bold text-orange-700">{{ stats.vendasHoje }}</div>
            <div class="text-xs text-orange-600 font-medium">Vendas Hoje ({{ todayDate }})</div>
          </div>
          <div class="mt-1 pt-1 border-t border-orange-200">
             <span class="text-xs font-semibold text-orange-800">{{ formatCurrency(stats.faturamentoHoje) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Container do Gráfico -->
    <div class="bg-white rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm h-[320px] md:h-[400px] relative">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
        <div class="flex flex-col items-center gap-3">
          <IconActivity class="w-8 h-8 text-primary animate-spin" />
          <span class="text-sm text-gray-500 font-medium">Carregando dados...</span>
        </div>
      </div>
      
      <div v-else-if="error" class="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl">
        <div class="text-center p-6">
          <p class="text-red-600 font-medium mb-2">Erro ao carregar dados</p>
          <p class="text-red-500 text-sm">{{ error }}</p>
          <BaseButton @click="atualizarDados" size="sm" variant="outline" class="mt-4">Tentar novamente</BaseButton>
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
  // Se tivermos stats do servidor, usamos eles (são mais precisos/globais)
  if (serverStats.value) {
    return {
      // Totais do período (calculados no front para precisão visual do gráfico)
      totalNovos: rawData.value.reduce((acc, curr) => acc + curr.novosLeads, 0),
      totalRecorrentes: rawData.value.reduce((acc, curr) => acc + curr.recorrentes, 0),
      totalVendas: rawData.value.reduce((acc, curr) => acc + curr.vendas, 0),
      
      // Totais globais / Hoje (vindos do servidor)
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

  // Fallback se não tiver server stats ainda
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
        borderColor: '#f97316', // Orange-500
        backgroundColor: '#f97316',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0, 
        pointHoverRadius: 4,
        yAxisID: 'y1',
        order: 0
      },
      {
        label: 'Novos Leads',
        type: 'bar' as const,
        data: rawData.value.map(d => d.novosLeads),
        backgroundColor: '#10b981', // Emerald-500
        stack: 'Stack 0',
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        order: 1
      },
      {
        label: 'Recorrentes',
        type: 'bar' as const,
        data: rawData.value.map(d => d.recorrentes),
        backgroundColor: '#8b5cf6', // Violet-500
        stack: 'Stack 0',
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        borderRadius: { topLeft: 4, topRight: 4 },
        order: 1
      }
    ] as any // Casting to any to avoid strict mixed-chart type issues in this version
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
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, family: "'Inter', sans-serif" }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
        displayColors: true,
        callbacks: {
          title: (items: any[]) => {
            return `Dia ${items[0].label}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false, // Ocultar grade vertical para visual mais limpo
          drawBorder: false
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
          maxRotation: 0,
          autoSkip: true, // Manter autoSkip para não sobrepor
          // maxTicksLimit: 10 // REMOVIDO para mostrar mais dias se couber
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Leads',
          color: '#9ca3af',
          font: { size: 10 }
        },
        grid: {
          color: '#f3f4f6',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
          precision: 0
        },
        stacked: true // Habilita empilhamento
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Vendas',
          color: '#f97316',
          font: { size: 10 }
        },
        grid: {
          drawOnChartArea: false // Apenas grade do eixo Y principal
        },
        ticks: {
          color: '#f97316',
          font: { size: 11 },
          precision: 0
        }
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
      
      // Update stats from server if available
      if (response.stats) {
        serverStats.value = response.stats
      }
      
      if (response.debug) {
        console.log('🔍 Chart Debug Info:', response.debug)
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
/* Otimizações visuais adicionais se necessário */
</style>