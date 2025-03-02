import { defineStore } from 'pinia'
import axios from 'axios'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
  }),

  getters: {
    hasUnread: (state) => state.unreadCount > 0,
    sortedNotifications: (state) => {
      return [...state.notifications].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    }
  },

  actions: {
    async fetchNotifications() {
      try {
        this.loading = true
        const response = await axios.get('/api/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.notifications = response.data
        this.updateUnreadCount()
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement des notifications'
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationId) {
      try {
        await axios.put(`/api/notifications/${notificationId}/read`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        const notification = this.notifications.find(n => n.id === notificationId)
        if (notification) {
          notification.read = true
          this.updateUnreadCount()
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du marquage comme lu'
        throw error
      }
    },

    async markAllAsRead() {
      try {
        await axios.put('/api/notifications/read-all', null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        this.notifications.forEach(n => n.read = true)
        this.updateUnreadCount()
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du marquage comme lu'
        throw error
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => !n.read).length
    },

    // Pour les notifications en temps réel via WebSocket
    handleNewNotification(notification) {
      this.notifications.unshift(notification)
      if (!notification.read) {
        this.unreadCount++
      }
    }
  }
})