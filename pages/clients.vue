<template>
    <div class="bg-white">
      <!-- Mobile menu -->
      <TransitionRoot as="template" :show="mobileMenuOpen">
        <Dialog class="relative z-40 lg:hidden" @close="mobileMenuOpen = false">
          <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>
  
          <div class="fixed inset-0 z-40 flex">
            <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
              <DialogPanel class="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div class="flex px-4 pb-2 pt-5">
                  <button type="button" class="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400" @click="mobileMenuOpen = false">
                    <span class="sr-only">Close menu</span>
                    <XMarkIcon class="size-6" aria-hidden="true" />
                  </button>
                </div>
  
                <!-- Links -->
                <TabGroup as="div" class="mt-2">
                  <div class="border-b border-gray-200">
                    <TabList class="-mb-px flex space-x-8 px-4">
                      <Tab as="template" v-for="category in navigation.categories" :key="category.name" v-slot="{ selected }">
                        <button :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900', 'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium']">{{ category.name }}</button>
                      </Tab>
                    </TabList>
                  </div>
                  <TabPanels as="template">
                    <TabPanel v-for="category in navigation.categories" :key="category.name" class="space-y-12 px-4 py-6">
                      <div class="grid grid-cols-2 gap-x-4 gap-y-10">
                        <div v-for="item in category.featured" :key="item.name" class="group relative">
                          <img :src="item.imageSrc" :alt="item.imageAlt" class="aspect-square w-full rounded-md bg-gray-100 object-cover group-hover:opacity-75" />
                          <a :href="item.href" class="mt-6 block text-sm font-medium text-gray-900">
                            <span class="absolute inset-0 z-10" aria-hidden="true" />
                            {{ item.name }}
                          </a>
                          <p aria-hidden="true" class="mt-1 text-sm text-gray-500">Shop now</p>
                        </div>
                      </div>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
  
                <div class="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div v-for="page in navigation.pages" :key="page.name" class="flow-root">
                    <a :href="page.href" class="-m-2 block p-2 font-medium text-gray-900">{{ page.name }}</a>
                  </div>
                </div>
  
                <div class="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div class="flow-root">
                    <a href="#" class="-m-2 block p-2 font-medium text-gray-900">Create an account</a>
                  </div>
                  <div class="flow-root">
                    <a href="#" class="-m-2 block p-2 font-medium text-gray-900">Sign in</a>
                  </div>
                </div>
  
                <div class="space-y-6 border-t border-gray-200 px-4 py-6">
                  <!-- Currency selector -->
                  <form>
                    <div class="-ml-2 inline-grid grid-cols-1">
                      <select id="mobile-currency" name="currency" aria-label="Currency" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-0.5 pl-2 pr-7 text-base font-medium text-gray-700 focus:outline focus:outline-2 group-hover:text-gray-800 sm:text-sm/6">
                        <option v-for="currency in currencies" :key="currency">{{ currency }}</option>
                      </select>
                      <ChevronDownIcon class="pointer-events-none col-start-1 row-start-1 mr-1 size-5 self-center justify-self-end fill-gray-500" aria-hidden="true" />
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Hero section -->
      <div class="relative bg-gray-900">
      
        
  
        <!-- Navigation -->
        <header class="relative z-10">
          <nav aria-label="Top">
            <!-- Top navigation -->
            <div class="bg-white/10 backdrop-blur-md backdrop-filter">
              <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div>
                  <div class="flex h-16 items-center justify-between">
                    <!-- Logo (lg+) -->
                    <div class="hidden lg:flex lg:flex-1 lg:items-center">
                      <a href="/">
                        <span class="sr-only">Your Company</span>
                        <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white" alt="" />
                      </a>
                    </div>
  
                    <div class="hidden h-full lg:flex">
                      <!-- Flyout menus -->
                      <PopoverGroup class="inset-x-0 bottom-0 px-4">
                        <div class="flex h-full justify-center space-x-8">
                          <Popover v-for="category in navigation.categories" :key="category.name" class="flex" v-slot="{ open }">
                            <div class="relative flex">
                              <PopoverButton class="relative z-10 flex items-center justify-center text-sm font-medium text-white transition-colors duration-200 ease-out">
                                {{ category.name }}
                                <span :class="[open ? 'bg-white' : '', 'absolute inset-x-0 -bottom-px h-0.5 transition duration-200 ease-out']" aria-hidden="true" />
                              </PopoverButton>
                            </div>
  
                            <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
                              <PopoverPanel class="absolute inset-x-0 top-full text-sm text-gray-500">
                                <!-- Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow -->
                                <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />
  
                                <div class="relative bg-white">
                                  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                    <div class="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                                      <div v-for="item in category.featured" :key="item.name" class="group relative">
                                        <img :src="item.imageSrc" :alt="item.imageAlt" class="aspect-square w-full rounded-md bg-gray-100 object-cover group-hover:opacity-75" />
                                        <a :href="item.href" class="mt-4 block font-medium text-gray-900">
                                          <span class="absolute inset-0 z-10" aria-hidden="true" />
                                          {{ item.name }}
                                        </a>
                                        <p aria-hidden="true" class="mt-1">Shop now</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverPanel>
                            </transition>
                          </Popover>
  
                          <a v-for="page in navigation.pages" :key="page.name" :href="page.href" class="flex items-center text-sm font-medium text-white">{{ page.name }}</a>
                        </div>
                      </PopoverGroup>
                    </div>
  
                    <!-- Mobile menu and search (lg-) -->
                    <div class="flex flex-1 items-center lg:hidden">
                      <button type="button" class="-ml-2 p-2 text-white" @click="mobileMenuOpen = true">
                        <span class="sr-only">Open menu</span>
                        <Bars3Icon class="size-6" aria-hidden="true" />
                      </button>
  
                      <!-- Search -->
                      <a href="#" class="ml-2 p-2 text-white">
                        <span class="sr-only">Search</span>
                        <MagnifyingGlassIcon class="size-6" aria-hidden="true" />
                      </a>
                    </div>
  
                    <!-- Logo (lg-) -->
                    <a href="#" class="lg:hidden">
                      <span class="sr-only">Your Company</span>
                      <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white" alt="" class="h-8 w-auto" />
                    </a>
  
                    <div class="flex flex-1 items-center justify-end">
                      <a href="#" class="hidden text-sm font-medium text-white lg:block">Search</a>
  
                      <div class="flex items-center lg:ml-8">
                        <!-- Help -->
                        <a href="#" class="p-2 text-white lg:hidden">
                          <span class="sr-only">Help</span>
                          <QuestionMarkCircleIcon class="size-6" aria-hidden="true" />
                        </a>
                        <a href="#" class="hidden text-sm font-medium text-white lg:block">Help</a>
  
                        <!-- Cart -->
                        <div class="ml-4 flow-root lg:ml-8">
                          <a href="#" class="group -m-2 flex items-center p-2">
                            <ShoppingBagIcon class="size-6 shrink-0 text-white" aria-hidden="true" />
                            <span class="ml-2 text-sm font-medium text-white">0</span>
                            <span class="sr-only">items in cart, view bag</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
  
   
      </div>
  
      <main>
  
        <!-- Featured section -->
        <section aria-labelledby="comfort-heading" class="bg-white mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div class="ml-4 mt-2">
              <h3 class="text-xl font-semibold text-gray-900">Clients</h3>
            </div>
            <div class="ml-4 mt-2 shrink-0">
              <button @click="open=true" type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 top-0 right-0">Add Client</button>
            </div>
          </div>
          

          <div class="relative rounded-lg">
            
            <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <li v-for="client in clients" :key="client.email" class="col-span-1 divide-y divide-white rounded-lg bg-gray-200 backdrop-blur-sm shadow-lg">
                <div class="flex w-full items-center justify-between space-x-6 p-6">
                  <div class="flex-1 truncate">
                    <div class="flex items-center space-x-3">
                      <h3 class="truncate text-sm font-medium text-gray-900">{{ client.name }}</h3>
                      <!-- <span class="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ person.role }}</span> -->
                    </div>

                    <!-- <p class="mt-1 truncate text-sm text-gray-500">{{ person.title }}</p> -->
                  </div>
                  <button @click="deleteClient(client.client_id)" class="text-red-600 hover:text-red-800">
                    <XMarkIcon class="h-6 w-6" />
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
                    <form @submit.prevent="addClient" class="w-full max-w-lg">
                      <div class="flex flex-wrap -mx-3 mb-2">
                        <div class="w-full px-3 ">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Name
                          </label>
                          <input v-model="client.name" required class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane">
                          
                        </div>
                        
                      </div>
                      <div class="flex flex-wrap -mx-3 mb-2">
                        <div class="w-full px-3 ">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Email
                          </label>
                          <input v-model="client.email" required class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-email" type="email" placeholder="Jane@gmail.com">
                          
                        </div>
                      </div>
                      <div class="flex flex-wrap -mx-3 mb-2">
                        <div class="w-full px-3 ">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Phone Number
                          </label>
                          <input v-model="client.phone" required class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-phone" type="text" placeholder="123-456-7890">
                          
                        </div>
                      </div>
                      <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="submit" class="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto" >Submit</button>
                        <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="open = false" ref="cancelButtonRef">Cancel</button>
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
      <footer aria-labelledby="footer-heading" class="bg-gray-900">
        <h2 id="footer-heading" class="sr-only">Footer</h2>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="py-20 xl:grid xl:grid-cols-3 xl:gap-8">
            <div class="grid grid-cols-2 gap-8 xl:col-span-2">
              <div class="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 class="text-sm font-medium text-white">Shop</h3>
                  <ul role="list" class="mt-6 space-y-6">
                    <li v-for="item in footerNavigation.shop" :key="item.name" class="text-sm">
                      <a :href="item.href" class="text-gray-300 hover:text-white">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-white">Company</h3>
                  <ul role="list" class="mt-6 space-y-6">
                    <li v-for="item in footerNavigation.company" :key="item.name" class="text-sm">
                      <a :href="item.href" class="text-gray-300 hover:text-white">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 class="text-sm font-medium text-white">Account</h3>
                  <ul role="list" class="mt-6 space-y-6">
                    <li v-for="item in footerNavigation.account" :key="item.name" class="text-sm">
                      <a :href="item.href" class="text-gray-300 hover:text-white">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-white">Connect</h3>
                  <ul role="list" class="mt-6 space-y-6">
                    <li v-for="item in footerNavigation.connect" :key="item.name" class="text-sm">
                      <a :href="item.href" class="text-gray-300 hover:text-white">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="mt-12 md:mt-16 xl:mt-0">
              <h3 class="text-sm font-medium text-white">Sign up for our newsletter</h3>
              <p class="mt-6 text-sm text-gray-300">The latest deals and savings, sent to your inbox weekly.</p>
              <form class="mt-2 flex sm:max-w-md">
                <input id="email-address" type="text" autocomplete="email" required="" aria-label="Email address" class="block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white" />
                <div class="ml-4 shrink-0">
                  <button type="submit" class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">Sign up</button>
                </div>
              </form>
            </div>
          </div>
  
          <div class="border-t border-gray-800 py-10">
            <p class="text-sm text-gray-400">Copyright &copy; 2021 Your Company, Inc.</p>
          </div>
        </div>
      </footer>
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
  import {
    Bars3Icon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    ShoppingBagIcon,
    XMarkIcon,
    ExclamationTriangleIcon
  } from '@heroicons/vue/24/outline'
    import { EnvelopeIcon, PhoneIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'

  const open = ref(false)
  const client = ref({
    name: '',
    email: '',
    phone: '',
  })

  const {clients} = await $fetch('/api/get-clients', {
        method: 'GET',
      })
    
  async function addClient(){
    try {
      const response = await $fetch('/api/post-clients', {
        method: 'POST',
        body: client.value,
      })
      console.log('Client added:', response)
      alert('Client added successfully!')
    } catch (error) {
      console.error('Error adding client:', error)
      alert('Failed to add client.')
    }
  }

  async function deleteClient(clientId){
    console.log("clientID:", clientId)
    try {
      const response = await $fetch(`/api/remove-clients`, {
        method: 'POST',
        body:{clientId}
      })

    } catch (err) {
      console.error('Error deleting client:', err)
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
      { name: 'Gel', href: '#' },
      { name: 'Accessories', href: '#' },
    ],
    company: [
      { name: 'Who we are', href: '#' },
      { name: 'Sustainability', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Terms & Conditions', href: '#' },
      { name: 'Privacy', href: '#' },
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
      { name: 'Pinterest', href: '#' },
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
  
  