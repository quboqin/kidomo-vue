<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores'
import { EventBus } from '@/utils/event-bus'
import webBridge from '@/utils/web-bridge'

import DeleteIcon from '@/components/icons/IconDelete.vue'
import ConfirmIcon from '@/components/icons/IconConfirm.vue'
import BackIcon from '@/components/icons/IconBack.vue'
import CrossIcon from '@/components/icons/IconCross.vue'
import CameraIcon from '@/components/icons/IconCamera.vue'
import LocationIcon from '@/components/icons/IconLocation.vue'

const router = useRouter()
const route = useRoute()

const taskId = route.params.id as string
const taskTitle = ref('')
const taskDetail = ref('')
const taskImage = ref('')
const taskCompleted = ref(false)
const taskLocation = ref({ latitude: 0, longitude: 0 })

const taskStore = useTaskStore()

const goBack = () => {
  router.back()
}

const confirmAction = async () => {
  const updatedTask = {
    id: taskId,
    name: taskTitle.value,
    description: taskDetail.value,
    start_time: +new Date(),
    duration: 900000,
    image: taskImage.value,
    latitude: taskLocation.value.latitude,
    longitude: taskLocation.value.longitude,
    is_solved: taskCompleted.value
  }
  await taskStore.updateTask(updatedTask)

  goBack()
}

const deleteAction = async () => {
  await taskStore.deleteTaskById(taskId)
  goBack()
}

const fetchAndSetTaskDetails = async () => {
  if (taskId !== '0') {
    const task = await taskStore.fetchTaskById(taskId)
    taskTitle.value = task!.name
    taskDetail.value = task!.description!
    taskImage.value = task!.image!
    taskLocation.value = { latitude: task!.latitude!, longitude: task!.longitude! }
    taskCompleted.value = task!.is_solved
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
  webBridge.callNativeFunction(jsonObject)
}

const getLocation = async () => {
  const jsonObject = {
    action: 'location',
    data: {
      taskId: taskId
    },
    callback: 'nativeLocationData'
  }
  webBridge.callNativeFunction(jsonObject)
}

onMounted(() => {
  EventBus.on('taskImageUpdated', handleTaskImageUpdated)
  EventBus.on('taskLocationUpdated', handleTaskLocationUpdated)
  fetchAndSetTaskDetails()
})

onUnmounted(() => {
  EventBus.off('taskImageUpdated', handleTaskImageUpdated)
  EventBus.off('taskLocationUpdated', handleTaskLocationUpdated)
})

function handleTaskImageUpdated() {
  fetchAndSetTaskDetails()
}

function handleTaskLocationUpdated() {
  fetchAndSetTaskDetails()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between p-4 bg-gray-200">
      <!-- Back arrow icon when taskId is 0 -->
      <button v-if="taskId === ''" @click="goBack" class="back-button"><BackIcon /></button>
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
      <!-- Location Button -->
      <button
        class="flex items-center justify-center mt-4 w-8 h-8 text-white bg-blue-500 rounded-full hover:bg-blue-600"
        @click="getLocation"
      >
        <LocationIcon />
        <!-- Replace with your actual location icon component -->
      </button>
      <!-- Display Latitude and Longitude -->
      <div v-if="taskLocation.latitude && taskLocation.longitude" class="mt-2">
        <p>Latitude: {{ taskLocation.latitude }}</p>
        <p>Longitude: {{ taskLocation.longitude }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
