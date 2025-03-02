<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          {{ $t('register.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          {{ $t('register.subtitle') }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- Nom d'utilisateur -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-400">
            {{ $t('register.username') }}
          </label>
          <div class="mt-1">
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :placeholder="$t('register.username_placeholder')"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-400">
            {{ $t('register.email') }}
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :placeholder="$t('register.email_placeholder')"
            />
          </div>
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-400">
            {{ $t('register.password') }}
          </label>
          <div class="mt-1">
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :placeholder="$t('register.password_placeholder')"
            />
          </div>
        </div>

        <!-- Confirmation du mot de passe -->
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-400">
            {{ $t('register.confirm_password') }}
          </label>
          <div class="mt-1">
            <input
              id="password_confirmation"
              v-model="form.passwordConfirmation"
              type="password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :placeholder="$t('register.confirm_password_placeholder')"
            />
          </div>
        </div>

        <!-- Conditions d'utilisation -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-400">
            {{ $t('register.accept_terms_1') }}
            <a href="#" class="text-blue-500 hover:text-blue-400">
              {{ $t('register.terms_of_service') }}
            </a>
            {{ $t('register.accept_terms_2') }}
            <a href="#" class="text-blue-500 hover:text-blue-400">
              {{ $t('register.privacy_policy') }}
            </a>
          </label>
        </div>

        <!-- Bouton d'inscription -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ loading ? $t('register.registering') : $t('register.submit') }}
          </button>
        </div>
      </form>

      <!-- Lien de connexion -->
      <div class="text-center">
        <p class="text-sm text-gray-400">
          {{ $t('register.already_registered') }}
          <router-link
            to="/login"
            class="font-medium text-blue-500 hover:text-blue-400"
          >
            {{ $t('register.login_here') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const form = ref({
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
})

const handleRegister = async () => {
  if (form.value.password !== form.value.passwordConfirmation) {
    // TODO: Afficher une erreur
    return
  }

  try {
    loading.value = true
    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
  } finally {
    loading.value = false
  }
}
</script>