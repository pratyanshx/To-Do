<template>
  <form @submit.prevent="handleSubmit" class="flex items-center gap-4 mb-6 w-full">
    <input
      v-model="taskText"
      type="text"
      placeholder="Enter new task..."
      class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    <button
      type="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Add Task
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])
const taskText = ref('')

const handleSubmit = () => {
  if (taskText.value.trim() === '') return
  emit('add', taskText.value)
  taskText.value = '' // clear after adding
}
</script>
