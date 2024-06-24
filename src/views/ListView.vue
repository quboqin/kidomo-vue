<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores'
import type { Task } from '@/models'

const router = useRouter()
const taskStore = useTaskStore()
const tasks = ref<Task[]>([])

onMounted(async () => {
  await taskStore.initTasks()
  tasks.value = await taskStore.getAllTasks()
})

function navigateToDetail() {
  router.push({ path: `/task/:${0}` }) // Use the route name or path to navigate
}
</script>

<template>
  <div class="app-container">
    <header class="title-bar">
      <h1>Task List</h1>
    </header>

    <div class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ completed: task.completed }">
        <RouterLink :to="`/task/${task.id}`">{{ task.title }}</RouterLink>
      </li>
    </div>

    <button class="add-button" @click="navigateToDetail">Add</button>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title-bar {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.task-list li.completed {
  color: #aaa;
  text-decoration: line-through;
}

.add-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #0056b3;
}
</style>
