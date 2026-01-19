<template>
  <PageShell title="Gestão de Clientes" subtitle="Gerencie e acompanhe todos os seus clientes">
    <SurfaceCard padding="sm" rounded="lg" class="mb-6">
      <div class="relative">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Buscar por nome, e-mail ou ID de contato..."
          class="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
    </SurfaceCard>

    <SurfaceCard padding="md" rounded="lg" class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filtros
        </h3>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          Limpar filtros
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 mb-2 block">Cidade</label>
          <select
            v-model="filters.cidade"
            @change="applyFilters"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Todas</option>
            <option v-for="cidade in filterOptions.cidades" :key="cidade" :value="cidade">
              {{ cidade }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 mb-2 block">Sentimento</label>
          <select
            v-model="filters.sentimento"
            @change="applyFilters"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Todos</option>
            <option v-for="sentimento in filterOptions.sentimentos" :key="sentimento" :value="sentimento">
              {{ sentimento }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 mb-2 block">Urgência</label>
          <select
            v-model="filters.urgencia"
            @change="applyFilters"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Todas</option>
            <option v-for="urgencia in filterOptions.urgencias" :key="urgencia" :value="urgencia">
              {{ urgencia }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 mb-2 block">Fase da Obra</label>
          <select
            v-model="filters.faseObra"
            @change="applyFilters"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Todas</option>
            <option v-for="fase in filterOptions.fasesObra" :key="fase" :value="fase">
              {{ fase }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 mb-2 block">Ordenar por</label>
          <select
            v-model="filters.orderBy"
            @change="applyFilters"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="created_at">Data de cadastro</option>
            <option value="nome">Nome</option>
            <option value="cidade">Cidade</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 mb-2 block">Direção</label>
          <select
            v-model="filters.orderDirection"
            @change="applyFilters"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>
      </div>
    </SurfaceCard>

    <SurfaceCard v-if="loading" padding="lg" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-500">Carregando clientes...</p>
    </SurfaceCard>

    <SurfaceCard v-else-if="error" padding="md" class="text-center bg-red-50 border-red-100">
      <p class="text-red-600">{{ error }}</p>
      <BaseButton variant="primary" size="md" class="mt-4" @click="loadClientes">
        Tentar novamente
      </BaseButton>
    </SurfaceCard>

    <SurfaceCard v-else padding="md" class="overflow-hidden">
      <div v-if="clientes.length === 0" class="p-12 text-center">
        <p class="text-gray-500">Nenhum cliente encontrado.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cidade</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">E-mail</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sentimento</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div>
                  <p class="font-semibold text-gray-900">{{ getDisplayName(cliente) }}</p>
                  <p class="text-xs text-gray-500">ID: {{ cliente.contato_id }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ cliente.cidade || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ cliente.email || '-' }}
              </td>
              <td class="px-6 py-4">
                <span v-if="cliente.sentimento" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getSentimentoColor(cliente.sentimento)">
                  {{ cliente.sentimento }}
                </span>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openDetailModal(cliente)"
                    class="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                  >
                    Ver detalhes
                  </button>
                  <button
                    @click="openEditModal(cliente)"
                    class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Mostrando {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize, totalCount) }} de {{ totalCount }} clientes
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

          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="px-3 py-1 text-sm rounded-lg transition-colors"
              :class="page === currentPage ? 'bg-primary text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'"
            >
              {{ page }}
            </button>
          </div>

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
    </SurfaceCard>

    <ClienteDetailModal
      v-model="showDetailModal"
      :cliente="selectedCliente"
    />

    <ClienteEditModal
      v-model="showEditModal"
      :cliente="selectedClienteForEdit"
      @saved="handleClienteSaved"
    />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'
import type { CrmEvastur } from '~~/shared/types/CrmEvastur'
import type { ClienteFilters } from '~/composables/useClientes'
import { useClientes } from '~/composables/useClientes'
import BaseButton from '~/components/BaseButton.vue'
import ClienteDetailModal from '~/components/ClienteDetailModal.vue'
import ClienteEditModal from '~/components/ClienteEditModal.vue'
import PageShell from '~/components/PageShell.vue'
import SurfaceCard from '~/components/SurfaceCard.vue'

const { getClientes, searchClientes, getFilterOptions } = useClientes()

const clientes = ref<CrmEvastur[]>([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const totalCount = ref(0)
const pageSize = ref(20)
const searchTerm = ref('')
const showDetailModal = ref(false)
const selectedCliente = ref<CrmEvastur | null>(null)
const showEditModal = ref(false)
const selectedClienteForEdit = ref<CrmEvastur | null>(null)
let searchTimeout: NodeJS.Timeout

const filters = ref<ClienteFilters>({
  cidade: '',
  sentimento: '',
  urgencia: '',
  faseObra: '',
  orderBy: 'created_at',
  orderDirection: 'desc'
})

const filterOptions = ref({
  cidades: [] as string[],
  sentimentos: [] as string[],
  urgencias: [] as string[],
  fasesObra: [] as string[]
})

const hasActiveFilters = computed(() => {
  return !!(filters.value.cidade || filters.value.sentimento || filters.value.urgencia || filters.value.faseObra)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const getDisplayName = (cliente: CrmEvastur) => {
  return cliente.nome || cliente.nome_social || 'Sem nome'
}

const getSentimentoColor = (sentimento: string) => {
  const colors: Record<string, string> = {
    'positivo': 'bg-green-100 text-green-800',
    'neutro': 'bg-gray-100 text-gray-800',
    'negativo': 'bg-red-100 text-red-800'
  }
  return colors[sentimento.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const loadClientes = async () => {
  try {
    loading.value = true
    error.value = ''

    const activeFilters: ClienteFilters = {
      cidade: filters.value.cidade || undefined,
      sentimento: filters.value.sentimento || undefined,
      urgencia: filters.value.urgencia || undefined,
      faseObra: filters.value.faseObra || undefined,
      orderBy: filters.value.orderBy,
      orderDirection: filters.value.orderDirection
    }

    const result = searchTerm.value
      ? await searchClientes(searchTerm.value, currentPage.value, pageSize.value, activeFilters)
      : await getClientes(currentPage.value, pageSize.value, activeFilters)

    clientes.value = result.data
    totalCount.value = result.count
    totalPages.value = result.totalPages
  } catch (e: any) {
    error.value = e.message || 'Erro ao carregar clientes'
  } finally {
    loading.value = false
  }
}

const loadFilterOptions = async () => {
  try {
    const options = await getFilterOptions()
    filterOptions.value = options
  } catch (e: any) {
    console.error('Erro ao carregar opções de filtro:', e)
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadClientes()
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadClientes()
  }, 500)
}

const applyFilters = () => {
  currentPage.value = 1
  loadClientes()
}

const clearFilters = () => {
  filters.value = {
    cidade: '',
    sentimento: '',
    urgencia: '',
    faseObra: '',
    orderBy: 'created_at',
    orderDirection: 'desc'
  }
  currentPage.value = 1
  loadClientes()
}

const openDetailModal = (cliente: CrmEvastur) => {
  selectedCliente.value = cliente
  showDetailModal.value = true
}

const openEditModal = (cliente: CrmEvastur) => {
  selectedClienteForEdit.value = cliente
  showEditModal.value = true
}

const handleClienteSaved = () => {
  loadClientes()
}

onMounted(() => {
  loadFilterOptions()
  loadClientes()
})
</script>
