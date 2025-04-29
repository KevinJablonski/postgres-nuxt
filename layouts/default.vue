<script setup lang="ts">
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
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const currencies = ['CAD', 'USD', 'AUD', 'EUR', 'GBP']
const navigation = {

  pages: [
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '#' },
    { name: 'Team', href: '#' },
    { name: 'Admin', href: '/admin/dashboard' },
  ],
}

// Control mobile menu open/close
const mobileMenuOpen = ref(false)

// Your navigation data
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
</script>

<template>
    <div class="bg-white">
    <div class="relative bg-gray-900">
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
    
  <!-- page-specific content -->
  <slot />
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
