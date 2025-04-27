<template>
  <div class="bg-white p-4 rounded-xl shadow-md flex justify-between items-start gap-4 w-full">
    <div class="flex-1">
      <div v-if="!editing" class="text-lg font-medium text-gray-800">
        {{ task.todo }}
      </div>
      <div v-else>
        <input
          v-model="editedTask"
          class="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-700"
        />
      </div>

      <div class="text-sm text-gray-500 mt-1">
        <span>Status:</span>
        <span :class="task.completed ? 'text-green-600' : 'text-red-600'">
          {{ task.completed ? 'Completed' : 'Pending' }}
        </span>
      </div>

      <!-- Add Checkbox for completion -->
      <div class="mt-2 flex items-center">
        <input
          type="checkbox"
          v-model="task.completed"
          @change="toggleCompletion"
          class="mr-2"
        />
        <label class="text-sm text-gray-700">Completed</label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <button
        v-if="!editing"
        @click="startEditing"
        class="text-blue-600 hover:text-blue-800 text-sm"
      >
        ✏️ Edit
      </button>
      <button
        v-else
        @click="saveEdit"
        class="text-green-600 hover:text-green-800 text-sm"
      >
        ✅ Save
      </button>
      <button
        @click="deleteTask"
        class="text-red-600 hover:text-red-800 text-sm"
      >
        🗑️ Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['task'])
const emit = defineEmits(['update', 'delete'])

const editing = ref(false)
const editedTask = ref(props.task.todo)

const startEditing = () => {
  editing.value = true
  editedTask.value = props.task.todo
}

const saveEdit = () => {
  emit('update', { ...props.task, todo: editedTask.value })
  editing.value = false
}

const deleteTask = () => {
  emit('delete', props.task.id)
}

// Handle completion toggle
const toggleCompletion = async () => {
  const updatedTask = { ...props.task, completed: !props.task.completed }
  emit('update', updatedTask)
}
</script>

<style scoped>
/* Styling if needed */
</style>
