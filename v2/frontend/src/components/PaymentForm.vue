<template>
  <div class="space-y-6">
    <div class="bg-gray-800 rounded-lg p-6">
      <h2 class="text-lg font-medium text-white mb-4">
        {{ $t('payment.recharge') }}
      </h2>

      <!-- Montant -->
      <div class="space-y-4">
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-400">
            {{ $t('payment.amount') }}
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">¥</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              v-model="amount"
              class="block w-full pl-7 pr-12 bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">CNY</span>
            </div>
          </div>
        </div>

        <!-- Méthodes de paiement -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">
            {{ $t('payment.method') }}
          </label>
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="method in paymentMethods"
              :key="method.id"
              type="button"
              @click="selectedMethod = method.id"
              :class="[
                selectedMethod === method.id
                  ? 'ring-2 ring-blue-500 bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600',
                'p-4 rounded-lg flex items-center justify-center'
              ]"
            >
              <component
                :is="method.icon"
                class="h-6 w-6 mr-2"
              />
              {{ method.name }}
            </button>
          </div>
        </div>

        <!-- Bouton de paiement -->
        <div class="mt-6">
          <button
            type="button"
            @click="handlePayment"
            :disabled="!isValid || loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? $t('payment.processing') : $t('payment.pay_now') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Code d'échange -->
    <div class="bg-gray-800 rounded-lg p-6">
      <h2 class="text-lg font-medium text-white mb-4">
        {{ $t('payment.redeem_code') }}
      </h2>
      <div class="flex space-x-4">
        <input
          type="text"
          v-model="exchangeCode"
          class="flex-1 bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          :placeholder="$t('payment.code_placeholder')"
        />
        <button
          type="button"
          @click="redeemCode"
          :disabled="!exchangeCode || loading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ loading ? $t('payment.redeeming') : $t('payment.redeem') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePaymentStore } from '@/stores/payment'
import { useExchangeCodeStore } from '@/stores/exchangeCode'

const paymentStore = usePaymentStore()
const exchangeCodeStore = useExchangeCodeStore()

const amount = ref('')
const selectedMethod = ref(null)
const exchangeCode = ref('')
const loading = ref(false)

const paymentMethods = [
  {
    id: 'alipay',
    name: 'Alipay',
    icon: 'AlipayIcon'
  },
  {
    id: 'wechat',
    name: 'WeChat',
    icon: 'WeChatIcon'
  }
]

const isValid = computed(() => {
  return amount.value > 0 && selectedMethod.value
})

const handlePayment = async () => {
  if (!isValid.value) return

  try {
    loading.value = true
    await paymentStore.createPayment({
      amount: parseFloat(amount.value),
      method: selectedMethod.value
    })
    // Rediriger vers la page de paiement ou afficher le QR code
  } catch (error) {
    console.error('Erreur de paiement:', error)
  } finally {
    loading.value = false
  }
}

const redeemCode = async () => {
  if (!exchangeCode.value) return

  try {
    loading.value = true
    await exchangeCodeStore.redeemCode(exchangeCode.value)
    exchangeCode.value = ''
    // Afficher un message de succès
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
  } finally {
    loading.value = false
  }
}
</script>