<template>
  <div class="text-black bg-white min-h-screen flex flex-col">
    <main class="flex-grow">
      <section aria-labelledby="appointments-heading" class="mx-auto max-w-7xl px-4 py-12">
        <div class="flex justify-between items-center mb-6">
          <h2 id="appointments-heading" class="text-xl font-semibold">Appointments</h2>
          <button
            @click="openAdd()"
            class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                <td class="px-4 py-2 text-sm">{{ a.booking_code.slice(0,8) }}</td>
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
        <!-- Backdrop -->
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

        <!-- Panel -->
        <div class="text-black fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="bg-white relative z-20 rounded-lg shadow-xl max-w-2xl w-full p-6">
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
                    <option v-for="st in stylists" :key="st.id" :value="st.id">{{ st.name }}</option>
                  </select>
                </div>

                <!-- Date -->
                <div>
                  <label class="block text-sm font-medium">Date</label>
                  <select v-model="selectedDate" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select date</option>
                    <option v-for="d in availableDates" :key="d" :value="d">
                      {{ formatDate(d + 'T00:00:00Z') }}
                    </option>
                  </select>
                </div>

                <!-- Time -->
                <div>
                  <label class="block text-sm font-medium">Time</label>
                  <select v-model.number="selectedSlotId" required class="w-full border p-2 rounded">
                    <option value="" disabled>Select time</option>
                    <option v-for="opt in availableTimes" :key="opt.id" :value="opt.id">
                      {{ opt.time }}
                    </option>
                  </select>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium">Status</label>
                  <select v-model="form.status" required class="w-64 border p-2 rounded">
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
  slot_id: number
}
interface Slot {
  id: number
  stylist_id: number
  available_date: string
  available_time: string
}

// Fetch lookup data
const { data: clients }  = await useFetch<Client[]>('/api/clients',    { key: 'getClients' })
const { data: services } = await useFetch<Service[]>('/api/services',  { key: 'getServices' })
const { data: stylists } = await useFetch<Stylist[]>('/api/stylists', { key: 'getStylists' })

// Fetch appointments, defaulting to []
const { data: rawAppointments, refresh: refreshAppts } =
  await useFetch<Appointment[]>('/api/appointments', { key: 'getAppointments' })
const appointments = computed(() => rawAppointments.value ?? [])

// Form & modal state
const form            = ref<Partial<Appointment>>({ status: 'Scheduled' })
const selectedDate    = ref('')
const selectedSlotId  = ref<number|null>(null)
const open            = ref(false)
const isEditing       = ref(false)
const editingId       = ref<number|null>(null)
const editingAppt     = ref<Appointment|null>(null)
const originalSlot    = ref<Slot|null>(null)

// Fetch availability for chosen stylist
const availUrl = computed(() =>
  form.value.stylist_id
    ? `/api/availability?stylist_id=${form.value.stylist_id}`
    : '/api/availability'
)
const { data: availSlots, refresh: refreshAvail } = await useFetch<Slot[]>(availUrl, { key: 'getAvail' })

// Reload slots when stylist changes
watch(() => form.value.stylist_id, async (sid) => {
  if (sid) {
    await refreshAvail()
    selectedDate.value = ''
    selectedSlotId.value = null
  }
})

// dates
const availableDates = computed(() => {
  const dates = (availSlots.value||[]).map(s => s.available_date.split('T')[0])

  if (
    isEditing.value &&
    originalSlot.value &&
    form.value.stylist_id === originalSlot.value.stylist_id
  ) {
    dates.push(originalSlot.value.available_date.split('T')[0])
  }

  return Array.from(new Set(dates))
})

