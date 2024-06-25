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
    <RouterLink :to="`/task/${task?.id}`" class="block p-4 hover:bg-gray-100 flex-grow">
      <div>{{ task?.title }}</div>
      <div class="text-gray-500 text-sm">{{ task?.detail }}</div>
    </RouterLink>
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
