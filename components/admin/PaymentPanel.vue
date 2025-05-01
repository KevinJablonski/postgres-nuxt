<template>
  <div class="text-black bg-white min-h-screen flex flex-col">
    <main class="flex-grow">
      <section aria-labelledby="payments-heading" class="mx-auto max-w-7xl px-4 py-12">
        <div class="flex justify-between items-center mb-6">
          <h2 id="payments-heading" class="text-xl font-semibold">Payments</h2>
          <button @click="openAdd" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 top-0 right-0">
            + New Payment
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
                <th class="px-4 py-2 text-left text-sm font-semibold">Amount</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Paid At</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Method</th>
                <th class="px-4 py-2 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="p in payments" :key="p.id">
                <td class="px-4 py-2 text-sm">{{ p.id }}</td>
                <td class="px-4 py-2 text-sm">{{ p.booking_code.slice(0, 8) }}</td>
                <td class="px-4 py-2 text-sm">{{ p.client_name }}</td>
                <td class="px-4 py-2 text-sm">{{ p.stylist_name }}</td>
                <td class="px-4 py-2 text-sm">${{ p.amount }}</td>
                <td class="px-4 py-2 text-sm">{{ formatDate(p.paid_at) }}</td>
                <td class="px-4 py-2 text-sm">{{ p.payment_method }}</td>
                <td class="px-4 py-2 text-center space-x-2">
                  <button @click="openEdit(p)" class="text-blue-600 hover:underline">Edit</button>
                  <button @click="deletePayment(p.id)" class="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr v-if="!payments.length">
                <td colspan="8" class="px-4 py-6 text-center text-gray-500">No payments yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Add/Edit Modal -->
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
                {{ isEditing ? 'Edit Payment' : 'New Payment' }}
              </DialogTitle>
              <form @submit.prevent="submitPayment" class="space-y-4">
                <!-- Appointment -->
                <div>
                  <label class="block text-sm font-medium">Booking</label>
                  <select v-model.number="form.appointment_id" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select booking</option>
                    <option v-for="a in appointments" :key="a.id" :value="a.id">
                      {{ a.booking_code.slice(0, 8) }} — {{ formatDateTime(a.appointment_datetime) }}
                    </option>
                  </select>
                </div>
                <!-- Amount -->
                <div>
                  <label class="block text-sm font-medium">Amount</label>
                  <input
                    v-model.number="form.amount"
                    type="number"
                    step="0.01"
                    required
                    class="w-full border p-2 rounded"
                  />
                </div>
                <!-- Paid At -->
                <div>
                  <label class="block text-sm font-medium">Paid At</label>
                  <input
                    v-model="form.paid_at"
                    type="datetime-local"
                    class="w-full border p-2 rounded"
                  />
                </div>
                <!-- Method -->
                <div>
                  <label class="block text-sm font-medium">Method</label>
                  <select v-model="form.payment_method" required class="w-full border p-2 rounded">
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Online</option>
                  </select>
                </div>
                <!-- Actions -->
                <div class="flex justify-end space-x-2 pt-4">
                  <button type="button" @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
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
import { Dialog, DialogTitle, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface Appointment { id:number; booking_code:string; appointment_datetime:string }
interface Payment  {
  id:number,
  appointment_id:number,
  booking_code:string,
  client_name:string,
  stylist_name:string,
  amount:number,
  paid_at:string,
  payment_method:string
}

// lookup data
const { data: appointments } = await useFetch<Appointment[]>('/api/appointments', { key:'getAppointments' })
const { data: payments, refresh: refreshPayments } = await useFetch<Payment[]>('/api/payments', { key:'getPayments' })

// modal & form state
const open = ref(false)
const isEditing = ref(false)
const editingId = ref<number|null>(null)
const form = ref<Partial<Payment>>({ amount: 0, payment_method: 'Cash' })

// format helpers
function formatDate(iso:string) {
  return new Date(iso).toLocaleDateString('en-US', { timeZone:'UTC', year:'numeric', month:'short', day:'numeric' })
}
function formatDateTime(iso:string) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone:'UTC', year:'numeric', month:'short', day:'numeric',
    hour:'2-digit', minute:'2-digit'
  })
}

// open add
function openAdd(){
  isEditing.value=false
  editingId.value=null
  form.value={ amount:0, payment_method:'Cash', paid_at:'', appointment_id:undefined }
  open.value=true
}
// open edit
function openEdit(p: Payment) {
  isEditing.value = true
  editingId.value = p.id

  // Convert the paid_at to a datetime-local–friendly string:
  //   new Date(p.paid_at).toISOString() => '2025-05-03T14:23:00.000Z'
  //   slice(0,16) => '2025-05-03T14:23'
  const dtLocal = new Date(p.paid_at).toISOString().slice(0, 16)

  form.value = {
    appointment_id:  p.appointment_id,
    amount:          p.amount,
    payment_method:  p.payment_method,
    paid_at:         dtLocal
  }

  open.value = true
}
// close
function closeModal(){ open.value=false }

// submit
async function submitPayment(){
  const url    = isEditing.value ? `/api/payments/${editingId.value}` : '/api/payments'
  const method = isEditing.value ? 'PUT' : 'POST'
  await $fetch(url, { method, body: form.value })
  await refreshPayments()
  closeModal()
}
// delete
async function deletePayment(id:number){
  if(!confirm('Delete payment?')) return
  await $fetch(`/api/payments/${id}`, { method:'DELETE' })
  await refreshPayments()
}
</script>
