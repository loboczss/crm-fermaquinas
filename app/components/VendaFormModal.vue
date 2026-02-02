<template>
  <ModalBase
    :model-value="modelValue"
    :title="isEdit ? 'Editar Venda' : 'Nova Venda'"
    :subtitle="isEdit ? `ID: ${venda?.id}` : 'Preencha os dados da venda'"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <!-- Content -->
    <form id="venda-form" class="p-5 space-y-5" @submit.prevent="handleSave">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-bold transition-all border-b-2',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: Básico -->
      <div v-show="activeTab === 'basico'" class="space-y-4">
        <div class="relative">
          <BaseInput
            id="venda-contato-id"
            label="ID do Contato *"
            placeholder="ID do contato (obrigatório)"
            v-model="form.contato_id"
            required
            @focus="showDropdown = true"
            @input="showDropdown = true"
            @blur="handleBlur"
            autocomplete="off"
          />
          
          <!-- Custom Dropdown Results -->
          <div v-if="showDropdown && filteredClientes.length > 0" 
               class="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div 
              v-for="c in filteredClientes" 
              :key="c.contato_id"
              @mousedown="selectCliente(c)"
              class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex flex-col transition-colors border-b border-gray-50 last:border-0"
            >
              <span class="text-sm font-bold text-gray-900">{{ c.contato_id }}</span>
              <span class="text-xs text-gray-500">{{ c.nome }}</span>
            </div>
          </div>
        </div>

        <BaseInput
          id="venda-cliente"
          label="Nome do Cliente *"
          placeholder="Ex: João Silva"
          v-model="form.contact_name"
          required
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            id="venda-telefone"
            label="Telefone"
            type="number"
            placeholder="5568999999999"
            v-model.number="form.telefone"
          />
          
          <BaseInput
            id="venda-instagram"
            label="Instagram"
            placeholder="@usuario"
            v-model="form.instagram"
          />
        </div>
        
        <BaseInput
          id="venda-vendedor"
          label="Vendedor"
          placeholder="Nome do vendedor"
          v-model="form.vendedor"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            id="venda-valor"
            label="Valor da Venda (R$) *"
            type="number"
            step="0.01"
            placeholder="0,00"
            v-model.number="form.valor_venda"
            required
          />
          
          <BaseInput
            id="venda-data"
            label="Data da Venda *"
            type="date"
            v-model="form.created_at"
            required
          />
        </div>

        <BaseInput
          id="venda-fornecedor"
          label="Fornecedor"
          placeholder="Ex: SAKURA, SKY"
          v-model="form.fornecedor"
        />
      </div>

      <!-- Tab: Processo -->
      <div v-show="activeTab === 'processo'" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5 w-full">
            <label for="venda-status" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
              Status
            </label>
            <select
              id="venda-status"
              v-model="form.status"
              class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent font-medium"
            >
              <option value="">Selecione um status</option>
              <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          
          <div class="space-y-1.5 w-full">
            <label for="venda-tipo" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
              Tipo de Venda
            </label>
            <select
              id="venda-tipo"
              v-model="form.tipo_venda"
              class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent font-medium"
            >
              <option value="">Selecione o tipo</option>
              <option v-for="t in tipoOptions" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5 w-full">
            <label for="venda-forma-pagamento" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
              Forma de Pagamento
            </label>
            <select
              id="venda-forma-pagamento"
              v-model="form.forma_pagamento"
              class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent font-medium"
            >
              <option value="">Selecione o pagamento</option>
              <option v-for="f in pagamentoOptions" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>
          
          <div class="space-y-1.5 w-full">
            <label for="venda-forma-faturas" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
              Forma Pagamento Faturas Automáticas
            </label>
            <select
              id="venda-forma-faturas"
              v-model="form.forma_pagamento_faturas_automaticas"
              class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent font-medium"
            >
              <option value="">Selecione a forma</option>
              <option v-for="f in faturasOptions" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-1.5 w-full">
          <label for="venda-acao" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
            Ação da Venda
          </label>
          <select
            id="venda-acao"
            v-model="form.acao_venda"
            class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent font-medium"
          >
            <option value="">Selecione a ação</option>
            <option v-for="a in acaoOptions" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>
      </div>

      <!-- Tab: Logística -->
      <div v-show="activeTab === 'logistica'" class="space-y-4">
        <BaseInput
          id="venda-embarque"
          label="Data de Embarque"
          type="date"
          v-model="form.embarque"
        />

        <BaseInput
          id="venda-obs-pendencias"
          label="Observações / Pendências"
          placeholder="Anotações sobre pendências"
          v-model="form.obs_pendencias"
          type="textarea"
        />

        <BaseInput
          id="venda-observacao"
          label="Observação Geral"
          placeholder="Observações gerais sobre a venda"
          v-model="form.observacao"
          type="textarea"
        />
      </div>

      <!-- Tab: Financeiro/Atlas -->
      <div v-show="activeTab === 'financeiro'" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            id="venda-codigo-atlas"
            label="Código Atlas"
            type="number"
            placeholder="Código no sistema Atlas"
            v-model.number="form.codigo_atlas"
          />
          
          <BaseInput
            id="venda-cliente-atlas"
            label="Cliente Atlas"
            placeholder="Nome do cliente no Atlas"
            v-model="form.cliente_atlas"
          />
        </div>

        <BaseInput
          id="venda-data-atlas"
          label="Data da Venda no Atlas"
          type="date"
          v-model="form.data_venda_atlas"
        />

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BaseInput
            id="venda-taxa"
            label="Taxa (%)"
            type="number"
            step="0.01"
            placeholder="0,00"
            v-model.number="form.taxa"
          />
          
          <BaseInput
            id="venda-taxa-adm"
            label="Taxa Administrativa (R$)"
            type="number"
            step="0.01"
            placeholder="0,00"
            v-model.number="form.taxa_adm"
          />
          
          <BaseInput
            id="venda-comissao"
            label="Comissão (%)"
            type="number"
            step="0.01"
            placeholder="0,00"
            v-model.number="form.comissao"
          />
        </div>
      </div>

      <div v-if="error" class="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
        {{ error }}
      </div>
    </form>

    <!-- Footer -->
    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton
          variant="secondary"
          @click="close"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          type="submit"
          form="venda-form"
          :loading="loading"
        >
          {{ isEdit ? 'Salvar Alterações' : 'Criar Venda' }}
        </BaseButton>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from '#imports'
