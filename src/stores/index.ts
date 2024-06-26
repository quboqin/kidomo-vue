import { defineStore } from 'pinia'
import { EventBus } from '@/utils/event-bus'

import type { Task } from './task'
import data from './data.json'

export enum OSType {
  iOS = 'iOS',
  Android = 'Android',
  Unknown = 'Unknown'
}

function initOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  if (/android/i.test(userAgent)) {
    return OSType.Android
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return OSType.iOS
  } else {
    return OSType.Unknown
  }
}

export const osInfoStore = defineStore('osInfo', {
  state: () => ({
    appName: 'kidomo',
    operatingSystem: initOperatingSystem()
  }),
  actions: {
    async getAppName(): Promise<string> {
      return this.appName
    },
    getOperatingSystem(): OSType {
      return this.operatingSystem
    },
    async setOperatingSystem(os: OSType): Promise<void> {
      this.operatingSystem = os
    }
  }
})

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: JSON.parse(localStorage.getItem('tasks') || JSON.stringify(data)) as Task[]
  }),
  actions: {
    async saveTasks() {
      try {
        console.log('Tasks saved to local storage')
        await localStorage.setItem('tasks', JSON.stringify(this.tasks))
      } catch (error) {
        console.error('Error saving tasks to local storage', error)
      }
    },
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
    },
    async updateTaskImage(taskId: number, image: string): Promise<void> {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
      console.log(`Task ${taskId} @ ${taskIndex} completed uploading image`)
      if (taskIndex !== -1) {
        console.log(`Task ${taskId} completed uploading image`)
        this.tasks[taskIndex].image = image
        EventBus.emit('taskImageUpdated', {})
      } else {
        console.error(`Task with ID ${taskId} not found.`)
      }
    },
    async updateTaskLocation(taskId: number, latitude: number, longitude: number): Promise<void> {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        console.log(`Task ${taskId} completed updating location`)
        this.tasks[taskIndex].latitude = latitude
        this.tasks[taskIndex].longitude = longitude
        EventBus.emit('taskLocationUpdated', {})
      } else {
        console.error(`Task with ID ${taskId} not found.`)
      }
    }
  }
})
