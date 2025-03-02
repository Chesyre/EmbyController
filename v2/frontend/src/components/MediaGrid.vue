<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <MediaCard
      v-for="media in media"
      :key="media.id"
      :media="media"
      @play="$emit('play', media.id)"
      @toggleFavorite="$emit('toggleFavorite', media.id)"
      @showDetails="$emit('showDetails', media.id)"
    />
    
    <!-- Placeholder pour le chargement -->
    <template v-if="loading">
      <MediaSkeleton v-for="i in 4" :key="`skeleton-${i}`" />
    </template>
  </div>
</template>

<script setup>
import MediaCard from './MediaCard.vue'
import MediaSkeleton from './MediaSkeleton.vue'

defineProps({
  media: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['play', 'toggleFavorite', 'showDetails'])
</script>
