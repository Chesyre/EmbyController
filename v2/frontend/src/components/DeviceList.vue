<template>
  <div class="space-y-6">
    <!-- En-tête avec statistiques -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DevicesIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-400 truncate">
                  {{ $t('devices.total_devices') }}
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-white">
                    {{ devices.length }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ShieldCheckIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-400 truncate">
                  {{ $t('devices.active_devices') }}
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-white">
                    {{ activeDevices.length }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BanIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-400 truncate">
                  {{ $t('devices.blocked_devices') }}
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-white">
                    {{ blockedDevices.length }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des appareils -->
    <div class="bg-gray-800 shadow rounded-lg">
      <div class="divide-y divide-gray-700">
        <div
          v-for="device in devices"
          :key="device.id"
          class="p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-700">
                <component
                  :is="getDeviceIcon(device.client)"
                  class="h-6 w-6 text-gray-400"
                />
              </div>

              <div>
                <h3 class="text-lg font-medium text-white">
                  {{ device.name }}
                </h3>
                <div class="mt-1 flex items-center space-x-4 text-sm text-gray-400">
                  <span>{{ device.client }}</span>
                  <span>{{ formatDate(device.lastUsedAt) }}</span>
                  <span>{{ device.lastIp }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <button
                v-if="device.status === 'active'"
                @click="blockDevice(device.id)"
                class="text-red-400 hover:text-red-300"
              >
                {{ $t('devices.block') }}
              </button>
              <button
                v-else-if="device.status === 'blocked'"
                @click="unblockDevice(device.id)"
                class="text-green-400 hover:text-green-300"
              >
                {{ $t('devices.unblock') }}
              </button>
              <button
                @click="renameDevice(device)"
                class="text-blue-400 hover:text-blue-300"
              >
                {{ $t('devices.rename') }}
              </button>
              <button
                @click="removeDevice(device.id)"
                class="text-red-400 hover:text-red-300"
              >
                {{ $t('devices.remove') }}
              </button>
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

    <!-- Modal de confirmation -->
    <ConfirmDialog
      v-if="showConfirmDialog"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      @confirm="handleConfirm"
      @cancel="showConfirmDialog = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  DevicesIcon,
  ShieldCheckIcon,
  BanIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  TvIcon
} from '@heroicons/vue/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDeviceStore } from '@/stores/device'
import RenameDeviceDialog from './RenameDeviceDialog.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const deviceStore = useDeviceStore()
const showRenameDialog = ref(false)
const showConfirmDialog = ref(false)
const selectedDevice = ref(null)
const confirmAction = ref(null)
const confirmDialogTitle = ref('')
const confirmDialogMessage = ref('')

const devices = computed(() => deviceStore.devices)
const activeDevices = computed(() => deviceStore.activeDevices)
const blockedDevices = computed(() => devices.value.filter(d => d.status === 'blocked'))

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

const renameDevice = (device) => {
  selectedDevice.value = device
  showRenameDialog.value = true
}

const handleRename = async (deviceId, newName) => {
  try {
    await deviceStore.renameDevice(deviceId, newName)
    showRenameDialog.value = false
  } catch (error) {
    console.error('Erreur lors du renommage:', error)
  }
}

const showConfirm = (title, message, action) => {
  confirmDialogTitle.value = title
  confirmDialogMessage.value = message
  confirmAction.value = action
  showConfirmDialog.value = true
}

const handleConfirm = async () => {
  if (confirmAction.value) {
    await confirmAction.value()
  }
  showConfirmDialog.value = false
}

const blockDevice = (deviceId) => {
  showConfirm(
    $t('devices.block_title'),
    $t('devices.block_confirm'),
    async () => {
      try {
        await deviceStore.blockDevice(deviceId)
      } catch (error) {
        console.error('Erreur lors du blocage:', error)
      }
    }
  )
}

const unblockDevice = (deviceId) => {
  showConfirm(
    $t('devices.unblock_title'),
    $t('devices.unblock_confirm'),
    async () => {
      try {
        await deviceStore.unblockDevice(deviceId)
      } catch (error) {
        console.error('Erreur lors du déblocage:', error)
      }
    }
  )
}

const removeDevice = (deviceId) => {
  showConfirm(
    $t('devices.remove_title'),
    $t('devices.remove_confirm'),
    async () => {
      try {
        await deviceStore.removeDevice(deviceId)
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  )
}

onMounted(async () => {
  try {
    await deviceStore.fetchDevices()
  } catch (error) {
    console.error('Erreur lors du chargement des appareils:', error)
  }
})
</script>