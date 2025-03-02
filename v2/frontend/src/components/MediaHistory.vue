<template>
  <div class="space-y-4">
    <h2 class="text-lg font-medium text-white">
      {{ $t('media.history.title') }}
    </h2>

    <!-- Liste de l'historique -->
    <div class="space-y-4">
      <div
        v-for="item in history"
        :key="item.id"
        class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex">
          <!-- Miniature -->
          <div class="w-32 flex-shrink-0">
            <img
              :src="item.media.poster_url || defaultPoster"
              :alt="item.media.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Informations -->
          <div class="flex-1 p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-white">
                  {{ item.media.title }}
                </h3>
                <p class="text-sm text-gray-400">
                  {{ formatDate(item.watchedAt) }}
                </p>
              </div>
              <div class="text-sm text-gray-400">
                {{ formatProgress(item.progress) }}
              </div>
            </div>

            <!-- Barre de progression -->
            <div class="mt-4">
              <div class="relative pt-1">
                <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                  <div
                    :style="{ width: `${item.progress}%` }"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex space-x-4">
              <button
                @click="$emit('resume', item.media.id)"
                class="text-sm text-blue-400 hover:text-blue-300 flex items-center"
              >
                <PlayIcon class="h-4 w-4 mr-1" />
                {{ $t('media.history.resume') }}
              </button>
              <button
                @click="$emit('remove', item.id)"
                class="text-sm text-red-400 hover:text-red-300 flex items-center"
              >
                <TrashIcon class="h-4 w-4 mr-1" />
                {{ $t('media.history.remove') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucun historique -->
    <div
      v-if="history.length === 0"
      class="text-center py-8 text-gray-400"
    >
      {{ $t('media.history.empty') }}
    </div>

    <!-- Chargement -->
    <div
      v-if="loading"
      class="flex justify-center py-4"
    >
      <svg
        class="animate-spin h-6 w-6 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { PlayIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps({
  history: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const defaultPoster = '/default-poster.jpg'

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr
  })
}

const formatProgress = (progress) => {
  return `${Math.round(progress)}%`
}

defineEmits(['resume', 'remove'])
</script>
