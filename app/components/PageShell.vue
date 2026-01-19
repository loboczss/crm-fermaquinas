<template>
  <div class="min-h-screen bg-gray-50/50">
    <div class="container mx-auto px-6 py-12" :class="maxWidthClass">
      <div v-if="title || subtitle || $slots.actions" class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 v-if="title" class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
          <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.actions" class="flex items-center gap-2">
          <slot name="actions" />
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  maxWidth?: 'full' | 'lg' | 'xl'
}>(), {
  maxWidth: 'full'
})

const maxWidthClass = computed(() => {
  if (props.maxWidth === 'lg') return 'max-w-5xl'
  if (props.maxWidth === 'xl') return 'max-w-6xl'
  return ''
})
</script>
