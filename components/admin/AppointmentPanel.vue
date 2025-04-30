<template>
  <div class="text-black bg-white min-h-screen flex flex-col">
    <main class="flex-grow">
      <section aria-labelledby="appointments-heading" class="mx-auto max-w-7xl px-4 py-12">
        <div class="flex justify-between items-center mb-6">
          <h2 id="appointments-heading" class="text-xl font-semibold">Appointments</h2>
          <button
            @click="openAdd()"
            class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Appt
          </button>
        </div>

        <!-- Appointments Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-semibold">Code</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Client</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Service</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Stylist</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Time</th>
                <th class="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th class="px-4 py-2 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="a in appointments" :key="a.id">
                <td class="px-4 py-2 text-sm">{{ a.booking_code.slice(0, 8) }}</td>
                <td class="px-4 py-2 text-sm">{{ a.client_name }}</td>
                <td class="px-4 py-2 text-sm">{{ a.service_name }}</td>
                <td class="px-4 py-2 text-sm">{{ a.stylist_name }}</td>
                <td class="px-4 py-2 text-sm">{{ formatDate(a.appointment_datetime) }}</td>
                <td class="px-4 py-2 text-sm">{{ formatTime(a.appointment_datetime) }}</td>
                <td class="px-4 py-2 text-sm">{{ a.status }}</td>
                <td class="px-4 py-2 text-center space-x-2">
                  <button @click="openEdit(a)" class="text-blue-600 hover:underline">Edit</button>
                  <button @click="deleteAppt(a.id)" class="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr v-if="!appointments.length">
                <td colspan="8" class="px-4 py-6 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Add/Edit Appointment Modal -->
    <TransitionRoot as="template" :show="open">
      <Dialog class="fixed inset-0 z-10 overflow-y-auto" @close="closeModal">
        <div class="text-black flex items-center justify-center min-h-screen px-4">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <DialogTitle class="text-lg font-medium mb-4">
                {{ isEditing ? 'Edit Appointment' : 'New Appointment' }}
              </DialogTitle>

              <form @submit.prevent="submitAppt" class="space-y-4">
                <!-- Client -->
                <div>
                  <label class="block text-sm font-medium">Client</label>
                  <select v-model.number="form.client_id" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select client</option>
                    <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>

                <!-- Service -->
                <div>
                  <label class="block text-sm font-medium">Service</label>
                  <select v-model.number="form.service_id" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select service</option>
                    <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>

                <!-- Stylist -->
                <div>
                  <label class="block text-sm font-medium">Stylist</label>
                  <select v-model.number="form.stylist_id" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select stylist</option>
                    <option v-for="t in stylists" :key="t.id" :value="t.id">{{ t.name }}</option>
                  </select>
                </div>

                <!-- Date -->
                <div>
                  <label class="block text-sm font-medium">Date</label>
                  <select v-model="selectedDate" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select date</option>
                    <option v-for="d in availableDates" :key="d" :value="d">
                      {{ formatDate(d+'T00:00:00Z') }}
                    </option>
                  </select>
                </div>

                <!-- Time -->
                <div>
                  <label class="block text-sm font-medium">Time</label>
                  <select v-model="selectedSlotId" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select time</option>
                    <option v-for="opt in availableTimes" :key="opt.id" :value="opt.id">
                      {{ opt.time }}
                    </option>
                  </select>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium">Status</label>
                  <select v-model="form.status" required class="w-full border p-2 rounded">
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
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
                    {{ isEditing ? 'Save' : 'Book' }}
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
import { ref, computed, watch } from 'vue'
import { useFetch } from '#app'
import { Dialog, DialogTitle, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface Client { id: number; name: string }
interface Service { id: number; name: string }
interface Stylist { id: number; name: string }
interface Appointment {
  id: number
  booking_code: string
  client_id: number
  client_name: string
  service_id: number
  service_name: string
  stylist_id: number
  stylist_name: string
  appointment_datetime: string
  status: string
}
interface Slot {
  id: number
  stylist_id: number
  available_date: string
  available_time: string
}

// Lookup data
const { data: clients }    = await useFetch<Client[]>('/api/clients',    { key: 'getClients' })
const { data: services }   = await useFetch<Service[]>('/api/services',  { key: 'getServices' })
const { data: stylists }   = await useFetch<Stylist[]>('/api/stylists', { key: 'getStylists' })
const { data: appointments, refresh: refreshAppts } =
  await useFetch<Appointment[]>('/api/appointments', { key: 'getAppointments' })

// Form state
const form = ref<Partial<Appointment>>({ status: 'Scheduled' })
const selectedDate   = ref('')
const selectedSlotId = ref<number|null>(null)

// Availability for chosen stylist
const availUrl = computed(() => 
  form.value.stylist_id
    ? `/api/availability?stylist_id=${form.value.stylist_id}`
    : '/api/availability'
)

// 2) Pass that Ref<string> directly into useFetch
const { data: availSlots, refresh: refreshAvail } = await useFetch<Slot[]>(
  availUrl,
  { key: 'getAvail' }
)
// Modal state
const open = ref(false)
const isEditing = ref(false)
const editingId = ref<number|null>(null)

// Re-load availability when stylist changes
watch(() => form.value.stylist_id, async (sid) => {
  if (sid) {
    await refreshAvail()
    selectedDate.value = ''
    selectedSlotId.value = null
  }
})

// Available dates (distinct YYYY-MM-DD)
const availableDates = computed(() =>
  (availSlots.value || []).map(s => s.available_date.split('T')[0])
    .filter((v,i,a) => a.indexOf(v)===i)
)

// Available times for selected date
const availableTimes = computed(() =>
  (availSlots.value || [])
    .filter(s => s.available_date.split('T')[0] === selectedDate.value)
    .map(s => ({ id: s.id, time: s.available_time.slice(0,5) }))
)

// Helpers for display
function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', { timeZone: 'UTC',
    year:'numeric', month:'short', day:'numeric',
    hour:'2-digit', minute:'2-digit'
  })
}
function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { timeZone:'UTC',
    year:'numeric', month:'short', day:'numeric'
  })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone:'UTC', hour:'2-digit', minute:'2-digit'
  })
}

