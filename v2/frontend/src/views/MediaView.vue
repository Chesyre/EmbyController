
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-white">
          {{ $t('media.title') }}
        </h1>
        
        <!-- Statistiques -->
        <div class="flex items-center space-x-4 text-gray-400">
          <div class="flex items-center">
            <FilmIcon class="h-5 w-5 mr-1" />
            <span>{{ stats.totalCount }}</span>
          </div>
          <div class="flex items-center">
            <ClockIcon class="h-5 w-5 mr-1" />
            <span>{{ stats.totalDuration }}</span>
          </div>
          <div class="flex items-center">
            <StarIcon class="h-5 w-5 mr-1" />
            <span>{{ stats.averageRating }}/5</span>
          </div>
        </div>
      </div>

      <!-- Liste des médias -->
      <MediaList />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FilmIcon, ClockIcon, StarIcon } from '@heroicons/vue/24/outline'
import { useMediaStore } from '@/stores/media'
import MediaList from '@/components/MediaList.vue'

const mediaStore = useMediaStore()

const stats = ref({
  totalCount: 0,
  totalDuration: '0h',
  averageRating: 0
})

onMounted(async () => {
  try {
    const response = await mediaStore.getStats()
    stats.value = {
      totalCount: response.totalCount,
      totalDuration: formatDuration(response.totalDuration),
      averageRating: response.averageRating.toFixed(1)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
})

const formatDuration = (minutes) => {
  if (!minutes) return '0h'
  const hours = Math.floor(minutes / 60)
  return `${hours}h`
}
</script>
