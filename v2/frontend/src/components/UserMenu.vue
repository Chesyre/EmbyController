<template>
  <Menu as="div" class="relative ml-3">
    <div>
      <MenuButton
        class="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span class="sr-only">{{ $t('user_menu.open') }}</span>
        <img
          class="h-8 w-8 rounded-full"
          :src="user?.avatar_url || defaultAvatar"
          :alt="user?.username"
        />
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <MenuItem v-slot="{ active }">
          <router-link
            to="/profile"
            :class="[
              active ? 'bg-gray-700' : '',
              'block px-4 py-2 text-sm text-gray-300'
            ]"
          >
            {{ $t('user_menu.profile') }}
          </router-link>
        </MenuItem>
        <MenuItem v-slot="{ active }">
          <router-link
            to="/settings"
            :class="[
              active ? 'bg-gray-700' : '',
              'block px-4 py-2 text-sm text-gray-300'
            ]"
          >
            {{ $t('user_menu.settings') }}
          </router-link>
        </MenuItem>
        <MenuItem v-slot="{ active }">
          <a
            @click="handleLogout"
            :class="[
              active ? 'bg-gray-700' : '',
              'block px-4 py-2 text-sm text-gray-300 cursor-pointer'
            ]"
          >
            {{ $t('user_menu.logout') }}
          </a>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.currentUser)
const defaultAvatar = '/default-avatar.png'

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>