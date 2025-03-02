
<template>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        :disabled="currentPage === 1"
        @click="$emit('update:page', currentPage - 1)"
        class="relative inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-700"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        {{ $t('pagination.previous') }}
      </button>
      <button
        :disabled="currentPage === totalPages"
        @click="$emit('update:page', currentPage + 1)"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-700"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        {{ $t('pagination.next') }}
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-400">
          {{ $t('pagination.showing') }}
          <span class="font-medium">{{ startIndex }}</span>
          {{ $t('pagination.to') }}
          <span class="font-medium">{{ endIndex }}</span>
          {{ $t('pagination.of') }}
          <span class="font-medium">{{ total }}</span>
          {{ $t('pagination.results') }}
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            :disabled="currentPage === 1"
            @click="$emit('update:page', currentPage - 1)"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            <span class="sr-only">{{ $t('pagination.previous') }}</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <!-- Pages -->
          <template v-for="page in displayedPages" :key="page">
            <button
              v-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-700"
            >
              ...
            </button>
            <button
              v-else
              @click="$emit('update:page', page)"
              :class="[
                page === currentPage
                  ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 focus:z-20 focus:outline-offset-0',
              ]"
            >
              {{ page }}
            </button>
          </template>
          
          <button
            :disabled="currentPage === totalPages"
            @click="$emit('update:page', currentPage + 1)"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            <span class="sr-only">{{ $t('pagination.next') }}</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:page'])

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const startIndex = computed(() => 
  ((props.currentPage - 1) * props.pageSize) + 1
)

const endIndex = computed(() => 
  Math.min(props.currentPage * props.pageSize, props.total)
)

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 7 // Nombre maximum de pages à afficher
  
  if (totalPages.value <= maxPages) {
    // Afficher toutes les pages si le nombre total est inférieur au maximum
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Toujours afficher la première page
    pages.push(1)
    
    if (props.currentPage > 3) {
      pages.push('...')
    }
    
    // Pages autour de la page courante
    for (let i = Math.max(2, props.currentPage - 1); i <= Math.min(totalPages.value - 1, props.currentPage + 1); i++) {
      pages.push(i)
    }
    
    if (props.currentPage < totalPages.value - 2) {
      pages.push('...')
    }
    
    // Toujours afficher la dernière page
    pages.push(totalPages.value)
  }
  
  return pages
})
</script>
