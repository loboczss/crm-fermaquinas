<template>
  <div class="space-y-1">
    <dt class="text-[11px] font-medium uppercase tracking-wider text-gray-400">{{ label }}</dt>
    <dd class="text-sm text-gray-900">
      <slot>{{ value || '-' }}</slot>
    </dd>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string | number | null
}>()
</script>
