<template>
  <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
    <div class="px-5 py-4 border-b border-gray-50">
      <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ title }}</h4>
    </div>
    <div :class="['p-5', contentClass]">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  contentClass?: string
}>()
</script>
