<template>
  <BaseButton
    :type="type"
    :disabled="disabled"
    variant="primary"
    size="lg"
    class="w-full py-4 text-base tracking-wide"
  >
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'

type ButtonType = 'button' | 'submit' | 'reset'

withDefaults(defineProps<{
  type?: ButtonType
  disabled?: boolean
}>(), {
  type: 'button',
  disabled: false
})
</script>
