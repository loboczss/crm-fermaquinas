<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Editar Cliente</h2>
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

          <form class="flex-1 overflow-y-auto p-6 space-y-6" @submit.prevent="handleSave">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                id="cliente-edit-nome"
                label="Nome"
                placeholder="Nome"
                v-model="form.nome"
              />
              <BaseInput
                id="cliente-edit-nome-social"
                label="Nome Social"
                placeholder="Nome social"
                v-model="form.nome_social"
              />
              <BaseInput
                id="cliente-edit-email"
                label="E-mail"
                type="email"
                placeholder="email@exemplo.com"
                v-model="form.email"
              />
              <BaseInput
                id="cliente-edit-cidade"
                label="Cidade"
                placeholder="Cidade"
                v-model="form.cidade"
              />
              <BaseInput
                id="cliente-edit-data"
                label="Data de Nascimento"
                type="date"
                v-model="form.data_nascimento"
              />
              <BaseInput
                id="cliente-edit-sentimento"
                label="Sentimento"
                placeholder="positivo, neutro, negativo"
                v-model="form.sentimento"
              />
              <BaseInput
                id="cliente-edit-urgencia"
                label="Urgência"
                placeholder="alta, média, baixa"
                v-model="form.urgencia"
              />
              <BaseInput
                id="cliente-edit-fase"
                label="Fase da Obra"
                placeholder="fase da obra"
                v-model="form.fase_obra"
              />
            </div>

            <div class="space-y-4">
              <div class="space-y-1.5 w-full">
                <label for="cliente-edit-resumo" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
                  Resumo do Perfil
                </label>
                <textarea
                  id="cliente-edit-resumo"
                  v-model="form.resumo_perfil"
                  rows="4"
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent placeholder:text-gray-400 font-medium"
                  placeholder="Resumo do perfil"
                />
              </div>

              <div class="space-y-1.5 w-full">
                <label for="cliente-edit-interesses" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
                  Interesses (separados por vírgula)
                </label>
                <textarea
                  id="cliente-edit-interesses"
                  v-model="form.interesses"
                  rows="3"
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent placeholder:text-gray-400 font-medium"
                  placeholder="Interesse 1, Interesse 2"
                />
              </div>

              <div class="space-y-1.5 w-full">
                <label for="cliente-edit-objeccoes" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
                  Objeções (separadas por vírgula)
                </label>
                <textarea
                  id="cliente-edit-objeccoes"
                  v-model="form.objeccoes"
                  rows="3"
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent placeholder:text-gray-400 font-medium"
                  placeholder="Objeção 1, Objeção 2"
                />
              </div>

              <div class="space-y-1.5 w-full">
                <label for="cliente-edit-compras" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
                  Compras do Cliente (separadas por vírgula)
                </label>
                <textarea
                  id="cliente-edit-compras"
                  v-model="form.compras_cliente"
                  rows="3"
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent placeholder:text-gray-400 font-medium"
                  placeholder="Compra 1, Compra 2"
                />
              </div>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
              {{ error }}
            </div>
          </form>

          <div class="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50">
            <BaseButton variant="ghost" size="md" @click="close">
              Cancelar
            </BaseButton>
            <BaseButton variant="primary" size="md" :disabled="loading" @click="handleSave">
              {{ loading ? 'Salvando...' : 'Salvar alterações' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from '#imports'
import type { CrmEvastur } from '~~/shared/types/CrmEvastur'
import { useClientes } from '~/composables/useClientes'
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const props = defineProps<{
  modelValue: boolean
  cliente: CrmEvastur | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', value: CrmEvastur): void
}>()

const { updateCliente } = useClientes()

const loading = ref(false)
const error = ref('')

const form = ref({
  nome: '',
  nome_social: '',
  email: '',
  cidade: '',
  data_nascimento: '',
  sentimento: '',
  urgencia: '',
  fase_obra: '',
  resumo_perfil: '',
  interesses: '',
  objeccoes: '',
  compras_cliente: ''
})

const close = () => {
  emit('update:modelValue', false)
}

const toCsv = (value: any[] | null) => {
  if (!Array.isArray(value)) return ''
  return value.filter(Boolean).join(', ')
}

const toArray = (value: string) => {
  const items = value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
  return items.length > 0 ? items : null
}

const fillForm = () => {
  if (!props.cliente) return
  form.value = {
    nome: props.cliente.nome || '',
    nome_social: props.cliente.nome_social || '',
    email: props.cliente.email || '',
    cidade: props.cliente.cidade || '',
    data_nascimento: props.cliente.data_nascimento || '',
    sentimento: props.cliente.sentimento || '',
    urgencia: props.cliente.urgencia || '',
    fase_obra: props.cliente.fase_obra || '',
    resumo_perfil: props.cliente.resumo_perfil || '',
    interesses: toCsv(props.cliente.interesses),
    objeccoes: toCsv(props.cliente.objeccoes),
    compras_cliente: toCsv(props.cliente.compras_cliente)
  }
}

const handleSave = async () => {
  if (!props.cliente) return
  try {
    loading.value = true
    error.value = ''

    const updates: Partial<CrmEvastur> = {
      nome: form.value.nome || null,
      nome_social: form.value.nome_social || null,
      email: form.value.email || null,
      cidade: form.value.cidade || null,
      data_nascimento: form.value.data_nascimento || null,
      sentimento: form.value.sentimento || null,
      urgencia: form.value.urgencia || null,
      fase_obra: form.value.fase_obra || null,
      resumo_perfil: form.value.resumo_perfil || null,
      interesses: toArray(form.value.interesses),
      objeccoes: toArray(form.value.objeccoes),
      compras_cliente: toArray(form.value.compras_cliente)
    }

    const updated = await updateCliente(props.cliente.id, updates)
    emit('saved', updated)
    close()
  } catch (e: any) {
    error.value = e.message || 'Erro ao salvar alterações'
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue, (value) => {
  if (value) {
    fillForm()
  }
})
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
