<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
    <!-- Image du média -->
    <div class="relative aspect-w-2 aspect-h-3">
      <img
        :src="media.poster_url || defaultPoster"
        :alt="media.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <h3 class="text-lg font-medium text-white">{{ media.title }}</h3>
        <p class="text-sm text-gray-300">{{ media.year }}</p>
      </div>
    </div>

    <!-- Informations et actions -->
    <div class="p-4">
      <!-- Note et durée -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <StarIcon 
            class="h-5 w-5 text-yellow-400" 
            :class="{ 'fill-current': media.rating >= 4 }"
          />
          <span class="text-white">{{ media.rating }}/5</span>
        </div>
        <span class="text-sm text-gray-400">{{ formatDuration(media.duration) }}</span>
      </div>

      <!-- Description -->
      <p class="mt-2 text-sm text-gray-400 line-clamp-2">
        {{ media.description }}
      </p>

      <!-- Boutons d'action -->
      <div class="mt-4 flex justify-between items-center">
        <button
          @click="$emit('showDetails', media.id)"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <InformationCircleIcon class="h-4 w-4 mr-1" />
          {{ $t('media.details') }}
        </button>

        <button
          @click="$emit('toggleFavorite', media.id)"
          class="text-gray-400 hover:text-white"
        >
          <component 
            :is="media.isFavorite ? HeartIconSolid : HeartIcon"
            class="h-5 w-5"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  HeartIcon,
  StarIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  media: {
    type: Object,
    required: true
  }
})

const defaultPoster = '/default-poster.jpg'

const formatDuration = (minutes) => {
  if (!minutes) return ''
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
}

defineEmits(['toggleFavorite', 'showDetails'])
</script>
