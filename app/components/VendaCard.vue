<template>
  <SurfaceCard padding="none" rounded="lg" class="flex flex-col h-full bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border border-gray-100 overflow-hidden relative min-h-[200px]">
    
    <!-- Top colored bar with status-based gradient -->
    <div 
      :class="[
        'h-1 w-full transition-all duration-300',
        getStatusGradient(venda.status)
      ]"
    ></div>

    <div class="p-4 flex flex-col h-full justify-between gap-3">
      <!-- Header: Value + Status Badge -->
      <div class="flex justify-between items-start gap-2">
        <div class="flex flex-col flex-1 min-w-0">
            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Valor Venda</span>
            <span class="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                {{ formatCurrency(venda.valor_venda) }}
            </span>
        </div>
        <div v-if="venda.status" class="shrink-0">
          <span 
            :class="[
              'text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full',
              getStatusBadgeClass(venda.status)
            ]"
          >
            {{ venda.status }}
          </span>
        </div>
      </div>

      <!-- Content: Customer Info + New Fields -->
      <div class="space-y-2 flex-1">
        <div class="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
           <span class="text-sm font-medium text-gray-700 truncate min-w-0" :title="venda.contact_name || undefined">
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

        <!-- New: Tipo de Venda -->
        <div v-if="venda.tipo_venda" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span class="text-xs text-gray-500 truncate">
               {{ venda.tipo_venda }}
            </span>
        </div>


        <!-- New: Embarque with formatted date -->
        <div v-if="venda.embarque" class="flex items-center gap-2 bg-primary/5 -mx-1 px-2 py-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
              <path d="M12 3v6"/>
            </svg>
            <div class="flex flex-col flex-1">
              <span class="text-[9px] font-bold uppercase tracking-wider text-primary/60">Embarque</span>
              <span class="text-xs text-primary font-bold">
                {{ formatDate(venda.embarque) }}
              </span>
            </div>
        </div>

        <!-- New: Fornecedor -->
        <div v-if="venda.fornecedor" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
              <path d="M9 22v-4h6v4"/>
              <path d="M8 6h.01"/>
              <path d="M16 6h.01"/>
              <path d="M8 10h.01"/>
              <path d="M16 10h.01"/>
              <path d="M8 14h.01"/>
              <path d="M16 14h.01"/>
            </svg>
            <span class="text-xs text-gray-500 truncate">
               {{ venda.fornecedor }}
            </span>
        </div>
      </div>

       <!-- Action Area -->
       <div class="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between px-1">
           <button 
                class="flex-1 text-[10px] font-bold text-primary hover:bg-primary/5 uppercase tracking-tight py-2 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                :disabled="loading"
                @click="$emit('view', venda.contato_id)"
                title="Ver detalhes do cliente"
            >
                <span v-if="loading">...</span>
                <span v-else>Ver</span>
           </button>
           <div class="w-px h-4 bg-gray-100 mx-1"></div>
           <button 
                class="flex-1 text-[10px] font-bold text-gray-500 hover:bg-gray-50 uppercase tracking-tight py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                @click="$emit('edit', venda)"
                title="Editar venda"
            >
                <span>Editar</span>
           </button>
           <div class="w-px h-4 bg-gray-100 mx-1"></div>
           <button 
                class="flex-1 text-[10px] font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 uppercase tracking-tight py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                @click="$emit('delete', venda.id)"
                title="Excluir venda"
            >
                <span>Excluir</span>
           </button>
       </div>
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
import type { HistoricoVenda } from '~~/shared/types/HistoricoVenda'

defineProps<{
  venda: HistoricoVenda
  loading?: boolean
}>()

defineEmits<{
  (e: 'view', id: string): void
  (e: 'edit', venda: HistoricoVenda): void
  (e: 'delete', id: number): void
}>()

const getStatusGradient = (status: string | null): string => {
  if (!status) return 'bg-gradient-to-r from-gray-100 to-gray-50 group-hover:from-primary/40 group-hover:to-primary/10'
  
  const s = status.toLowerCase()
  if (s.includes('aprovado') || s.includes('pago') || s.includes('concluído')) {
    return 'bg-gradient-to-r from-green-400 to-emerald-300'
  }
  if (s.includes('pendente') || s.includes('aguardando')) {
    return 'bg-gradient-to-r from-yellow-400 to-amber-300'
  }
  if (s.includes('cancelado') || s.includes('rejeitado')) {
    return 'bg-gradient-to-r from-red-400 to-rose-300'
  }
  return 'bg-gradient-to-r from-primary to-blue-400'
}

const getStatusBadgeClass = (status: string | null): string => {
  if (!status) return 'bg-gray-100 text-gray-600'
  
  const s = status.toLowerCase()
  if (s.includes('aprovado') || s.includes('pago') || s.includes('concluído')) {
    return 'bg-green-100 text-green-700'
  }
  if (s.includes('pendente') || s.includes('aguardando')) {
    return 'bg-yellow-100 text-yellow-700'
  }
  if (s.includes('cancelado') || s.includes('rejeitado')) {
    return 'bg-red-100 text-red-700'
  }
  return 'bg-primary/10 text-primary'
}
</script>
