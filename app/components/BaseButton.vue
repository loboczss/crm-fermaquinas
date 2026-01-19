<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="[
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-1',
      variantClasses,
      disabledClasses,
      sizeClasses
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10 focus:ring-primary',
    secondary: 'bg-gray-900 hover:bg-gray-800 text-white shadow-md shadow-gray-900/10 focus:ring-gray-900',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200',
    ghost: 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 focus:ring-gray-100'
  }
  return variants[props.variant as keyof typeof variants]
})

const disabledClasses = computed(() => {
  return props.disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-2.5',
    lg: 'text-base px-8 py-3'
  }
  if (props.size === 'lg') return 'text-base px-8 py-3'
  return sizes[props.size as keyof typeof sizes]
})
</script>
