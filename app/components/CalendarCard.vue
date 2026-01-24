<template>
  <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', iconBgClass]">
            <slot name="icon"></slot>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">{{ title }}</h3>
            <p v-if="subtitle" class="text-[11px] text-gray-500 mt-0.5">{{ subtitle }}</p>
          </div>
        </div>
        <slot name="action"></slot>
      </div>
    </div>

    <!-- Content -->
    <div :class="['p-4', contentClass]">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  iconBgClass?: string
  contentClass?: string
}>()
</script>
