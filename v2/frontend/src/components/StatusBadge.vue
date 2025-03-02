
<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    <span
      class="h-2 w-2 rounded-full mr-1.5"
      :class="dotClasses"
    ></span>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['online', 'offline', 'maintenance'].includes(value)
  }
})

const statusClasses = computed(() => ({
  'bg-green-100 text-green-800': props.status === 'online',
  'bg-red-100 text-red-800': props.status === 'offline',
  'bg-yellow-100 text-yellow-800': props.status === 'maintenance'
}))

const dotClasses = computed(() => ({
  'bg-green-400': props.status === 'online',
  'bg-red-400': props.status === 'offline',
  'bg-yellow-400': props.status === 'maintenance'
}))

const statusText = computed(() => {
  switch (props.status) {
    case 'online':
      return 'En ligne'
    case 'offline':
      return 'Hors ligne'
    case 'maintenance':
      return 'Maintenance'
    default:
      return ''
  }
})
</script>
