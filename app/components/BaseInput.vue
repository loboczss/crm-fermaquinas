<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" :for="id" class="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
      {{ label }}
      <span v-if="required" class="text-primary">*</span>
    </label>
    <div class="relative group">
      <input
        v-bind="$attrs"
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :value="modelValue"
        @input="handleInput"
        class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 font-medium"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

interface Props {
  id: string
  label?: string
  type?: string
  placeholder?: string
  modelValue?: string | number
  required?: boolean
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>
