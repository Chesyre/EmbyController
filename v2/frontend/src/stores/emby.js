import { defineStore } from 'pinia'
import { embyService } from '@/services/emby'

export const useEmbyStore = defineStore('emby', {
  state: () => ({
    serverInfo: null,
    currentSessions: [],
    latestMedia: [],
    loading: false,
    error: null
  }),

  getters: {
    isServerOnline: (state) => !!state.serverInfo,
    activeSessionsCount: (state) => state.currentSessions.length,
    serverVersion: (state) => state.serverInfo?.Version || 'Unknown'
  },

  actions: {
    async initializeServer() {
      try {
        this.loading = true
        this.serverInfo = await embyService.getServerStats()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCurrentSessions() {
      try {
        this.loading = true
        this.currentSessions = await embyService.getCurrentSessions()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchLatestMedia() {
      try {
        this.loading = true
        this.latestMedia = await embyService.getLatestMedia()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createEmbyUser(username) {
      try {
        this.loading = true
        const user = await embyService.createUser(username)
        return user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async setUserPassword(userId, password) {
      try {
        this.loading = true
        await embyService.setUserPassword(userId, password)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserPolicy(userId, policy) {
      try {
        this.loading = true
        await embyService.updateUserPolicy(userId, policy)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getUserDevices(userId) {
      try {
        this.loading = true
        return await embyService.getUserDevices(userId)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDevice(deviceId) {
      try {
        this.loading = true
        await embyService.deleteDevice(deviceId)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async stopSession(sessionId) {
      try {
        this.loading = true
        await embyService.stopSession(sessionId)
        this.currentSessions = this.currentSessions.filter(
          session => session.Id !== sessionId
        )
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})