import type { HistoricoVenda } from '~~/shared/types/HistoricoVenda'
import { useClientes } from '~~/app/composables/useClientes'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import ModalBase from '~/components/ModalBase.vue'

const props = defineProps<{
  modelValue: boolean
  venda: HistoricoVenda | null
}>()

const emit = defineEmits(['update:modelValue', 'saved'])

const { createVenda, updateVenda, getAllClientesMinimal, getClienteByContatoId, createCliente } = useClientes()

const loading = ref(false)
const error = ref<string | null>(null)
const clientesList = ref<Array<{ nome: string, contato_id: string }>>([])
const showDropdown = ref(false)
const activeTab = ref('basico')

const tabs = [
  { id: 'basico', label: 'Básico' },
  { id: 'processo', label: 'Processo' },
  { id: 'logistica', label: 'Logística' },
  { id: 'financeiro', label: 'Financeiro/Atlas' }
]

const statusOptions = ['Ativo', 'Inativo', 'Pendente', 'Cancelado', 'Aguardando Pagamento', 'Aprovado']
const pagamentoOptions = ['Depósito', 'PIX', 'Cartão de Crédito', 'Boleto', 'Transferência', 'Dinheiro', 'Outro']
const faturasOptions = ['Depósito', 'Débito Automático', 'Cartão de Crédito', 'PIX Programado', 'Outro', 'Nenhuma']
const tipoOptions = ['Nacional', 'Internacional', 'Online', 'Presencial', 'Outro']
const acaoOptions = ['Venda Efetivada', 'Orçamento Enviado', 'Aguardando Aprovação', 'Cancelada', 'Pendente']

const isEdit = computed(() => !!props.venda?.id)

const form = reactive({
  contact_name: '',
  vendedor: '',
  valor_venda: 0,
  created_at: new Date().toISOString().split('T')[0],
  contato_id: '',
  telefone: null as number | null,
  instagram: '',
  codigo_atlas: null as number | null,
  status: '',
  tipo_venda: '',
  forma_pagamento: '',
  data_venda_atlas: '',
  cliente_atlas: '',
  embarque: '',
  obs_pendencias: '',
  fornecedor: '',
  forma_pagamento_faturas_automaticas: '',
  observacao: '',
  acao_venda: '',
  taxa: null as number | null,
  taxa_adm: null as number | null,
  comissao: null as number | null
})

const filteredClientes = computed(() => {
  const query = (form.contato_id || '').toString().toLowerCase().trim()
  if (!query) return []
  
  return clientesList.value
    .filter(c => {
      const id = (c.contato_id || '').toString().toLowerCase()
      const nome = (c.nome || '').toString().toLowerCase()
      return id.includes(query) || nome.includes(query)
    })
    .slice(0, 10)
})

