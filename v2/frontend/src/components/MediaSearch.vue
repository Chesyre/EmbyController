
<template>
  <div class="relative">
    <!-- Champ de recherche -->
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        class="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :placeholder="$t('media.search')"
        @focus="showResults = true"
        @blur="handleBlur"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <MagnifyingGlassIcon 
          class="h-5 w-5 text-gray-400" 
        />
      </div>
    </div>

    <!-- Résultats de recherche -->
    <div
      v-if="showResults && (loading || results.length > 0)"
      class="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <!-- Chargement -->
      <div v-if="loading" class="p-4">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="flex space-x-4">
            <div class="w-16 h-24 bg-gray-700 rounded"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 bg-gray-700 rounded w-3/4"></div>
              <div class="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Résultats -->
      <div v-else class="divide-y divide-gray-700">
        <div
          v-for="result in results"
          :key="result.id"
          class="p-4 hover:bg-gray-700 cursor-pointer"
          @mousedown="selectResult(result)"
        >
          <div class="flex space-x-4">
            <img
              :src="
              result.poster_url || defaultPoster"
              :alt="result.title"
              class="w-16 h-24 object-cover rounded"
            />
            <div>
              <h4 class="font-medium text-white">{{ result.title }}</h4>
              <p class="text-sm text-gray-400">{{ result.year }}</p>
              <div class="flex items-center mt-1">
                <StarIcon 
                  class="h-4 w-4 text-yellow-400" 
                  :class="{ 'fill-current': result.rating >= 4 }"
                />
                <span class="ml-1 text-sm text-gray-400">
                  {{ result.rating }}/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun résultat -->
      <div
        v-if="!loading && results.length === 0 && searchQuery"
        class="p-4 text-center text-gray-400"
      >
        {{ $t('media.no_results') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/vue/24/outline'
import { useMediaStore } from '@/stores/media'
import { debounce } from '@vueuse/core'

const mediaStore = useMediaStore()

const props = defineProps({
  minLength: {
    type: Number,
    default: 2
  }
})

const emit = defineEmits(['select'])

const searchQuery = ref('')
const showResults = ref(false)
const loading = ref(false)
const results = ref([])
const defaultPoster = '/default-poster.jpg'

// Debounce la recherche
const search = debounce(async () => {
  if (searchQuery.value.length >= props.minLength) {
    try {
      loading.value = true
      const response = await mediaStore.searchMedia(searchQuery.value)
      results.value = response.data
    } catch (error) {
      console.error('Erreur de recherche:', error)
      results.value = []
    } finally {
      loading.value = false
    }
  } else {
    results.value = []
  }
}, 300)

// Observer les changements de la requête
watch(searchQuery, () => {
  if (searchQuery.value.length >= props.minLength) {
    search()
  } else {
    results.value = []
  }
})

const handleBlur = () => {
  // Petit délai pour permettre le clic sur un résultat
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

const selectResult = (result) => {
  emit('select', result)
  searchQuery.value = ''
  showResults.value = false
}
</script>
