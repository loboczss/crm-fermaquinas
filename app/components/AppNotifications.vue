<template>
  <div class="relative" id="app-notifications">
    <!-- Combined Notification Bell -->
    <button 
      @click.stop="toggleDropdown"
      class="p-2.5 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 relative group active:scale-95"
      aria-label="Notificações"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="w-6 h-6 transition-transform group-hover:rotate-12" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      
      <span 
        v-if="totalNotifications > 0"
        class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white animate-pulse"
      >
        {{ totalNotifications }}
      </span>
    </button>

    <!-- Unified Dropdown -->
    <div 
      v-if="isOpen" 
      v-click-outside="closeDropdown"
      class="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-primary/5">
        <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
          <span class="text-primary text-xl">🔔</span>
          Central de Avisos
        </h3>
        <span class="text-[10px] font-bold uppercase tracking-widest text-primary/60">
          {{ todayDateFormatted }}
        </span>
      </div>

      <div class="max-h-[480px] overflow-y-auto">
        <!-- Loading State -->
        <div v-if="loadingBirthdays || loadingEmbarques" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p class="text-xs text-gray-500 font-medium">Atualizando...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="totalNotifications === 0" class="p-10 text-center">
          <div class="text-4xl mb-4 grayscale">✨</div>
          <p class="text-sm text-gray-500 font-medium">Tudo em dia!</p>
          <p class="text-[10px] text-gray-400 mt-1">Nenhum evento para hoje ou amanhã.</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <!-- Section: Birthdays -->
          <div v-if="birthdaysToday.length > 0">
            <div class="px-5 py-2 bg-yellow-50/50 text-[10px] font-bold text-yellow-700 uppercase tracking-widest flex items-center gap-2">
              <span>🎂</span> Aniversariantes
            </div>
            <div 
              v-for="birthday in birthdaysToday" 
              :key="birthday.id" 
              class="px-5 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div class="flex items-center justify-between">
                <div class="min-w-0 pr-2">
                  <p class="text-sm font-bold text-gray-900 truncate">
                    {{ birthday.nome || birthday.nome_social || 'Sem nome' }}
                  </p>
                  <p class="text-[10px] text-gray-400 font-medium">Hoje é o dia!</p>
                </div>
                <BaseButton 
                  variant="primary" 
                  size="sm" 
                  class="!px-3 !py-1.5 !text-[10px] !rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                  @click="parabenizar(birthday)"
                >
                  Parabenizar
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Section: Embarques Hoje -->
          <div v-if="embarquesHoje.length > 0">
            <div class="px-5 py-2 bg-blue-50/50 text-[10px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
              <span>✈️</span> Embarques de Hoje
            </div>
            <div 
              v-for="embarque in embarquesHoje" 
              :key="embarque.id" 
              class="px-5 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div class="flex items-center justify-between">
                <div class="min-w-0 pr-2">
                  <p class="text-sm font-bold text-gray-900 truncate">
                    {{ embarque.contact_name || 'Sem nome' }}
                  </p>
                  <p class="text-[10px] text-gray-400 font-medium">{{ embarque.fornecedor || 'Sem fornecedor' }}</p>
                </div>
                <div class="flex items-center gap-1">
                  <BaseButton 
                    variant="outline" 
                    size="sm" 
                    class="!px-3 !py-1.5 !text-[10px] !rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    @click="viewDetails(embarque.contato_id)"
                  >
                    Ver
                  </BaseButton>
                  <BaseButton 
                    variant="primary" 
                    size="sm" 
                    class="!px-3 !py-1.5 !text-[10px] !rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    @click="avisarEmbarque(embarque)"
                  >
                    Avisar Zap
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Embarques Amanhã -->
          <div v-if="embarquesAmanha.length > 0">
            <div class="px-5 py-2 bg-primary/5 text-[10px] font-bold text-primary/60 uppercase tracking-widest flex items-center gap-2">
              <span>📦</span> Embarques de Amanhã
            </div>
            <div 
              v-for="embarque in embarquesAmanha" 
              :key="embarque.id" 
              class="px-5 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div class="flex items-center justify-between">
                <div class="min-w-0 pr-2">
                  <p class="text-sm font-bold text-gray-900 truncate">
                    {{ embarque.contact_name || 'Sem nome' }}
                  </p>
                  <p class="text-[10px] text-gray-400 font-medium">{{ embarque.fornecedor || 'Sem fornecedor' }}</p>
                </div>
                <div class="flex items-center gap-1">
                  <BaseButton 
                    variant="outline" 
                    size="sm" 
                    class="!px-3 !py-1.5 !text-[10px] !rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    @click="viewDetails(embarque.contato_id)"
                  >
                    Ver
                  </BaseButton>
                  <BaseButton 
                    variant="primary" 
                    size="sm" 
                    class="!px-3 !py-1.5 !text-[10px] !rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    @click="avisarEmbarque(embarque)"
                  >
                    Avisar Zap
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
        <NuxtLink 
          to="/calendario" 
          @click="isOpen = false"
          class="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
        >
          Ver Calendário
        </NuxtLink>
        <NuxtLink 
          to="/vendas" 
          @click="isOpen = false"
          class="text-[10px] font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
        >
          Todas as Vendas
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, navigateTo } from '#imports'
import { useBirthdays } from '~/composables/useBirthdays'
import { useEmbarques } from '~/composables/useEmbarques'
import { useCalendario } from '~/composables/useCalendario'
import BaseButton from './BaseButton.vue'

