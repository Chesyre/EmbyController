<template>
  <div class="animate-pulse">
    <div class="bg-gray-800 rounded-lg p-4">
      <!-- En-tête -->
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <!-- Avatar -->
          <div class="h-8 w-8 bg-gray-700 rounded-full"></div>
          
          <div>
            <!-- Nom d'utilisateur -->
            <div class="h-4 bg-gray-700 rounded w-24"></div>
            
            <!-- Note -->
            <div class="flex items-center mt-2 space-x-1">
              <div
                v-for="i in 5"
                :key="i"
                class="h-4 w-4 bg-gray-700 rounded"
              ></div>
            </div>
          </div>
        </div>

        <!-- Date -->
        <div class="h-4 bg-gray-700 rounded w-20"></div>
      </div>

      <!-- Contenu -->
      <div class="mt-4 space-y-2">
        <div class="h-4 bg-gray-700 rounded w-3/4"></div>
        <div class="h-4 bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  </div>
</template>
