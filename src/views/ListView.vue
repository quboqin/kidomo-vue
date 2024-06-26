<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import MoreIcon from '@/components/icons/IconMore.vue'
import AddIcon from '@/components/icons/IconAdd.vue'
import HomeIcon from '@/components/icons/IconHome.vue'
import { useTaskStore } from '@/stores'
import type { Task } from '@/stores/task'
import TaskItem from '@/components/TaskItem.vue'

const router = useRouter()
const taskStore = useTaskStore()
const tasks = ref<Task[]>([])

const showMenu = ref(false)
const showConfirmationDialog = ref(false)

const operatingSystem = ref('unknown')

onMounted(async () => {
  tasks.value = await taskStore.getAllTasks()
})

const navigateToDetail = () => {
  router.push({ path: '/task/0' })
}

const navigateToHome = async () => {
  const jsonObject = {
    action: 'back',
    data: {
      source: 'index.html'
    }
  }
  const callNativeFunction =
    getCurrentInstance()?.appContext.config.globalProperties.$callNativeFunction
  callNativeFunction(jsonObject)
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const clearAllTasks = () => {
  showMenu.value = false
  showConfirmationDialog.value = true
}

const confirmClearAllTasks = async () => {
  await taskStore.clearAllTasks()
  tasks.value = []
  showConfirmationDialog.value = false
}

const handleCheckboxChange = async (checked: boolean, taskId: number) => {
  console.log(`Checkbox for task ${taskId} changed to ${checked}`)
  await taskStore.updateTaskCompletedStatus(taskId, checked)
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <header
      class="fixed top-0 left-0 w-full bg-blue-500 p-4 z-10 flex justify-between items-center"
    >
      <button @click="navigateToHome" class="p-2 bg-blue-500 text-white rounded">
        <HomeIcon />
      </button>
      <h1 class="text-white text-lg font-bold text-center">Task List {{ operatingSystem }}</h1>
      <button @click="toggleMenu" class="p-2 bg-blue-500 text-white rounded">
        <MoreIcon />
      </button>
    </header>
    <div
      v-if="showMenu"
      class="absolute right-4 mt-14 py-2 w-48 bg-white rounded-md shadow-xl z-20"
    >
      <a
        @click="clearAllTasks"
        class="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
      >
        Clear All Tasks
      </a>
      <!-- Add more menu items here -->
    </div>

    <div
      v-if="showConfirmationDialog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Action</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">Are you sure you want to clear all tasks?</p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="confirmClearAllTasks"
              class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Yes
            </button>
            <button
              @click="showConfirmationDialog = false"
              class="ml-3 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="task-list pt-16">
      <ul class="list-none m-0 p-0">
        <TaskItem
          @checkbox-change="handleCheckboxChange"
          v-for="task in tasks"
          :key="task.id"
          :task="task"
        />
      </ul>
    </div>

    <button
      class="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
      @click="navigateToDetail"
    >
      <AddIcon />
    </button>
  </div>
</template>

<style scoped></style>
@/views
