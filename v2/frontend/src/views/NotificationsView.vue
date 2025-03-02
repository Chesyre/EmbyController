
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-white">
          {{ $t('notifications.title') }}
        </h1>
        <button
          v-if="hasUnread"
          @click="markAllAsRead"
          class="text-sm text-blue-400 hover:text-blue-300"
        >
          {{ $t('notifications.mark_all_read') }}
        </button>
      </div>

      <NotificationList />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import NotificationList from '@/components/NotificationList.vue'

const notificationStore = useNotificationStore()
const hasUnread = computed(() => notificationStore.hasUnread)

const markAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error)
  }
}
</script>
