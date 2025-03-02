<template>
  <TransitionRoot
    as="template"
    :show="show"
  >
    <div
      class="fixed bottom-0 right-0 z-50 m-4"
    >
      <div
        class="rounded-lg shadow-lg"
        :class="{
          'bg-green-800': type === 'success',
          'bg-red-800': type === 'error',
          'bg-yellow-800': type === 'warning',
          'bg-blue-800': type === 'info'
        }"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component
                :is="icon"
                class="h-6 w-6"
                :class="{
                  'text-green-400': type === 'success',
                  'text-red-400': type === 'error',
                  'text-yellow-400': type === 'warning',
                  'text-blue-400': type === 'info'
                }"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-white">
                {{ title }}
              </p>
              <p
                v-if="message"
                class="mt-1 text-sm text-gray-300"
              >
                {{ message }}
              </p>
            </div>
            <div class="ml-4 flex flex-shrink-0">
              <button
                type="button"
                class="inline-flex rounded-md text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="close"
              >
                <span class="sr-only">Fermer</span>
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
import { computed } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return ExclamationCircleIcon
    case 'warning':
      return ExclamationCircleIcon
    case 'info':
    default:
      return InformationCircleIcon
  }
})

const close = () => {
  emit('close')
}

// Fermeture automatique après la durée spécifiée
if (props.duration > 0) {
  setTimeout(() => {
    close()
  }, props.duration)
}
</script>