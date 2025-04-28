<template>
    <div class="bg-white min-h-screen flex flex-col">
      <!-- Hero section -->
      <main class="flex-grow">
        <!-- Featured section -->
        <section aria-labelledby="comfort-heading" class="bg-white mx-auto max-w-7xl h-page px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div class="ml-4 mt-2">
              <h3 class="text-xl font-semibold text-gray-900">Services</h3>
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
                          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ">Name</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span class="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-for="service in services" :key="service.id">
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 ">{{ service.name }}</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ service.description }}</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${{ service.price }}</td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <a href="#" class="text-indigo-600 hover:text-indigo-900"
                              >Edit</a
                            >
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
                        <form @submit.prevent="submitClient" class="w-full max-w-lg">
                          <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full px-3">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                Name
                              </label>
                              <input v-model="client.name" required class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane">
                            </div>
                          </div>

                          <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full px-3">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email">
                                Email
                              </label>
                              <input v-model="client.email" required class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-email" type="email" placeholder="Jane@gmail.com">
                            </div>
                          </div>

                          <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full px-3">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-phone">
                                Phone Number
                              </label>
                              <input v-model="client.phone" required class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-phone" type="text" placeholder="123-456-7890">
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

  const client = ref({
    name: '',
    email: '',
    phone: '',
  });

  // Fetch clients from API
  const { data: services } = await useFetch('/api/services/', {
    method: 'GET',
    key: "getServices"
  });

  // Open modal for editing a client

  // Close modal
  function closeModal() {
    open.value = false;
    isEditing.value = false; // Reset editing flag when closing the modal
  }

  // Submit form for adding or editing client
  async function submitClient() {
    try {
      const endpoint = isEditing.value ? '/api/edit-client' : '/api/post-clients';
      const method = isEditing.value ? 'PUT' : 'POST';
      
      // If editing, we need to send clientId along with updated data
      const body = isEditing.value
        ? { clientId: client.value.client_id, clientData: client.value } // Send clientId and clientData for editing
        : client.value; // For adding, just send the client data
      
      const response = await $fetch(endpoint, {
        method,
        body,
      });

      if (isEditing.value) {
        console.log('Client updated successfully:', response);
      } else {
        console.log('Client added successfully:', response);
      }

      closeModal(); // Close the modal after submission
      refreshNuxtData("getClients") 
    } catch (err) {
      console.error('Error submitting client:', err);
    }
  }

  </script>
  
  