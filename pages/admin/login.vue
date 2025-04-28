<template>
  <div class="flex items-center justify-center min-h-screen text-black bg-gray-200">
    <form @submit.prevent="login" class="p-6 bg-white rounded shadow">
      <h2 class="text-xl mb-4">Admin Login</h2>
      <input
        v-model="password"
        type="password"
        placeholder="Enter password"
        class="border text-black p-2 w-full mb-4"
      />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Log In
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useState, navigateTo, useRuntimeConfig } from '#app'

const password     = ref('')
const adminAuth    = useState('adminAuth', () => false)
const config       = useRuntimeConfig()

function login() {
  // compare against the runtimeConfig value
  if (password.value === config.public.adminPassword) {
    adminAuth.value = true
    return navigateTo('/admin/dashboard')
  }
  alert('Incorrect password')
}
</script>