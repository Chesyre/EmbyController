import { defineStore } from 'pinia'
import axios from 'axios'

export const useMediaStore = defineStore('media', {
  state: () => ({
    mediaList: [],
    currentMedia: null,
    favorites: [],
    loading: false,
    error: null,
    filters: {
      type: 'all',
      sort: 'recent',
      search: ''
    },
    pagination: {
      page: 1,
      pageSize: 12,
      total: 0
    }
  }),

  getters: {
    filteredMedia: (state) => {
      let result = [...state.mediaList]

      // Filtre par type
      if (state.filters.type !== 'all') {
        result = result.filter(media => media.type === state.filters.type)
      }

      // Filtre par recherche
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        result = result.filter(media => 
          media.title.toLowerCase().includes(search) ||
          media.description.toLowerCase().includes(search)
        )
      }

      // Tri
      switch (state.filters.sort) {
        case 'recent':
          result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
          break
        case 'rating':
          result.sort((a, b) => b.rating - a.rating)
          break
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title))
          break
      }

      return result
    },

    totalPages: (state) => {
      return Math.ceil(state.pagination.total / state.pagination.pageSize)
    }
  },

  actions: {
    async fetchMedia({ page = 1, pageSize = 12 } = {}) {
      try {
        this.loading = true
        const response = await axios.get('/api/media', {
          params: {
            page,
            pageSize,
            type: this.filters.type,
            sort: this.filters.sort,
            search: this.filters.search
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.mediaList = response.data.data
        this.pagination = {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des médias'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getMediaDetails(id) {
      try {
        this.loading = true
        const response = await axios.get(`/api/media/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.currentMedia = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des détails'
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleFavorite(id) {
      try {
        const response = await axios.post(`/api/media/${id}/favorite`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        // Mettre à jour l'état local
        const mediaIndex = this.mediaList.findIndex(m => m.id === id)
        if (mediaIndex !== -1) {
          this.mediaList[mediaIndex].isFavorite = response.data.isFavorite
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour des favoris'
        throw error
      }
    },

    async getStats() {
      try {
        const response = await axios.get('/api/media/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des statistiques'
        throw error
      }
    },

    setFilters(filters) {
      this.filters = {
        ...this.filters,
        ...filters
      }
      // Recharger les médias avec les nouveaux filtres
      this.fetchMedia()
    },

    clearError() {
      this.error = null
    }
  }
})