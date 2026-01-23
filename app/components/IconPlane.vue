<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- Corpo do avião -->
    <path d="M2 16l20-5-20-5v4l16 1-16 1z" />
    <!-- Cauda -->
    <path d="M22 11v2" />
    <!-- Asa esquerda -->
    <path d="M7 12l-2 4" />
    <!-- Asa direita -->
    <path d="M7 12l-2-4" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  size?: number | string
  color?: string
}>()
</script>
