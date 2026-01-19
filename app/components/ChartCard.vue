<template>
  <SurfaceCard padding="none" rounded="lg" class="border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide">{{ title }}</h3>
        <p v-if="subtitle" class="text-xs text-gray-400 mt-0.5">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.filters" class="flex items-center gap-2 flex-wrap">
        <slot name="filters" />
      </div>
    </div>
    
    <!-- Chart Content -->
    <div class="p-5 flex flex-col gap-4" :style="{ minHeight: `${height}px` }">
      <div v-if="$slots.summary" class="bg-gray-50/50 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <slot name="summary" />
      </div>
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
import SurfaceCard from './SurfaceCard.vue'

defineProps<{
  title: string
  subtitle?: string
  height?: number
}>()
</script>
