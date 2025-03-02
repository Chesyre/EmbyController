import { defineStore } from 'pinia'
import axios from 'axios'

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tickets: [],
    currentTicket: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  }),

  getters: {
    sortedTickets: (state) => {
      return [...state.tickets].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
    },

    openTicketsCount: (state) => {
      return state.tickets.filter(ticket => ticket.status === 'open').length
    }
  },

  actions: {
    async fetchTickets({ page = 1, pageSize = 10 } = {}) {
      try {
        this.loading = true
        const response = await axios.get('/api/tickets', {
          params: { page, pageSize },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.tickets = response.data.data
        this.pagination = {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des tickets'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getTicket(id) {
      try {
        this.loading = true
        const response = await axios.get(`/api/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.currentTicket = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement du ticket'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTicket(ticketData) {
      try {
        this.loading = true
        const response = await axios.post('/api/tickets', ticketData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        this.tickets.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création du ticket'
        throw error
      } finally {
        this.loading = false
      }
    },

    async replyToTicket(ticketId, replyData) {
      try {
        this.loading = true
        const response = await axios.post(`/api/tickets/${ticketId}/reply`, replyData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        if (this.currentTicket && this.currentTicket.id === ticketId) {
          this.currentTicket.messages.push(response.data)
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'envoi de la réponse'
        throw error
      } finally {
        this.loading = false
      }
    },

    async closeTicket(ticketId) {
      try {
        this.loading = true
        await axios.post(`/api/tickets/${ticketId}/close`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        // Mettre à jour le statut dans le state
        const ticket = this.tickets.find(t => t.id === ticketId)
        if (ticket) {
          ticket.status = 'closed'
        }
        if (this.currentTicket && this.currentTicket.id === ticketId) {
          this.currentTicket.status = 'closed'
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la fermeture du ticket'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})