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

    <!-- Gráfico Moderno -->
    <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <IconCalendar class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Atendimentos por Dia</h3>
            <p class="text-sm text-gray-500">Visual moderno para comparar leads novos, recorrentes e vendas diárias.</p>
          </div>
        </div>
        <div class="text-right text-sm text-gray-500">
          <div>Média de novos: <span class="font-semibold text-gray-700">{{ stats.mediaNovasLeadsPorDia }} leads/dia</span></div>
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

      <div v-else>
        <!-- Gráfico Principal -->
        <div class="relative h-80 bg-white rounded-lg border border-gray-100 p-4 overflow-hidden">
          <!-- Grid de fundo -->
          <div class="absolute inset-4">
            <!-- Linhas horizontais -->
            <div v-for="i in 5" :key="`h-${i}`" 
                 class="absolute w-full border-t border-gray-100"
                 :style="{ top: `${(i-1) * 25}%` }">
            </div>
            <!-- Linhas verticais (sutis) -->
            <div v-for="(_, index) in dadosParaGrafico" :key="`v-${index}`"
                 v-if="index % 5 === 0"
                 class="absolute h-full border-l border-gray-50"
                 :style="{ left: `${(index / (dadosParaGrafico.length - 1)) * 100}%` }">
            </div>
          </div>

          <!-- Eixo Y (valores) -->
          <div class="absolute left-0 top-4 bottom-4 w-8 flex flex-col justify-between text-xs text-gray-400">
            <span>{{ maxValue }}</span>
            <span>{{ Math.round(maxValue * 0.75) }}</span>
            <span>{{ Math.round(maxValue * 0.5) }}</span>
            <span>{{ Math.round(maxValue * 0.25) }}</span>
            <span>0</span>
          </div>

          <!-- Área do gráfico -->
          <div class="absolute inset-4 ml-8">
            <!-- Barras -->
            <div class="absolute inset-0 flex items-end justify-between">
              <div v-for="(dia, index) in dadosParaGrafico" 
                   :key="dia.data"
                   class="flex flex-col items-center justify-end h-full group relative"
                   :style="{ width: `${100 / dadosParaGrafico.length}%` }">
                
                <!-- Container das barras empilhadas -->
                <div class="relative flex flex-col justify-end h-full w-full max-w-8 mx-auto">
                  <!-- Barra de Novos Leads (Verde) -->
                  <div 
                    class="w-full bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-sm transition-all duration-700 ease-out shadow-sm"
                    :class="{ 'animate-grow-up': isAnimated }"
                    :style="{ 
                      height: `${(dia.novosLeads / maxValue) * 100}%`,
                      animationDelay: `${index * 50}ms`
                    }"
                    v-if="dia.novosLeads > 0">
                  </div>
                  
                  <!-- Barra de Recorrentes (Azul) -->
                  <div 
                    class="w-full bg-gradient-to-t from-blue-400 to-blue-300 transition-all duration-700 ease-out shadow-sm"
                    :class="{ 
                      'animate-grow-up': isAnimated,
                      'rounded-t-sm': dia.novosLeads === 0
                    }"
                    :style="{ 
                      height: `${(dia.recorrentes / maxValue) * 100}%`,
                      animationDelay: `${index * 50 + 100}ms`
                    }"
                    v-if="dia.recorrentes > 0">
                  </div>
                </div>

                <!-- Indicador de Vendas -->
                <div v-if="dia.vendas > 0" 
                     class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-full shadow-lg animate-pulse">
                </div>

                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none shadow-xl">
                  <div class="font-semibold">{{ formatDate(dia.data) }}</div>
                  <div class="text-emerald-300">Novos: {{ dia.novosLeads }}</div>
                  <div class="text-blue-300">Recorrentes: {{ dia.recorrentes }}</div>
                  <div class="text-orange-300" v-if="dia.vendas > 0">Vendas: {{ dia.vendas }}</div>
                  <div class="border-t border-gray-700 mt-1 pt-1">
                    Total: {{ dia.totalAtendimentos }}
                  </div>
                  <!-- Seta do tooltip -->
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>

            <!-- Linha suave (SVG) -->
            <svg class="absolute inset-0 pointer-events-none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                  <stop offset="50%" style="stop-color:#ef4444;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <!-- Área preenchida sob a linha -->
              <path
                :d="areaPath"
                fill="url(#lineGradient)"
                fill-opacity="0.1"
                class="transition-all duration-1000 ease-out"
                :class="{ 'animate-fade-in': isAnimated }"
              />
              
              <!-- Linha principal -->
              <path
                :d="linePath"
                fill="none"
                stroke="url(#lineGradient)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                filter="url(#glow)"
                class="transition-all duration-1000 ease-out"
                :class="{ 'animate-draw-line': isAnimated }"
                :style="{ strokeDasharray: isAnimated ? lineLength : 'none' }"
              />
              
              <!-- Pontos na linha -->
              <circle
                v-for="(dia, index) in dadosParaGrafico"
                :key="`point-${index}`"
                :cx="(index / (dadosParaGrafico.length - 1)) * 100 + '%'"
                :cy="(100 - (dia.totalAtendimentos / maxValue) * 100) + '%'"
                r="4"
                fill="white"
                stroke="url(#lineGradient)"
                stroke-width="2"
                class="transition-all duration-500 ease-out hover:r-6"
                :class="{ 'animate-scale-in': isAnimated }"
                :style="{ animationDelay: `${index * 100 + 500}ms` }"
              />
            </svg>
          </div>

          <!-- Eixo X (datas) -->
          <div class="absolute bottom-0 left-8 right-4 h-8 flex items-center justify-between">
            <div v-for="(dia, index) in dadosParaGrafico" 
                 :key="`date-${index}`"
                 v-if="index % Math.max(1, Math.floor(dadosParaGrafico.length / 8)) === 0"
                 class="text-xs text-gray-400 transform -rotate-45 origin-left">
              {{ formatDateShort(dia.data) }}
            </div>
          </div>
        </div>

        <!-- Legenda moderna -->
        <div class="flex items-center justify-center gap-8 mt-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded shadow-sm"></div>
            <span class="text-sm font-medium text-gray-700">Novos leads</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-300 rounded shadow-sm"></div>
            <span class="text-sm font-medium text-gray-700">Recorrentes</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-sm"></div>
            <span class="text-sm font-medium text-gray-700">Total de leads</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-gray-700">Vendas</span>
          </div>
        </div>
      </div>
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick, ref, readonly } from '#imports'
import SurfaceCard from './SurfaceCard.vue'
import BaseButton from './BaseButton.vue'
import IconActivity from './IconActivity.vue'
import IconCalendar from './IconCalendar.vue'
import { useAtendimentosFixed } from '~/composables/useAtendimentosFixed'
import { formatCurrency } from '~/utils/formatters'

