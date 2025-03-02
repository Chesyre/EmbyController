import { defineStore } from 'pinia'
import axios from 'axios'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    devices: [],
    loading: false,
    error: null
  }),

  getters: {
    activeDevices: (state) => {
      return state.devices.filter(device => device.status === 'active')
    },

    deviceCount: (state) => {
      return state.devices.length
    }
  },

  actions: {
    async fetchDevices() {
      try {
        this.loading = true
        const response = await axios.get('/api/devices', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.devices = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des appareils'
        throw error
      } finally {
        this.loading = false
      }
    },

    async renameDevice(deviceId, newName) {
      try {
        const response = await axios.put(`/api/devices/${deviceId}`, {
          name: newName
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const index = this.devices.findIndex(d => d.id === deviceId)
        if (index !== -1) {
          this.devices[index] = response.data
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du renommage de l\'appareil'
        throw error
      }
    },

    async blockDevice(deviceId) {
      try {
        await axios.post(`/api/devices/${deviceId}/block`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const device = this.devices.find(d => d.id === deviceId)
        if (device) {
          device.status = 'blocked'
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du blocage de l\'appareil'
        throw error
      }
    },

    async unblockDevice(deviceId) {
      try {
        await axios.post(`/api/devices/${deviceId}/unblock`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const device = this.devices.find(d => d.id === deviceId)
        if (device) {
          device.status = 'active'
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du déblocage de l\'appareil'
        throw error
      }
    },

    async removeDevice(deviceId) {
      try {
        await axios.delete(`/api/devices/${deviceId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.devices = this.devices.filter(d => d.id !== deviceId)
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de l\'appareil'
        throw error
      }
    }
  }
})