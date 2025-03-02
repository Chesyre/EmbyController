<template>
  <div class="relative">
    <!-- Bouton de notification -->
    <button
      @click="toggleNotifications"
      class="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
    >
      <span class="sr-only">{{ $t('notifications.view') }}</span>
      <BellIcon class="h-6 w-6" />
      <!-- Badge de notification -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Panneau de notifications -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div class="py-1">
        <div class="px-4 py-2 border-b border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-white">
              {{ $t('notifications.title') }}
            </h3>
            <button
              v-if="notifications.length > 0"
              @click="markAllAsRead"
              class="text-xs text-blue-400 hover:text-blue-300"
            >
              {{ $t('notifications.mark_all_read') }}
            </button>
          </div>
        </div>

        <!-- Liste des notifications -->
        <div v-if="notifications.length > 0" class="divide-y divide-gray-700">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
            :class="{ 'bg-gray-700/50': !notification.read }"
          >
            <div class="flex items-start">
              <!-- Icône -->
              <div class="flex-shrink-0">
                <component
                  :is="getNotificationIcon(notification.type)"
                  class="h-5 w-5 text-gray-400"
                />
              </div>

              <!-- Contenu -->
              <div class="ml-3 flex-1">
                <p class="text-sm text-white">
                  {{ notification.message }}
                </p>
                <p class="mt-1 text-xs text-gray-400">
                  {{ formatDate(notification.createdAt) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="ml-3 flex-shrink-0">
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
          v-else
          class="px-4 py-6 text-center text-sm text-gray-400"
        >
          {{ $t('notifications.no_notifications') }}
        </div>

        <!-- Bouton "Voir tout" -->
        <div
          v-if="notifications.length > 0"
          class="border-t border-gray-700 px-4 py-2"
        >
          <router-link
            to="/notifications"
            class="block text-center text-sm text-blue-400 hover:text-blue-300"
          >
            {{ $t('notifications.view_all') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { BellIcon } from '@heroicons/vue/24/outline'
import {
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const isOpen = ref(false)
const unreadCount = ref(0)
const notifications = ref([])
let pollingInterval

// Simuler des notifications pour la démo
const mockNotifications = [
  {
    id: 1,
    type: 'info',
    message: 'Nouvelle mise à jour disponible',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  },
  {
    id: 2,
    type: 'success',
    message: 'Votre profil a été mis à jour',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 3,
    type: 'warning',
    message: 'Votre abonnement expire bientôt',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  }
]

onMounted(() => {
  // Charger les notifications initiales
  notifications.value = mockNotifications
  updateUnreadCount()

  // Démarrer le polling
  pollingInterval = setInterval(fetchNotifications, 30000)

  // Gestionnaire de clic en dehors
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  clearInterval(pollingInterval)
  document.removeEventListener('click', handleClickOutside)
})

const toggleNotifications = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  const notificationCenter = event.target.closest('.notification-center')
  if (!notificationCenter && isOpen.value) {
    isOpen.value = false
  }
}

const updateUnreadCount = () => {
  unreadCount.value = notifications.value.filter(n => !n.read).length
}

const fetchNotifications = async () => {
  try {
    // TODO: Implémenter la récupération des notifications depuis l'API
    console.log('Récupération des notifications...')
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error)
  }
}

const markAsRead = async (id) => {
  try {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
      updateUnreadCount()
      // TODO: Appeler l'API pour marquer comme lu
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
  }
}

const markAllAsRead = async () => {
  try {
    notifications.value.forEach(n => n.read = true)
    updateUnreadCount()
    // TODO: Appeler l'API pour tout marquer comme lu
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error)
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'warning':
      return ExclamationCircleIcon
    case 'info':
    default:
      return InformationCircleIcon
  }
}

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}
</script>