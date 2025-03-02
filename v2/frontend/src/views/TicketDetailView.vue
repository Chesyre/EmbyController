
<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <div class="flex items-center">
            <h1 class="text-2xl font-semibold text-white">
              {{ ticket.title }}
            </h1>
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
            {{ $t('tickets.created_by') }} {{ ticket.creator.username }} • {{ formatDate(ticket.createdAt) }}
          </p>
        </div>
        <div class="flex space-x-3">
          <button
            v-if="ticket.status !== 'closed'"
            @click="closeTicket"
            class="px-4 py-2 text-sm text-red-400 hover:text-red-300"
          >
            {{ $t('tickets.close_ticket') }}
          </button>
          <button
            @click="$router.push('/tickets')"
            class="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            {{ $t('tickets.back_to_list') }}
          </button>
        </div>
      </div>

      <!-- Conversation -->
      <div class="bg-gray-800 shadow rounded-lg">
        <div class="p-6 space-y-6">
          <!-- Messages -->
          <div
            v-for="message in ticket.messages"
            :key="message.id"
            class="flex"
            :class="{ 'flex-row-reverse': message.isFromStaff }"
          >
            <div
              class="flex-1 max-w-2xl"
              :class="{ 'ml-4': !message.isFromStaff, 'mr-4': message.isFromStaff }"
            >
              <div
                class="bg-gray-700 rounded-lg p-4"
                :class="{ 'bg-blue-600': message.isFromStaff }"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-white">
                    {{ message.user.username }}
                  </span>
                  <span class="text-sm text-gray-400">
                    {{ formatDate(message.createdAt) }}
                  </span>
                </div>
                <p class="text-white whitespace-pre-wrap">{{ message.content }}</p>
                
                <!-- Pièces jointes -->
                <div
                  v-if="message.attachments && message.attachments.length > 0"
                  class="mt-3 space-y-2"
                >
                  <div
                    v-for="attachment in message.attachments"
                    :key="attachment.id"
                    class="flex items-center space-x-2 text-sm"
                  >
                    <PaperClipIcon class="h-4 w-4 text-gray-400" />
                    <a
                      :href="attachment.url"
                      target="_blank"
                      class="text-blue-400 hover:text-blue-300"
                    >
                      {{ attachment.name }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire de réponse -->
        <div
          v-if="ticket.status !== 'closed'"
          class="border-t border-gray-700 p-6"
        >
          <form @submit.prevent="sendReply" class="space-y-4">
            <div>
              <label for="reply" class="sr-only">{{ $t('tickets.your_reply') }}</label>
              <textarea
                id="reply"
                v-model="replyContent"
                rows="4"
                class="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                :placeholder="$t('tickets.reply_placeholder')"
              ></textarea>
            </div>

            <!-- Upload de fichiers -->
            <div class="flex items-center space-x-4">
              <button
                type="button"
                class="flex items-center text-sm text-gray-400 hover:text-white"
                @click="$refs.fileInput.click()"
              >
                <PaperClipIcon class="h-5 w-5 mr-1" />
                {{ $t('tickets.attach_files') }}
              </button>
              <input
                ref="fileInput"
                type="file"
                multiple
                class="hidden"
                @change="handleFileUpload"
              />
              <div v-if="selectedFiles.length > 0" class="text-sm text-gray-400">
                {{ selectedFiles.length }} {{ $t('tickets.files_selected') }}
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading || !replyContent.trim()"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ loading ? $t('common.sending') : $t('common.send') }}
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
import { useRoute, useRouter } from 'vue-router'
import { PaperClipIcon } from '@heroicons/vue/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const route = useRoute()
const router = useRouter()

const ticket = ref({})
const loading = ref(false)
const replyContent = ref('')
const selectedFiles = ref([])

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

const handleFileUpload = (event) => {
  selectedFiles.value = Array.from(event.target.files)
}

const loadTicket = async () => {
  try {
    loading.value = true
    const response = await fetch(`/api/tickets/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      ticket.value = await response.json()
    }
  } catch (error) {
    console.error('Erreur lors du chargement du ticket:', error)
  } finally {
    loading.value = false
  }
}

const sendReply = async () => {
  if (!replyContent.value.trim()) return

  try {
    loading.value = true

    const formData = new FormData()
    formData.append('content', replyContent.value)
    selectedFiles.value.forEach(file => {
      formData.append('attachments', file)
    })

    const response = await fetch(`/api/tickets/${route.params.id}/reply`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })

    if (response.ok) {
      const newMessage = await response.json()
      ticket.value.messages.push(newMessage)
      replyContent.value = ''
      selectedFiles.value = []
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error)
  } finally {
    loading.value = false
  }
}

const closeTicket = async () => {
  if (!confirm($t('tickets.close_confirm'))) return

  try {
    loading.value = true
    await fetch(`/api/tickets/${route.params.id}/close`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    ticket.value.status = 'closed'
  } catch (error) {
    console.error('Erreur lors de la fermeture du ticket:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadTicket)
</script>
