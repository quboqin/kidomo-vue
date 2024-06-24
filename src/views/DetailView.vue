<template>
  <div>
    <div class="title-bar">
      <button @click="goBack">&lt; Back</button>
      <h2>Task Detail</h2>
      <div class="action-buttons">
        <button @click="confirmAction">Confirm</button>
        <button @click="deleteAction">Delete</button>
      </div>
    </div>
    <!-- Task details go here -->
    <div class="input-section">
      <div class="input-group">
        <label for="title">Title:</label>
        <input id="title" v-model="taskTitle" type="text" placeholder="Enter title" />
      </div>
      <div class="input-group">
        <label for="detail">Detail:</label>
        <textarea id="detail" v-model="taskDetail" placeholder="Enter detail"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const taskTitle = ref('')
const taskDetail = ref('')

const taskStore = useTaskStore()

function goBack() {
  router.back()
}

function confirmAction() {
  // Implement the confirm action logic here
}

function deleteAction() {
  // Implement the delete action logic here
}

async function fetchAndSetTaskDetails() {
  const taskId = +route.params.id
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

<style scoped>
.title-bar {
  display: flex;
  background-color: #f0f0f0;
  align-items: center;
}

.title-bar button {
  margin-right: 20px;
  cursor: pointer;
}

.action-buttons button {
  margin-left: 10px; /* Space between buttons */
}

.input-section .input-group {
  margin-bottom: 20px;
}

.input-section .input-group label {
  display: block;
  margin-bottom: 5px;
}

/* Add more styles for TaskDetail as needed */
</style>
