<template>
  <div class="text-black flex flex-col min-h-screen">
    <main class="flex-grow flex items-center justify-center p-8 bg-gray-50">
        <div class="max-w-md w-full bg-white rounded-lg shadow p-6 relative">
        <transition name="card" mode="out-in">
            <div :key="step">
                <!-- STEP 1: Service -->
                <div v-if="step === 1">
                <h2 class="text-xl font-semibold mb-4">1. Select a Service</h2>
                <ul class="space-y-2">
                    <li v-for="s in services" :key="s.id">
                    <button
                        @click="selectService(s)"
                        class="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        {{ s.name }} — ${{ parseFloat(s.price).toFixed(2) }}
                    </button>
                    </li>
                </ul>
                </div>

                <!-- STEP 2: Stylist & Slot -->
                <div v-if="step === 2">
                <h2 class="text-xl font-semibold mb-4">2. Pick Stylist & Time</h2>
                <select
                    v-model.number="stylistId"
                    @change="loadSlots"
                    class="w-full border rounded p-2 mb-4"
                >
                    <option value="">Choose stylist</option>
                    <option v-for="t in stylists" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
                <ul class="space-y-2">
                    <li v-for="slot in filteredSlots" :key="slot.id">
                    <button
                        @click="selectSlot(slot)"
                        class="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        {{ formatDate(slot.available_date) }} @ {{ slot.available_time.slice(0,5) }}
                    </button>
                    </li>
                </ul>
                </div>

                <!-- STEP 3: Client Info -->
                <div v-if="step === 3">
                <h2 class="text-xl font-semibold mb-4">3. Your Details</h2>
                <form @submit.prevent="book" class="space-y-4">
                    <input
                    v-model="client.name"
                    type="text"
                    placeholder="Name"
                    required
                    class="w-full border rounded p-2"
                    />
                    <input
                    v-model="client.email"
                    type="email"
                    placeholder="Email"
                    required
                    class="w-full border rounded p-2"
                    />
                    <input
                    v-model="client.phone"
                    type="tel"
                    placeholder="Phone (optional)"
                    class="w-full border rounded p-2"
                    />
                    <button
                    type="submit"
                    class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                    Book Appointment
                    </button>
                </form>
                </div>
            </div>
            </transition>

  
      <!-- Confirmation Modal -->
      <TransitionRoot as="template" :show="confirmed" @close="closeConfirm">
        <Dialog class="fixed inset-0 z-10 overflow-y-auto" @close="closeConfirm">
          <div class="text-black flex items-center justify-center min-h-screen px-4">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                <DialogTitle class="text-lg font-medium mb-4">
                  🎉 Appointment Booked!
                </DialogTitle>
                <div class="space-y-2">
                  <p><strong>Code:</strong> <code>{{ confirmation.booking_code }}</code></p>
                  <p><strong>Service:</strong> {{ service?.name }}</p>
                  <p><strong>Stylist:</strong> {{ stylistName }}</p>
                  <p>
                    <strong>When:</strong>
                    {{ formatDate(confirmation.appointment_datetime.split('T')[0]) }}
                    @ {{ confirmation.appointment_datetime.split('T')[1].slice(0,5) }}
                  </p>
                </div>
                <div class="mt-6 text-right">
                  <button
                    @click="closeConfirm"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
    </main>
    </div>
    
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useFetch } from '#app'
  import {
    Dialog,
    DialogTitle,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  
  interface Service   { id: number; name: string; price: string }
  interface Stylist   { id: number; name: string }
  interface Slot      { id: number; stylist_id: number; available_date: string; available_time: string }
  interface Booking   { id: number; booking_code: string; appointment_datetime: string; status: string }
  
  // 1) Load lookup data
  const { data: services } = await useFetch<Service[]>('/api/services', { key: 'services' })
  const { data: stylists } = await useFetch<Stylist[]>('/api/stylists', { key: 'stylists' })
  
  // 2) Steps state
  const step         = ref(1)
  const service      = ref<Service|null>(null)
  const stylistId    = ref<number|null>(null)
  const slots        = ref<Slot[]>([])
  const selectedSlot = ref<Slot|null>(null)
  const client       = ref({ name: '', email: '', phone: '' })
  
  // 3) Confirmation state
  const confirmed    = ref(false)
  const confirmation = ref<Booking>({ id:0, booking_code:'', appointment_datetime:'', status:'' })
  
  // 4) Load availability
  async function loadSlots() {
    if (!stylistId.value) return
    slots.value = await $fetch<Slot[]>(`/api/availability?stylist_id=${stylistId.value}`)
  }
  const filteredSlots = computed(() =>
    slots.value.filter(s => s.stylist_id === stylistId.value)
  )
  
  // 5) Step handlers
  function selectService(s: Service) {
    service.value = s
    step.value = 2
  }
  function selectSlot(slot: Slot) {
    selectedSlot.value = slot
    step.value = 3
  }
  
  // 6) Book & show modal
  async function book() {
    if (!service.value || !selectedSlot.value) return
    try {
      const result = await $fetch<Booking>('/api/book', {
        method: 'POST',
        body: {
          name:                client.value.name,
          email:               client.value.email,
          phone:               client.value.phone,
          service_id:          service.value.id,
          stylist_id:          selectedSlot.value.stylist_id,
          appointment_datetime:`${selectedSlot.value.available_date.split('T')[0]}T${selectedSlot.value.available_time}`,
          slot_id:             selectedSlot.value.id
        }
      })
      confirmation.value = result
      confirmed.value = true
    } catch (err) {
      console.error('Booking failed', err)
      alert('Failed to book. Please try again.')
    }
  }
  
  // 7) Close modal
  function closeConfirm() {
    confirmed.value = false
    // reset wizard (optional)
    step.value = 1
    service.value = null
    stylistId.value = null
    slots.value = []
    selectedSlot.value = null
    client.value = { name: '', email: '', phone: '' }
  }
  
  // 8) Helpers
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { timeZone:'UTC' })
  }
  const stylistName = computed(() => {
    const st = stylists.value?.find(s => s.id === selectedSlot.value?.stylist_id)
    return st?.name ?? ''
  })
  </script>
  