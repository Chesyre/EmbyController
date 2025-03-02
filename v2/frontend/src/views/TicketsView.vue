
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-white">
          {{ $t('tickets.title') }}
        </h1>
        <button
          @click="openNewTicketDialog"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {{ $t('tickets.create_new') }}
        </button>
      </div>

      <!-- Liste des tickets -->
      <div class="bg-gray-800 shadow rounded-lg">
        <div class="divide-y divide-gray-700">
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            class="p-6 hover:bg-gray-700/50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <h3 class="text-lg font-medium text-white">
                    {{ ticket.title }}
                  </h3>
                  <span
                    :class="[
                      'ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusClass(ticket.status)
                    ]"
                  >
                    {{ getStatusText(ticket.status) }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-400">
                  {{ ticket.description }}
                </p>
                <div class="mt-2 flex items-center text-sm text-gray-400">
                  <ClockIcon class="h-4 w-4 mr-1" />
                  {{ formatDate(ticket.createdAt) }}
                  <span class="mx-2">•</span>
                  <ChatBubbleLeftIcon class="h-4 w-4 mr-1" />
                  {{ ticket.messageCount }} {{ $t('tickets.messages') }}
                </div>
              </div>
              <button
                @click="viewTicket(ticket.id)"
                class="ml-4 text-sm text-blue-400 hover:text-blue-300"
              >
                {{ $t('tickets.view') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Message si aucun ticket -->
        <div
          v-if="tickets.length === 0"
          class="p-6 text-center text-gray-400"
        >
          {{ $t('tickets.no_tickets') }}
        </div>
      </div>
    </div>

    <!-- Modal de nouveau ticket -->
    <NewTicketDialog
      v-if="showNewTicketDialog"
      @close="showNewTicketDialog = false"
      @submit="createTicket"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ClockIcon, ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import NewTicketDialog from '@/components/NewTicketDialog.vue'

const router = useRouter()
const tickets = ref([])
const showNewTicketDialog = ref(false)

const getStatusClass = (status) => {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'closed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'open':
      return 'Ouvert'
    case 'pending':
      return 'En attente'
    case 'closed':
      return 'Fermé'
    default:
      return status
  }
}

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr
  })
}

const openNewTicketDialog = () => {
  showNewTicketDialog.value = true
}

const createTicket = async (ticketData) => {
  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(ticketData)
    })

    if (response.ok) {
      const newTicket = await response.json()
      tickets.value.unshift(newTicket)
      showNewTicketDialog.value = false
    }
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error)
  }
}

const viewTicket = (ticketId) => {
  router.push(`/tickets/${ticketId}`)
}

const loadTickets = async () => {
  try {
    const response = await fetch('/api/tickets', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      tickets.value = await response.json()
    }
  } catch (error) {
    console.error('Erreur lors du chargement des tickets:', error)
  }
}

onMounted(loadTickets)
</script>
