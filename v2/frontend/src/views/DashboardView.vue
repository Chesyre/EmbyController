<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-white">
        {{ $t('dashboard.welcome', { name: user?.username }) }}
      </h1>

      <!-- Statistiques -->
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <component 
                  :is="stat.icon" 
                  class="h-6 w-6 text-gray-400" 
                  aria-hidden="true" 
                />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-400 truncate">
                    {{ stat.name }}
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-white">
                      {{ stat.value }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activité récente -->
      <div class="mt-8">
        <h2 class="text-lg font-medium text-white">
          {{ $t('dashboard.recent_activity') }}
        </h2>
        <div class="mt-4 bg-gray-800 shadow rounded-lg">
          <div class="p-6">
            <ul class="divide-y divide-gray-700">
              <li
                v-for="activity in recentActivity"
                :key="activity.id"
                class="py-4"
              >
                <div class="flex space-x-3">
                  <div class="flex-1">
                    <p class="text-sm text-white">
                      {{ activity.description }}
                    </p>
                    <p class="mt-1 text-sm text-gray-400">
                      {{ activity.date }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  UsersIcon,
  FilmIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = authStore.currentUser

// Données simulées pour la démo
const stats = ref([
  { name: 'Utilisateurs actifs', value: '2,451', icon: UsersIcon },
  { name: 'Films disponibles', value: '12,426', icon: FilmIcon },
  { name: 'Temps de visionnage', value: '24.5h', icon: ClockIcon }
])

const recentActivity = ref([
  {
    id: 1,
    description: 'Nouveau film ajouté: "Les Évadés"',
    date: 'Il y a 2 heures'
  },
  {
    id: 2,
    description: 'Mise à jour du système effectuée',
    date: 'Il y a 4 heures'
  },
  {
    id: 3,
    description: 'Nouvel utilisateur inscrit',
    date: 'Il y a 6 heures'
  }
])

onMounted(async () => {
  // Charger les données réelles ici
})
</script>