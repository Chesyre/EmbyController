import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import { useAuthStore } from '@/stores/auth'

class WebSocketService {
  constructor() {
    this.socket = null
    this.connected = ref(false)
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectTimeout = null
  }

  connect() {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return

    // Utiliser le protocole WebSocket approprié
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`

    this.socket = new WebSocket(wsUrl)

    this.socket.onopen = () => {
      console.log('WebSocket connecté')
      this.connected.value = true
      this.reconnectAttempts = 0
      
      // Envoyer le token d'authentification
      this.socket.send(JSON.stringify({
        type: 'auth',
        token: localStorage.getItem('token')
      }))
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('Erreur de parsing du message WebSocket:', error)
      }
    }

    this.socket.onclose = () => {
      console.log('WebSocket déconnecté')
      this.connected.value = false
      this.attemptReconnect()
    }

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error)
      this.connected.value = false
    }
  }

  handleMessage(data) {
    const notificationStore = useNotificationStore()

    switch (data.type) {
      case 'notification':
        notificationStore.handleNewNotification(data.notification)
        break
      
      case 'comment':
        // Gérer les nouveaux commentaires
        break
      
      case 'media_update':
        // Gérer les mises à jour des médias
        break
      
      default:
        console.warn('Type de message WebSocket non géré:', data.type)
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Nombre maximum de tentatives de reconnexion atteint')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Tentative de reconnexion ${this.reconnectAttempts}...`)
      this.connect()
    }, delay)
  }

  send(data) {
    if (this.socket && this.connected.value) {
      this.socket.send(JSON.stringify(data))
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
  }
}

export const wsService = new WebSocketService()