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
    <Table v-if="data" :stylists="data?.stylists" :duration="data?.duration" />
  </main>
</template>

<script setup>
const { data, error } = await useFetch('/api/get-users')
console.log("Data:", data)
console.log("Error:", error)
</script>
