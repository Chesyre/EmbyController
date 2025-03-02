<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden">
    <!-- En-tête avec image de fond -->
    <div class="relative h-96">
      <img
        :src="media.backdrop_url || defaultBackdrop"
        :alt="media.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60"></div>
      
      <!-- Contenu de l'en-tête -->
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="flex items-end space-x-6">
          <!-- Poster -->
          <img
            :src="media.poster_url || defaultPoster"
            :alt="media.title"
            class="w-48 rounded-lg shadow-lg"
          />
          
          <!-- Informations -->
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-white mb-2">
              {{ media.title }}
            </h1>
            <div class="flex items-center space-x-4 text-sm text-gray-300">
              <span>{{ media.year }}</span>
              <span>{{ formatDuration(media.duration) }}</span>
              <div class="flex items-center">
                <StarIcon class="h-5 w-5 text-yellow-400" />
                <span class="ml-1">{{ media.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Corps -->
    <div class="p-6">
      <!-- Actions -->
      <div class="flex space-x-4 mb-6">
        <button
          @click="$emit('toggleFavorite')"
          class="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          <component
            :is="media.isFavorite ? HeartIconSolid : HeartIcon"
            class="h-5 w-5 mr-2"
          />
          {{ media.isFavorite ? $t('media.remove_favorite') : $t('media.add_favorite') }}
        </button>
      </div>

      <!-- Description -->
      <div class="prose prose-invert max-w-none">
        <h2>{{ $t('media.synopsis') }}</h2>
        <p>{{ media.description }}</p>
      </div>

      <!-- Informations supplémentaires -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Genres -->
        <div>
          <h3 class="text-lg font-medium text-white mb-2">
            {{ $t('media.genres') }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="genre in media.genres"
              :key="genre.id"
              class="px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
            >
              {{ genre.name }}
            </span>
          </div>
        </div>

        <!-- Casting -->
        <div>
          <h3 class="text-lg font-medium text-white mb-2">
            {{ $t('media.cast') }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="actor in media.cast"
              :key="actor.id"
              class="flex items-center space-x-2"
            >
              <img
                :src="actor.photo_url || defaultAvatar"
                :alt="actor.name"
                class="w-8 h-8 rounded-full"
              />
              <span class="text-white">{{ actor.name }}</span>
              <span class="text-gray-400">{{ actor.character }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Commentaires -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-white mb-4">
          {{ $t('media.comments') }}
        </h2>
        <CommentList :media-id="media.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  HeartIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import CommentList from './CommentList.vue'

const props = defineProps({
  media: {
    type: Object,
    required: true
  }
})

const defaultPoster = '/default-poster.jpg'
const defaultBackdrop = '/default-backdrop.jpg'
const defaultAvatar = '/default-avatar.jpg'

const formatDuration = (minutes) => {
  if (!minutes) return ''
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
}

defineEmits(['toggleFavorite'])
</script>

<style>
.prose {
  max-width: none;
}

.prose a {
  color: #60a5fa;
}

.prose h2 {
  color: white;
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose p {
  color: #9ca3af;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
