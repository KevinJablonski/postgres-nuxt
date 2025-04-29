<template>
    <div class="bg-white min-h-screen flex flex-col">
      <!-- Hero section -->
      <main class="flex-grow">
        <!-- Featured section -->
        <section aria-labelledby="comfort-heading" class="bg-white mx-auto max-w-7xl h-page px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div class="ml-4 mt-2">
              <h3 class="text-xl font-semibold text-gray-900">Clients</h3>
            </div>
            <div class="ml-4 mt-2 shrink-0">
              <button  @click="openAddModal" type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 top-0 right-0">Add Client</button>
            </div>
          </div>
          

          <div class="relative rounded-lg">
            
            <ul v-if="clients.length > 0" role="list" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <li v-for="client in clients" :key="client.email" class="col-span-1 divide-y divide-white rounded-lg bg-gray-200 backdrop-blur-sm shadow-lg">
                <div class="flex w-full items-center justify-between space-x-6 p-6">
                  <div class="flex-1 truncate">
                    <div class="flex items-center space-x-3">
                      <h3 class="truncate text-sm font-medium text-gray-900">{{ client.name }}</h3>
                      <!-- <span class="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ person.role }}</span> -->
                    </div>

                    <!-- <p class="mt-1 truncate text-sm text-gray-500">{{ person.title }}</p> -->
                  </div>
                  <button @click="openEditModal(client)" class="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button @click="deleteClient(client.client_id)" class="text-red-600 hover:text-red-800">
                    <!-- <XMarkIcon class="h-6 w-6" /> -->
                     Delete
                  </button>
                  <!-- <img class="size-10 shrink-0 rounded-full bg-gray-300" :src="person.imageUrl" alt="" /> -->
                </div>
                <div>
                  <div class="-mt-px flex divide-x divide-white">
                    <div class="flex w-0 flex-1">
                      <a :href="`mailto:${client.email}`" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                        <EnvelopeIcon class="size-5 text-gray-400" aria-hidden="true" />
                        {{ client.email }}
                      </a>
                    </div>
                    <div class="-ml-px flex w-0 flex-1">
                      <a :href="`tel:${client.phone}`" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                        <PhoneIcon class="size-5 text-gray-400" aria-hidden="true" />
                        {{ client.phone }}
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div v-else class="text-center mt-8">
              <PlusCircleIcon class="mx-auto size-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-semibold text-gray-900">No Clients</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by adding a new client.</p>
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
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  import {
    PlusCircleIcon
  } from '@heroicons/vue/24/outline'
    import { EnvelopeIcon, PhoneIcon,  } from '@heroicons/vue/20/solid'


  const isEditing = ref(false); // Flag to track edit mode
  const open = ref(false); // Modal visibility

  const client = ref({
    name: '',
    email: '',
    phone: '',
  });

  // Fetch clients from API
  const { data: clients } = await useFetch('/api/get-clients', {
    method: 'GET',
    key: "getClients"
  });

  // Open modal for editing a client
  function openEditModal(selectedClient) {
    client.value = { ...selectedClient }; // Prefill the client data into the client object
    isEditing.value = true; // Set the mode to editing
    open.value = true; // Show the modal
  }
  function openAddModal() {
    client.value = { name: '', email: '', phone: '' }; // Reset client object to empty fields
    isEditing.value = false; // Set the mode to adding (not editing)
    open.value = true; // Show the modal
  }

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

  // Delete client function
  async function deleteClient(clientId) {
    console.log("clientID:", clientId);
    try {
      const response = await $fetch(`/api/remove-clients`, {
        method: 'POST',
        body: { clientId },
      });
      
      refreshNuxtData("getClients") 
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  }
  const navigation = {
    categories: [
      {
        name: 'Services',
        featured: [
          {
            name: 'Haircut',
            href: '#',
            imageSrc: 'https://images.pexels.com/photos/3993443/pexels-photo-3993443.jpeg',
          },
          {
            name: 'Color',
            href: '#',
            imageSrc: 'https://images.pexels.com/photos/8468142/pexels-photo-8468142.jpeg',
          },
          {
            name: 'Blowout & Styling',
            href: '#',
            imageSrc: 'https://images.pexels.com/photos/28994566/pexels-photo-28994566/free-photo-of-woman-styling-red-hair-with-a-curling-iron.jpeg',
          },
          {
            name: 'Hair Treatments',
            href: '#',
            imageSrc: 'https://images.pexels.com/photos/8467970/pexels-photo-8467970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          },
        ],
      },
  
    ],
    pages: [
      { name: 'About Us', href: '#' },
      { name: 'Team', href: '#' },
      { name: 'Contact', href: '#' },
    ],
  }
  const categories = [
  {
            name: 'Haircut',
            href: '#',
            imageSrc: 'https://images.pexels.com/photos/3993443/pexels-photo-3993443.jpeg',
          },
          {
            name: 'Color',
            href: '#',
            imageSrc: 'https://images.pexels.com/photos/8468142/pexels-photo-8468142.jpeg',
          },
          {
            name: 'Blowout & Styling',
            href: '#',
            imageSrc: 'https://images.pexels.com/photos/28994566/pexels-photo-28994566/free-photo-of-woman-styling-red-hair-with-a-curling-iron.jpeg',
          },
          {
            name: 'Hair Treatments',
            href: '#',
            imageSrc: 'https://images.pexels.com/photos/8467970/pexels-photo-8467970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          },
  ]
  
  const footerNavigation = {
    shop: [
      { name: 'Sampoo', href: '#' },
      { name: 'Conditioner', href: '#' },
      { name: 'Accessories', href: '#' },
    ],
    company: [
      { name: 'Who we are', href: '#' },
      { name: 'Sustainability', href: '#' },
      { name: 'Careers', href: '#' },
    ],
    account: [
      { name: 'Manage Account', href: '#' },
      { name: 'Returns & Exchanges', href: '#' },
      { name: 'Redeem a Gift Card', href: '#' },
    ],
    connect: [
      { name: 'Contact Us', href: '#' },
      { name: 'Facebook', href: '#' },
      { name: 'Instagram', href: '#' },
    ],
  }


const people = [


  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
]
  const mobileMenuOpen = ref(false)
  // <Table v-if="data" :stylists="data.stylists" " />
  // const { data } = await useFetch('/api/get-users') 
  </script>
  
  