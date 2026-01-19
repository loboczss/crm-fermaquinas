<template>
  <SurfaceCard padding="none" rounded="lg" class="flex flex-col h-full bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border border-gray-100 overflow-hidden relative min-h-[160px]">
    
    <!-- Top colored bar (aesthetic) -->
    <div class="h-1 w-full bg-gradient-to-r from-gray-100 to-gray-50 group-hover:from-primary/40 group-hover:to-primary/10 transition-all duration-300"></div>

    <div class="p-4 flex flex-col h-full justify-between gap-3">
      <!-- Header: Value + Status/Icon -->
      <div class="flex justify-between items-start">
        <div class="flex flex-col">
            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Valor Venda</span>
            <span class="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {{ formatCurrency(venda.valor_venda) }}
            </span>
        </div>
        <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
        </div>
      </div>

      <!-- Content: Customer Info -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
           <span class="text-sm font-medium text-gray-700 truncate min-w-0" :title="venda.contact_name">
             {{ venda.contact_name || 'Cliente (Sem nome)' }}
           </span>
        </div>
        <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
           <span class="text-xs text-gray-500">
             {{ formatDate(venda.created_at) }}
           </span>
        </div>
        
        <div v-if="venda.vendedor" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="text-xs text-gray-500 truncate">
               {{ venda.vendedor }}
            </span>
        </div>
      </div>

       <!-- Action Area (Implicit Action) -->
       <div class="mt-auto pt-2 border-t border-gray-50">
           <button 
                class="w-full text-xs font-semibold text-primary hover:text-primary-dark uppercase tracking-wide flex items-center justify-center gap-1 group/btn py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading"
                @click="$emit('view', venda.contato_id)"
            >
                <span v-if="loading">Carregando...</span>
                <span v-else class="flex items-center gap-1">
                  Ver Detalhes
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </span>
           </button>
       </div>
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
// formatCurrency and formatDate are auto-imported

// If utils are auto-imported in Nuxt, the above might not be strictly needed as import but good practice or just rely on global.
// Given strict TS context, better to expect them to be available or imported if they are utils.
// The previous file used them directly, so they are likely auto-imported composables/utils.

defineProps<{
  venda: any // Replace 'any' with proper type if available, e.g. Venda
  loading?: boolean
}>()

defineEmits<{
  (e: 'view', id: string): void
}>()
</script>
