
<template>
  <TransitionRoot appear :show="true" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/75" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-white"
              >
                {{ $t('devices.rename_device') }}
              </DialogTitle>

              <div class="mt-4">
                <label
                  for="device-name"
                  class="block text-sm font-medium text-gray-400"
                >
                  {{ $t('devices.new_name') }}
                </label>
                <input
                  type="text"
                  id="device-name"
                  v-model="newName"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  :placeholder="$t('devices.name_placeholder')"
                />
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  @click="$emit('close')"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="handleRename"
                  :disabled="!isValid"
                >
                  {{ $t('common.save') }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'

const props = defineProps({
  device: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'rename'])

const newName = ref(props.device.deviceName)

const isValid = computed(() => {
  return newName.value && newName.value.trim() !== ''
})

const handleRename = () => {
  if (isValid.value) {
    emit('rename', props.device.id, newName.value.trim())
  }
}
</script>
