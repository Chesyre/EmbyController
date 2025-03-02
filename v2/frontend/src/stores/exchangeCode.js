import { defineStore } from 'pinia'
import axios from 'axios'

export const useExchangeCodeStore = defineStore('exchangeCode', {
  state: () => ({
    codes: [],
    loading: false,
    error: null
  }),

  actions: {
    async redeemCode(code) {
      try {
        this.loading = true
        const response = await axios.post('/api/exchange-codes/redeem', { code })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'échange du code'
        throw error
      } finally {
        this.loading = false
      }
    },

    async generateCode(data) {
      try {
        this.loading = true
        const response = await axios.post('/api/exchange-codes', data)
        this.codes.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la génération du code'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCodes() {
      try {
        this.loading = true
        const response = await axios.get('/api/exchange-codes')
        this.codes = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des codes'
        throw error
      } finally {
        this.loading = false
      }
    },

    async disableCode(codeId) {
      try {
        this.loading = true
        await axios.put(`/api/exchange-codes/${codeId}/disable`)
        const index = this.codes.findIndex(code => code.id === codeId)
        if (index !== -1) {
          this.codes[index].status = 'disabled'
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la désactivation du code'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})