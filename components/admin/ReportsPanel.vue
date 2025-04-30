<template>
    <div class="text-black bg-white min-h-screen p-6 space-y-12">
      <h2 class="text-2xl font-bold">Reports</h2>
  
      <!-- Monthly Revenue Report -->
      <section>
        <h3 class="text-xl font-semibold mb-4">Monthly Revenue by Service</h3>
        <table class="w-full text-sm mb-6">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-2 py-1 text-left">Service</th>
              <th class="px-2 py-1 text-left">Month</th>
              <th class="px-2 py-1 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in revenueReport" :key="r.service_name + r.month">
              <td class="px-2 py-1">{{ r.service_name }}</td>
              <td class="px-2 py-1">{{ formatMonth(r.month) }}</td>
                <td class="px-2 py-1 text-right">
                    ${{ formatRevenue(r.total_revenue) }}
                </td>
            </tr>
          </tbody>
        </table>
      </section>
  
      <!-- Stylist Average Rating -->
      <section>
        <h3 class="text-xl font-semibold mb-4">Stylist Average Rating</h3>
        <div class="max-w-md space-y-4">
          <div>
            <label class="block text-sm font-medium">Select Stylist</label>
            <select
              v-model.number="selectedStylist"
              @change="fetchAvgRating"
              class="w-full border p-2 rounded"
            >
              <option value="" disabled>— pick one —</option>
              <option v-for="s in stylists" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
          <div v-if="avgRating !== null" class="text-lg">
            Average Rating: <strong>{{ avgRating }}</strong>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'
  
  /** ---- Types ---- **/
  interface RevenueRow {
    service_name: string
    month: string
    total_revenue: number
  }
  interface Stylist {
    id: number
    name: string
  }
  
  /** ---- Revenue data ---- **/
  const { data: revenueReport, refresh: refreshRevenue } = await useFetch<RevenueRow[]>(
    '/api/reports/monthly-revenue',
    { key: 'getRevenue' }
  )
  function formatMonth(iso: string) {
    const d = new Date(iso)
    return d.toLocaleString('default', { year: 'numeric', month: 'short' })
  }
  function formatRevenue(val: string) {
  const num = parseFloat(val)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}
  /** ---- Stylist list ---- **/
  const { data: stylists } = await useFetch<Stylist[]>(
    '/api/stylists',
    { key: 'getStylists' }
  )
  const selectedStylist = ref<number|null>(null)
  const avgRating       = ref<number|null>(null)
  
  /** ---- Fetch average rating ---- **/
   async function fetchAvgRating() {
   if (!selectedStylist.value) {
     avgRating.value = null
     return
   }
   try {
     const { avg_rating } = await $fetch<{ avg_rating: number }>(
       `/api/reports/avg-rating/${selectedStylist.value}`
     )
     avgRating.value = avg_rating
   } catch (err) {
     console.error('Failed to load avg rating:', err)
   }
 }
  
  /** ---- Refresh both on mount ---- **/
  onMounted(async () => {
    await Promise.all([refreshRevenue(), fetchAvgRating()])
  })
  </script>
  