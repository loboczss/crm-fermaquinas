<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="handleBackdropClick"
      >
        <div 
          :class="[
            'bg-white w-full flex flex-col overflow-hidden shadow-2xl',
            'h-[85vh] sm:h-auto sm:max-h-[80vh]',
            'rounded-t-2xl sm:rounded-2xl',
            'sm:mx-4',
            sizeClasses,
            'animate-in fade-in duration-200',
            'sm:slide-in-from-bottom-4 slide-in-from-bottom-8'
          ]"
        >
          <!-- Header -->
          <div class="flex items-start justify-between px-4 py-3 border-b border-gray-50 bg-white sticky top-0 z-10 flex-shrink-0">
            <div class="flex-1 min-w-0">
              <h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-widest">{{ title }}</h2>
              <p v-if="subtitle" class="text-[9px] text-gray-400 font-semibold mt-0.5">{{ subtitle }}</p>
            </div>
            <button
              @click="close"
              class="p-1 hover:bg-gray-50 rounded transition-colors"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div 
            :class="[
              'flex-1 min-h-0 overscroll-contain flex flex-col',
              scrollable ? 'overflow-y-auto' : 'overflow-hidden'
            ]"
          >
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-5 py-3 border-t border-gray-100 bg-white sticky bottom-0 flex-shrink-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from '#imports'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  subtitle?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  scrollable?: boolean
}>(), {
  size: 'md',
  closeOnBackdrop: true,
  scrollable: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'sm:max-w-sm',
    sm: 'sm:max-w-md',
    md: 'sm:max-w-xl',
    lg: 'sm:max-w-3xl',
    xl: 'sm:max-w-4xl',
    full: 'sm:max-w-5xl'
  }
  return sizes[props.size]
})

const close = () => {
  emit('update:modelValue', false)
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
