<template>
  <div class="flex" :class="isOutgoing ? 'justify-end' : 'justify-start'">
    <div class="max-w-[75%]">
      <div 
        class="rounded-2xl px-4 py-2 shadow-sm"
        :class="isOutgoing 
          ? 'bg-primary text-white rounded-br-sm' 
          : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'"
      >
        <p class="text-sm leading-relaxed whitespace-pre-wrap break-words">{{ message.mensagem }}</p>
      </div>
      <div class="flex items-center gap-2 mt-1 px-2" :class="isOutgoing ? 'justify-end' : 'justify-start'">
        <span class="text-xs text-gray-400">{{ senderName }}</span>
        <span class="text-xs text-gray-400">•</span>
        <span class="text-xs text-gray-400">{{ formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'
import type { HistoricoMsg } from '~~/shared/types/HistoricoMsg'

const props = defineProps<{
  message: HistoricoMsg
}>()

const isOutgoing = computed(() => props.message.message_type === 'outgoing')

const senderName = computed(() => {
  return props.message.sender_name || props.message.contact_name || 'Desconhecido'
})

const formattedTime = computed(() => {
  const date = new Date(props.message.created_at)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>
