<template>
  <div class="text-black bg-white min-h-screen flex flex-col">
    <main class="flex-grow">
      <section aria-labelledby="cancellations-heading" class="mx-auto max-w-7xl px-4 py-12">
        <div class="flex justify-between items-center mb-6">
          <h2 id="cancellations-heading" class="text-xl font-semibold">Cancellations</h2>
          <button @click="openAdd" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 top-0 right-0">
            + New Cancellation
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-semibold">Booking</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Reason</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Cancelled At</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="c in cancellations" :key="c.appointment_id">
                <td class="px-4 py-2 text-sm">{{ c.booking_code.slice(0, 8) }}</td>
                <td class="px-4 py-2 text-sm">{{ c.reason_text }}</td>
                <td class="px-4 py-2 text-sm">{{ formatDateTime(c.cancelled_at) }}</td>
              </tr>
              <tr v-if="!cancellations.length">
                <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                  No cancellations recorded.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Add Cancellation Modal -->
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
              <DialogTitle class="text-lg font-medium mb-4">New Cancellation</DialogTitle>
              <form @submit.prevent="submitCancel" class="space-y-4">
                <!-- Appointment selector -->
                <div>
                  <label class="block text-sm font-medium">Booking</label>
                  <select v-model.number="form.appointment_id" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select booking</option>
                    <option v-for="a in appointments" :key="a.id" :value="a.id">
                      {{ a.booking_code.slice(0, 8) }} — {{ formatDateTime(a.appointment_datetime) }}
                    </option>
                  </select>
                </div>

                <!-- Reason -->
                <div>
                  <label class="block text-sm font-medium">Reason</label>
                  <textarea
                    v-model="form.reason_text"
                    rows="3"
                    required
                    class="w-full border p-2 rounded"
                    placeholder="Reason for cancellation..."
                  />
                </div>

                <!-- Actions -->
                <div class="flex justify-end space-x-2 pt-4">
                  <button type="button" @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Record
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
import { ref } from 'vue'
import { useFetch } from '#app'
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

interface Appointment {
  id: number
  booking_code: string
  appointment_datetime: string
}

interface Cancellation {
  appointment_id: number
  booking_code: string
  reason_text: string
  cancelled_at: string
}

// fetch existing cancellations
const { data: cancellations, refresh: refreshCancels } = await useFetch<Cancellation[]>(
  '/api/cancellations',
  { key: 'getCancels' }
)

// fetch appointments for the dropdown
const { data: appointments } = await useFetch<Appointment[]>(
  '/api/appointments',
  { key: 'getAppointments' }
)

// modal & form state
const open = ref(false)
const form = ref<{ appointment_id?: number; reason_text: string }>({
  appointment_id: undefined,
  reason_text: '',
})

// format datetime
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function openAdd() {
  form.value = { appointment_id: undefined, reason_text: '' }
  open.value = true
}

function closeModal() {
  open.value = false
}

async function submitCancel() {
  await $fetch('/api/cancellations', {
    method: 'POST',
    body: form.value,
  })
  await refreshCancels()
  closeModal()
}
</script>
