<template>
    <div class="text-black bg-white min-h-screen flex flex-col">
      <main class="flex-grow">
        <section
          aria-labelledby="availability-heading"
          class="mx-auto max-w-7xl px-4 py-12"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 id="availability-heading" class="text-xl font-semibold">
              Availability
            </h2>
            <button
              @click="openAddModal"
              class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 top-0 right-0"
            >
              + New Slot
            </button>
          </div>
  
          <!-- Stylist filter -->
          <div class="mb-4">
            <label class="mr-2">Filter by stylist:</label>
            <select v-model="filterStylist" class="border p-1 rounded">
              <option value="">All</option>
              <option v-for="s in stylists" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
  
          <!-- Slots table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-sm font-semibold">Stylist</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold">Date</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold">Time</th>
                  <th class="px-4 py-2 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="slot in filteredSlots" :key="slot.id">
                  <td class="px-4 py-2 text-sm">{{ slot.stylist_name }}</td>
                  <td class="px-4 py-2 text-sm">{{ formatDate(slot.available_date) }}</td>
                  <td class="px-4 py-2 text-sm">{{ slot.available_time.slice(0,5) }}</td>
                  <td class="px-4 py-2 text-center space-x-2">
                    <button
                      @click="startEdit(slot)"
                      class="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteSlot(slot.id)"
                      class="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <tr v-if="!filteredSlots.length">
                  <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                    No slots found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
  
      <!-- Add/Edit Slot Modal -->
      <TransitionRoot as="template" :show="open">
        <Dialog class="fixed inset-0 z-10 overflow-y-auto" @close="closeModal">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-gray-900 bg-opacity-50" aria-hidden="true" />
          </TransitionChild>
          <div class="text-black fixed inset-0 flex items-center justify-center px-4 py-6">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="bg-white z-20 rounded-lg shadow-xl max-w-md w-full p-6">
                <DialogTitle class="text-lg font-medium">
                  {{ isEditing ? 'Edit Slot' : 'New Slot' }}
                </DialogTitle>
                <form @submit.prevent="submitSlot" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium">Stylist</label>
                    <select
                      v-model.number="newSlot.stylist_id"
                      required
                      class="w-full border p-2 rounded"
                    >
                      <option value="" disabled>Select stylist</option>
                      <option v-for="s in stylists" :key="s.id" :value="s.id">
                        {{ s.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium">Date</label>
                    <input
                      v-model="newSlot.available_date"
                      type="date"
                      required
                      class="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium">Time</label>
                    <input
                      v-model="newSlot.available_time"
                      type="time"
                      required
                      class="w-full border p-2 rounded"
                    />
                  </div>
                  <div class="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      {{ isEditing ? 'Save Changes' : 'Add Slot' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import {
    Dialog,
    DialogTitle,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  import { useFetch } from '#app'
  
  interface Stylist {
    id: number
    name: string
  }
  
  interface Slot {
    id: number
    stylist_id: number
    stylist_name: string
    available_date: string
    available_time: string
  }
  
  // fetch stylists + slots
  const { data: stylists, refresh: refreshStylists } = await useFetch<Stylist[]>(
    '/api/stylists',
    { method: 'GET', key: 'getStylists' }
  )
  const { data: slots, refresh: refreshSlots } = await useFetch<Slot[]>(
    '/api/availability',
    { method: 'GET', key: 'getSlots' }
  )
  console.log(slots.value)
  
  // local state
  const open = ref(false)
  const isEditing = ref(false)
  const editingId = ref<number|null>(null)
  const filterStylist = ref<number|string>('')
  const newSlot = ref({
    stylist_id: 0,
    available_date: '',
    available_time: '',
  })
  
  // date formatting helper
  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // computed filtered list
  const filteredSlots = computed(() => {
    if (!slots.value) return []
    if (!filterStylist.value) return slots.value
    return slots.value.filter(
      s => String(s.stylist_id) === String(filterStylist.value)
    )
  })
  
  // modal controls
  function openAddModal() {
    isEditing.value = false
    editingId.value = null
    newSlot.value = { stylist_id: 0, available_date: '', available_time: '' }
    open.value = true
  }
  
  function startEdit(slot: Slot) {
    isEditing.value = true
    editingId.value = slot.id
    newSlot.value = {
      stylist_id: slot.stylist_id,
      // ensure date input pre-fills
      available_date: slot.available_date.split('T')[0],
      available_time: slot.available_time.slice(0,5),
    }
    open.value = true
  }
  
  function closeModal() {
    open.value = false
    isEditing.value = false
    editingId.value = null
  }
  
  // create or update then refresh
  async function submitSlot() {
    const url = isEditing.value
      ? `/api/availability/${editingId.value}`
      : '/api/availability'
    const method = isEditing.value ? 'PUT' : 'POST'
  
    await $fetch(url, {
      method,
      body: newSlot.value
    })
    await refreshSlots()
    closeModal()
  }
  
  // delete then refresh
  async function deleteSlot(id: number) {
    if (!confirm('Delete this slot?')) return
    await $fetch(`/api/availability/${id}`, { method: 'DELETE' })
    await refreshSlots()
  }
  </script>
  