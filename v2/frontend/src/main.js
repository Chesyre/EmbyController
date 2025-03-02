// Fichier principal de l'application Vue
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Configuration i18n pour la localisation française
const i18n = createI18n({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr: {
      // Messages de l'interface utilisateur
      common: {
        welcome: 'Bienvenue sur Emby Controller',
        login: 'Connexion',
        register: 'Inscription',
        logout: 'Déconnexion',
        dashboard: 'Tableau de bord',
        profile: 'Profil',
        settings: 'Paramètres'
      },
      // Messages d'erreur
      errors: {
        login_failed: 'Échec de la connexion',
        invalid_credentials: 'Identifiants invalides',
        server_error: 'Erreur serveur'
      }
    }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')