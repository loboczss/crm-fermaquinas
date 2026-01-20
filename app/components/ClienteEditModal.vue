<template>
  <ModalBase
    :model-value="modelValue"
    title="Editar Cliente"
    :subtitle="`ID: ${cliente?.contato_id || ''}`"
    size="md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <form class="p-5 space-y-5" @submit.prevent="handleSave">
      <!-- Basic Info Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput
          id="cliente-edit-nome"
          label="Nome"
          placeholder="Nome completo"
          v-model="form.nome"
        />
        <BaseInput
          id="cliente-edit-nome-social"
          label="Nome Social"
          placeholder="Nome social (opcional)"
          v-model="form.nome_social"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BaseInput
          id="cliente-edit-data"
          label="Data de Nascimento"
          type="date"
          v-model="form.data_nascimento"
        />
        <div class="space-y-1.5">
          <label for="cliente-edit-sentimento" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 block">
            Sentimento
          </label>
          <select
            id="cliente-edit-sentimento"
            v-model="form.sentimento"
            class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Selecione</option>
            <option value="positivo">Positivo</option>
            <option value="neutro">Neutro</option>
            <option value="negativo">Negativo</option>
          </select>
        </div>
        <div class="space-y-1.5">
          <label for="cliente-edit-urgencia" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 block">
            Urgência
          </label>
          <select
            id="cliente-edit-urgencia"
            v-model="form.urgencia"
            class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Selecione</option>
            <option value="alta">Alta</option>
            <option value="média">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
      </div>

      <BaseInput
        id="cliente-edit-fase"
        label="Fase da Obra"
        placeholder="Ex: Planejamento, Execução, Finalização"
        v-model="form.fase_obra"
      />

      <!-- Textarea Fields -->
      <div class="space-y-1.5">
        <label for="cliente-edit-resumo" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 block">
          Resumo do Perfil
        </label>
        <textarea
          id="cliente-edit-resumo"
          v-model="form.resumo_perfil"
          rows="3"
          class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none"
          placeholder="Breve descrição do perfil do cliente"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="cliente-edit-interesses" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 block">
            Interesses
          </label>
          <textarea
            id="cliente-edit-interesses"
            v-model="form.interesses"
            rows="2"
            class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none"
            placeholder="Separados por vírgula"
          />
        </div>
        <div class="space-y-1.5">
          <label for="cliente-edit-objeccoes" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 block">
            Objeções
          </label>
          <textarea
            id="cliente-edit-objeccoes"
            v-model="form.objeccoes"
            rows="2"
            class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none"
            placeholder="Separadas por vírgula"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="cliente-edit-compras" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 block">
          Compras do Cliente
        </label>
        <textarea
          id="cliente-edit-compras"
          v-model="form.compras_cliente"
          rows="2"
          class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none"
          placeholder="Separadas por vírgula"
        />
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
        {{ error }}
      </div>
    </form>

    <!-- Footer -->
    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <BaseButton variant="ghost" size="md" @click="close" class="w-full sm:w-auto">
          Cancelar
        </BaseButton>
        <BaseButton variant="primary" size="md" :disabled="loading" @click="handleSave" class="w-full sm:w-auto">
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </BaseButton>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, watch } from '#imports'
import type { CrmEvastur } from '~~/shared/types/CrmEvastur'
import { useClientes } from '~/composables/useClientes'
import ModalBase from '~/components/ModalBase.vue'
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
  const items = value.split(',').map(item => item.trim()).filter(Boolean)
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
    error.value = ''
    fillForm()
  }
})
</script>
