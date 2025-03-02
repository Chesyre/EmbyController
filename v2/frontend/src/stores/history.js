
import { defineStore } from 'pinia'
import axios from 'axios'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  }),

  getters: {
    sortedHistory: (state) => {
      return [...state.history].sort((a, b) => {
        return new Date(b.watchedAt) - new Date(a.watchedAt)
      })
    },

    recentlyWatched: (state) => {
      return state.history.slice(0, 5)
    },

    watchTimeStats: (state) => {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

      const recentHistory = state.history.filter(item => 
        new Date(item.watchedAt) >= thirtyDaysAgo
      )

      const totalMinutes = recentHistory.reduce((acc, item) => {
        return acc + (item.media.duration || 0) * (item.progress / 100)
      }, 0)

      return {
        totalHours: Math.round(totalMinutes / 60),
        averageHoursPerDay: Math.round((totalMinutes / 60 / 30) * 10) / 10
      }
    }
  },

  actions: {
    async fetchHistory({ page = 1, pageSize = 10 } = {}) {
      try {
        this.loading = true
        const response = await axios.get('/api/watch-history', {
          params: { page, pageSize },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.history = response.data.data
        this.pagination = {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement de l\'historique'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProgress(mediaId, progress) {
      try {
        const response = await axios.post(`/api/watch-history/${mediaId}/progress`, {
          progress
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        // Mettre à jour l'historique local
        const historyItem = this.history.find(item => item.media.id === mediaId)
        if (historyItem) {
          historyItem.progress = progress
          historyItem.watchedAt = new Date().toISOString()
        } else {
          this.history.unshift(response.data)
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour de la progression'
        throw error
      }
    },

    async removeFromHistory(historyId) {
      try {
        await axios.delete(`/api/watch-history/${historyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.history = this.history.filter(item => item.id !== historyId)
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de l\'historique'
        throw error
      }
    },

    async clearHistory() {
      try {
        await axios.delete('/api/watch-history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.history = []
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de l\'historique'
        throw error
      }
    }
  }
})
