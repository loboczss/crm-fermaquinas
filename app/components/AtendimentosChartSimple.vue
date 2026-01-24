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

    <!-- Gráfico Simples -->
    <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <IconCalendar class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Atendimentos por Dia</h3>
            <p class="text-sm text-gray-500">Comparação de leads novos, recorrentes e vendas diárias</p>
          </div>
        </div>
        <div class="text-right text-sm text-gray-500">
          <div>Média: <span class="font-semibold text-gray-700">{{ stats.mediaNovasLeadsPorDia }} leads/dia</span></div>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="flex items-center gap-3 text-gray-500">
          <IconActivity class="w-5 h-5 animate-spin" />
          <span>Carregando dados...</span>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <div v-else>
        <!-- Gráfico de Barras Verticais -->
        <div class="h-80 flex items-end justify-between gap-1 bg-gray-50 rounded-lg p-4">
          <div 
            v-for="(dia, index) in dadosComAtendimentos" 
            :key="dia.data"
            class="flex flex-col items-center group relative"
            :style="{ width: `${100 / Math.max(dadosComAtendimentos.length, 1)}%` }"
          >
            <!-- Barras empilhadas -->
            <div class="flex flex-col justify-end h-72 w-full max-w-12 mx-auto relative">
              <!-- Barra de Recorrentes (base) -->
              <div 
                v-if="dia.recorrentes > 0"
                class="w-full bg-blue-500 rounded-b-sm transition-all duration-500 hover:bg-blue-600"
                :style="{ height: `${(dia.recorrentes / maxValue) * 100}%` }"
                :title="`${dia.recorrentes} recorrentes`"
              ></div>
              
              <!-- Barra de Novos Leads (topo) -->
              <div 
                v-if="dia.novosLeads > 0"
                class="w-full bg-green-500 transition-all duration-500 hover:bg-green-600"
                :class="{ 'rounded-t-sm': true, 'rounded-b-sm': dia.recorrentes === 0 }"
                :style="{ height: `${(dia.novosLeads / maxValue) * 100}%` }"
                :title="`${dia.novosLeads} novos leads`"
              ></div>
            </div>

            <!-- Indicador de Vendas -->
            <div 
              v-if="dia.vendas > 0" 
              class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
              :title="`${dia.vendas} vendas`"
            >
              {{ dia.vendas }}
            </div>

            <!-- Data -->
            <div class="mt-2 text-xs text-gray-500 transform -rotate-45 origin-center whitespace-nowrap">
              {{ formatDateShort(dia.data) }}
            </div>

            <!-- Tooltip -->
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none shadow-xl">
              <div class="font-semibold">{{ formatDate(dia.data) }}</div>
              <div class="text-green-300">Novos: {{ dia.novosLeads }}</div>
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

        <!-- Legenda -->
        <div class="flex items-center justify-center gap-8 mt-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
            <span class="text-sm font-medium text-gray-700">Novos leads</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-blue-500 rounded shadow-sm"></div>
            <span class="text-sm font-medium text-gray-700">Recorrentes</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-orange-500 rounded-full shadow-sm"></div>
            <span class="text-sm font-medium text-gray-700">Vendas</span>
          </div>
        </div>

        <!-- Debug Info (removível em produção) -->
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> 
          {{ dadosComAtendimentos.length }} dias com dados | 
          Max: {{ maxValue }} | 
          Total registros: {{ atendimentosPorDia.length }}
        </div>
      </div>
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SurfaceCard from './SurfaceCard.vue'
import BaseButton from './BaseButton.vue'
import IconActivity from './IconActivity.vue'
import IconCalendar from './IconCalendar.vue'
import { useAtendimentosFixed } from '~/composables/useAtendimentosFixed'
import { formatCurrency } from '~/utils/formatters'

const { atendimentosPorDia, stats, loading, error, fetchAtendimentosPorDia } = useAtendimentosFixed()

const periodoSelecionado = ref('30')

const dadosComAtendimentos = computed(() => {
  return atendimentosPorDia.value.filter(d => d.totalAtendimentos > 0).slice(-15) // Mostrar apenas últimos 15 dias com dados
})

const maxValue = computed(() => {
  if (dadosComAtendimentos.value.length === 0) return 10
  
  const max = Math.max(...dadosComAtendimentos.value.map(d => d.totalAtendimentos))
  return Math.max(max, 5)
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
  await fetchAtendimentosPorDia(parseInt(periodoSelecionado.value))
}

onMounted(async () => {
  await atualizarDados()
})
</script>