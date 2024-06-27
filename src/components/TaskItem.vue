<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Task } from '@/stores/task'

defineProps({
  task: Object as () => Task
})

const emit = defineEmits(['checkbox-change'])

const onCheckboxChange = (event: any, taskId: number | undefined) => {
  const target = event.target as HTMLInputElement
  emit('checkbox-change', target.checked, taskId)
}
</script>

<template>
  <li class="flex justify-between items-center border-b border-gray-200">
    <!-- Image container -->
    <div class="flex items-center">
      <!-- Base64 encoded image -->
      <img v-if="task?.image" :src="'data:image/png;base64,' + task?.image" class="h-8 w-8 m-2" />
      <!-- 20x20px is equivalent to 5x5 rem -->
      <RouterLink :to="`/task/${task?.id}`" class="block hover:bg-gray-100 flex-grow ml-4">
        <div>{{ task?.title }}</div>
        <div class="text-gray-500 text-sm">{{ task?.detail }}</div>
        <!-- Location info -->
        <div v-if="task?.latitude && task?.longitude" class="text-gray-500 text-xs">
          Location: {{ task.latitude }}, {{ task.longitude }}
        </div>
      </RouterLink>
    </div>
    <span class="p-4">
      <input
        type="checkbox"
        class="form-checkbox h-6 w-6 text-green-500"
        :checked="task?.completed"
        @change="onCheckboxChange($event, task?.id)"
      />
    </span>
  </li>
</template>

<style scoped></style>
