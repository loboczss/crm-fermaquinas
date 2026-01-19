<template>
  <PageShell title="Meu Perfil" subtitle="Gerencie suas informações pessoais e configurações de conta" maxWidth="lg">
    <div class="space-y-6">
      <!-- Card de Informações Básicas -->
      <SurfaceCard padding="lg">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
              <p class="text-sm text-gray-500 mt-1">Atualize seu nome e informações de perfil</p>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">Nome completo</label>
              <div class="mt-2 flex gap-3">
                <input
                  v-model="displayName"
                  type="text"
                  class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white"
                  :disabled="!editingName"
                />
                <BaseButton
                  v-if="!editingName"
                  variant="outline"
                  size="md"
                  @click="editingName = true"
                >
                  Editar
                </BaseButton>
                <div v-else class="flex gap-2">
                  <BaseButton
                    variant="primary"
                    size="md"
                    @click="updateName"
                    :disabled="loadingName"
                  >
                    {{ loadingName ? 'Salvando...' : 'Salvar' }}
                  </BaseButton>
                  <BaseButton
                    variant="ghost"
                    size="md"
                    @click="cancelEditName"
                  >
                    Cancelar
                  </BaseButton>
                </div>
              </div>
            </div>

            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">E-mail</label>
              <div class="mt-2 flex gap-3">
                <input
                  v-model="displayEmail"
                  type="email"
                  class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white"
                  :disabled="!editingEmail"
                />
                <BaseButton
                  v-if="!editingEmail"
                  variant="outline"
                  size="md"
                  @click="editingEmail = true"
                >
                  Editar
                </BaseButton>
                <div v-else class="flex gap-2">
                  <BaseButton
                    variant="primary"
                    size="md"
                    @click="updateEmail"
                    :disabled="loadingEmail"
                  >
                    {{ loadingEmail ? 'Salvando...' : 'Salvar' }}
                  </BaseButton>
                  <BaseButton
                    variant="ghost"
                    size="md"
                    @click="cancelEditEmail"
                  >
                    Cancelar
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
      </SurfaceCard>

      <!-- Card de Segurança -->
      <SurfaceCard padding="lg">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Segurança</h2>
            <p class="text-sm text-gray-500 mt-1">Atualize sua senha para manter sua conta segura</p>
          </div>

          <div class="space-y-4">
            <InputPassword
              id="currentPassword"
              label="Senha atual"
              placeholder="Digite sua senha atual"
              v-model="currentPassword"
            />

            <InputPassword
              id="newPassword"
              label="Nova senha"
              placeholder="Digite sua nova senha"
              v-model="newPassword"
            />

            <InputPassword
              id="confirmPassword"
              label="Confirmar nova senha"
              placeholder="Confirme sua nova senha"
              v-model="confirmPassword"
            />

            <div class="pt-2">
              <BaseButton
                variant="primary"
                size="md"
                @click="updatePassword"
                :disabled="loadingPassword || !currentPassword || !newPassword || !confirmPassword"
              >
                {{ loadingPassword ? 'Enviando confirmação...' : 'Alterar Senha' }}
              </BaseButton>
            </div>
          </div>
      </SurfaceCard>
    </div>

    <AlertModal
      v-model="showSuccessModal"
      :title="successTitle"
      :message="successMessage"
      button-text="Ok, entendi"
    />

    <AlertModal
      v-model="showErrorModal"
      title="Erro"
      :message="errorMessage"
      button-text="Fechar"
    />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import BaseButton from '~/components/BaseButton.vue'
import InputPassword from '~/components/InputPassword.vue'
import AlertModal from '~/components/AlertModal.vue'
import PageShell from '~/components/PageShell.vue'
import SurfaceCard from '~/components/SurfaceCard.vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const editingName = ref(false)
const editingEmail = ref(false)
const loadingName = ref(false)
const loadingEmail = ref(false)
const loadingPassword = ref(false)

const displayName = ref(user.value?.user_metadata?.name || '')
const displayEmail = ref(user.value?.email || '')
const originalName = ref(user.value?.user_metadata?.name || '')
const originalEmail = ref(user.value?.email || '')

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const successTitle = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const cancelEditName = () => {
  displayName.value = originalName.value
  editingName.value = false
}

const cancelEditEmail = () => {
  displayEmail.value = originalEmail.value
  editingEmail.value = false
}

const updateName = async () => {
  try {
    loadingName.value = true
    const { error } = await supabase.auth.updateUser({
      data: { name: displayName.value }
    })

    if (error) throw error

    originalName.value = displayName.value
    editingName.value = false
    successTitle.value = 'Nome atualizado!'
    successMessage.value = 'Seu nome foi atualizado com sucesso.'
    showSuccessModal.value = true
  } catch (error: any) {
    errorMessage.value = error.message || 'Erro ao atualizar nome.'
    showErrorModal.value = true
  } finally {
    loadingName.value = false
  }
}

const updateEmail = async () => {
  try {
    loadingEmail.value = true
    const { error } = await supabase.auth.updateUser({
      email: displayEmail.value
    })

    if (error) throw error

    originalEmail.value = displayEmail.value
    editingEmail.value = false
    successTitle.value = 'E-mail atualizado!'
    successMessage.value = 'Enviamos um e-mail de confirmação para o novo endereço. Verifique sua caixa de entrada.'
    showSuccessModal.value = true
  } catch (error: any) {
    errorMessage.value = error.message || 'Erro ao atualizar e-mail.'
    showErrorModal.value = true
  } finally {
    loadingEmail.value = false
  }
}

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.'
    showErrorModal.value = true
    return
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'A senha deve ter pelo menos 6 caracteres.'
    showErrorModal.value = true
    return
  }

  if (!currentPassword.value) {
    errorMessage.value = 'Por favor, digite sua senha atual.'
    showErrorModal.value = true
    return
  }

  try {
    loadingPassword.value = true
    
    // Verificar senha atual fazendo reauthentication
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.value?.email || '',
      password: currentPassword.value
    })

    if (signInError) {
      throw new Error('Senha atual incorreta.')
    }

    // Atualizar senha imediatamente após validação
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (error) throw error

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    successTitle.value = 'Senha atualizada!'
    successMessage.value = 'Sua senha foi alterada com sucesso. Use a nova senha no próximo login.'
    showSuccessModal.value = true
  } catch (error: any) {
    errorMessage.value = error.message || 'Erro ao atualizar senha.'
    showErrorModal.value = true
  } finally {
    loadingPassword.value = false
  }
}
</script>
