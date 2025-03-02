<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          {{ $t('auth.login_title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          {{ $t('auth.login_subtitle') }}
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">{{ $t('auth.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.email_placeholder')"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{ $t('auth.password') }}</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.password_placeholder')"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-400">
              {{ $t('auth.remember_me') }}
            </label>
          </div>

          <div class="text-sm">
            <router-link
              to="/forgot-password"
              class="font-medium text-blue-500 hover:text-blue-400"
            >
              {{ $t('auth.forgot_password') }}
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon 
                class="h-5 w-5 text-blue-500 group-hover:text-blue-400" 
                aria-hidden="true" 
              />
            </span>
            {{ loading ? $t('auth.logging_in') : $t('auth.login') }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-400">
          {{ $t('auth.no_account') }}
          <router-link
            to="/register"
            class="font-medium text-blue-500 hover:text-blue-400"
          >
            {{ $t('auth.register_now') }}
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
import { LockClosedIcon } from '@heroicons/vue/20/solid'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const form = ref({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  try {
    loading.value = true
    await authStore.login({
      identifier: form.value.email,
      password: form.value.password
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Erreur de connexion:', error)
  } finally {
    loading.value = false
  }
}
</script>