<!-- components/ReviewModal.vue -->
<template>
    <TransitionRoot as="template" :show="show" @close="$emit('update:show', false)">
      <Dialog class="fixed inset-0 z-10 overflow-y-auto" @close="$emit('update:show', false)">
        <div class="text-black flex items-center justify-center min-h-screen px-4">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <DialogTitle class="text-lg font-medium mb-4">Leave a Review</DialogTitle>
              <form @submit.prevent="submitReview" class="space-y-4">
                <!-- form fields identical to before -->
                <div>
                  <label class="block text-sm font-medium">Booking Code</label>
                  <input v-model="form.booking_code" type="text" maxlength="8" required
                         class="w-full border rounded p-2" placeholder="8-char code" />
                </div>
                <div>
                  <label class="block text-sm font-medium">Name</label>
                  <input v-model="form.name" type="text" required
                         class="w-full border rounded p-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium">Email</label>
                  <input v-model="form.email" type="email" required
                         class="w-full border rounded p-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium">Rating</label>
                  <select v-model.number="form.rating" required class="w-full border rounded p-2">
                    <option v-for="n in [1,2,3,4,5]" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium">Comment</label>
                  <textarea v-model="form.comment" rows="3"
                            class="w-full border rounded p-2" placeholder="Your feedback..." />
                </div>
                <div class="flex justify-end space-x-2 pt-4">
                  <button type="button" @click="$emit('update:show', false)"
                          class="px-4 py-2 border rounded hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit"
                          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Submit
                  </button>
                </div>
              </form>
              <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
              <p v-if="error"   class="mt-4 text-red-600">{{ error }}</p>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Dialog, DialogTitle, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
  
  interface ReviewForm {
    booking_code: string
    name:         string
    email:        string
    rating:       number
    comment:      string
  }
  
  const props = defineProps<{ show: boolean }>()
// use the array form (and `as const` to keep the literal types)
  const emit = defineEmits(['update:show', 'close'] as const)
  
  const form    = ref<ReviewForm>({ booking_code:'', name:'', email:'', rating:5, comment:'' })
  const message = ref<string|null>(null)
  const error   = ref<string|null>(null)
  
  watch(() => props.show, val => {
    if (val) {
      // reset on open
      form.value = { booking_code:'', name:'', email:'', rating:5, comment:'' }
      message.value = error.value = null
    }
  })
  
  async function submitReview() {
    message.value = error.value = null
    try {
      await $fetch('/api/reviews', { method:'POST', body: form.value })
      message.value = 'Thanks! Your review has been recorded.'
      form.value = { booking_code:'', name:'', email:'', rating:5, comment:'' }
    } catch (err: any) {
      console.error('Review error:', err)
      error.value = err.statusMessage || 'Could not submit review.'
    }
  }
  </script>
  