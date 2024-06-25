<template>
  <div>
    <div class="flex items-center justify-between p-4 bg-gray-200">
      <button class="text-blue-500" @click="goBack">&lt; Back</button>
      <h2 class="text-lg font-semibold">Task Detail</h2>
      <div class="flex space-x-2">
        <button
          class="flex items-center justify-center w-6 h-6 text-white bg-blue-500 rounded-full hover:bg-blue-600"
          @click="confirmAction"
        >
          <ConfirmIcon />
        </button>
        <button
          class="flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full hover:bg-red-600"
          @click="deleteAction"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
    <!-- Task details go here -->
    <div class="p-4">
      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium" for="title">Title:</label>
        <input
          class="w-full px-3 py-2 border rounded"
          id="title"
          v-model="taskTitle"
          type="text"
          placeholder="Enter title"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium" for="detail">Detail:</label>
        <textarea
          class="w-full px-3 py-2 border rounded"
          id="detail"
          v-model="taskDetail"
          placeholder="Enter detail"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores'

import DeleteIcon from '@/components/icons/IconDelete.vue'
import ConfirmIcon from '@/components/icons/IconConfirm.vue'

const router = useRouter()
const route = useRoute()

var taskId = +route.params.id

const taskTitle = ref('')
const taskDetail = ref('')

const taskStore = useTaskStore()

function goBack() {
  router.back()
}

async function confirmAction() {
  // Implement the confirm action logic here
  if (taskId === 0) {
    const newId = taskStore.calculateNewId()
    const newTask = {
      id: newId,
      title: taskTitle.value,
      detail: taskDetail.value,
      completed: false
    }
    taskStore.appendTask(newTask)
    goBack()
  } else {
    const updatedTask = {
      id: taskId,
      title: taskTitle.value,
      detail: taskDetail.value,
      completed: false
    }
    await taskStore.updateTask(updatedTask)
    goBack()
  }
}

function deleteAction() {
  // Implement the delete action logic here
  taskStore.deleteTaskById(taskId)
  goBack()
}

async function fetchAndSetTaskDetails() {
  if (taskId !== 0) {
    const task = taskStore.fetchTaskById(taskId)
    taskTitle.value = task!.title
    taskDetail.value = task!.detail!
  } else {
    taskTitle.value = ''
    taskDetail.value = ''
  }
}

// Fetch task details when component is mounted
onMounted(fetchAndSetTaskDetails)
</script>

<style scoped></style>
