<template>
  <div class="space-y-4">
    <!-- Éditeur de texte -->
    <div class="relative">
      <textarea
        ref="editor"
        v-model="content"
        rows="4"
        class="w-full rounded-lg bg-gray-700 border-gray-600 text-white resize-none focus:ring-blue-500 focus:border-blue-500"
        :placeholder="placeholder"
        @input="handleInput"
        @keydown.enter.ctrl="submit"
      ></textarea>

      <!-- Barre d'outils -->
      <div class="absolute bottom-2 right-2 flex space-x-2">
        <button
          v-for="tool in tools"
          :key="tool.name"
          @click="tool.action"
          class="p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-600"
          :title="tool.title"
        >
          <component :is="tool.icon" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Prévisualisation -->
    <div v-if="showPreview" class="mt-4">
      <h3 class="text-sm font-medium text-gray-400 mb-2">
        {{ $t('comments.preview') }}
      </h3>
      <div
        class="prose prose-invert max-w-none p-4 bg-gray-700 rounded-lg"
        v-html="renderedContent"
      ></div>
    </div>

    <!-- Sélecteur d'emoji -->
    <div
      v-if="showEmojiPicker"
      class="absolute bottom-full right-0 mb-2 p-2 bg-gray-700 rounded-lg shadow-xl"
    >
      <div class="grid grid-cols-8 gap-1">
        <button
          v-for="emoji in commonEmojis"
          :key="emoji"
          @click="insertEmoji(emoji)"
          class="p-1 hover:bg-gray-600 rounded"
        >
          {{ emoji }}
        </button>
      </div>
    </div>

    <!-- Sélecteur de mention -->
    <div
      v-if="showMentionList"
      class="absolute z-10 w-64 mt-1 bg-gray-700 rounded-lg shadow-xl"
    >
      <ul class="py-1">
        <li
          v-for="user in filteredUsers"
          :key="user.id"
          @click="insertMention(user)"
          class="px-4 py-2 hover:bg-gray-600 cursor-pointer"
        >
          <div class="flex items-center">
            <img
              :src="user.avatar || '/default-avatar.jpg'"
              :alt="user.username"
              class="h-6 w-6 rounded-full mr-2"
            />
            <span class="text-white">{{ user.username }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-3">
      <button
        v-if="canCancel"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm text-gray-400 hover:text-white"
      >
        {{ $t('common.cancel') }}
      </button>
      <button
        @click="submit"
        :disabled="!canSubmit || loading"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {{ loading ? $t('common.saving') : $t('common.submit') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  FaceSmileIcon,
  AtSymbolIcon,
  PhotoIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  initialContent: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  canCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const content = ref(props.initialContent)
const showPreview = ref(false)
const showEmojiPicker = ref(false)
const showMentionList = ref(false)
const editor = ref(null)
const mentionQuery = ref('')
const currentMentionPosition = ref(null)

// Liste d'emojis couramment utilisés
const commonEmojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉']

// Outils de l'éditeur
const tools = [
  {
    name: 'emoji',
    icon: FaceSmileIcon,
    title: 'Insérer un emoji',
    action: () => {
      showEmojiPicker.value = !showEmojiPicker.value
      showMentionList.value = false
    }
  },
  {
    name: 'mention',
    icon: AtSymbolIcon,
    title: 'Mentionner un utilisateur',
    action: () => {
      insertText('@')
      showEmojiPicker.value = false
    }
  },
  {
    name: 'image',
    icon: PhotoIcon,
    title: 'Insérer une image',
    action: () => {
      // TODO: Implémenter l'upload d'image
    }
  },
  {
    name: 'preview',
    icon: EyeIcon,
    title: 'Prévisualiser',
    action: () => {
      showPreview.value = !showPreview.value
    }
  }
]

// Rendu markdown sécurisé
const renderedContent = computed(() => {
  const html = marked(content.value)
  return DOMPurify.sanitize(html)
})

// Vérifier si le contenu peut être soumis
const canSubmit = computed(() => {
  return content.value.trim().length > 0
})

// Gérer la saisie
const handleInput = (event) => {
  const text = event.target.value
  const lastAtPosition = text.lastIndexOf('@')
  
  if (lastAtPosition !== -1 && lastAtPosition === text.length - 1) {
    showMentionList.value = true
    currentMentionPosition.value = lastAtPosition
    mentionQuery.value = ''
  } else if (lastAtPosition !== -1 && currentMentionPosition.value === lastAtPosition) {
    mentionQuery.value = text.slice(lastAtPosition + 1)
  } else {
    showMentionList.value = false
  }
}

// Insérer du texte à la position du curseur
const insertText = (text) => {
  const textarea = editor.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  content.value = content.value.substring(0, start) + text + content.value.substring(end)
  
  // Replacer le curseur après le texte inséré
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + text.length
    textarea.focus()
  })
}

// Insérer un emoji
const insertEmoji = (emoji) => {
  insertText(emoji)
  showEmojiPicker.value = false
}

// Insérer une mention
const insertMention = (user) => {
  const text = content.value
  const newText = text.substring(0, currentMentionPosition.value) +
    `@${user.username} ` +
    text.substring(currentMentionPosition.value + mentionQuery.value.length + 1)
  
  content.value = newText
  showMentionList.value = false
}

// Soumettre le commentaire
const submit = () => {
  if (canSubmit.value && !props.loading) {
    emit('submit', content.value)
  }
}

// Nettoyer les popups lors de la destruction du composant
onUnmounted(() => {
  showEmojiPicker.value = false
  showMentionList.value = false
})
</script>

<style>
.prose {
  color: inherit;
}

.prose a {
  color: #60a5fa;
}

.prose code {
  color: #e879f9;
}

.prose blockquote {
  color: #9ca3af;
  border-left-color: #4b5563;
}
</style>
