import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    // Inscription
    async register(userData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.post('/api/auth/local/register', userData)
        
        this.token = response.data.jwt
        this.user = response.data.user
        
        localStorage.setItem('token', this.token)
        
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur d\'inscription'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Connexion
    async login(credentials) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.post('/api/auth/local', credentials)
        
        this.token = response.data.jwt
        this.user = response.data.user
        
        localStorage.setItem('token', this.token)
        
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de connexion'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Déconnexion
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },

    // Vérification du token
    async checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await axios.get('/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          this.token = token
          this.user = response.data
        } catch (error) {
          this.logout()
        }
      }
    },

    // Mise à jour du profil
    async updateProfile(profileData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.put(`/api/users/${this.user.id}`, profileData, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        this.user = response.data
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de mise à jour du profil'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})