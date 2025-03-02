import axios from 'axios'

class EmbyService {
  constructor() {
    this.baseURL = process.env.EMBY_API_URL
    this.apiKey = process.env.EMBY_API_KEY
  }

  // Configuration de l'instance axios
  getAxiosInstance() {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-Emby-Token': this.apiKey,
        'Content-Type': 'application/json'
      }
    })
  }

  // Gestion des utilisateurs
  async createUser(username) {
    const api = this.getAxiosInstance()
    const response = await api.post('/Users/New', {
      Name: username
    })
    return response.data
  }

  async updateUserPolicy(userId, policy) {
    const api = this.getAxiosInstance()
    await api.post(`/Users/${userId}/Policy`, policy)
  }

  async getUserInfo(userId) {
    const api = this.getAxiosInstance()
    const response = await api.get(`/Users/${userId}`)
    return response.data
  }

  async setUserPassword(userId, password) {
    const api = this.getAxiosInstance()
    await api.post(`/Users/${userId}/Password`, {
      NewPw: password
    })
  }

  // Gestion des appareils
  async getUserDevices(userId) {
    const api = this.getAxiosInstance()
    const response = await api.get(`/Devices?UserId=${userId}`)
    return response.data
  }

  async deleteDevice(deviceId) {
    const api = this.getAxiosInstance()
    await api.delete(`/Devices?Id=${deviceId}`)
  }

  // Gestion des sessions
  async getCurrentSessions() {
    const api = this.getAxiosInstance()
    const response = await api.get('/Sessions')
    return response.data
  }

  async stopSession(sessionId) {
    const api = this.getAxiosInstance()
    await api.delete(`/Sessions/${sessionId}`)
  }

  // Statistiques
  async getServerStats() {
    const api = this.getAxiosInstance()
    const response = await api.get('/System/Info')
    return response.data
  }

  async getUserStats(userId) {
    const api = this.getAxiosInstance()
    const response = await api.get(`/Users/${userId}/Items/Counts`)
    return response.data
  }

  // Gestion de la bibliothèque
  async getLatestMedia() {
    const api = this.getAxiosInstance()
    const response = await api.get('/Items/Latest')
    return response.data
  }

  async searchMedia(query) {
    const api = this.getAxiosInstance()
    const response = await api.get('/Items', {
      params: {
        SearchTerm: query,
        IncludeItemTypes: 'Movie,Series',
        Recursive: true
      }
    })
    return response.data
  }

  // Gestion de la lecture
  async getPlaybackInfo(itemId, userId) {
    const api = this.getAxiosInstance()
    const response = await api.get(`/Items/${itemId}/PlaybackInfo`, {
      params: { userId }
    })
    return response.data
  }

  async reportPlaybackStart(data) {
    const api = this.getAxiosInstance()
    await api.post('/Sessions/Playing', data)
  }

  async reportPlaybackProgress(data) {
    const api = this.getAxiosInstance()
    await api.post('/Sessions/Playing/Progress', data)
  }

  async reportPlaybackStopped(data) {
    const api = this.getAxiosInstance()
    await api.post('/Sessions/Playing/Stopped', data)
  }
}

export const embyService = new EmbyService()