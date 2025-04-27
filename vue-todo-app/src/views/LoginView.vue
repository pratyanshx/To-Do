<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
    <!-- Main Centered Card -->
    <div class="w-full max-w-xs bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <!-- Perfectly Centered Logo -->
      <div class="flex flex-col items-center mb-5">
        <div class="w-14 h-14 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="text-gradient">
            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path fill="#fff" d="M7 12l2 2 4-4 4 4 2-2-6-6z"/>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-center">
          <span class="text-gradient">TODO</span>
          <span class="text-gray-500 text-sm font-normal">App</span>
        </h1>
      </div>

      <!-- Centered Form Fields -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email Field - Now Properly Centered -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600 text-center">Email</label>
          <div class="flex justify-center">
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="w-full max-w-xs px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              required
            />
          </div>
        </div>

        <!-- Password Field - Now Properly Centered -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600 text-center">Password</label>
          <div class="flex justify-center">
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full max-w-xs px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              required
            />
          </div>
        </div>

        <!-- Centered Button -->
        <div class="flex justify-center pt-2">
          <button
            type="submit"
            class="w-full max-w-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </div>

        <p v-if="error" class="text-center text-red-500 text-xs mt-2">{{ error }}</p>
      </form>

      <!-- Centered Footer Link -->
      <div class="text-center text-xs text-gray-500 mt-4">
        New here? <a href="#" class="text-blue-500 font-medium">Create account</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const loginApi = 'https://dummyjson.com/users'

const handleLogin = async () => {
  error.value = ''
  try {
    const res = await fetch(loginApi)
    const data = await res.json()
    const users = data.users

    const user = users.find(u => u.email === email.value && u.password === password.value)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')
    } else {
      error.value = 'Invalid credentials'
    }
  } catch (err) {
    error.value = 'Connection error'
  }
}
</script>

<style>
.text-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.text-gradient path {
  fill: url(#logo-gradient);
}
</style>