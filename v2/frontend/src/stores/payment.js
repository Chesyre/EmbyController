import { defineStore } from 'pinia'
import axios from 'axios'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  }),

  getters: {
    sortedPayments: (state) => {
      return [...state.payments].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },

    totalAmount: (state) => {
      return state.payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    }
  },

  actions: {
    async createPayment(data) {
      try {
        this.loading = true
        const response = await axios.post('/api/payments', data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.payments.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création du paiement'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPayments({ page = 1, pageSize = 10 } = {}) {
      try {
        this.loading = true
        const response = await axios.get('/api/payments', {
          params: { page, pageSize },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.payments = response.data.data
        this.pagination = {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des paiements'
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkPaymentStatus(paymentId) {
      try {
        const response = await axios.get(`/api/payments/${paymentId}/status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        const index = this.payments.findIndex(p => p.id === paymentId)
        if (index !== -1) {
          this.payments[index] = response.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la vérification du paiement'
        throw error
      }
    },

    async getPaymentMethods() {
      try {
        const response = await axios.get('/api/payment-methods', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération des méthodes de paiement'
        throw error
      }
    }
  }
})