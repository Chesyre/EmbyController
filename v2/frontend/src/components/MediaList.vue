
<template>
  <div class="space-y-6">
    <!-- Filtres -->
    <MediaFilters
      :filters="filters"
      @update:filters="updateFilters"
    />

    <!-- Grille de médias -->
    <MediaGrid
      :media="media"
      :loading="loading"
      @play="handlePlay"
      @toggleFavorite="handleToggleFavorite"
      @showDetails="handleShowDetails"
    />

    <!-- Pagination -->
    <MediaPagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:page="handlePageChange"
    />

    <!-- Modal de détails -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" @close="closeDetailsModal" class="relative z-50">
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
              <DialogPanel class="w-full max-w-4xl">
                <MediaDetails
                  v-if="selectedMedia"
                  :media="selectedMedia"
                  @play="handlePlay"
                  @toggleFavorite="handleToggleFavorite"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useMediaStore } from '@/stores/media'
import MediaFilters from './MediaFilters.vue'
import MediaGrid from './MediaGrid.vue'
import MediaPagination from './MediaPagination.vue'
import MediaDetails from './MediaDetails.vue'

const mediaStore = useMediaStore()

// États
const loading = ref(false)
const showDetailsModal = ref(false)
const selectedMedia = ref(null)
const filters = ref({
  search: '',
  type: 'all',
  sort: 'recent'
})
const currentPage = ref(1)

// Computed
const media = computed(() => mediaStore.filteredMedia)
const totalPages = computed(() => mediaStore.totalPages)

// Méthodes
const updateFilters = (newFilters) => {
  filters.value = newFilters
  currentPage.value = 1
  loadMedia()
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadMedia()
}

const handlePlay = (mediaId) => {
  // TODO: Implémenter la lecture
  console.log('Lecture du média:', mediaId)
}

const handleToggleFavorite = async (mediaId) => {
  try {
    await mediaStore.toggleFavorite(mediaId)
  } catch (error) {
    console.error('Erreur lors de la mise à jour des favoris:', error)
  }
}

const handleShowDetails = async (mediaId) => {
  try {
    loading.value = true
    selectedMedia.value = await mediaStore.getMediaDetails(mediaId)
    showDetailsModal.value = true
  } catch (error) {
    console.error('Erreur lors du chargement des détails:', error)
  } finally {
    loading.value = false
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedMedia.value = null
}

const loadMedia = async () => {
  try {
    loading.value = true
    await mediaStore.fetchMedia({
      page: currentPage.value,
      ...filters.value
    })
  } catch (error) {
    console.error('Erreur lors du chargement des médias:', error)
  } finally {
    loading.value = false
  }
}

// Charger les médias au montage
loadMedia()
</script>
