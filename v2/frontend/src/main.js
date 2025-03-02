import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { wsService } from './services/websocket'
import fr from './locales/fr'
import './assets/main.css'

// Configuration i18n
const i18n = createI18n({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: { fr }
})

// Création de l'application
const app = createApp(App)

// Installation des plugins
app.use(createPinia())
app.use(router)
app.use(i18n)

// Configuration globale d'Axios
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gestionnaire d'erreurs global
app.config.errorHandler = (err, vm, info) => {
  console.error('Erreur globale:', err)
  // TODO: Implémenter un système de notification des erreurs
}

// Initialisation du service WebSocket
wsService.connect()

// Montage de l'application
app.mount('#app')

// Nettoyage à la fermeture
window.addEventListener('beforeunload', () => {
  wsService.disconnect()
})

// Gestion des erreurs non capturées
window.addEventListener('unhandledrejection', event => {
  console.error('Promise non gérée:', event.reason)
  // TODO: Implémenter un système de notification des erreurs
})

// Exportation pour les tests
export { app, router, i18n }
