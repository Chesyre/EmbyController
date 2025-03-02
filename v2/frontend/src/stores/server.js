import { defineStore } from 'pinia'
import axios from 'axios'

export const useServerStore = defineStore('server', {
  state: () => ({
    servers: [],
    preferredServer: null,
    loading: false,
    error: null
  }),

  getters: {
    onlineServers: (state) => {
      return state.servers.filter(server => server.status === 'online')
    },

    preferredServerUrl: (state) => {
      if (state.preferredServer) {
        const server = state.servers.find(s => s.id === state.preferredServer)
        return server?.url
      }
      return null
    }
  },

  actions: {
    async fetchServers() {
      try {
        this.loading = true
        const response = await axios.get('/api/servers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.servers = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des serveurs'
        throw error
      } finally {
        this.loading = false
      }
    },

    async pingServer(serverId) {
      try {
        const server = this.servers.find(s => s.id === serverId)
        if (!server) return

        const response = await axios.get(`${server.url}/System/Ping`, {
          timeout: 5000
        })
        return response.status === 200
      } catch (error) {
        this.error = 'Erreur lors du ping du serveur'
        throw error
      }
    },

    async setPreferredServer(serverId) {
      try {
        await axios.post(`/api/servers/${serverId}/preferred`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.preferredServer = serverId
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la définition du serveur préféré'
        throw error
      }
    },

    async getServerStats(serverId) {
      try {
        const response = await axios.get(`/api/servers/${serverId}/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
        throw error
      }
    }
  }
})