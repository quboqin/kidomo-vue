<template>
  <li class="flex justify-between items-center border-b border-gray-200">
    <RouterLink :to="`/task/${task?.id}`" class="block p-4 hover:bg-gray-100 flex-grow">
      <div>{{ task?.title }}</div>
      <div class="text-gray-500 text-sm">{{ task?.detail }}</div>
    </RouterLink>
    <span class="p-4">
      <input
        type="checkbox"
        class="form-checkbox h-6 w-6 text-green-500"
        @change="onCheckboxChange($event, task?.id)"
      />
    </span>
  </li>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Task } from '@/models'

defineProps({
  task: Object as () => Task
})

const onCheckboxChange = (event: any, taskId: number | undefined) => {
  // Handle the change event, e.g., update task status
  console.log(`Checkbox for task ${taskId} changed to ${event.target.checked}`)
}
</script>

<style scoped></style>
