
<template>
  <div class="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
    <!-- En-tête -->
    <div class="px-4 py-3 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-white">
          {{ $t('notifications.title') }}
        </h3>
        <button
          v-if="hasUnread"
          @click="markAllAsRead"
          class="text-sm text-blue-400 hover:text-blue-300"
        >
          {{ $t('notifications.mark_all_read') }}
        </button>
      </div>
    </div>

    <!-- Liste des notifications -->
    <div class="divide-y divide-gray-700">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="p-4 hover:bg-gray-700/50 transition-colors duration-200"
        :class="{ 'bg-gray-700/30': !notification.read }"
      >
        <div class="flex items-start space-x-3">
          <!-- Icône -->
          <div class="flex-shrink-0">
            <component
              :is="getNotificationIcon(notification.type)"
              class="h-6 w-6"
              :class="getNotificationIconColor(notification.type)"
            />
          </div>

          <!-- Contenu -->
          <div class="flex-1 min-w-0">
            <p class="text-sm text-white">
              {{ notification.message }}
            </p>
            <p class="mt-1 text-xs text-gray-400">
              {{ formatDate(notification.createdAt) }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex-shrink-0">
            <button
              v-if="!notification.read"
              @click="markAsRead(notification.id)"
              class="text-xs text-blue-400 hover:text-blue-300"
            >
              {{ $t('notifications.mark_read') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucune notification -->
    <div
      v-if="notifications.length === 0"
      class="p-8 text-center text-gray-400"
    >
      {{ $t('notifications.no_notifications') }}
    </div>

    <!-- Chargement -->
    <div
      v-if="loading"
      class="p-4 flex justify-center"
    >
      <svg
        class="animate-spin h-6 w-6 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.sortedNotifications)
const loading = computed(() => notificationStore.loading)
const hasUnread = computed(() => notificationStore.hasUnread)

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'warning':
      return ExclamationCircleIcon
    case 'error':
      return ExclamationCircleIcon
    case 'info':
    default:
      return InformationCircleIcon
  }
}

const getNotificationIconColor = (type) => {
  switch (type) {
    case 'success':
      return 'text-green-400'
    case 'warning':
      return 'text-yellow-400'
    case 'error':
      return 'text-red-400'
    case 'info':
    default:
      return 'text-blue-400'
  }
}

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr
  })
}

const markAsRead = async (id) => {
  try {
    await notificationStore.markAsRead(id)
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications comme lues:', error)
  }
}
</script>
