import { defineStore } from 'pinia'
import axios from 'axios'

export const useCommentStore = defineStore('comments', {
  state: () => ({
    comments: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  }),

  getters: {
    sortedComments: (state) => {
      return [...state.comments].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },

    averageRating: (state) => {
      if (state.comments.length === 0) return 0
      const sum = state.comments.reduce((acc, comment) => acc + comment.rating, 0)
      return (sum / state.comments.length).toFixed(1)
    }
  },

  actions: {
    async fetchComments(mediaId, { page = 1, pageSize = 10 } = {}) {
      try {
        this.loading = true
        const response = await axios.get(`/api/media/${mediaId}/comments`, {
          params: { page, pageSize },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.comments = response.data.data
        this.pagination = {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des commentaires'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addComment(mediaId, { content, rating }) {
      try {
        this.loading = true
        const response = await axios.post(`/api/media/${mediaId}/comments`, {
          content,
          rating
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.comments.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'ajout du commentaire'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateComment(mediaId, commentId, { content, rating }) {
      try {
        this.loading = true
        const response = await axios.put(`/api/media/${mediaId}/comments/${commentId}`, {
          content,
          rating
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const index = this.comments.findIndex(c => c.id === commentId)
        if (index !== -1) {
          this.comments[index] = response.data
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la modification du commentaire'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteComment(mediaId, commentId) {
      try {
        this.loading = true
        await axios.delete(`/api/media/${mediaId}/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.comments = this.comments.filter(c => c.id !== commentId)
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression du commentaire'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addReply(mediaId, commentId, content) {
      try {
        this.loading = true
        const response = await axios.post(`/api/media/${mediaId}/comments/${commentId}/replies`, {
          content
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const parentComment = this.comments.find(c => c.id === commentId)
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = []
          }
          parentComment.replies.push(response.data)
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'ajout de la réponse'
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