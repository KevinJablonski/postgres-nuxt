<template>
    <div class="bg-white min-h-screen flex flex-col">
      <!-- Hero section -->
      <main class="flex-grow">
        <!-- Featured section -->
        <section aria-labelledby="comfort-heading" class="bg-white mx-auto max-w-7xl h-page px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div class="ml-4 mt-2">
              <h3 class="text-xl font-semibold text-gray-900">Stylist</h3>
            </div>
            <div class="ml-4 mt-2 shrink-0">
              <button  @click="openAddModal" type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 top-0 right-0">Add Stylist</button>
            </div>
          </div>
          

          <div class="min-w-full px-4 sm:px-6 lg:px-8">
            <div class="mt-8 flow-root">
              <div class="w-full overflow-x-auto">
                <div class="mx-auto max-w-screen-2xl py-2 sm:px-6 lg:px-8">
                  <div class="shadow rounded-lg">
                    <table class="w-full divide-y divide-gray-300">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ">Name/Specialty</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Avg. Rating</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Upcoming Appts.</th>
                          
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-for="stylist in stylists" :key="stylist.id">
                          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                            <div class="flex items-center">
                              <div class="size-11 shrink-0">
                                <img class="size-11 rounded-full" :src="stylist.photo_url || '/images/default-avatar.png'" alt="" />
                              </div>
                              <div class="ml-4">
                                <div class="font-medium text-gray-900">{{ stylist.name }}</div>
                                <div class="mt-1 text-gray-500">{{ stylist.specialization }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ stylist.avg_rating }}</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ stylist.upcoming_count }}</td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
                            <button
                              @click="openEditModal(stylist)"
                              class="px-1 text-indigo-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              @click="deleteStylist(stylist.id)"
                              class="px-1 text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <TransitionRoot as="template" :show="open">
        <Dialog class="relative z-10" @close="open = false">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </TransitionChild>

          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="w-full">
                      <div class="mt-3 text-left">
                        <form @submit.prevent="submitStylist" class="w-full max-w-lg">
                          <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full px-3">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                Name
                              </label>
                              <input v-model="stylist.name" required class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane">
                            </div>
                          </div>

                          <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full px-3">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email">
                                Specialization
                              </label>
                              <input v-model="stylist.specialization" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-specialization" type="text" >
                            </div>
                          </div>

                          <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full px-3">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-phone">
                                Photo URL
                              </label>
                              <input v-model="stylist.photo_url" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-url" type="url" placeholder="https://example.com/my-photo.jpg">
                            </div>
                          </div>

                          <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="submit" class="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto">
                              {{ isEditing ? 'Update' : 'Submit' }}
                            </button>
                            <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="closeModal">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
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
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  
  const isEditing = ref(false); // Flag to track edit mode
  const open = ref(false); // Modal visibility

  const stylist = ref({
    name: '',
    specialization: '',
    photo_url: '',
  });

  // Fetch clients from API
  const { data: stylists } = await useFetch('/api/stylists/', {
    method: 'GET',
    key: "getStylists"
  });
  // Open modal for editing a stylist
console.log("Stylists",stylists)
  // Close modal
  function closeModal() {
    open.value = false;
    isEditing.value = false; // Reset editing flag when closing the modal
  }
  function openEditModal(selectedClient) {
    stylist.value = { ...selectedClient }; // Prefill the client data into the client object
    isEditing.value = true; // Set the mode to editing
    open.value = true; // Show the modal
  }
  function openAddModal() {
    stylist.value = { name: '', specialization: '', photo_url: '' }; // Reset stylist object to empty fields
    isEditing.value = false; // Set the mode to adding (not editing)
    open.value = true; // Show the modal
  }
  // Submit form for adding or editing stylist
  async function submitStylist() {
  try {
    console.log("ID Value:",stylist.value.id)
    // 1) Build the endpoint and method
    const endpoint = isEditing.value
      ? `/api/stylists/${stylist.value.id}`
      : '/api/stylists'
    const method = isEditing.value ? 'PUT' : 'POST'

    // 2) Only send the fields your API wants
    const body = {
      name:           stylist.value.name,
      specialization: stylist.value.specialization,
      photo_url:      stylist.value.photo_url
    }

    // 3) Fire the request
    const response = await $fetch(endpoint, {
      method,
      body
    })

    console.log(
      isEditing.value
        ? 'Stylist updated successfully'
        : 'Stylist created successfully',
      response
    )

    // 4) Reset form + reload table
    isEditing.value = false
    closeModal()
    stylist.value = { name: '', specialization: '', photo_url: '' }
    refreshNuxtData("getStylists")

  } catch (err) {
    console.error('Error submitting stylist:', err)
    alert('Oops! Something went wrong.')
  }
}
async function deleteStylist(id) {
  if (!confirm('Are you sure you want to delete this stylist?')) return
  try {
    await $fetch(`/api/stylists/${id}`, { method: 'DELETE' })
    // refresh the list
    await refreshNuxtData("getStylists")
    alert('Stylist deleted.')
  } catch (err) {
    console.error('Failed to delete stylist:', err)
    alert('Could not delete stylist.')
  }
}
  </script>
  
  