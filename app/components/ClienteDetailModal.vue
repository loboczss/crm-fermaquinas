<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <!-- Header -->
          <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ displayName }}</h2>
              <p class="text-sm text-gray-500">ID: {{ cliente?.contato_id }}</p>
            </div>
            <button
              @click="close"
              class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-hidden flex">
            <!-- Sidebar - Cliente Info -->
            <div class="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50 p-6 space-y-6">
              <div>
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Informações Pessoais</h3>
                <div class="space-y-3">
                  <div v-if="cliente?.email">
                    <p class="text-xs text-gray-500">E-mail</p>
                    <p class="text-sm font-medium text-gray-900">{{ cliente.email }}</p>
                  </div>
                  <div v-if="cliente?.cidade">
                    <p class="text-xs text-gray-500">Cidade</p>
                    <p class="text-sm font-medium text-gray-900">{{ cliente.cidade }}</p>
                  </div>
                  <div v-if="cliente?.data_nascimento">
                    <p class="text-xs text-gray-500">Data de Nascimento</p>
                    <p class="text-sm font-medium text-gray-900">{{ cliente.data_nascimento }}</p>
                  </div>
                </div>
              </div>

              <div v-if="cliente?.sentimento || cliente?.urgencia || cliente?.fase_obra">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Status</h3>
                <div class="space-y-3">
                  <div v-if="cliente?.sentimento">
                    <p class="text-xs text-gray-500">Sentimento</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getSentimentoColor(cliente.sentimento)">
                      {{ cliente.sentimento }}
                    </span>
                  </div>
                  <div v-if="cliente?.urgencia">
                    <p class="text-xs text-gray-500">Urgência</p>
                    <p class="text-sm font-medium text-gray-900">{{ cliente.urgencia }}</p>
                  </div>
                  <div v-if="cliente?.fase_obra">
                    <p class="text-xs text-gray-500">Fase da Obra</p>
                    <p class="text-sm font-medium text-gray-900">{{ cliente.fase_obra }}</p>
                  </div>
                </div>
              </div>

              <div v-if="cliente?.resumo_perfil">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Resumo do Perfil</h3>
                <p class="text-sm text-gray-700 leading-relaxed">{{ cliente.resumo_perfil }}</p>
              </div>

              <div v-if="cliente?.interesses && Array.isArray(cliente.interesses) && cliente.interesses.length > 0">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Interesses</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(interesse, idx) in cliente.interesses" :key="idx" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ interesse }}
                  </span>
                </div>
              </div>

              <div v-if="cliente?.objeccoes && Array.isArray(cliente.objeccoes) && cliente.objeccoes.length > 0">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Objeções</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(objeccao, idx) in cliente.objeccoes" :key="idx" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {{ objeccao }}
                  </span>
                </div>
              </div>

              <div>
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Vendas</h3>
                <div v-if="loadingVendas" class="text-sm text-gray-500">Carregando vendas...</div>
                <div v-else-if="vendas.length === 0" class="text-sm text-gray-500">Nenhuma venda registrada</div>
                <div v-else class="space-y-3">
                  <div v-for="venda in vendas" :key="venda.id" class="bg-white rounded-lg border border-gray-200 p-3">
                    <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(venda.valor_venda) }}</p>
                    <p v-if="venda.vendedor" class="text-xs text-gray-500">Vendedor: {{ venda.vendedor }}</p>
                    <p class="text-xs text-gray-400">{{ new Date(venda.created_at).toLocaleString('pt-BR') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 flex flex-col bg-gray-50">
              <!-- Chat Header -->
              <div class="px-6 py-4 bg-white border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Histórico de Conversas</h3>
                <p class="text-xs text-gray-500 mt-1">{{ mensagens.length }} mensagens</p>
              </div>

              <!-- Messages -->
              <div v-if="loadingMensagens" class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p class="text-sm text-gray-500">Carregando mensagens...</p>
                </div>
              </div>

              <div v-else-if="mensagens.length === 0" class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p class="text-sm text-gray-500">Nenhuma mensagem encontrada</p>
                </div>
              </div>

              <div v-else ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <ChatMessage
                  v-for="message in mensagens"
                  :key="message.id"
                  :message="message"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from '#imports'
import type { CrmEvastur } from '~~/shared/types/CrmEvastur'
import type { HistoricoMsg } from '~~/shared/types/HistoricoMsg'
import type { HistoricoVenda } from '~~/shared/types/HistoricoVenda'
import { useClientes } from '~/composables/useClientes'
import ChatMessage from '~/components/ChatMessage.vue'

const props = defineProps<{
  modelValue: boolean
  cliente: CrmEvastur | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { getMensagensByContatoId, getVendasByContatoId } = useClientes()

const mensagens = ref<HistoricoMsg[]>([])
const vendas = ref<HistoricoVenda[]>([])
const loadingMensagens = ref(false)
const loadingVendas = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const displayName = computed(() => {
  if (!props.cliente) return ''
  return props.cliente.nome || props.cliente.nome_social || 'Sem nome'
})

const getSentimentoColor = (sentimento: string) => {
  const colors: Record<string, string> = {
    'positivo': 'bg-green-100 text-green-800',
    'neutro': 'bg-gray-100 text-gray-800',
    'negativo': 'bg-red-100 text-red-800'
  }
  return colors[sentimento.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const close = () => {
  emit('update:modelValue', false)
}

const formatCurrency = (value: number | null) => {
  if (!value && value !== 0) return '-'
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const loadMensagens = async () => {
  if (!props.cliente) return

  try {
    loadingMensagens.value = true
    mensagens.value = await getMensagensByContatoId(props.cliente.contato_id)
    
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  } catch (error: any) {
    console.error('Erro ao carregar mensagens:', error)
  } finally {
    loadingMensagens.value = false
  }
}

const loadVendas = async () => {
  if (!props.cliente) return

  try {
    loadingVendas.value = true
    vendas.value = await getVendasByContatoId(props.cliente.contato_id)
  } catch (error: any) {
    console.error('Erro ao carregar vendas:', error)
  } finally {
    loadingVendas.value = false
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.cliente) {
    loadMensagens()
    loadVendas()
  } else {
    mensagens.value = []
    vendas.value = []
  }
}, { immediate: true })
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
