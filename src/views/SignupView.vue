<template>
  <div class="bg-gray-100 flex items-center justify-center h-screen">
    <header
      class="fixed top-0 left-0 w-full bg-blue-500 p-4 z-10 flex justify-between items-center"
    >
      <button @click="goBack" class="back-button text-white"><BackIcon /></button>
      <h1 class="text-white text-lg font-bold text-center">Sign Up</h1>
      <button class="p-2 bg-blue-500 text-white rounded">
        <MoreIcon />
      </button>
    </header>
    <div class="bg-gray-100 p-8 w-96">
      <h2 class="text-2xl font-bold mb-4">Signup</h2>
      <form @submit.prevent="signup">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded-md">Signup</button>
      </form>
      <button @click="goToSignin" class="w-full bg-blue-500 text-white p-2 rounded-md mt-4">
        Go to Signin
      </button>
      <button class="w-full bg-red-500 text-white p-2 rounded-md mt-4">Signup with Google</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'
const authStore = useAuthStore()

import BackIcon from '@/components/icons/IconBack.vue'

const router = useRouter()

const username = ref('')
const password = ref('')

const signup = async () => {
  await authStore.singUp(username.value, password.value)
  router.push({ path: '/' })
}

const goToSignin = () => {
  router.push('/signin')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
