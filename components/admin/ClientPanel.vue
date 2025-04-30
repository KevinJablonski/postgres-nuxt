<template>
  <div class="bg-white min-h-screen flex flex-col">
    <main class="flex-grow">
      <section
        aria-labelledby="clients-heading"
        class="bg-white mx-auto max-w-7xl h-page px-4 py-12 "
      >
        <div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div class="ml-4 mt-2">
            <h3 id="clients-heading" class="text-xl font-semibold text-gray-900">
              Clients
            </h3>
          </div>
          <div class="ml-4 mt-2 shrink-0">
            <button
              @click="openAddModal"
              type="button"
              class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Add Client
            </button>
          </div>
        </div>

        <div class="min-w-full ">
          <div class="mt-8 flow-root">
            <div class="w-full overflow-x-auto">
              <div class="mx-auto max-w-screen-2xl py-2">
                <div class="shadow rounded-lg">
                  <table class="w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                        >
                          Name
                        </th>
                        <th
                          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Email
                        </th>
                        <th
                          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Phone
                        </th>
                        <th
                          class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                        >
                          Actions
                        </th>
                        
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="client in clients" :key="client.id">
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {{ client.name }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {{ client.email }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {{ client.phone || '–' }}
                        </td>
                        <td
                          class="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-0"
                        >
                          <button
                            @click="openEditModal(client)"
                            class="px-1 text-indigo-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            @click="deleteClient(client.id)"
                            class="px-1 text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="!clients.length" class="p-4 text-center text-gray-500">
                    No clients found.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal -->
    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-10" @close="open = false">
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

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <form @submit.prevent="submitClient" class="w-full max-w-lg">
                    <div class="mb-4">
                      <label class="block text-gray-700 text-xs font-bold mb-2">
                        Name
                      </label>
                      <input
                        v-model="client.name"
                        required
                        type="text"
                        placeholder="Jane Doe"
                        class="appearance-none block w-full bg-gray-200 border border-gray-500 rounded py-3 px-4 text-gray-700 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div class="mb-4">
                      <label class="block text-gray-700 text-xs font-bold mb-2">
                        Email
                      </label>
                      <input
                        v-model="client.email"
                        required
                        type="email"
                        placeholder="jane@example.com"
                        class="appearance-none block w-full bg-gray-200 border border-gray-500 rounded py-3 px-4 text-gray-700 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div class="mb-4">
                      <label class="block text-gray-700 text-xs font-bold mb-2">
                        Phone
                      </label>
                      <input
                        v-model="client.phone"
                        type="tel"
                        placeholder="(000)-555-1234"
                        pattern="^\d{10}$"
                        title="Enter a 10-digit phone number (digits only)"
                        class="appearance-none block w-full bg-gray-200 border border-gray-500 rounded py-3 px-4 text-gray-700 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                      <button
                        type="button"
                        class="px-4 py-2 bg-white text-gray-900 border rounded hover:bg-gray-50"
                        @click="closeModal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400"
                      >
                        {{ isEditing ? 'Update' : 'Add' }}
                      </button>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const isEditing = ref(false)
const open = ref(false)
const client = ref({ name: '', email: '', phone: '' })

// fetch clients
const { data: clients, refresh: refreshClients } = await useFetch(
  '/api/clients/',
  { method: 'GET', key: 'getClients' }
)

function closeModal() {
  open.value = false
  isEditing.value = false
}

function openAddModal() {
  client.value = { name: '', email: '', phone: '' }
  isEditing.value = false
  open.value = true
}

function openEditModal(c) {
  client.value = { ...c }
  isEditing.value = true
  open.value = true
}

async function submitClient() {
  try {
    const endpoint = isEditing.value
      ? `/api/clients/${client.value.id}`
      : '/api/clients'
    const method = isEditing.value ? 'PUT' : 'POST'

    const body = {
      name: client.value.name,
      email: client.value.email,
      phone: client.value.phone || null,
    }

    await $fetch(endpoint, { method, body })
    closeModal()
    await refreshClients()
  } catch (err) {
    console.error('Error submitting client:', err)
    alert('Oops! Something went wrong.')
  }
}

async function deleteClient(id) {
  if (!confirm('Delete this client?')) return
  try {
    await $fetch(`/api/clients/${id}`, { method: 'DELETE' })
    await refreshClients()
    alert('Client deleted.')
  } catch (err) {
    console.error('Failed to delete client:', err)
    alert('Could not delete client.')
  }
}
</script>
