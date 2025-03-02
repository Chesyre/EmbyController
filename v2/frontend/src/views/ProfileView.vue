<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-white mb-6">
        {{ $t('profile.title') }}
      </h1>

      <div class="bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <form @submit.prevent="handleSubmit">
            <!-- Photo de profil -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-400 mb-2">
                {{ $t('profile.avatar') }}
              </label>
              <div class="flex items-center">
                <img
                  :src="form.avatar_url || defaultAvatar"
                  alt=""
                  class="h-16 w-16 rounded-full"
                />
                <button
                  type="button"
                  class="ml-4 bg-gray-700 px-3 py-2 text-sm text-white rounded-md hover:bg-gray-600"
                  @click="triggerFileInput"
                >
                  {{ $t('profile.change_avatar') }}
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
              </div>
            </div>

            <!-- Informations de base -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-400">
                  {{ $t('profile.username') }}
                </label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-400">
                  {{ $t('profile.email') }}
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="language" class="block text-sm font-medium text-gray-400">
                  {{ $t('profile.language') }}
                </label>
                <select
                  id="language"
                  v-model="form.language"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label for="timezone" class="block text-sm font-medium text-gray-400">
                  {{ $t('profile.timezone') }}
                </label>
                <select
                  id="timezone"
                  v-model="form.timezone"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <!-- Bio -->
            <div class="mt-6">
              <label for="bio" class="block text-sm font-medium text-gray-400">
                {{ $t('profile.bio') }}
              </label>
              <textarea
                id="bio"
                v-model="form.bio"
                rows="4"
                class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <!-- Boutons -->
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                @click="resetForm"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ loading ? $t('common.saving') : $t('common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const fileInput = ref(null)
const loading = ref(false)
const defaultAvatar = '/default-avatar.png'

const form = ref({
  username: '',
  email: '',
  bio: '',
  language: 'fr',
  timezone: 'Europe/Paris',
  avatar_url: ''
})

onMounted(() => {
  // Charger les données du profil
  const user = authStore.currentUser
  if (user) {
    form.value = {
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      language: user.language || 'fr',
      timezone: user.timezone || 'Europe/Paris',
      avatar_url: user.avatar_url
    }
  }
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      // TODO: Implémenter le téléchargement de l'avatar
      console.log('Téléchargement de l\'avatar:', file)
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'avatar:', error)
    }
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    await authStore.updateProfile(form.value)
    // TODO: Afficher un message de succès
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    // TODO: Afficher un message d'erreur
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  const user = authStore.currentUser
  if (user) {
    form.value = {
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      language: user.language || 'fr',
      timezone: user.timezone || 'Europe/Paris',
      avatar_url: user.avatar_url
    }
  }
}
</script>