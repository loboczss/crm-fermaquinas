<template>
  <div class="space-y-2">
    <h4 class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{{ title }}</h4>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
