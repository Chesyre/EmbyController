
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-white mb-6">
        {{ $t('servers.title') }}
      </h1>

      <!-- Liste des serveurs -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="server in servers"
          :key="server.id"
          class="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <!-- En-tête -->
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-white">
                {{ server.name }}
              </h3>
              <StatusBadge :status="server.status" />
            </div>
            <p class="mt-1 text-sm text-gray-400">
              {{ server.url }}
            </p>
          </div>

          <!-- Statistiques -->
          <div class="px-6 py-4 border-t border-gray-700">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <p class="text-sm font-medium text-gray-400">
                  {{ $t('servers.latency') }}
                </p>
                <p class="mt-1 text-2xl font-semibold text-white">
                  {{ server.latency ? `${server.latency}ms` : '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-400">
                  {{ $t('servers.uptime') }}
                </p>
                <p class="mt-1 text-2xl font-semibold text-white">
                  {{ formatUptime(server.uptime) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 bg-gray-700/50">
            <div class="flex justify-between items-center">
              <button
                @click="testLatency(server.id)"
                class="text-sm text-blue-400 hover:text-blue-300"
              >
                {{ $t('servers.test_latency') }}
              </button>
              <button
                v-if="server.status === 'online'"
                @click="setPreferred(server.id)"
                :class="[
                  'text-sm',
                  server.isPreferred
                    ? 'text-green-400 hover:text-green-300'
                    : 'text-gray-400 hover:text-white'
                ]"
              >
                {{ server.isPreferred ? $t('servers.preferred') : $t('servers.set_preferred') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'

const servers = ref([])
const loading = ref(false)

// Charger les serveurs
const loadServers = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/servers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    servers.value = await response.json()
  } catch (error) {
    console.error('Erreur lors du chargement des serveurs:', error)
  } finally {
    loading.value = false
  }
}

// Tester la latence
const testLatency = async (serverId) => {
  try {
    const server = servers.value.find(s => s.id === serverId)
    if (!server) return

    server.latency = null // Reset latency
    const start = Date.now()
    
    const response = await fetch(`/api/servers/${serverId}/ping`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      server.latency = Date.now() - start
    }
  } catch (error) {
    console.error('Erreur lors du test de latence:', error)
  }
}

// Définir le serveur préféré
const setPreferred = async (serverId) => {
  try {
    await fetch(`/api/servers/${serverId}/preferred`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    servers.value.forEach(server => {
      server.isPreferred = server.id === serverId
    })
  } catch (error) {
    console.error('Erreur lors de la définition du serveur préféré:', error)
  }
}

// Formater le temps de disponibilité
const formatUptime = (uptime) => {
  if (!uptime) return '-'
  const days = Math.floor(uptime / (24 * 60 * 60))
  return `${days}d`
}

onMounted(loadServers)
</script>