const selectCliente = (c: { nome: string, contato_id: string }) => {
  form.contato_id = c.contato_id.toString()
  form.contact_name = c.nome
  showDropdown.value = false
}

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const fetchClientes = async () => {
  try {
    clientesList.value = await getAllClientesMinimal()
  } catch (err) {
    console.error('Erro ao buscar clientes:', err)
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    error.value = null
    activeTab.value = 'basico'
    fetchClientes()
    if (props.venda) {
      form.contact_name = props.venda.contact_name || ''
      form.vendedor = props.venda.vendedor || ''
      form.valor_venda = props.venda.valor_venda || 0
      if (props.venda.created_at) {
        form.created_at = new Date(props.venda.created_at).toISOString().split('T')[0]
      } else {
        form.created_at = new Date().toISOString().split('T')[0]
      }
      form.contato_id = props.venda.contato_id || ''
      form.telefone = props.venda.telefone ?? null
      form.instagram = props.venda.instagram || ''
      form.codigo_atlas = props.venda.codigo_atlas ?? null
      form.status = props.venda.status || ''
      form.tipo_venda = props.venda.tipo_venda || ''
      form.forma_pagamento = props.venda.forma_pagamento || ''
      form.data_venda_atlas = '' // Field removed from DB
      form.cliente_atlas = props.venda.cliente_atlas || ''
      if (props.venda.embarque) {
        try {
          form.embarque = new Date(props.venda.embarque).toISOString().split('T')[0]
        } catch (e) {
          form.embarque = ''
        }
      } else {
        form.embarque = ''
      }
      form.obs_pendencias = props.venda.obs_pendencias || ''
      form.fornecedor = props.venda.fornecedor || ''
      form.forma_pagamento_faturas_automaticas = props.venda.forma_pagamento_faturas_automaticas || ''
      form.observacao = props.venda.observacao || ''
      form.acao_venda = props.venda.acao_venda || ''
      form.taxa = props.venda.taxa || null
      form.taxa_adm = props.venda.taxa_adm || null
      form.comissao = props.venda.comissao || null
    } else {
      form.contact_name = ''
      form.vendedor = ''
      form.valor_venda = 0
      form.created_at = new Date().toISOString().split('T')[0]
      form.contato_id = ''
      form.telefone = null
      form.instagram = ''
      form.codigo_atlas = null
      form.status = ''
      form.tipo_venda = ''
      form.forma_pagamento = ''
      form.data_venda_atlas = ''
      form.cliente_atlas = ''
      form.embarque = ''
      form.obs_pendencias = ''
      form.fornecedor = ''
      form.forma_pagamento_faturas_automaticas = ''
      form.observacao = ''
      form.acao_venda = ''
      form.taxa = null
      form.taxa_adm = null
      form.comissao = null
    }
  }
})

watch(() => form.contato_id, (newId) => {
  if (!isEdit.value && newId) {
    const found = clientesList.value.find(c => 
      String(c.contato_id || '').toLowerCase() === String(newId).toLowerCase()
    )
    if (found) {
      form.contact_name = found.nome
    }
  }
})

const close = () => {
  emit('update:modelValue', false)
}

const handleSave = async () => {
  loading.value = true
  error.value = null

  try {
    let clienteExistente = null
    try {
      clienteExistente = await getClienteByContatoId(form.contato_id)
    } catch (e) {
      clienteExistente = null
    }

    if (!clienteExistente) {
      await createCliente({
        contato_id: form.contato_id,
        nome: form.contact_name,
        created_at: new Date().toISOString()
      })
    }

    const dataForVenda: any = {
      contact_name: form.contact_name,
      vendedor: form.vendedor,
      valor_venda: form.valor_venda,
      contato_id: form.contato_id,
      id_mensagem_venda: props.venda?.id_mensagem_venda || null,
      created_at: new Date(form.created_at as string).toISOString(),
      telefone: form.telefone,
      instagram: form.instagram,
      codigo_atlas: form.codigo_atlas,
      status: form.status,
      tipo_venda: form.tipo_venda,
      forma_pagamento: form.forma_pagamento,
      cliente_atlas: form.cliente_atlas,
      embarque: form.embarque,
      obs_pendencias: form.obs_pendencias,
      fornecedor: form.fornecedor,
      forma_pagamento_faturas_automaticas: form.forma_pagamento_faturas_automaticas,
      observacao: form.observacao,
      acao_venda: form.acao_venda,
      taxa: form.taxa,
      taxa_adm: form.taxa_adm,
      comissao: form.comissao
    }

    if (isEdit.value && props.venda?.id) {
      await updateVenda(props.venda.id, dataForVenda)
    } else {
      await createVenda(dataForVenda)
    }

    emit('saved')
    close()
  } catch (err: any) {
    console.error('Erro ao salvar venda:', err)
    error.value = err.message || 'Ocorreu um erro ao salvar a venda.'
  } finally {
    loading.value = false
  }
}
</script>
