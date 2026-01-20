<template>
  <ModalBase
    :model-value="modelValue"
    :title="displayName"
    :subtitle="`ID: ${cliente?.contato_id || ''}`"
    size="xl"
    :scrollable="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- Mobile: Tabs Navigation -->
      <div class="sm:hidden border-b border-gray-100 bg-white z-20 flex-shrink-0">
        <div class="flex">
          <button
            @click="activeTab = 'info'"
            :class="[
              'flex-1 py-3 text-xs font-medium transition-colors',
              activeTab === 'info' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500'
            ]"
          >
            Informações
          </button>
          <button
            @click="activeTab = 'chat'"
            :class="[
              'flex-1 py-3 text-xs font-medium transition-colors',
              activeTab === 'chat' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500'
            ]"
          >
            Conversas
            <span v-if="mensagens.length" class="ml-1 text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
              {{ mensagens.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Content Layout -->
      <div class="flex-1 flex flex-col sm:flex-row min-h-0 overflow-hidden">
        <!-- Sidebar / Info Panel -->
        <div 
          :class="[
            'sm:w-80 sm:border-r border-gray-100 overflow-y-auto bg-gray-50/50 flex-shrink-0',
            activeTab === 'info' ? 'block' : 'hidden sm:block'
          ]"
        >
          <div class="p-5 space-y-6">
            <!-- Personal Info -->
            <DetailSection title="Informações Pessoais">
              <div class="space-y-3">
                <DetailField label="E-mail" :value="cliente?.email" />
                <DetailField label="Cidade" :value="cliente?.cidade" />
                <DetailField v-if="cliente?.data_nascimento" label="Nascimento" :value="cliente.data_nascimento" />
              </div>
            </DetailSection>

            <!-- Status -->
            <DetailSection v-if="cliente?.sentimento || cliente?.urgencia || cliente?.fase_obra" title="Status">
              <div class="space-y-3">
                <DetailField v-if="cliente?.sentimento" label="Sentimento">
                  <span :class="['inline-flex px-2 py-0.5 rounded-md text-xs font-medium', getSentimentoColor(cliente.sentimento)]">
                    {{ cliente.sentimento }}
                  </span>
                </DetailField>
                <DetailField v-if="cliente?.urgencia" label="Urgência" :value="cliente.urgencia" />
                <DetailField v-if="cliente?.fase_obra" label="Fase da Obra" :value="cliente.fase_obra" />
              </div>
            </DetailSection>

            <!-- Profile Summary -->
            <DetailSection v-if="cliente?.resumo_perfil" title="Resumo">
              <p class="text-sm text-gray-600 leading-relaxed">{{ cliente.resumo_perfil }}</p>
            </DetailSection>

            <!-- Tags -->
            <DetailSection title="Interesses">
              <div v-if="hasInteresses" class="flex flex-wrap gap-1.5">
                <span 
                  v-for="(item, idx) in cliente?.interesses" 
                  :key="idx" 
                  class="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                >
                  {{ item }}
                </span>
              </div>
              <p v-else class="text-xs text-gray-400">Nenhum interesse informado</p>
            </DetailSection>

            <DetailSection title="Objeções">
              <div v-if="hasObjeccoes" class="flex flex-wrap gap-1.5">
                <span 
                  v-for="(item, idx) in cliente?.objeccoes" 
                  :key="idx" 
                  class="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium"
                >
                  {{ item }}
                </span>
              </div>
              <p v-else class="text-xs text-gray-400">Nenhuma objeção informada</p>
            </DetailSection>

            <!-- Sales -->
            <DetailSection title="Vendas">
              <div v-if="loadingVendas" class="text-sm text-gray-400">Carregando...</div>
              <div v-else-if="vendas.length === 0" class="text-sm text-gray-400">Nenhuma venda</div>
              <div v-else class="space-y-2">
                <div 
                  v-for="venda in vendas" 
                  :key="venda.id" 
                  class="bg-white rounded-lg border border-gray-100 p-3"
                >
                  <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(venda.valor_venda) }}</p>
                  <p v-if="venda.vendedor" class="text-xs text-gray-500">{{ venda.vendedor }}</p>
                  <p class="text-[10px] text-gray-400 mt-1">{{ formatDate(venda.created_at) }}</p>
                </div>
              </div>
            </DetailSection>
          </div>
        </div>

        <!-- Chat Area -->
        <div 
          :class="[
            'flex-1 flex flex-col min-h-0 bg-white',
            activeTab === 'chat' ? 'flex' : 'hidden sm:flex'
          ]"
        >
          <!-- Desktop Chat Header -->
          <div class="hidden sm:block px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <h3 class="text-sm font-semibold text-gray-900">Histórico de Conversas</h3>
            <p class="text-xs text-gray-400">{{ mensagens.length }} mensagens</p>
          </div>

          <!-- Messages -->
          <div v-if="loadingMensagens" class="flex-1 flex items-center justify-center p-8">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3"></div>
              <p class="text-sm text-gray-400">Carregando...</p>
            </div>
          </div>

          <div v-else-if="mensagens.length === 0" class="flex-1 flex items-center justify-center p-8">
            <div class="text-center">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p class="text-sm text-gray-400">Sem mensagens</p>
            </div>
          </div>

          <div v-else ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 touch-pan-y">
            <ChatMessage
              v-for="message in mensagens"
              :key="message.id"
              :message="message"
            />
          </div>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from '#imports'
import type { CrmEvastur } from '~~/shared/types/CrmEvastur'
import type { HistoricoMsg } from '~~/shared/types/HistoricoMsg'
import type { HistoricoVenda } from '~~/shared/types/HistoricoVenda'
import { useClientes } from '~/composables/useClientes'
import ModalBase from '~/components/ModalBase.vue'
import DetailSection from '~/components/DetailSection.vue'
import DetailField from '~/components/DetailField.vue'
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
const activeTab = ref<'info' | 'chat'>('info')

const displayName = computed(() => {
  if (!props.cliente) return ''
  return props.cliente.nome || props.cliente.nome_social || 'Sem nome'
})

const hasInteresses = computed(() => {
  return props.cliente?.interesses && Array.isArray(props.cliente.interesses) && props.cliente.interesses.length > 0
})

const hasObjeccoes = computed(() => {
  return props.cliente?.objeccoes && Array.isArray(props.cliente.objeccoes) && props.cliente.objeccoes.length > 0
})

const getSentimentoColor = (sentimento: string) => {
  const colors: Record<string, string> = {
    'positivo': 'bg-green-50 text-green-700',
    'neutro': 'bg-gray-100 text-gray-700',
    'negativo': 'bg-red-50 text-red-700'
  }
  return colors[sentimento.toLowerCase()] || 'bg-gray-100 text-gray-700'
}

const formatCurrency = (value: number | null) => {
  if (!value && value !== 0) return '-'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
    activeTab.value = 'info'
    loadMensagens()
    loadVendas()
  } else {
    mensagens.value = []
    vendas.value = []
  }
}, { immediate: true })
</script>
