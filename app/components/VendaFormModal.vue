<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <!-- Header -->
          <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                {{ isEdit ? 'Editar Venda' : 'Nova Venda' }}
              </h2>
              <p v-if="isEdit" class="text-sm text-gray-500">
                ID: {{ venda?.id }}
              </p>
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

          <!-- Form -->
          <form class="flex-1 overflow-y-auto p-6 space-y-6" @submit.prevent="handleSave">
            <div class="space-y-4">
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

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div v-if="error" class="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {{ error }}
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                @click="close"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { HistoricoVenda } from '~/shared/types/HistoricoVenda'

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
  if (!query) return clientesList.value.slice(0, 10)
  
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
  // Delay to allow mousedown to trigger first
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

// Reset or init form when modal opens/venda changes
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    error.value = null
    fetchClientes()
    if (props.venda) {
      form.contact_name = props.venda.contact_name || ''
      form.vendedor = props.venda.vendedor || ''
      form.valor_venda = props.venda.valor_venda || 0
      // Format date for <input type="date"> (YYYY-MM-DD)
      if (props.venda.created_at) {
        form.created_at = new Date(props.venda.created_at).toISOString().split('T')[0]
      } else {
        form.created_at = new Date().toISOString().split('T')[0]
      }
      form.contato_id = props.venda.contato_id || ''
    } else {
      // Reset form for create mode
      form.contact_name = ''
      form.vendedor = ''
      form.valor_venda = 0
      form.created_at = new Date().toISOString().split('T')[0]
      form.contato_id = ''
    }
  }
})

// Auto-fill name when contato_id is selected from list
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
    // 1. Verificar se o cliente já existe na crm_evastur
    // Se não existir, criar um novo cliente com o contato_id e contact_name informados
    let clienteExistente = null
    try {
      clienteExistente = await getClienteByContatoId(form.contato_id)
    } catch (e) {
      // Se der erro (provavelmente 406 Not Found ou similar se usar .single()), cliente não existe
      clienteExistente = null
    }

    if (!clienteExistente) {
      // Criar cliente se não existir
      await createCliente({
        contato_id: form.contato_id,
        nome: form.contact_name,
        // Você pode adicionar outros campos padrão aqui se necessário
        created_at: new Date().toISOString()
      })
    }

    // 2. Salvar a venda
    const data = {
      ...form,
      // Ensure date is properly handled
      created_at: new Date(form.created_at).toISOString()
    }

    if (isEdit.value && props.venda?.id) {
      const { error: updateErr } = await updateVenda(props.venda.id, data)
      if (updateErr) throw updateErr
    } else {
      const { error: createErr } = await createVenda(data)
      if (createErr) throw createErr
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
