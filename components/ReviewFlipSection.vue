<template>
    <section
      aria-labelledby="comfort-heading"
      class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div class="perspective w-full text-black bg-gray-100 mx-auto z-20">
        <div
          class="flip-card-inner relative w-full h-96 transform-style-preserve-3d transition-transform duration-700"
          :class="{ 'rotate-y-180': showForm }"
        >
          <!-- FRONT -->
          <div class="front absolute inset-0 backface-hidden rounded-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/3993320/pexels-photo-3993320.jpeg"
              alt=""
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gray-900/75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div class="mx-auto max-w-3xl text-center">
                <h2
                  id="comfort-heading"
                  class="text-3xl font-bold text-white sm:text-4xl"
                >
                  Leave Us A Review!
                </h2>
                <p class="mt-3 text-xl text-white">
                  Please let us know what you think.
                </p>
                <button
                  @click="showForm = true"
                  class="mt-8 inline-block rounded-md bg-white px-8 py-3 font-medium text-gray-900 hover:bg-gray-100"
                >
                  Leave Review
                </button>
              </div>
            </div>
          </div>
  
          <!-- BACK -->
          <div
            class="back absolute inset-0 bg-white p-6 backface-hidden rotate-y-180 rounded-lg shadow-lg overflow-auto"
          >
            <h3 class="text-xl font-semibold mb-4">Your Review</h3>
            <form @submit.prevent="submitReview" class="space-y-6">
  <!-- Row 1: Booking Code & Name -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium">Booking Code</label>
      <input
        v-model="form.booking_code"
        type="text" maxlength="8" required
        class="w-full border rounded p-2"
        placeholder="8-char code"
      />
    </div>
    <div>
      <label class="block text-sm font-medium">Name</label>
      <input
        v-model="form.name"
        type="text" required
        class="w-full border rounded p-2"
        placeholder="Your name"
      />
    </div>
  </div>

  <!-- Row 2: Email & Rating -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium">Email</label>
      <input
        v-model="form.email"
        type="email" required
        class="w-full border rounded p-2"
        placeholder="you@example.com"
      />
    </div>
    <div>
    <label class="block text-sm font-medium mb-1">Rating</label>
    <div class="flex space-x-1">
      <button
        v-for="n in 5"
        :key="n"
        @click="form.rating = n"
        type="button"
        class="focus:outline-none"
      >
        <component
          :is="n <= form.rating ? SolidStar : OutlineStar"
          class="w-6 h-6"
          :class="n <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
        />
      </button>
    </div>
  </div>
  </div>

  <!-- Row 3: Comment (full width) -->
  <div>
    <label class="block text-sm font-medium">Comment</label>
    <textarea
      v-model="form.comment"
      rows="4"
      class="w-full border rounded p-2"
      placeholder="Your feedback..."
    />
  </div>

  <!-- Actions -->
  <div class="flex justify-between pt-4">
    <button
      type="button"
      @click="showForm = false"
      class="px-4 py-2 border rounded hover:bg-gray-50"
    >
      Back
    </button>
    <button
      type="submit"
      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Submit
    </button>
  </div>
</form>
            <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
            <p v-if="error"   class="mt-4 text-red-600">{{ error }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { StarIcon as SolidStar } from '@heroicons/vue/24/solid'
import { StarIcon as OutlineStar } from '@heroicons/vue/24/outline'
  interface ReviewForm {
    booking_code: string
    name:         string
    email:        string
    rating:       number
    comment:      string
  }
  
  const showForm = ref(false)
  const message  = ref<string|null>(null)
  const error    = ref<string|null>(null)
  
  const form = ref<ReviewForm>({
    booking_code: '',
    name:         '',
    email:        '',
    rating:       5,
    comment:      '',
  })
  
  async function submitReview() {
    message.value = error.value = null
    try {
      await $fetch('/api/reviews', {
        method: 'POST',
        body: form.value,
      })
      message.value  = 'Thanks! Your review has been recorded.'
      showForm.value = false
      form.value     = {
        booking_code: '',
        name:         '',
        email:        '',
        rating:       5,
        comment:      '',
      }
    } catch (err: any) {
      console.error('Review error:', err)
      error.value = err.statusMessage || 'Could not submit review.'
    }
  }
  </script>
  
  <style scoped>
  .perspective {
    perspective: 1000px;
  }
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  </style>
  