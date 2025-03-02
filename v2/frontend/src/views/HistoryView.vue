
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-white">
          {{ $t('history.title') }}
        </h1>
        <button
          v-if="history.length > 0"
          @click="confirmClearHistory"
          class="text-sm text-red-400 hover:text-red-300"
        >
          {{ $t('history.clear_all') }}
        </button>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div
          v-for="stat in watchTimeStats"
          :key="stat.name"
          class="bg-gray-800 rounded-lg p-4"
        >
          <h3 class="text-sm font-medium text-gray-400">
            {{ stat.name }}
          </h3>
          <p class="mt-2 text-3xl font-semibold text-white">
            {{ stat.value }}
          </p>
        </div>
      </div>

      <!-- Historique -->
      <MediaHistory
        :history="history"
        :loading="loading"
        @remove="handleRemoveFromHistory"
      />

      <!-- Modal de confirmation -->
      <ConfirmDialog
        v-if="showConfirmDialog"
        :title="$t('history.clear_confirm_title')"
        :message="$t('history.clear_confirm_message')"
        @confirm="clearHistory"
        @cancel="showConfirmDialog = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHistoryStore } from '@/stores/history'
import MediaHistory from '@/components/MediaHistory.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const historyStore = useHistoryStore()
const loading = ref(false)
const showConfirmDialog = ref(false)

const history = computed(() => historyStore.sortedHistory)
const watchTimeStats = computed(() => {
  const stats = historyStore.watchTimeStats
  return [
    {
      name: 'Temps total de visionnage',
      value: `${stats.totalHours}h`
    },
    {
      name: 'Moyenne quotidienne',
      value: `${stats.averageHoursPerDay}h`
    }
  ]
})

const handleRemoveFromHistory = async (historyId) => {
  try {
    await historyStore.removeFromHistory(historyId)
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique:', error)
  }
}

const confirmClearHistory = () => {
  showConfirmDialog.value = true
}

const clearHistory = async () => {
  try {
    await historyStore.clearHistory()
    showConfirmDialog.value = false
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique:', error)
  }
}

// Charger l'historique au montage
const loadHistory = async () => {
  try {
    loading.value = true
    await historyStore.fetchHistory()
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique:', error)
  } finally {
    loading.value = false
  }
}

loadHistory()
</script>