const { birthdaysToday, loading: loadingBirthdays, fetchBirthdaysToday } = useBirthdays()
const { upcomingEmbarques, loading: loadingEmbarques, fetchUpcomingEmbarques, triggerWebhook: triggerEmbarqueWebhook } = useEmbarques()
const { triggerWebhook: triggerBirthdayWebhook } = useCalendario()

const isOpen = ref(false)

const totalNotifications = computed(() => {
  return birthdaysToday.value.length + upcomingEmbarques.value.length
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    fetchBirthdaysToday()
    fetchUpcomingEmbarques()
  }
}

const closeDropdown = () => {
  isOpen.value = false
}

const todayDateFormatted = computed(() => {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(new Date())
})

const embarquesHoje = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const today = `${year}-${month}-${day}`
  return upcomingEmbarques.value.filter(e => e.embarque?.startsWith(today))
})

const embarquesAmanha = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const year = tomorrow.getFullYear()
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const day = String(tomorrow.getDate()).padStart(2, '0')
  const tomorrowStr = `${year}-${month}-${day}`
  return upcomingEmbarques.value.filter(e => e.embarque?.startsWith(tomorrowStr))
})

const viewDetails = (contatoId: string | null) => {
  if (!contatoId) return
  navigateTo(`/clientes?search=${contatoId}`)
  isOpen.value = false
}

const parabenizar = async (person: any) => {
  try {
    const nome = person.nome || person.nome_social || 'Sem nome'
    const dia_aniversario = person.data_nascimento || ''
    const contato_id = person.contato_id || 'unknown'
    
    await triggerBirthdayWebhook(nome, dia_aniversario, contato_id)
    alert(`Mensagem enviada para ${nome}!`)
  } catch (e) {
    console.error(e)
    alert('Erro ao enviar mensagem.')
  }
}

const avisarEmbarque = async (embarque: any) => {
  try {
    const nome = embarque.contact_name || 'Sem nome'
    const data_embarque = embarque.embarque || ''
    const observacoes = [embarque.obs_pendencias, embarque.observacao, embarque.fornecedor].filter(Boolean).join(' | ')
    
    await triggerEmbarqueWebhook(nome, data_embarque, observacoes)
    alert(`Alerta de embarque enviado para ${nome}!`)
  } catch (e) {
    console.error(e)
    alert('Erro ao enviar alerta.')
  }
}
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
