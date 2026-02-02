<template>
  <PageShell title="Central de Analytics" subtitle="Monitore performance, leads e conversão em tempo real">
    <template #actions>
      <div class="hidden md:flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-full border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div class="px-3 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          SISTEMA ONLINE
        </div>
      </div>
    </template>

    <div class="space-y-8 animate-fade-in">
      <!-- Seção Principal: Gráficos e Métricas -->
      <div class="grid grid-cols-1 gap-8">
        <AtendimentosChartPerfect />
      </div>
      
      <!-- Seção Secundária: Ranking e Extras -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div class="lg:col-span-2">
          <VendedoresTable />
        </div>
        
        <div class="lg:col-span-1">
          <SurfaceCard glass class="h-full flex flex-col justify-center items-center text-center p-8 animate-slide-up" style="animation-delay: 0.4s">
            <div class="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-3 tracking-tight">Novos Insights</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              Nossa IA está processando novos padrões de comportamento para seus próximos relatórios.
            </p>
            <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="w-2/3 h-full bg-primary animate-pulse"></div>
            </div>
            <p class="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">Processando Atividade...</p>
          </SurfaceCard>
        </div>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import PageShell from '~/components/PageShell.vue'
import SurfaceCard from '~/components/SurfaceCard.vue'
import VendedoresTable from '~/components/VendedoresTable.vue'
import AtendimentosChartPerfect from '~/components/AtendimentosChartPerfect.vue'
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