const { atendimentosPorDia, stats, loading, error, fetchAtendimentosPorDia } = useAtendimentosFixed()

const periodoSelecionado = ref('30')
const isAnimated = ref(false)

const dadosParaGrafico = computed(() => {
  // Pegar os últimos 30 dias com ou sem dados para mostrar a linha contínua
  return atendimentosPorDia.value.slice(-30)
})

const maxValue = computed(() => {
  if (dadosParaGrafico.value.length === 0) return 10
  
  const max = Math.max(...dadosParaGrafico.value.map(d => d.totalAtendimentos))
  return Math.max(max, 10)
})

const linePath = computed(() => {
  if (dadosParaGrafico.value.length === 0) return ''
  
  const points = dadosParaGrafico.value.map((dia, index) => {
    const x = (index / (dadosParaGrafico.value.length - 1)) * 100
    const y = 100 - (dia.totalAtendimentos / maxValue.value) * 100
    return `${x},${y}`
  })
  
  return `M ${points.join(' L ')}`
})

const areaPath = computed(() => {
  if (dadosParaGrafico.value.length === 0) return ''
  
  const points = dadosParaGrafico.value.map((dia, index) => {
    const x = (index / (dadosParaGrafico.value.length - 1)) * 100
    const y = 100 - (dia.totalAtendimentos / maxValue.value) * 100
    return `${x},${y}`
  })
  
  return `M 0,100 L ${points.join(' L ')} L 100,100 Z`
})

const lineLength = computed(() => {
  // Calcular comprimento aproximado da linha para animação
  return dadosParaGrafico.value.length * 10
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

const atualizarDados = async () => {
  isAnimated.value = false
  await fetchAtendimentosPorDia(parseInt(periodoSelecionado.value))
  
  // Trigger animations after data loads
  await nextTick()
  setTimeout(() => {
    isAnimated.value = true
  }, 100)
}

onMounted(async () => {
  await atualizarDados()
})
</script>

<style scoped>
@keyframes grow-up {
  from {
    height: 0%;
    opacity: 0;
  }
  to {
    height: var(--final-height);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.1;
  }
}

@keyframes draw-line {
  from {
    stroke-dashoffset: v-bind(lineLength);
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-grow-up {
  animation: grow-up 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-draw-line {
  animation: draw-line 2s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out forwards;
}
</style>