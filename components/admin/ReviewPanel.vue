<template>
  <div class="text-black bg-white min-h-screen flex flex-col">
    <main class="flex-grow">
      <section aria-labelledby="reviews-heading" class="mx-auto max-w-7xl px-4 py-12">
        <div class="flex justify-between items-center mb-6">
          <h2 id="reviews-heading" class="text-xl font-semibold">Reviews</h2>
          <button
            @click="openAdd"
            class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 top-0 right-0"
          >
            + New Review
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-semibold">#</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Booking</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Client</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Stylist</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Rating</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Comment</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th class="px-4 py-2 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="r in reviews" :key="r.id">
                <td class="px-4 py-2 text-sm">{{ r.id }}</td>
                <td class="px-4 py-2 text-sm">{{ r.booking_code.slice(0, 8) }}</td>
                <td class="px-4 py-2 text-sm">{{ r.client_name }}</td>
                <td class="px-4 py-2 text-sm">{{ r.stylist_name }}</td>
                <td class="px-4 py-2 text-sm">{{ r.rating }}</td>
                <td class="px-4 py-2 text-sm">{{ r.comment }}</td>
                <td class="px-4 py-2 text-sm">{{ formatDate(r.review_date) }}</td>
                <td class="px-4 py-2 text-center space-x-2">
                  <button @click="openEdit(r)" class="text-blue-600 hover:underline">Edit</button>
                  <button @click="deleteReview(r.id)" class="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr v-if="!reviews.length">
                <td colspan="8" class="px-4 py-6 text-center text-gray-500">
                  No reviews yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Add/Edit Review Modal -->
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
              <DialogTitle class="text-lg font-medium mb-4">
                {{ isEditing ? 'Edit Review' : 'New Review' }}
              </DialogTitle>
              <form @submit.prevent="submitReview" class="space-y-4">
                <!-- Appointment -->
                <div v-if="!isEditing">
                  <label class="block text-sm font-medium">Booking</label>
                  <select
                    v-model.number="form.appointment_id"
                    required
                    class="w-full border p-2 rounded"
                  >
                    <option value="" disabled>Select booking</option>
                    <option
                      v-for="a in appointments"
                      :key="a.id"
                      :value="a.id"
                    >
                      {{ a.booking_code.slice(0, 8) }} — {{ formatDateTime(a.appointment_datetime) }}
                    </option>
                  </select>
                </div>

                <!-- Rating -->
                <div>
                  <label class="block text-sm font-medium">Rating</label>
                  <select
                    v-model.number="form.rating"
                    required
                    class="w-full border p-2 rounded"
                  >
                    <option v-for="n in [1,2,3,4,5]" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>

                <!-- Comment -->
                <div>
                  <label class="block text-sm font-medium">Comment</label>
                  <textarea
                    v-model="form.comment"
                    rows="3"
                    class="w-full border p-2 rounded"
                    placeholder="Leave your feedback..."
                  />
                </div>

                <!-- Actions -->
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
                    {{ isEditing ? 'Save' : 'Add' }}
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

interface Review {
  id: number
  appointment_id: number
  booking_code: string
  client_name: string
  stylist_name: string
  rating: number
  comment: string
  review_date: string
}

// fetch existing reviews
const { data: reviews, refresh: refreshReviews } = await useFetch<Review[]>(
  '/api/reviews',
  { key: 'getReviews' }
)

// fetch appointments for the dropdown
const { data: appointments } = await useFetch<Appointment[]>(
  '/api/appointments',
  { key: 'getAppointments' }
)

// modal & form state
const open = ref(false)
const isEditing = ref(false)
const editingId = ref<number|null>(null)
const form = ref<Partial<Review>>({
  appointment_id: undefined,
  rating: 5,
  comment: ''
})

// helpers
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// open "Add" modal
function openAdd() {
  isEditing.value = false
  editingId.value = null
  form.value = { appointment_id: undefined, rating: 5, comment: '' }
  open.value = true
}

// open "Edit" modal
function openEdit(r: Review) {
  isEditing.value = true
  editingId.value = r.id
  form.value = {
    appointment_id: r.appointment_id,
    rating: r.rating,
    comment: r.comment
  }
  open.value = true
}

// close modal
function closeModal() {
  open.value = false
}

// submit (POST or PUT)
async function submitReview() {
  const url    = isEditing.value
    ? `/api/reviews/${editingId.value}`
    : '/api/reviews'
  const method = isEditing.value ? 'PUT' : 'POST'

  await $fetch(url, {
    method,
    body: form.value
  })
  await refreshReviews()
  closeModal()
}

// delete review
async function deleteReview(id: number) {
  if (!confirm('Delete this review?')) return
  await $fetch(`/api/reviews/${id}`, { method: 'DELETE' })
  await refreshReviews()
}
</script>
