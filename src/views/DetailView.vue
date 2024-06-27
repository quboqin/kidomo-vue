<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores'
import { EventBus } from '@/utils/event-bus'

import DeleteIcon from '@/components/icons/IconDelete.vue'
import ConfirmIcon from '@/components/icons/IconConfirm.vue'
import BackIcon from '@/components/icons/IconBack.vue'
import CrossIcon from '@/components/icons/IconCross.vue'
import CameraIcon from '@/components/icons/IconCamera.vue'

const router = useRouter()
const route = useRoute()

const taskId = +route.params.id
const taskTitle = ref('')
const taskDetail = ref('')
const taskImage = ref('')
const taskCompleted = ref(false)

const taskStore = useTaskStore()

const instance = getCurrentInstance()

const goBack = () => {
  router.back()
}

const confirmAction = async () => {
  if (taskId === 0) {
    const newId = await taskStore.calculateNewId()
    const newTask = {
      id: newId,
      title: taskTitle.value,
      detail: taskDetail.value,
      completed: false
    }
    await taskStore.appendTask(newTask)
  } else {
    const updatedTask = {
      id: taskId,
      title: taskTitle.value,
      detail: taskDetail.value,
      completed: taskCompleted.value
    }
    await taskStore.updateTask(updatedTask)
  }
  goBack()
}

const deleteAction = async () => {
  await taskStore.deleteTaskById(taskId)
  goBack()
}

const fetchAndSetTaskDetails = async () => {
  if (taskId !== 0) {
    const task = await taskStore.fetchTaskById(taskId)
    taskTitle.value = task!.title
    taskDetail.value = task!.detail!
    taskImage.value = task!.image!
    taskCompleted.value = task!.completed
  } else {
    taskTitle.value = ''
    taskDetail.value = ''
    taskImage.value = ''
    taskCompleted.value = false
  }
}

const handleImageUpload = async () => {
  const jsonObject = {
    action: 'camera',
    data: {
      taskId: taskId
    },
    callback: 'nativeImageData'
  }
  const callNativeFunction = instance?.appContext.config.globalProperties.$callNativeFunction
  callNativeFunction(jsonObject)
}

onMounted(() => {
  EventBus.on('taskImageUpdated', handleTaskImageUpdated)
  fetchAndSetTaskDetails()
})

onUnmounted(() => {
  EventBus.off('taskImageUpdated', handleTaskImageUpdated)
})

function handleTaskImageUpdated() {
  fetchAndSetTaskDetails()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between p-4 bg-gray-200">
      <!-- Back arrow icon when taskId is 0 -->
      <button v-if="taskId === 0" @click="goBack" class="back-button"><BackIcon /></button>
      <!-- Cross icon when taskId is greater than 0 -->
      <button v-else @click="goBack" class="back-button"><CrossIcon /></button>
      <h2 class="text-lg font-semibold">Task Detail {{ taskId }}</h2>
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
      <div class="space-y-4">
        <!-- Upload Button -->
        <button
          for="image-upload"
          class="flex items-center justify-center w-8 h-8 text-white bg-gray-500 rounded-full hover:bg-red-600"
          @click="handleImageUpload"
        >
          <CameraIcon />
        </button>
        <!-- Image Preview -->
        <div class="h-10 w-10">
          <img
            v-if="taskImage"
            :src="'data:image/png;base64,' + taskImage"
            class="h-full w-full object-cover rounded"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
