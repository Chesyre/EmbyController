
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-white mb-6">
        {{ $t('favorites.title') }}
      </h1>

      <!-- Filtres -->
      <MediaFilters
        :filters="filters"
        @update:filters="updateFilters"
      />

      <!-- Liste des favoris -->
      <div class="mt-6">
        <MediaGrid
          :media="favoriteMedia"
          :loading="loading"
          @toggleFavorite="handleToggleFavorite"
          @showDetails="handleShowDetails"
        />
      </div>

      <!-- Message si aucun favori -->
      <div
        v-if="!loading && favoriteMedia.length === 0"
        class="text-center py-12"
      >
        <p class="text-gray-400">
          {{ $t('favorites.empty') }}
        </p>
        <router-link
          to="/media"
          class="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300"
        >
          {{ $t('favorites.browse_media') }}
          <ArrowRightIcon class="ml-2 h-5 w-5" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { useMediaStore } from '@/stores/media'
import MediaFilters from '@/components/MediaFilters.vue'
import MediaGrid from '@/components/MediaGrid.vue'

const mediaStore = useMediaStore()
const loading = ref(false)
const filters = ref({
  type: 'all',
  sort: 'recent',
  search: ''
})

const favoriteMedia = computed(() => {
  return mediaStore.mediaList.filter(media => media.isFavorite)
})

const updateFilters = (newFilters) => {
  filters.value = newFilters
}

const handleToggleFavorite = async (mediaId) => {
  try {
    await mediaStore.toggleFavorite(mediaId)
  } catch (error) {
    console.error('Erreur lors de la mise à jour des favoris:', error)
  }
}

const handleShowDetails = (mediaId) => {
  // TODO: Implémenter l'affichage des détails
}

// Charger les favoris au montage
const loadFavorites = async () => {
  try {
    loading.value = true
    await mediaStore.fetchMedia({ favorites: true })
  } catch (error) {
    console.error('Erreur lors du chargement des favoris:', error)
  } finally {
    loading.value = false
  }
}

loadFavorites()
</script>
