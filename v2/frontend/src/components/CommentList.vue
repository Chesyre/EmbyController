<template>
  <div class="space-y-6">
    <!-- Formulaire de commentaire -->
    <div class="bg-gray-800 rounded-lg p-4">
      <h3 class="text-lg font-medium text-white mb-4">
        {{ $t('comments.add_comment') }}
      </h3>
      <div class="space-y-4">
        <!-- Note -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">
            {{ $t('comments.rating') }}
          </label>
          <div class="flex items-center space-x-1">
            <button
              v-for="i in 5"
              :key="i"
              @click="rating = i"
              class="focus:outline-none"
            >
              <StarIcon
                class="h-6 w-6"
                :class="i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'"
              />
            </button>
          </div>
        </div>

        <!-- Commentaire -->
        <div>
          <label for="comment" class="block text-sm font-medium text-gray-400 mb-2">
            {{ $t('comments.your_comment') }}
          </label>
          <textarea
            id="comment"
            v-model="commentText"
            rows="4"
            class="w-full rounded-lg bg-gray-700 border-gray-600 text-white resize-none focus:ring-blue-500 focus:border-blue-500"
            :placeholder="$t('comments.comment_placeholder')"
          ></textarea>
        </div>

        <!-- Bouton d'envoi -->
        <div class="flex justify-end">
          <button
            @click="submitComment"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ loading ? $t('comments.submitting') : $t('comments.submit') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des commentaires -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-white">
        {{ $t('comments.all_comments') }} ({{ comments.length }})
      </h3>

      <!-- Filtres -->
      <div class="flex space-x-4">
        <select
          v-model="sortBy"
          class="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="recent">{{ $t('comments.sort_recent') }}</option>
          <option value="rating">{{ $t('comments.sort_rating') }}</option>
        </select>
      </div>

      <!-- Commentaires -->
      <div class="space-y-4">
        <div
          v-for="comment in sortedComments"
          :key="comment.id"
          class="bg-gray-800 rounded-lg p-4"
        >
          <!-- En-tête du commentaire -->
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <img
                :src="comment.user.avatar || '/default-avatar.jpg'"
                :alt="comment.user.username"
                class="h-8 w-8 rounded-full"
              />
              <div>
                <p class="font-medium text-white">{{ comment.user.username }}</p>
                <div class="flex items-center mt-1">
                  <div class="flex items-center">
                    <StarIcon
                      v-for="i in 5"
                      :key="i"
                      class="h-4 w-4"
                      :class="i <= comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'"
                    />
                  </div>
                  <span class="ml-2 text-sm text-gray-400">
                    {{ formatDate(comment.createdAt) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Menu d'actions -->
            <Menu as="div" class="relative">
              <MenuButton class="text-gray-400 hover:text-white">
                <EllipsisVerticalIcon class="h-5 w-5" />
              </MenuButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="absolute right-0 mt-2 w-48 rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="replyToComment(comment)"
                        :class="[
                          active ? 'bg-gray-600 text-white' : 'text-gray-300',
                          'block w-full text-left px-4 py-2 text-sm'
                        ]"
                      >
                        {{ $t('comments.reply') }}
                      </button>
                    </MenuItem>
                    <MenuItem v-if="canModifyComment(comment)" v-slot="{ active }">
                      <button
                        @click="editComment(comment)"
                        :class="[
                          active ? 'bg-gray-600 text-white' : 'text-gray-300',
                          'block w-full text-left px-4 py-2 text-sm'
                        ]"
                      >
                        {{ $t('comments.edit') }}
                      </button>
                    </MenuItem>
                    <MenuItem v-if="canModifyComment(comment)" v-slot="{ active }">
                      <button
                        @click="deleteComment(comment)"
                        :class="[
                          active ? 'bg-gray-600 text-red-400' : 'text-red-400',
                          'block w-full text-left px-4 py-2 text-sm'
                        ]"
                      >
                        {{ $t('comments.delete') }}
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Contenu du commentaire -->
          <div class="mt-3">
            <p class="text-white">{{ comment.content }}</p>
          </div>

          <!-- Réponses -->
          <div v-if="comment.replies?.length" class="mt-4 pl-4 border-l border-gray-700">
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="mt-3"
            >
              <div class="flex items-start space-x-3">
                <img
                  :src="reply.user.avatar || '/default-avatar.jpg'"
                  :alt="reply.user.username"
                  class="h-6 w-6 rounded-full"
                />
                <div>
                  <p class="font-medium text-white">{{ reply.user.username }}</p>
                  <p class="mt-1 text-gray-300">{{ reply.content }}</p>
                  <p class="mt-1 text-sm text-gray-400">
                    {{ formatDate(reply.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chargement -->
      <div
        v-if="loading"
        class="flex justify-center py-4"
      >
        <svg
          class="animate-spin h-6 w-6 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  StarIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps({
  mediaId: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()
const loading = ref(false)
const rating = ref(0)
const commentText = ref('')
const sortBy = ref('recent')
const comments = ref([])

// Trier les commentaires
const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    if (sortBy.value === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else {
      return b.rating - a.rating
    }
  })
})

// Vérifier si l'utilisateur peut modifier un commentaire
const canModifyComment = (comment) => {
  const currentUser = authStore.currentUser
  return currentUser && (
    comment.user.id === currentUser.id ||
    currentUser.role?.type === 'admin'
  )
}

// Formater la date
const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr
  })
}

// Soumettre un commentaire
const submitComment = async () => {
  if (!commentText.value || rating.value === 0) {
    // TODO: Afficher une erreur
    return
  }

  try {
    loading.value = true
    // TODO: Appeler l'API pour soumettre le commentaire
    const response = await fetch(`/api/media/${props.mediaId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        content: commentText.value,
        rating: rating.value
      })
    })

    if (response.ok) {
      const newComment = await response.json()
      comments.value.unshift(newComment)
      commentText.value = ''
      rating.value = 0
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du commentaire:', error)
  } finally {
    loading.value = false
  }
}

// Répondre à un commentaire
const replyToComment = (comment) => {
  // TODO: Implémenter la réponse aux commentaires
}

// Modifier un commentaire
const editComment = (comment) => {
  // TODO: Implémenter la modification des commentaires
}

// Supprimer un commentaire
const deleteComment = async (comment) => {
  if (!confirm($t('comments.delete_confirm'))) {
    return
  }

  try {
    loading.value = true
    await fetch(`/api/media/${props.mediaId}/comments/${comment.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    comments.value = comments.value.filter(c => c.id !== comment.id)
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error)
  } finally {
    loading.value = false
  }
}

// Charger les commentaires
const loadComments = async () => {
  try {
    loading.value = true
    const response = await fetch(`/api/media/${props.mediaId}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      comments.value = await response.json()
    }
  } catch (error) {
    console.error('Erreur lors du chargement des commentaires:', error)
  } finally {
    loading.value = false
  }
}

// Charger les commentaires au montage
loadComments()
</script>
