<template>
  <ModalBase
    :model-value="modelValue"
    :title="isEdit ? 'Editar Venda' : 'Nova Venda'"
    :subtitle="isEdit ? `ID: ${venda?.id}` : 'Preencha os dados da venda'"
    size="md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <!-- Content -->
    <form id="venda-form" class="p-5 space-y-5" @submit.prevent="handleSave">
      <div class="space-y-4">
        <div class="relative">
          <BaseInput
            id="venda-contato-id"
            label="ID do Contato"
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
          label="Nome do Cliente"
          placeholder="Ex: João Silva"
          v-model="form.contact_name"
          required
        />
        
        <BaseInput
          id="venda-vendedor"
          label="Vendedor"
          placeholder="Nome do vendedor"
          v-model="form.vendedor"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            id="venda-valor"
            label="Valor da Venda (R$)"
            type="number"
            step="0.01"
            placeholder="0,00"
            v-model.number="form.valor_venda"
            required
          />
          
          <BaseInput
            id="venda-data"
            label="Data da Venda"
            type="date"
            v-model="form.created_at"
            required
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

const isEdit = computed(() => !!props.venda?.id)

const form = reactive({
  contact_name: '',
  vendedor: '',
  valor_venda: 0,
  created_at: new Date().toISOString().split('T')[0],
  contato_id: ''
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
    } else {
      form.contact_name = ''
      form.vendedor = ''
      form.valor_venda = 0
      form.created_at = new Date().toISOString().split('T')[0]
      form.contato_id = ''
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

    const dataForVenda = {
      contact_name: form.contact_name,
      vendedor: form.vendedor,
      valor_venda: form.valor_venda,
      contato_id: form.contato_id,
      id_mensagem_venda: props.venda?.id_mensagem_venda || null,
      created_at: new Date(form.created_at as string).toISOString()
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
