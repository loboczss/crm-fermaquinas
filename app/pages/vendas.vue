<template>
  <PageShell title="Vendas" subtitle="Visão rápida das vendas registradas">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total" 
        :value="formatCurrency(vendasStats.total)" 
        variant="primary"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
        </template>
      </StatCard>

      <StatCard 
        title="Maior venda" 
        :value="formatCurrency(vendasStats.maior)" 
        variant="success"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        </template>
      </StatCard>

      <StatCard 
        title="Menor venda" 
        :value="formatCurrency(vendasStats.menor)" 
        variant="warning"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
        </template>
      </StatCard>
      
      <StatCard 
        title="Total de vendas" 
        :value="totalCount" 
        variant="info"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </template>
      </StatCard>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <SalesQuantityChart 
        :vendas="allVendasForChart" 
        :loading="loadingCharts"
        title="Quantidade de Vendas"
        subtitle="Volume diário de vendas realizadas"
      />
      <SalesValueChart 
        :vendas="allVendasForChart" 
        :loading="loadingCharts"
        title="Faturamento Diário"
        subtitle="Receita total gerada por dia"
      />
    </div>

    <SurfaceCard padding="sm" rounded="lg" class="mb-6">
      <!-- Quick Filters & Sort -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div class="flex flex-wrap gap-2">
          <button
            @click="applyQuickFilter('today')"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
              quickFilter === 'today' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            Hoje
          </button>
          <button
            @click="applyQuickFilter('week')"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
              quickFilter === 'week' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            Esta Semana
          </button>
          <button
            @click="applyQuickFilter('month')"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
              quickFilter === 'month' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            Este Mês
          </button>
          <button
            @click="applyQuickFilter('high-value')"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
              quickFilter === 'high-value' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            Alto Valor (>R$ 5.000)
          </button>
        </div>

        <div class="flex items-center gap-2">
          <label for="vendas-sort" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Ordenar:
          </label>
          <select
            id="vendas-sort"
            v-model="sortBy"
            class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="date-desc">Mais Recentes</option>
            <option value="date-asc">Mais Antigas</option>
            <option value="value-desc">Maior Valor</option>
            <option value="value-asc">Menor Valor</option>
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
          </select>
        </div>
      </div>

      <!-- Detailed Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
        <BaseInput
          id="vendas-busca"
          label="Buscar"
          placeholder="Nome, contato ou vendedor"
          v-model="filters.search"
        />
        <BaseInput
          id="vendas-data-inicio"
          label="Data início"
          type="date"
          v-model="filters.startDate"
        />
        <BaseInput
          id="vendas-data-fim"
          label="Data fim"
          type="date"
          v-model="filters.endDate"
        />
        <div class="space-y-1.5 w-full">
          <label for="vendas-vendedor" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
            Vendedor
          </label>
          <select
            id="vendas-vendedor"
            v-model="filters.vendedor"
            class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option v-for="item in vendedores" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <BaseInput
          id="vendas-valor-min"
          label="Valor mínimo"
          type="number"
          placeholder="0"
          v-model="filters.minValue"
        />
        <BaseInput
          id="vendas-valor-max"
          label="Valor máximo"
          type="number"
          placeholder="10000"
          v-model="filters.maxValue"
        />
        <div class="flex items-end justify-end">
          <BaseButton variant="ghost" size="sm" @click="clearFilters">
            Limpar filtros
          </BaseButton>
        </div>
      </div>
    </SurfaceCard>

    <SurfaceCard v-if="loading" padding="lg" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-500">Carregando vendas...</p>
    </SurfaceCard>

    <SurfaceCard v-else-if="error" padding="md" class="text-center bg-red-50 border-red-100">
      <p class="text-red-600">{{ error }}</p>
      <BaseButton variant="primary" size="md" class="mt-4" @click="loadVendas">
        Tentar novamente
      </BaseButton>
    </SurfaceCard>

    <div v-else>
      <SurfaceCard v-if="vendas.length === 0" padding="lg" class="text-center">
        <p class="text-gray-500">Nenhuma venda registrada.</p>
      </SurfaceCard>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <VendaCard 
          v-for="venda in vendas" 
          :key="venda.id" 
          :venda="venda"
          :loading="loadingClienteId === venda.contato_id"
          @view="openClienteModal"
        />
      </div>

      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Mostrando {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize, totalCount) }} de {{ totalCount }} vendas
        </div>
        <div class="flex items-center gap-2">
          <BaseButton
            variant="outline"
            size="sm"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            Anterior
          </BaseButton>

          <BaseButton
            variant="outline"
            size="sm"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            Próxima
          </BaseButton>
        </div>
      </div>
    </div>

    <ClienteDetailModal
      v-model="showDetailModal"
      :cliente="selectedCliente"
    />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from '#imports'
