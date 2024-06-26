import { defineStore } from 'pinia'
import type { Task } from './task'
import data from './data.json'

export const systemInfoStore = defineStore('systemInfo', {
  state: () => ({
    appName: 'Task Manager',
    operatingSystem: 'unknown'
  }),
  actions: {
    async getAppName(): Promise<string> {
      return this.appName
    },
    getOperatingSystem(): string {
      return this.operatingSystem
    },
    async setOperatingSystem(os: string): Promise<void> {
      this.operatingSystem = os
    }
  }
})

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: data as Task[]
  }),
  actions: {
    async getAllTasks(): Promise<Task[]> {
      return this.tasks
    },
    async fetchTaskById(id: number): Promise<Task | undefined> {
      return this.tasks.find((task) => task.id === id)
    },
    async appendTask(task: Task): Promise<void> {
      this.tasks.push(task)
    },
    async clearAllTasks(): Promise<void> {
      this.tasks = []
    },
    async calculateNewId(): Promise<number> {
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
        const newId = await this.calculateNewId()
        const newTask = { ...taskToUpdate, id: newId }
        this.tasks.push(newTask)
      } else {
        const taskIndex = this.tasks.findIndex((task) => task.id === taskToUpdate.id)
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskToUpdate }
        } else {
          console.error('Task not found, cannot update')
        }
      }
      return Promise.resolve()
    },
    async deleteTaskById(taskId: number): Promise<void> {
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
