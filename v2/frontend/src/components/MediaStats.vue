
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="stat in stats"
      :key="stat.name"
      class="bg-gray-800 overflow-hidden shadow rounded-lg"
    >
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component 
              :is="stat.icon" 
              class="h-6 w-6 text-gray-400" 
              aria-hidden="true" 
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-400 truncate">
                {{ stat.name }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-white">
                  {{ stat.value }}
                </div>
                <div
                  v-if="stat.change"
                  :class="[
                    stat.change > 0 ? 'text-green-400' : 'text-red-400',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  ]"
                >
                  <component
                    :is="stat.change > 0 ? ArrowUpIcon : ArrowDownIcon"
                    class="h-4 w-4 flex-shrink-0 self-center"
                    aria-hidden="true"
                  />
                  <span class="ml-1">{{ Math.abs(stat.change) }}%</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UsersIcon,
  FilmIcon,
  ClockIcon,
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'

defineProps({
  stats: {
    type: Array,
    default: () => [
      {
        name: 'Utilisateurs actifs',
        value: '2,451',
        icon: UsersIcon,
        change: 12
      },
      {
        name: 'Films disponibles',
        value: '12,426',
        icon: FilmIcon,
        change: 2.5
      },
      {
        name: 'Temps de visionnage',
        value: '24.5h',
        icon: ClockIcon,
        change: -0.5
      },
      {
        name: 'Note moyenne',
        value: '4.5',
        icon: StarIcon,
        change: 4.2
      }
    ]
  }
})
</script>
