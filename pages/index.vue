<template>
  <main
    class="relative flex flex-col items-center justify-center min-h-screen py-10"
  >
    <h1
      class="pt-4 pb-8 bg-gradient-to-br dark:from-white from-black via-[#707070] to-[#ffffff] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
    >
      Salon Stylists
    </h1>

    <!-- Only show Table when data is loaded -->
    <Table v-if="data?.value" :stylists="data?.value?.stylists" :duration="data?.value?.duration" />
  </main>
</template>

<script setup>
const { data } = await useFetch('/api/get-users')
console.log("Data:", data?.value)  // Accessing the actual value here
</script>
