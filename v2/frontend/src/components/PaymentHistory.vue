<template>
  <div class="space-y-6">
    <h2 class="text-lg font-medium text-white">
      {{ $t('payment.history') }}
    </h2>

    <!-- Liste des paiements -->
    <div class="bg-gray-800 shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              {{ $t('payment.date') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              {{ $t('payment.amount') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              {{ $t('payment.method') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              {{ $t('payment.status') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              {{ $t('payment.transaction_id') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="payment in payments" :key="payment.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
              {{ formatDate(payment.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
              {{ formatAmount(payment.amount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
              {{ getPaymentMethodName(payment.paymentMethod) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(payment.status)
                ]"
              >
                {{ getStatusText(payment.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
              {{ payment.transactionId }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Message si aucun paiement -->
      <div
        v-if="payments.length === 0"
        class="px-6 py-4 text-center text-gray-400"
      >
        {{ $t('payment.no_payments') }}
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex justify-center mt-4"
    >
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-5 w-5" />
        </button>
        
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            page === currentPage
              ? 'z-10 bg-blue-600 border-blue-600 text-white'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700',
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
          ]"
        >
          {{ page }}
        </button>
        
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { usePaymentStore } from '@/stores/payment'

const paymentStore = usePaymentStore()
const currentPage = ref(1)
const pageSize = ref(10)

const payments = computed(() => paymentStore.sortedPayments)
const totalPages = computed(() => Math.ceil(paymentStore.pagination.total / pageSize.value))

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  
  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (currentPage.value > 2) {
      pages.push('...')
    }
    
    for (let i = Math.max(2, currentPage.value - 1); i <= Math.min(totalPages.value - 1, currentPage.value + 1); i++) {
      pages.push(i)
    }
    
    if (currentPage.value < totalPages.value - 1) {
      pages.push('...')
    }
    
    pages.push(totalPages.value)
  }
  
  return pages
})

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr
  })
}

const formatAmount = (amount) => {
  return `¥ ${parseFloat(amount).toFixed(2)}`
}

const getPaymentMethodName = (method) => {
  const methods = {
    alipay: 'Alipay',
    wechat: 'WeChat Pay',
    balance: 'Solde'
  }
  return methods[method] || method
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'En attente',
    completed: 'Terminé',
    failed: 'Échoué',
    refunded: 'Remboursé'
  }
  return texts[status] || status
}

const changePage = async (page) => {
  if (page === '...') return
  
  try {
    currentPage.value = page
    await paymentStore.fetchPayments({
      page,
      pageSize: pageSize.value
    })
  } catch (error) {
    console.error('Erreur lors du changement de page:', error)
  }
}

onMounted(async () => {
  try {
    await paymentStore.fetchPayments({
      page: currentPage.value,
      pageSize: pageSize.value
    })
  } catch (error) {
    console.error('Erreur lors du chargement des paiements:', error)
  }
})
</script>
