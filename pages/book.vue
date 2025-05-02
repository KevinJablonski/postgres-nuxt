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
      <Dialog class="relative z-10" @close="closeConfirm">
        <!-- BACKDROP -->
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        <!-- MODAL PANEL CONTAINER -->
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 ">
                    <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold text-gray-900">
                      🎉 Appointment Booked!
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Your booking code is <code>{{ confirmation.booking_code }}</code>.<br/>
                        {{ service?.name }} with {{ stylistName }} on
                        {{ formatDate(confirmation.appointment_datetime.split('T')[0]) }}
                        at {{ confirmation.appointment_datetime.split('T')[1].slice(0,5) }}.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6">
                  <button
                    type="button"
                    @click="closeConfirm"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
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
  import {
CheckIcon
} from '@heroicons/vue/24/outline'
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
  