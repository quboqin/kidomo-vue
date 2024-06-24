import { defineStore } from 'pinia'
import type { Task } from '@/models'
import data from '@/assets/data.json'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[]
  }),
  actions: {
    async initTasks() {
      this.tasks = data as Task[]
    },
    async getAllTasks(): Promise<Task[]> {
      return this.tasks
    },
    fetchTaskById(id: number) {
      return this.tasks.find((task) => task.id === id)
    },
    appendTask(task: Task) {
      this.tasks.push(task)
    }
  }
})
