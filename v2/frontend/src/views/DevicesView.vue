<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-white mb-6">
        {{ $t('devices.title') }}
      </h1>

      <!-- Avertissements -->
      <div class="mb-6 space-y-4">
        <div v-if="maxDevices" class="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4">
          <p class="text-yellow-200">
            {{ $t('devices.max_devices_warning', { max: maxDevices }) }}
          </p>
        </div>
      </div>

      <!-- Liste des appareils -->
      <div class="bg-gray-800 shadow rounded-lg divide-y divide-gray-700">
        <div
          v-for="device in devices"
          :key="device.id"
          class="p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Icône de l'appareil -->
              <div class="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-700">
                <component
                  :is="getDeviceIcon(device.client)"
                  class="h-6 w-6 text-gray-400"
                />
              </div>

              <!-- Informations de l'appareil -->
              <div>
                <h3 class="text-lg font-medium text-white">
                  {{ device.deviceName }}
                </h3>
                <div class="mt-1 flex items-center space-x-4 text-sm text-gray-400">
                  <span>{{ device.client }}</span>
                  <span>{{ formatDate(device.lastUsedTime) }}</span>
                  <span>{{ device.lastUsedIp }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-4">
              <button
                v-if="device.isActive"
                @click="disconnectDevice(device.id)"
                class="text-red-400 hover:text-red-300"
              >
                {{ $t('devices.disconnect') }}
              </button>
              <button
                @click="renameDevice(device)"
                class="text-blue-400 hover:text-blue-300"
              >
                {{ $t('devices.rename') }}
              </button>
            </div>
          </div>

          <!-- Session active -->
          <div
            v-if="device.currentSession"
            class="mt-4 pl-16"
          >
            <div class="bg-gray-700/50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-white">
                    {{ device.currentSession.title }}
                  </p>
                  <p class="mt-1 text-xs text-gray-400">
                    {{ formatProgress(device.currentSession.progress) }}
                  </p>
                </div>
                <button
                  @click="terminateSession(device.currentSession.id)"
                  class="text-sm text-red-400 hover:text-red-300"
                >
                  {{ $t('devices.terminate_session') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de renommage -->
    <RenameDeviceDialog
      v-if="showRenameDialog"
      :device="selectedDevice"
      @close="showRenameDialog = false"
      @rename="handleRename"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  TvIcon
} from '@heroicons/vue/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import RenameDeviceDialog from '@/components/RenameDeviceDialog.vue'

const devices = ref([])
const loading = ref(false)
const maxDevices = ref(null)
const showRenameDialog = ref(false)
const selectedDevice = ref(null)

// Charger les appareils
const loadDevices = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/devices', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    devices.value = data.devices
    maxDevices.value = data.maxDevices
  } catch (error) {
    console.error('Erreur lors du chargement des appareils:', error)
  } finally {
    loading.value = false
  }
}

// Déconnecter un appareil
const disconnectDevice = async (deviceId) => {
  try {
    await fetch(`/api/devices/${deviceId}/disconnect`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    devices.value = devices.value.filter(d => d.id !== deviceId)
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Renommer un appareil
const renameDevice = (device) => {
  selectedDevice.value = device
  showRenameDialog.value = true
}

const handleRename = async (deviceId, newName) => {
  try {
    await fetch(`/api/devices/${deviceId}/rename`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name: newName })
    })
    
    const device = devices.value.find(d => d.id === deviceId)
    if (device) {
      device.deviceName = newName
    }
    
    showRenameDialog.value = false
  } catch (error) {
    console.error('Erreur lors du renommage:', error)
  }
}

// Terminer une session
const terminateSession = async (sessionId) => {
  try {
    await fetch(`/api/sessions/${sessionId}/terminate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    await loadDevices() // Recharger les appareils
  } catch (error) {
    console.error('Erreur lors de la terminaison de la session:', error)
  }
}

// Utilitaires
const getDeviceIcon = (client) => {
  if (client.includes('TV') || client.includes('Emby Theater')) {
    return TvIcon
  } else if (client.includes('Mobile') || client.includes('Android') || client.includes('iOS')) {
    return DevicePhoneMobileIcon
  } else if (client.includes('Tablet') || client.includes('iPad')) {
    return DeviceTabletIcon
  }
  return ComputerDesktopIcon
}

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr
  })
}

const formatProgress = (progress) => {
  return `${Math.round(progress)}% terminé`
}

onMounted(loadDevices)
</script>