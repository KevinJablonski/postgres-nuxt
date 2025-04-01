<template>
  <div
    class="w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="space-y-1">
        <h2 class="text-xl font-semibold">Available Stylist</h2>
        <p class="text-sm text-gray-500">
          Fetched {{ stylists?.length }} stylists in {{ duration }}ms
        </p>
      </div>
      <button class="hover:opacity-80" @click="refreshPage">
        Refresh Page
      </button>
    </div>
    <div class="divide-y divide-gray-900/5">
      <div
        v-for="stylist in stylists"
        :key="stylist.id"
        class="flex items-center justify-between py-3"
      >
        <div class="flex items-center space-x-4">
          <img
            :src="require('~/assets/images/scissor.png')"
            :alt="stylist.name"
            :width="48"
            :height="48"
            class="rounded-full ring-1 ring-gray-900/5"
          />
          <div class="space-y-1">
            <p class="font-medium leading-none">{{ stylist?.name }}</p>
            <p class="text-sm text-gray-500">{{ stylist?.email }}</p>
          </div>
        </div>
        <p class="text-sm text-gray-500">{{ timeAgo(stylist?.phone) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ms from 'ms'

export default {
  props: {
   stylists: {
      type: Array,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  methods: {
    timeAgo(timestamp, timeOnly) {
      if (!timestamp) return 'never'
      return `${ms(Date.now() - new Date(timestamp).getTime())}${
        timeOnly ? '' : ' ago'
      }`
    },
    refreshPage() {
      location.reload()
    },
  },
}
</script>
