import { defineStore } from 'pinia'
import type { Task } from '@/models'
import data from '@/assets/data.json'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: data as Task[]
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
    },
    async clearAllTasks(): Promise<void> {
      this.tasks = []
    },
    calculateNewId(): number {
      if (this.tasks.length === 0) {
        return 1 // Start IDs from 1 if the array is empty
      } else {
        const maxId = this.tasks.reduce(
          (max, task) => (task.id > max ? task.id : max),
          this.tasks[0].id
        )
        return maxId + 1
      }
    },
    async updateTask(taskToUpdate: Task): Promise<void> {
      if (taskToUpdate.id === 0) {
        // Task is new, assign a new ID
        const newId = this.calculateNewId()
        const newTask = { ...taskToUpdate, id: newId }
        this.tasks.push(newTask)
      } else {
        // Task exists, find it and update
        const taskIndex = this.tasks.findIndex((task) => task.id === taskToUpdate.id)
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskToUpdate }
        } else {
          console.error('Task not found, cannot update')
        }
      }
      return Promise.resolve()
    },
    deleteTaskById(taskId: number): void {
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
    },
    async updateTaskCompletedStatus(taskId: number, completed: boolean): Promise<void> {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        this.tasks[taskIndex].completed = completed
        console.log(`Task ${taskId} completed status updated to ${completed}`)
      } else {
        console.error(`Task with ID ${taskId} not found.`)
      }
    }
  }
})
