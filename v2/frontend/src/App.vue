<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête de l'application -->
    <header v-if="isAuthenticated" class="bg-gray-800">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="h-8 w-auto" src="@/assets/logo.png" alt="Logo" />
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <router-link 
                  v-for="item in navigation" 
                  :key="item.name"
                  :to="item.href"
                  :class="[
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium'
                  ]"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <!-- Profil dropdown -->
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Contenu principal -->
    <main>
      <router-view></router-view>
    </main>

    <!-- Pied de page -->
    <footer class="bg-gray-800 mt-auto">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-400">
          © {{ new Date().getFullYear() }} Emby Controller. Tous droits réservés.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserMenu from '@/components/UserMenu.vue'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const navigation = ref([
  { name: 'Tableau de bord', href: '/dashboard', current: true },
  { name: 'Médias', href: '/media', current: false },
  { name: 'Profil', href: '/profile', current: false },
  { name: 'Paramètres', href: '/settings', current: false },
])
</script>