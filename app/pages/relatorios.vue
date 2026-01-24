<template>
  <PageShell title="Relatórios e Análises" subtitle="Insights e métricas do sistema">
    <div class="space-y-6">
      <!-- Gráfico de Atendimentos -->
      <AtendimentosChartPerfect />
      
      <!-- Tabela de Vendedores -->
      <VendedoresTable />
      
      <!-- Placeholder para outros relatórios -->
      <SurfaceCard>
        <div class="text-center py-8">
          <div class="text-gray-400 mb-3">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Mais relatórios em breve</h3>
          <p class="text-gray-500">Novos insights e análises serão adicionados aqui.</p>
        </div>
      </SurfaceCard>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import PageShell from '~/components/PageShell.vue'
import SurfaceCard from '~/components/SurfaceCard.vue'
import VendedoresTable from '~/components/VendedoresTable.vue'
import AtendimentosChartPerfect from '~/components/AtendimentosChartPerfect.vue'
</script>