import type { CrmEvastur } from '~~/shared/types/CrmEvastur'
import type { HistoricoVenda } from '~~/shared/types/HistoricoVenda'
import { useClientes } from '~/composables/useClientes'
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'
import ClienteDetailModal from '~/components/ClienteDetailModal.vue'
import PageShell from '~/components/PageShell.vue'
import SurfaceCard from '~/components/SurfaceCard.vue'
import StatCard from '~/components/StatCard.vue'
import VendaCard from '~/components/VendaCard.vue'
import SalesQuantityChart from '~/components/SalesQuantityChart.vue'
import SalesValueChart from '~/components/SalesValueChart.vue'

const { getVendas, getClienteByContatoId, getVendasStats, getAllVendasForChart, getVendedores } = useClientes()

const vendas = ref<HistoricoVenda[]>([])
const allVendasForChart = ref<HistoricoVenda[]>([])
const vendedoresList = ref<string[]>([])
const loadingCharts = ref(false)
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const totalCount = ref(0)
const pageSize = ref(12)

const showDetailModal = ref(false)
const selectedCliente = ref<CrmEvastur | null>(null)
const loadingClienteId = ref<string | null>(null)
const vendasStats = ref({
  total: null as number | null,
  maior: null as number | null,
  menor: null as number | null
})

const filters = ref({
  search: '',
  vendedor: '',
  startDate: '',
  endDate: '',
  minValue: '',
  maxValue: ''
})

const sortBy = ref('date-desc')
const quickFilter = ref('')

// Auto-imported formatters from ~/utils/formatters.ts used in template

const loadVendas = async () => {
  try {
    loading.value = true
    error.value = ''

    const result = await getVendas(currentPage.value, pageSize.value, {
      ...filters.value,
      sortBy: sortBy.value
    })
    vendas.value = result.data
    totalCount.value = result.count
    totalPages.value = result.totalPages
  } catch (e: any) {
    error.value = e.message || 'Erro ao carregar vendas'
  } finally {
    loading.value = false
  }
}

// Watch filters to reload data
let debounceTimeout: any
watch([filters, sortBy], () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    currentPage.value = 1
    loadVendas()
  }, 500)
}, { deep: true })

const clearFilters = () => {
  filters.value = {
    search: '',
    vendedor: '',
    startDate: '',
    endDate: '',
    minValue: '',
    maxValue: ''
  }
  sortBy.value = 'date-desc'
  quickFilter.value = ''
}

const applyQuickFilter = (filter: string) => {
  // Toggle off if clicking the same filter
  if (quickFilter.value === filter) {
    quickFilter.value = ''
    clearFilters()
    return
  }

  quickFilter.value = filter
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  switch (filter) {
    case 'today':
      filters.value.startDate = `${year}-${month}-${day}`
      filters.value.endDate = `${year}-${month}-${day}`
      filters.value.minValue = ''
      filters.value.maxValue = ''
      break
    case 'week':
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const wsYear = weekStart.getFullYear()
      const wsMonth = String(weekStart.getMonth() + 1).padStart(2, '0')
      const wsDay = String(weekStart.getDate()).padStart(2, '0')
      filters.value.startDate = `${wsYear}-${wsMonth}-${wsDay}`
      filters.value.endDate = `${year}-${month}-${day}`
      filters.value.minValue = ''
      filters.value.maxValue = ''
      break
    case 'month':
      const monthStart = new Date(year, today.getMonth(), 1)
      const msYear = monthStart.getFullYear()
      const msMonth = String(monthStart.getMonth() + 1).padStart(2, '0')
      filters.value.startDate = `${msYear}-${msMonth}-01`
      filters.value.endDate = `${year}-${month}-${day}`
      filters.value.minValue = ''
      filters.value.maxValue = ''
      break
    case 'high-value':
      filters.value.minValue = '5000'
      filters.value.maxValue = ''
      filters.value.startDate = ''
      filters.value.endDate = ''
      break
  }
}

const loadVendedores = async () => {
  try {
    vendedoresList.value = await getVendedores()
  } catch (e) {
    console.error('Erro ao carregar vendedores:', e)
  }
}

const vendedores = computed(() => {
  return vendedoresList.value
})

const loadVendasStats = async () => {
  try {
    vendasStats.value = await getVendasStats()
  } catch (e: any) {
    console.error('Erro ao carregar métricas de vendas:', e)
  }
}

const loadChartData = async () => {
  try {
    loadingCharts.value = true
    allVendasForChart.value = await getAllVendasForChart()
  } catch (e: any) {
    console.error('Erro ao carregar dados do gráfico:', e)
  } finally {
    loadingCharts.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadVendas()
  }
}

const openClienteModal = async (contatoId: string) => {
  try {
    loadingClienteId.value = contatoId
    const cliente = await getClienteByContatoId(contatoId)
    selectedCliente.value = cliente
    showDetailModal.value = true
  } catch (e: any) {
    error.value = e.message || 'Erro ao carregar cliente'
  } finally {
    loadingClienteId.value = null
  }
}

onMounted(() => {
  loadVendas()
  loadVendasStats()
  loadChartData()
  loadVendedores()
})
</script>
