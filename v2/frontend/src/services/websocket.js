import { io } from 'socket.io-client'
import { useNotificationStore } from '@/stores/notifications'

class WebSocketService {
  constructor() {
    this.socket = null
    this.connected = false
    this.notificationStore = useNotificationStore()
  }

  connect() {
    if (this.socket) return

    this.socket = io(process.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    })

    this.socket.on('connect', () => {
      this.connected = true
      console.log('WebSocket connected')
    })

    this.socket.on('notification', (notification) => {
      this.notificationStore.addNotification(notification)
    })

    this.socket.on('disconnect', () => {
      this.connected = false
      console.log('WebSocket disconnected')
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data)
    }
  }
}

export const wsService = new WebSocketService()