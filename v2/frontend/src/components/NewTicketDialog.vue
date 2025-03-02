
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
                {{ $t('tickets.new_ticket') }}
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                <!-- Sujet -->
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-400">
                    {{ $t('tickets.subject') }}
                  </label>
                  <input
                    type="text"
                    id="title"
                    v-model="form.title"
                    required
                    class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <!-- Catégorie -->
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-400">
                    {{ $t('tickets.category') }}
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    required
                    class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="technical">{{ $t('tickets.categories.technical') }}</option>
                    <option value="billing">{{ $t('tickets.categories.billing') }}</option>
                    <option value="account">{{ $t('tickets.categories.account') }}</option>
                    <option value="other">{{ $t('tickets.categories.other') }}</option>
                  </select>
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-400">
                    {{ $t('tickets.description') }}
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="4"
                    required
                    class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                <!-- Pièces jointes -->
                <div>
                  <label class="block text-sm font-medium text-gray-400">
                    {{ $t('tickets.attachments') }}
                  </label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                    <div class="space-y-1 text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <div class="flex text-sm text-gray-400">
                        <label
                          for="file-upload"
                          class="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>{{ $t('tickets.upload_file') }}</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            class="sr-only"
                            multiple
                            @change="handleFileUpload"
                          />
                        </label>
                        <p class="pl-1">{{ $t('tickets.or_drag_drop') }}</p>
                      </div>
                      <p class="text-xs text-gray-400">
                        {{ $t('tickets.file_types') }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                    @click="$emit('close')"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {{ loading ? $t('common.submitting') : $t('common.submit') }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)
const form = ref({
  title: '',
  category: 'technical',
  description: '',
  attachments: []
})

const handleFileUpload = (event) => {
  form.value.attachments = Array.from(event.target.files)
}

const handleSubmit = async () => {
  try {
    loading.value = true

    // Créer un FormData pour gérer les fichiers
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('category', form.value.category)
    formData.append('description', form.value.description)
    
    form.value.attachments.forEach(file => {
      formData.append('attachments', file)
    })

    emit('submit', formData)
  } catch (error) {
    console.error('Erreur lors de la soumission du ticket:', error)
  } finally {
    loading.value = false
  }
}
</script>
