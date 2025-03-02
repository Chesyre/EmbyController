
<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
    <!-- Image placeholder -->
    <div class="relative aspect-w-2 aspect-h-3 bg-gray-700"></div>
    
    <!-- Content placeholder -->
    <div class="p-4">
      <!-- Title -->
      <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div class="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
      
      <!-- Rating -->
      <div class="flex items-center space-x-1 mb-4">
        <div v-for="i in 5" :key="i" class="h-4 w-4 bg-gray-700 rounded"></div>
      </div>
      
      <!-- Description -->
      <div class="space-y-2">
        <div class="h-3 bg-gray-700 rounded w-full"></div>
        <div class="h-3 bg-gray-700 rounded w-5/6"></div>
      </div>
      
      <!-- Actions -->
      <div class="flex justify-between items-center mt-4">
        <div class="h-8 bg-gray-700 rounded w-24"></div>
        <div class="h-8 bg-gray-700 rounded w-8"></div>
      </div>
    </div>
  </div>
</template>
