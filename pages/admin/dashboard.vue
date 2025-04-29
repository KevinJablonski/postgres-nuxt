<template>
  <div class="flex h-full">
    <!-- SIDE NAV -->
    <aside class="w-64 border-r border-gray-200 bg-white">
      <nav class="p-4">
        <ul class="space-y-1">
          <li v-for="item in menu" :key="item.name">
            <button
              type="button"
              @click="select(item)"
              :class="[
                item === active
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                'group flex items-center gap-x-3 w-full rounded-md px-3 py-2 text-sm font-semibold text-left'
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  item === active
                    ? 'text-indigo-600'
                    : 'text-gray-400 group-hover:text-indigo-600',
                  'w-6 h-6 shrink-0'
                ]"
                aria-hidden="true"
              />
              {{ item.name }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- DYNAMIC CONTENT -->
    <main class="flex-1 overflow-hidden">
      <transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >

          <component
            :is="active.component"
            :key="active.name"
            class="h-full overflow-auto p-6 bg-gray-50"
          />

      </transition>
    </main>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'
import {
  UserCircleIcon,
  FingerPrintIcon,
  BellIcon,
} from '@heroicons/vue/24/outline'

// your panel components
import StylistPanel from '~/components/admin/StylistPanel.vue'
import ServicePanel from '~/components/admin/ServicePanel.vue'
import ClientPanel  from '~/components/admin/ClientPanel.vue'
import AvailabilityPanel from '~/components/admin/AvailabilityPanel.vue'
const menu = [
  { name: 'Stylists',   component: StylistPanel, icon: UserCircleIcon },
  { name: 'Services',   component: ServicePanel, icon: FingerPrintIcon },
  { name: 'Clients',    component: ClientPanel,  icon: BellIcon },
  { name: 'Availability',    component: AvailabilityPanel,  icon: BellIcon },
]

// shallowRef holds the active menu item _by reference_ but doesn’t make its nested props reactive
const active = shallowRef(menu[0])

function select(item) {
  active.value = item
}
</script>
