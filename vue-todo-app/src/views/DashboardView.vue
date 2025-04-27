<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Dashboard Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Task Dashboard</h1>
          <p class="text-gray-500">Manage your to-do items</p>
        </div>
        
        <!-- Search, Filter and Add Task -->
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              placeholder="Search tasks..."
              class="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              @input="handleSearch"
            >
            <svg v-if="searchQuery" @click="clearSearch" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div class="relative flex-1">
            <select 
              v-model="filter"
              class="w-full px-4 py-2 pr-8 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed Only</option>
              <option value="incomplete">Incomplete Only</option>
            </select>
          </div>
          <AddTaskForm @add="addTask" class="flex-1" />
        </div>
      </div>

      <!-- Task Tables -->
      <div class="grid gap-8">
        <!-- Incomplete Tasks Table -->
        <div class="bg-white rounded-xl shadow-xs overflow-hidden">
          <div class="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 class="text-lg font-medium text-gray-800 flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              Pending Tasks ({{ filteredIncompleteCount }})
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in filteredIncompleteTasks" :key="task.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center" v-if="!task.editing">
                      <input 
                        type="checkbox" 
                        :checked="task.completed"
                        @change="toggleTask(task)"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                      >
                      <span class="text-sm font-medium text-gray-900">{{ task.todo }}</span>
                    </div>
                    <div v-else class="flex items-center">
                      <input
                        v-model="task.editedText"
                        @keyup.enter="saveEdit(task)"
                        @blur="saveEdit(task)"
                        class="px-2 py-1 border border-gray-300 rounded mr-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autofocus
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      @click="task.editing ? saveEdit(task) : startEdit(task)" 
                      class="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      {{ task.editing ? 'Save' : 'Edit' }}
                    </button>
                    <button @click="deleteTask(task.id)" class="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
                <tr v-if="filteredIncompleteCount === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                    No pending tasks
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Completed Tasks Table -->
        <div class="bg-white rounded-xl shadow-xs overflow-hidden">
          <div class="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 class="text-lg font-medium text-gray-800 flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              Completed Tasks ({{ filteredCompletedCount }})
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in filteredCompletedTasks" :key="task.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center" v-if="!task.editing">
                      <input 
                        type="checkbox" 
                        :checked="task.completed"
                        @change="toggleTask(task)"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
                      >
                      <span class="text-sm font-medium text-gray-500 line-through">{{ task.todo }}</span>
                    </div>
                    <div v-else class="flex items-center">
                      <input
                        v-model="task.editedText"
                        @keyup.enter="saveEdit(task)"
                        @blur="saveEdit(task)"
                        class="px-2 py-1 border border-gray-300 rounded mr-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autofocus
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      @click="task.editing ? saveEdit(task) : startEdit(task)" 
                      class="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      {{ task.editing ? 'Save' : 'Edit' }}
                    </button>
                    <button @click="deleteTask(task.id)" class="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
                <tr v-if="filteredCompletedCount === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                    No completed tasks
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getTodos, createTodo, updateTodo, deleteTodo as removeTodo } from '../services/api'
import AddTaskForm from '../components/AddTaskForm.vue'

const todos = ref([])
const filter = ref('all')
const searchQuery = ref('')

// Fetch tasks and add editing state
onMounted(async () => {
  const fetchedTodos = await getTodos()
  todos.value = fetchedTodos.map(task => ({
    ...task,
    editing: false,
    editedText: task.todo
  }))
})

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
}

// Handle search input
const handleSearch = () => {
  // Search is handled reactively through the computed properties
}

// Computed properties for search
const filteredBySearch = computed(() => {
  if (!searchQuery.value.trim()) return todos.value
  const query = searchQuery.value.toLowerCase().trim()
  return todos.value.filter(task => 
    task.todo.toLowerCase().includes(query))
})

// Filter tasks by status and search
const filteredTodos = computed(() => {
  let filtered = filteredBySearch.value
  if (filter.value === 'completed') return filtered.filter(task => task.completed)
  if (filter.value === 'incomplete') return filtered.filter(task => !task.completed)
  return filtered
})

// Filtered tasks for display
const filteredCompletedTasks = computed(() => filteredTodos.value.filter(task => task.completed))
const filteredIncompleteTasks = computed(() => filteredTodos.value.filter(task => !task.completed))
const filteredCompletedCount = computed(() => filteredCompletedTasks.value.length)
const filteredIncompleteCount = computed(() => filteredIncompleteTasks.value.length)

// Task actions
const addTask = async (newTaskText) => {
  const newTask = {
    todo: newTaskText,
    completed: false,
    userId: 1,
    editing: false,
    editedText: newTaskText
  }
  const createdTask = await createTodo(newTask)
  if (createdTask) todos.value.unshift(createdTask)
}

const toggleTask = async (task) => {
  const updatedTask = { ...task, completed: !task.completed }
  await updateTask(updatedTask)
}

const startEdit = (task) => {
  task.editing = true
  task.editedText = task.todo
}

const saveEdit = async (task) => {
  if (task.editedText.trim() === '') return
  
  const originalText = task.todo
  task.todo = task.editedText
  task.editing = false
  
  try {
    await updateTask(task)
  } catch (error) {
    // Revert if update fails
    task.todo = originalText
    console.error('Failed to update task:', error)
  }
}

const updateTask = async (updatedTask) => {
  const updated = await updateTodo(updatedTask.id, {
    todo: updatedTask.todo,
    completed: updatedTask.completed
  })
  if (updated) {
    const index = todos.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      todos.value[index] = { ...updatedTask, editing: false }
    }
  }
  return updated
}

const deleteTask = async (taskId) => {
  const deleted = await removeTodo(taskId)
  if (deleted) todos.value = todos.value.filter(t => t.id !== taskId)
}
</script>

<style scoped>
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>