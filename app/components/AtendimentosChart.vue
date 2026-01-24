<template>
  <SurfaceCard>
    <!-- Header com Stats -->
    <div class="mb-6">
      <!-- Filtro de Período -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <IconCalendar class="w-5 h-5 text-gray-400" />
          <span class="text-sm font-medium text-gray-600">Período:</span>
          <select 
            v-model="periodoSelecionado" 
            @change="atualizarDados"
            class="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="15">Últimos 15 dias</option>
            <option value="30">Este Mês</option>
            <option value="60">Últimos 2 meses</option>
          </select>
        </div>
        <BaseButton
          @click="atualizarDados"
          :disabled="loading"
          variant="outline"
          size="sm"
          class="flex items-center gap-2"
        >
          <IconActivity class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Atualizar
        </BaseButton>
      </div>

      <!-- Cards de Estatísticas -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Leads Hoje -->
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-blue-900">{{ stats.leadsHoje }}</p>
              <p class="text-xs text-blue-600 font-medium">Leads Hoje</p>
            </div>
          </div>
        </div>

        <!-- Novos Leads Hoje -->
        <div class="bg-green-50 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-green-900">{{ stats.novosLeadsHoje }}</p>
              <p class="text-xs text-green-600 font-medium">Novos Leads Hoje</p>
            </div>
          </div>
        </div>

        <!-- Vendas Histórico -->
        <div class="bg-purple-50 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-purple-900">{{ stats.vendasHistorico }}</p>
              <p class="text-xs text-purple-600 font-medium">Vendas Histórico</p>
            </div>
          </div>
        </div>

        <!-- Faturamento Histórico -->
        <div class="bg-orange-50 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-orange-900">{{ formatCurrency(stats.faturamentoHistorico) }}</p>
              <p class="text-xs text-orange-600 font-medium">Faturamento Histórico</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="bg-gray-50 rounded-lg p-6">
      <div class="flex items-center gap-3 mb-4">
        <IconCalendar class="w-5 h-5 text-gray-500" />
        <div>
          <h3 class="font-semibold text-gray-900">Atendimentos por Dia</h3>
          <p class="text-sm text-gray-500">Visual moderno para comparar leads novos, recorrentes e vendas diárias.</p>
        </div>
        <div class="ml-auto text-sm text-gray-500">
          Média de novos: <span class="font-semibold">{{ stats.mediaNovasLeadsPorDia }} leads/dia</span>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="flex items-center gap-3 text-gray-500">
          <IconActivity class="w-5 h-5 animate-spin" />
          <span>Carregando dados do gráfico...</span>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <div v-else class="relative">
        <!-- Debug Info (temporário) -->
        <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> 
          {{ atendimentosPorDia.length }} dias | 
          Max: {{ maxValue }} | 
          Últimos 3 dias: {{ atendimentosPorDia.slice(-3).map(d => `${d.data}: ${d.totalAtendimentos}`).join(', ') }}
        </div>

        <!-- Área do gráfico -->
        <div class="h-80 bg-white rounded-lg border border-gray-200 p-4">
          <!-- Eixo Y -->
          <div class="flex h-full">
            <div class="w-12 flex flex-col justify-between text-xs text-gray-400 pr-2">
              <span>{{ maxValue }}</span>
              <span>{{ Math.round(maxValue * 0.75) }}</span>
              <span>{{ Math.round(maxValue * 0.5) }}</span>
              <span>{{ Math.round(maxValue * 0.25) }}</span>
              <span>0</span>
            </div>

            <!-- Área das barras -->
            <div class="flex-1 relative">
              <!-- Grid lines -->
              <div class="absolute inset-0">
                <div v-for="i in 5" :key="i" 
                     class="absolute w-full border-t border-gray-100"
                     :style="{ top: `${(i-1) * 25}%` }">
                </div>
              </div>

              <!-- Barras -->
              <div class="absolute inset-0 flex items-end">
                <div v-for="(dia, index) in atendimentosPorDia.slice(0, 30)" 
                     :key="dia.data"
                     class="flex-1 flex justify-center px-0.5">
                  
                  <!-- Container da barra -->
                  <div class="w-full max-w-6 h-full flex flex-col justify-end relative group">
                    
                    <!-- Barra principal (atendimentos) -->
                    <div 
                      class="w-full bg-blue-500 hover:bg-blue-600 transition-colors rounded-t-sm"
                      :style="{ 
                        height: dia.totalAtendimentos > 0 ? `${(dia.totalAtendimentos / maxValue) * 100}%` : '0%',
                        minHeight: dia.totalAtendimentos > 0 ? '3px' : '0px'
                      }">
                    </div>

                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none">
                      <div>{{ formatDate(dia.data) }}</div>
                      <div>Atendimentos: {{ dia.totalAtendimentos }}</div>
                      <div>Vendas: {{ dia.vendas }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Linha de total -->
              <svg class="absolute inset-0 pointer-events-none" preserveAspectRatio="none">
                <polyline
                  :points="linePointsSimple"
                  fill="none"
                  stroke="#f97316"
                  stroke-width="2"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>

          <!-- Eixo X (datas) -->
          <div class="flex mt-2 ml-12">
            <div v-for="(dia, index) in atendimentosPorDia.slice(0, 30)" 
                 :key="`date-${dia.data}`"
                 class="flex-1 text-center">
              <span v-if="index % 5 === 0" class="text-xs text-gray-400 transform -rotate-45 inline-block">
                {{ formatDateShort(dia.data) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Legenda -->
        <div class="flex items-center justify-center gap-6 mt-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-400 rounded"></div>
            <span class="text-gray-600">Novos leads</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-400 rounded"></div>
            <span class="text-gray-600">Recorrentes</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span class="text-gray-600">Total de leads</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-purple-500 rounded"></div>
            <span class="text-gray-600">Vendas</span>
          </div>
        </div>
      </div>
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
import { computed, onMounted } from '#imports'
import SurfaceCard from './SurfaceCard.vue'
import BaseButton from './BaseButton.vue'
import IconActivity from './IconActivity.vue'
import IconCalendar from './IconCalendar.vue'
import { useAtendimentos } from '~/composables/useAtendimentos'
import { formatCurrency } from '~/utils/formatters'

const { atendimentosPorDia, stats, loading, error, fetchAtendimentosPorDia } = useAtendimentos()

const periodoSelecionado = ref('30')

const maxValue = computed(() => {
  if (atendimentosPorDia.value.length === 0) return 100
  
  const maxAtendimentos = Math.max(...atendimentosPorDia.value.map(d => d.totalAtendimentos))
  const maxVendas = Math.max(...atendimentosPorDia.value.map(d => d.vendas))
  
  const max = Math.max(maxAtendimentos, maxVendas, 5) // Mínimo 5
  console.log('📊 MaxValue calculado:', max, 'baseado em atendimentos:', maxAtendimentos, 'vendas:', maxVendas)
  
  return max
})

const linePointsSimple = computed(() => {
  if (atendimentosPorDia.value.length === 0) return ''
  
  const dados = atendimentosPorDia.value.slice(0, 30) // Limitar a 30 dias
  
  return dados
    .map((dia, index) => {
      const x = (index / Math.max(dados.length - 1, 1)) * 100
      const y = 100 - (dia.totalAtendimentos / maxValue.value) * 100
      return `${x}% ${y}%`
    })
    .join(', ')
})

const linePoints = computed(() => {
  if (atendimentosPorDia.value.length === 0) return ''
  
  return atendimentosPorDia.value
    .map((dia, index) => {
      const x = (index / (atendimentosPorDia.value.length - 1)) * 100
      const y = 100 - (dia.totalAtendimentos / maxValue.value) * 100
      return `${x},${y}`
    })
    .join(' ')
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: '2-digit'
  })
}

const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit'
  })
}

const atualizarDados = () => {
  fetchAtendimentosPorDia(parseInt(periodoSelecionado.value))
}

onMounted(() => {
  atualizarDados()
})
</script>