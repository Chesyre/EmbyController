<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <!-- Recherche -->
    <div class="flex-1">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          class="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :placeholder="$t('media.search')"
          @input="handleSearch"
        />
        <MagnifyingGlassIcon 
          class="h-5 w-5 text-gray-400 absolute right-3 top-2.5" 
        />
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex space-x-2">
      <!-- Type -->
      <select
        v-model="selectedType"
        class="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="handleFiltersChange"
      >
        <option value="all">{{ $t('media.filters.all') }}</option>
        <option value="movies">{{ $t('media.filters.movies') }}</option>
        <option value="series">{{ $t('media.filters.series') }}</option>
      </select>
      
      <!-- Tri -->
      <select
        v-model="selectedSort"
        class="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="handleFiltersChange"
      >
        <option value="recent">{{ $t('media.filters.recent') }}</option>
        <option value="rating">{{ $t('media.filters.rating') }}</option>
        <option value="title">{{ $t('media.filters.title') }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { debounce } from '@vueuse/core'

const emit = defineEmits(['update:filters'])

const searchQuery = ref('')
const selectedType = ref('all')
const selectedSort = ref('recent')

// Debounce la recherche
const handleSearch = debounce(() => {
  emitFilters()
}, 300)

const handleFiltersChange = () => {
  emitFilters()
}

const emitFilters = () => {
  emit('update:filters', {
    search: searchQuery.value,
    type: selectedType.value,
    sort: selectedSort.value
  })
}

// Réinitialiser les filtres quand les props changent
watch(() => props.filters, (newFilters) => {
  if (newFilters) {
    searchQuery.value = newFilters.search || ''
    selectedType.value = newFilters.type || 'all'
    selectedSort.value = newFilters.sort || 'recent'
  }
}, { deep: true })

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      search: '',
      type: 'all',
      sort: 'recent'
    })
  }
})
</script>