const availableTimes = computed(() => {
  const times = (availSlots.value||[])
    .filter(s => s.available_date.split('T')[0] === selectedDate.value)
    .map(s => ({ id: s.id, time: s.available_time.slice(0,5) }))

  if (
    isEditing.value &&
    originalSlot.value &&
    form.value.stylist_id === originalSlot.value.stylist_id &&
    originalSlot.value.available_date.split('T')[0] === selectedDate.value &&
    !times.find(t => t.id === originalSlot.value!.id)
  ) {
    const t = originalSlot.value.available_time.slice(0,5)
    times.unshift({ id: originalSlot.value.id, time: `${t} (current)` })
  }

  return times
})

// Format helpers
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone:'UTC', year:'numeric', month:'short', day:'numeric'
  })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone:'UTC', hour:'2-digit', minute:'2-digit'
  })
}

// Open “Add” modal
function openAdd() {
  isEditing.value   = false
  editingId.value   = null
  editingAppt.value = null
  originalSlot.value= null
  form.value        = { status: 'Scheduled' }
  selectedDate.value   = ''
  selectedSlotId.value = null
  open.value         = true
}

// Open “Edit” modal
async function openEdit(a: Appointment) {
  isEditing.value   = true
  editingId.value   = a.id
  editingAppt.value = a

  // core fields
  form.value = {
    client_id:  a.client_id,
    service_id: a.service_id,
    stylist_id: a.stylist_id,
    status:     a.status,
  }

  // extract original date/time
  const [d, tZone] = a.appointment_datetime.split('T')
  const t = tZone.slice(0,5)
  originalSlot.value = {
    id:              a.slot_id,
    stylist_id:      a.stylist_id,
    available_date:  `${d}T00:00:00.000Z`,
    available_time:  `${t}:00`,
  }

  // 1) load latest slots
  await refreshAvail()

  // 2) set date select
  selectedDate.value = d

  // 3) find the matching slot in fresh data, else fallback to original
  const match = (availSlots.value || []).find(s => 
    s.available_date.split('T')[0] === d &&
    s.available_time.slice(0,5) === t
  )
  selectedSlotId.value = match ? match.id : originalSlot.value.id

  open.value = true
}

// Close modal
function closeModal() {
  open.value = false
}

// Submit Add or Edit
async function submitAppt() {
  const body: any = {
    client_id:  form.value.client_id,
    service_id: form.value.service_id,
    stylist_id: form.value.stylist_id,
    status:     form.value.status
  }

  if (!isEditing.value) {
    // New booking: require slot
    if (!selectedSlotId.value) return alert('Please select a slot.')
    const slot = availSlots.value!.find(s => s.id === selectedSlotId.value)!
    const date = slot.available_date.split('T')[0]
    const time = slot.available_time.slice(0,5)
    body.appointment_datetime = `${date}T${time}:00`
  } else {
    // Editing: only include datetime/slot if changed
    if (selectedSlotId.value !== originalSlot.value?.id) {
      if (!selectedSlotId.value) return alert('Please select a slot.')
      const slot = availSlots.value!.find(s => s.id === selectedSlotId.value)!
      const date = slot.available_date.split('T')[0]
      const time = slot.available_time.slice(0,5)
      body.appointment_datetime = `${date}T${time}:00`
      body.slot_id = selectedSlotId.value
    }
  }

  try {
    if (isEditing.value && editingId.value) {
      await $fetch(`/api/appointments/${editingId.value}`, {
        method: 'PUT',
        body
      })
      // if they rescheduled, deletion is handled server‐side
    } else {
      await $fetch('/api/appointments', { method:'POST', body })
      // remove the slot on new booking
      await $fetch(`/api/availability/${selectedSlotId.value}`, { method:'DELETE' })
    }
    await Promise.all([refreshAppts(), refreshAvail()])
    closeModal()
  } catch (err: any) {
    alert(err.statusMessage || 'Error saving appointment')
  }
}

// Delete appointment
async function deleteAppt(id: number) {
  if (!confirm('Delete this appointment?')) return
  await $fetch(`/api/appointments/${id}`, { method: 'DELETE' })
  await refreshAppts()
}
</script>
