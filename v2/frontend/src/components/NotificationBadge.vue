
<template>
  <div class="relative">
    <slot></slot>
    <span
      v-if="count > 0"
      class="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full"
    >
      {{ formattedCount }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    default: 0
  }
})

const formattedCount = computed(() => {
  return props.count > 99 ? '99+' : props.count
})
</script>
