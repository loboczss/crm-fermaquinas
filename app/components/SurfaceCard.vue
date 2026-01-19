<template>
  <div :class="['bg-white border border-gray-100 shadow-sm', roundedClass, paddingClass]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'

const props = withDefaults(defineProps<{
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'md' | 'lg' | 'xl'
}>(), {
  padding: 'md',
  rounded: 'xl'
})

const paddingClass = computed(() => {
  if (props.padding === 'none') return 'p-0'
  if (props.padding === 'sm') return 'p-4'
  if (props.padding === 'lg') return 'p-8'
  return 'p-6'
})

const roundedClass = computed(() => {
  if (props.rounded === 'md') return 'rounded-lg'
  if (props.rounded === 'lg') return 'rounded-xl'
  return 'rounded-2xl'
})
</script>
