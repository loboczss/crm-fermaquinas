<template>
  <SurfaceCard glass class="animate-slide-up" style="animation-delay: 0.2s">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 tracking-tight">Elite de Vendas</h3>
          <p class="text-xs font-medium text-gray-500 uppercase tracking-widest mt-0.5">Performance Geral Vitalícia</p>
        </div>
      </div>
      <BaseButton
        @click="refreshData"
        :disabled="loading"
        variant="outline"
        size="sm"
        class="!rounded-full px-4 border-gray-200 hover:bg-gray-50 group"
      >
        <IconActivity class="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-500" :class="{ 'animate-spin': loading }" />
        <span class="ml-2 font-semibold text-gray-700">Recarregar</span>
      </BaseButton>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
      <span class="text-sm font-medium text-gray-500">Compilando ranking...</span>
    </div>

    <div v-else-if="error" class="bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-2xl p-6 text-center">
      <div class="inline-flex p-3 bg-red-100 rounded-full mb-3">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h4 class="font-bold text-red-900">Erro de Sincronização</h4>
      <p class="text-red-600 text-sm mt-1">{{ error }}</p>
    </div>

    <div v-else-if="vendedores.length === 0" class="text-center py-20">
      <div class="mb-4 opacity-20">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-gray-400 font-medium">Aguardando primeiros dados de performance...</p>
    </div>

    <div v-else class="relative overflow-hidden">
      <!-- Gradient overlay for scroll indicator -->
      <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/50 to-transparent pointer-events-none z-10 md:hidden"></div>
      
      <div class="overflow-x-auto pb-4 custom-scrollbar">
        <table class="w-full min-w-[700px] border-separate border-spacing-y-2">
          <thead>
            <tr class="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4">
              <th class="pb-4 pl-4 text-center w-16 uppercase">Ranking</th>
              <th class="pb-4 pl-4 uppercase">Vendedor</th>
              <th class="pb-4 text-center uppercase">Vendas</th>
              <th class="pb-4 text-center uppercase">Volume</th>
              <th class="pb-4 pr-4 text-center uppercase">Alcance</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="vendedor in vendedores" 
              :key="vendedor.nome"
              class="group hover:bg-white transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl hover:shadow-gray-200/50"
            >
              <!-- Posição -->
              <td class="py-4 pl-4 bg-gray-50/50 group-hover:bg-white rounded-l-2xl border-y border-l border-transparent group-hover:border-gray-100 transition-colors">
                <div class="flex items-center justify-center">
                  <div v-if="vendedor.posicao <= 3" class="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform"
                       :class="{
                         'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-yellow-200': vendedor.posicao === 1,
                         'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 shadow-slate-200': vendedor.posicao === 2,
                         'bg-gradient-to-br from-orange-400 via-orange-600 to-orange-700 shadow-orange-200': vendedor.posicao === 3
                       }">
                    <svg v-if="vendedor.posicao === 1" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span v-else class="text-sm font-black">{{ vendedor.posicao }}</span>
                  </div>
                  <div v-else class="text-lg font-black text-gray-300 group-hover:text-gray-900 transition-colors">
                    {{ vendedor.posicao }}
                  </div>
                </div>
              </td>

              <!-- Nome -->
              <td class="py-4 pl-4 bg-gray-50/50 group-hover:bg-white border-y border-transparent group-hover:border-gray-100 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary font-bold shadow-sm">
                    {{ vendedor.nome.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 leading-none mb-1">{{ vendedor.nome }}</p>
                    <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-tighter">Vendedor Certificado</p>
                  </div>
                </div>
              </td>

              <!-- Vendas -->
              <td class="py-4 text-center bg-gray-50/50 group-hover:bg-white border-y border-transparent group-hover:border-gray-100 transition-colors">
                <span class="text-xl font-black text-gray-900">{{ vendedor.vendas }}</span>
              </td>

              <!-- Faturamento -->
              <td class="py-4 text-center bg-gray-50/50 group-hover:bg-white border-y border-transparent group-hover:border-gray-100 transition-colors">
                <span class="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-lg border border-green-100 shadow-sm shadow-green-100/50">
                  {{ formatCurrency(vendedor.faturamento) }}
                </span>
              </td>

              <!-- Clientes -->
              <td class="py-4 pr-4 bg-gray-50/50 group-hover:bg-white rounded-r-2xl border-y border-r border-transparent group-hover:border-gray-100 transition-colors text-center">
                <span class="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 017 7v1H1s0-1 1-7a7 7 0 017-7z" />
                  </svg>
                  {{ vendedor.clientesAtendidos }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
import { onMounted } from '#imports'
import SurfaceCard from './SurfaceCard.vue'
import BaseButton from './BaseButton.vue'
import IconActivity from './IconActivity.vue'
import { useVendedores } from '~/composables/useVendedores'
import { formatCurrency } from '~/utils/formatters'

const { vendedores, loading, error, fetchVendedoresRanking } = useVendedores()

const refreshData = () => {
  fetchVendedoresRanking()
}

onMounted(() => {
  fetchVendedoresRanking()
})
</script>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
