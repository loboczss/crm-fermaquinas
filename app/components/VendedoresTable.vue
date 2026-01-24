<template>
  <SurfaceCard>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Ranking de Vendedores - Histórico</h3>
          <p class="text-sm text-gray-500 mt-1">Estatísticas de vendas e atendimentos</p>
        </div>
      </div>
      <BaseButton
        @click="refreshData"
        :disabled="loading"
        variant="outline"
        size="sm"
        class="flex items-center gap-2"
      >
        <IconActivity class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        Atualizar
      </BaseButton>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3 text-gray-500">
        <IconActivity class="w-5 h-5 animate-spin" />
        <span>Carregando ranking...</span>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-red-700">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium">Erro ao carregar dados</span>
      </div>
      <p class="text-red-600 text-sm mt-1">{{ error }}</p>
    </div>

    <div v-else-if="vendedores.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-gray-500">Nenhum vendedor encontrado</p>
    </div>

    <div v-else class="bg-gray-50 rounded-lg p-3 md:p-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <!-- Tabela com Scroll Horizontal Mobile -->
        <div class="overflow-x-auto">
          <div class="min-w-[700px]"> <!-- Força largura mínima para evitar esmagamento -->
            <!-- Header da tabela -->
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <div class="grid grid-cols-5 gap-4 text-xs md:text-sm font-semibold text-gray-600">
                <div class="text-center w-10">#</div>
                <div>Vendedor</div>
                <div class="text-center">Vendas</div>
                <div class="text-center">Valor Total</div>
                <div class="text-center">Clientes At</div>
              </div>
            </div>

            <!-- Linhas da tabela -->
            <div class="divide-y divide-gray-100">
              <div 
                v-for="vendedor in vendedores" 
                :key="vendedor.nome"
                class="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div class="grid grid-cols-5 gap-4 items-center">
                  <!-- Posição com medalha -->
                  <div class="text-center w-10">
                    <div v-if="vendedor.posicao <= 3" class="flex items-center justify-center">
                      <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold"
                           :class="{
                             'bg-yellow-500': vendedor.posicao === 1,
                             'bg-gray-400': vendedor.posicao === 2,
                             'bg-orange-600': vendedor.posicao === 3
                           }">
                        <svg v-if="vendedor.posicao === 1" class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span v-else>{{ vendedor.posicao }}</span>
                      </div>
                    </div>
                    <div v-else class="text-base md:text-lg font-semibold text-gray-700">
                      {{ vendedor.posicao }}
                    </div>
                  </div>

                  <!-- Nome do vendedor -->
                  <div class="truncate pr-2">
                    <p class="font-semibold text-gray-900 text-sm md:text-base truncate">{{ vendedor.nome }}</p>
                  </div>

                  <!-- Vendas -->
                  <div class="text-center">
                    <span class="text-sm md:text-lg font-semibold text-gray-900">{{ vendedor.vendas }}</span>
                  </div>

                  <!-- Faturamento -->
                  <div class="text-center">
                    <span class="text-xs md:text-sm font-medium text-gray-700 bg-green-50 px-2 py-1 rounded text-green-700 border border-green-100 whitespace-nowrap">
                      {{ formatCurrency(vendedor.faturamento) }}
                    </span>
                  </div>

                  <!-- Clientes atendidos -->
                  <div class="text-center">
                    <span class="inline-flex items-center justify-center w-auto min-w-[2rem] px-2 h-6 md:h-8 bg-gray-100 rounded-full text-xs md:text-sm font-semibold text-gray-700">
                      {{ vendedor.clientesAtendidos }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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