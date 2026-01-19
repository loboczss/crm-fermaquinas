<template>
  <SurfaceCard padding="sm" rounded="lg" class="flex items-center gap-4 h-full transition-all duration-200 hover:shadow-md border border-gray-100">
    <div 
      class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
      :class="[colorBg, colorText]"
    >
      <slot name="icon">
        <!-- Default fallback icon if needed -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </slot>
    </div>
    
    <div class="flex flex-col">
      <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 leading-tight">{{ title }}</p>
      <p class="text-lg font-bold text-gray-900 leading-tight mt-0.5">{{ value }}</p>
    </div>
  </SurfaceCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  value: string | number
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'
}>()

const variantClasses: Record<string, { bg: string, text: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  danger: { bg: 'bg-red-500/10', text: 'text-red-600' },
  neutral: { bg: 'bg-gray-100', text: 'text-gray-600' }
}

const colorBg = computed(() => variantClasses[props.variant || 'primary']?.bg || variantClasses.primary.bg)
const colorText = computed(() => variantClasses[props.variant || 'primary']?.text || variantClasses.primary.text)
</script>
