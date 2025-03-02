<template>
  <div class="space-y-6">
    <div class="bg-gray-800 rounded-lg p-6">
      <h2 class="text-lg font-medium text-white mb-4">
        {{ $t('exchange.redeem_code') }}
      </h2>
      <div class="space-y-4">
        <div>
          <label for="code" class="block text-sm font-medium text-gray-400">
            {{ $t('exchange.code') }}
          </label>
          <div class="mt-1">
            <input
              type="text"
              id="code"
              v-model="code"
              class="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              :placeholder="$t('exchange.code_placeholder')"
            />
          </div>
        </div>

        <button
          type="button"
          @click="redeemCode"
          :disabled="!code || loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ loading ? $t('exchange.redeeming') : $t('exchange.redeem') }}
        </button>
      </div>
    </div>

    <!-- Historique des codes utilisés -->
    <div class="bg-gray-800 rounded-lg p-6">
      <h2 class="text-lg font-medium text-white mb-4">
        {{ $t('exchange.history') }}
      </h2>
      <div class="space-y-4">
        <div
          v-for="code in usedCodes"
          :key="code.id"
          class="flex justify-between items-center py-3 border-b border-gray-700 last:border-0"
        >
          <div>
            <p class="text-white">{{ code.code }}</p>
            <p class="text-sm text-gray-400">
              {{ formatDate(code.usedAt) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-white">
              {{ formatValue(code.value, code.type) }}
            </p>
            <p class="text-sm text-gray-400">
              {{ getTypeText(code.type) }}
            </p>
          </div>
        </div>

        <!-- Message si aucun code utilisé -->
        <div
          v-if="usedCodes.length === 0"
          class="text-center text-gray-400 py-4"
        >
          {{ $t('exchange.no_history') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useExchangeCodeStore } from '@/stores/exchangeCode'

const exchangeCodeStore = useExchangeCodeStore()
const code = ref('')
const loading = ref(false)
const usedCodes = ref([])

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr
  })
}

const formatValue = (value, type) => {
  switch (type) {
    case 'activation':
      return 'Activation'
    case 'renewal':
      return `${value} jours`
    case 'credit':
      return `${value} R`
    default:
      return value
  }
}

const getTypeText = (type) => {
  const types = {
    activation: 'Activation',
    renewal: 'Renouvellement',
    credit: 'Crédit'
  }
  return types[type] || type
}

const redeemCode = async () => {
  if (!code.value) return

  try {
    loading.value = true
    await exchangeCodeStore.redeemCode(code.value)
    code.value = ''
    loadUsedCodes()
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
  } finally {
    loading.value = false
  }
}

const loadUsedCodes = async () => {
  try {
    const response = await exchangeCodeStore.fetchCodes()
    usedCodes.value = response.filter(code => code.status === 'used')
  } catch (error) {
    console.error('Erreur lors du chargement des codes:', error)
  }
}

onMounted(loadUsedCodes)
</script>
