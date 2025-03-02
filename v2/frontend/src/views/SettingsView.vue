<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-white mb-6">
        {{ $t('settings.title') }}
      </h1>

      <div class="space-y-6">
        <!-- Paramètres de notification -->
        <div class="bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-white mb-4">
              {{ $t('settings.notifications') }}
            </h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-white">
                    {{ $t('settings.email_notifications') }}
                  </h3>
                  <p class="text-sm text-gray-400">
                    {{ $t('settings.email_notifications_description') }}
                  </p>
                </div>
                <Switch
                  v-model="settings.emailNotifications"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-700'"
                >
                  <span class="sr-only">{{ $t('settings.enable_email_notifications') }}</span>
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                  />
                </Switch>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-white">
                    {{ $t('settings.telegram_notifications') }}
                  </h3>
                  <p class="text-sm text-gray-400">
                    {{ $t('settings.telegram_notifications_description') }}
                  </p>
                </div>
                <Switch
                  v-model="settings.telegramNotifications"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.telegramNotifications ? 'bg-blue-600' : 'bg-gray-700'"
                >
                  <span class="sr-only">{{ $t('settings.enable_telegram_notifications') }}</span>
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.telegramNotifications ? 'translate-x-6' : 'translate-x-1'"
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>

        <!-- Paramètres de sécurité -->
        <div class="bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-white mb-4">
              {{ $t('settings.security') }}
            </h2>
            <div class="space-y-4">
              <div>
                <label for="current_password" class="block text-sm font-medium text-gray-400">
                  {{ $t('settings.current_password') }}
                </label>
                <input
                  id="current_password"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="new_password" class="block text-sm font-medium text-gray-400">
                  {{ $t('settings.new_password') }}
                </label>
                <input
                  id="new_password"
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="confirm_password" class="block text-sm font-medium text-gray-400">
                  {{ $t('settings.confirm_password') }}
                </label>
                <input
                  id="confirm_password"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div class="flex justify-end">
                <button
                  type="button"
                  @click="changePassword"
                  :disabled="passwordLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ passwordLoading ? $t('settings.changing_password') : $t('settings.change_password') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Paramètres de l'application -->
        <div class="bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-white mb-4">
              {{ $t('settings.app_settings') }}
            </h2>
            <div class="space-y-4">
              <div>
                <label for="theme" class="block text-sm font-medium text-gray-400">
                  {{ $t('settings.theme') }}
                </label>
                <select
                  id="theme"
                  v-model="settings.theme"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="system">{{ $t('settings.theme_system') }}</option>
                  <option value="dark">{{ $t('settings.theme_dark') }}</option>
                  <option value="light">{{ $t('settings.theme_light') }}</option>
                </select>
              </div>

              <div>
                <label for="quality" class="block text-sm font-medium text-gray-400">
                  {{ $t('settings.default_quality') }}
                </label>
                <select
                  id="quality"
                  v-model="settings.defaultQuality"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="auto">{{ $t('settings.quality_auto') }}</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton de sauvegarde -->
        <div class="flex justify-end">
          <button
            type="button"
            @click="saveSettings"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ loading ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Switch } from '@headlessui/vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const passwordLoading = ref(false)

const settings = ref({
  emailNotifications: true,
  telegramNotifications: false,
  theme: 'system',
  defaultQuality: 'auto'
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(async () => {
  // Charger les paramètres de l'utilisateur
  try {
    const userSettings = await authStore.getUserSettings()
    settings.value = {
      ...settings.value,
      ...userSettings
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
  }
})

const saveSettings = async () => {
  try {
    loading.value = true
    await authStore.updateSettings(settings.value)
    // TODO: Afficher un message de succès
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error)
    // TODO: Afficher un message d'erreur
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    // TODO: Afficher une erreur
    return
  }

  try {
    passwordLoading.value = true
    await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    // TODO: Afficher un message de succès
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    // TODO: Afficher un message d'erreur
  } finally {
    passwordLoading.value = false
  }
}
</script>