// Open Add
function openAdd() {
  isEditing.value = false
  editingId.value = null
  form.value = { status: 'Scheduled' }
  selectedDate.value = ''
  selectedSlotId.value = null
  open.value = true
}
// Open Edit
function openEdit(a: Appointment) {
  isEditing.value = true
  editingId.value = a.id
  form.value = {
    client_id: a.client_id,
    service_id: a.service_id,
    stylist_id: a.stylist_id,
    status: a.status
  }
  // prefill date/time selects
  selectedDate.value = a.appointment_datetime.split('T')[0]
  // need to refetch availability for that stylist
  refreshAvail().then(() => {
    // find matching slot id if it exists
    const date = selectedDate.value
    const time = a.appointment_datetime.split('T')[1].slice(0,5)
    const slot = (availSlots.value||[]).find(s =>
      s.available_date.split('T')[0] === date &&
      s.available_time.slice(0,5) === time
    )
    selectedSlotId.value = slot?.id ?? null
  })
  open.value = true
}
// Close modal
function closeModal() {
  open.value = false
}

// Submit Add or Edit
async function submitAppt() {
  if (!selectedSlotId.value) return alert('Pick a time')
  // build datetime
  const slot = availSlots.value!.find(s => s.id===selectedSlotId.value)!
  const date = slot.available_date.split('T')[0]
  const time = slot.available_time.slice(0,5)
  const appointment_datetime = `${date}T${time}:00`

  // call API
  if (isEditing.value && editingId.value) {
    await $fetch(`/api/appointments/${editingId.value}`, {
      method: 'PUT',
      body: { ...form.value, appointment_datetime }
    })
  } else {
    await $fetch('/api/appointments', {
      method: 'POST',
      body: { ...form.value, appointment_datetime }
    })
  }
  // remove the slot
  await $fetch(`/api/availability/${selectedSlotId.value}`, { method:'DELETE' })

  // refresh both lists
  await Promise.all([refreshAppts(), refreshAvail()])

  closeModal()
}

// Delete appointment
async function deleteAppt(id: number) {
  if (!confirm('Delete this appointment?')) return
  await $fetch(`/api/appointments/${id}`, { method: 'DELETE' })
  await refreshAppts()
}
</script>
