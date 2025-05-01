<template>
  <div class="bg-white">
    <!-- Hero section -->
    <div class="relative bg-gray-900">
      <!-- Decorative image and overlay -->
      <div aria-hidden="true" class="absolute inset-0 overflow-hidden">
        <img src="https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg" alt="" class="size-full object-cover" />
      </div>
      <div aria-hidden="true" class="absolute inset-0 bg-gray-900 opacity-50" />
      <div class="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
        <h1 class="text-4xl font-bold tracking-tight text-white lg:text-6xl">Book your appointment today!</h1>
        <p class="mt-4 text-xl text-white">"Ready for a fresh new look? Book your appointment today and let our expert stylists give you the perfect summer style. Don’t wait—slots are filling up fast!"</p>
        <a @click="navigateTo('/book')" class="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 cursor-pointer hover:bg-gray-100">Book Now</a>
      </div>
      <!-- <div class="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
        <h1 class="text-4xl font-bold tracking-tight text-white lg:text-6xl">Add your clients today!</h1>
        <p class="mt-4 text-xl text-white">For the submission this week of CRUD operations on one table please add clients below.</p>
        <a @click="navigateTo('/clients')" class="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 cursor-pointer hover:bg-gray-100">Add Clients</a>
      </div> -->
    </div>

    <main>

      <!-- Collection section -->
      <section aria-labelledby="collection-heading" class="mx-auto max-w-xl px-4 pt-24 sm:px-6 sm:pt-32 lg:max-w-7xl lg:px-8">
        <h2 id="collection-heading" class="text-2xl font-bold tracking-tight text-gray-900">Meet The Stylists</h2>
        <p class="mt-4 text-base text-gray-500">Our talented stylists craft new looks inspired by the latest trends and the beauty of nature, ensuring you always leave with a fresh and unique style.</p>

        <div class="mt-10 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
          <a v-for="stylist in stylists" :key="stylist.name" class="group block">
            <img :src="stylist.photo_url || '/images/default-avatar.png'"  class="aspect-[3/2] w-full rounded-lg object-cover group-hover:opacity-75 lg:aspect-[5/6]" />
            <h3 class="mt-4 text-base font-semibold text-gray-900">{{ stylist.name }}</h3>
            <p class="mt-2 text-sm text-gray-500">Specialization: {{ stylist.specialization }}</p>
          </a>
        </div>
      </section>

      <!-- Featured section -->
      <ReviewFlipSection />
    </main>
    <ReviewModal v-model:show="showReview" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { data: stylists } = await useFetch('/api/stylists/', {
    method: 'GET',
    key: "getStylists"
  });

  const showReview = ref(false)
</script>

