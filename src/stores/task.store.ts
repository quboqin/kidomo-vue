import { defineStore } from 'pinia'
import { generateObjectId } from '@/utils/mongo-objectid-generator'
import { EventBus } from '@/utils/event-bus'

import type { ITask } from './task'
import data from './data.json'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: JSON.parse(localStorage.getItem('tasks') || JSON.stringify(data)) as ITask[]
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
    async getAllTasks(): Promise<ITask[]> {
      return this.tasks
    },
    async fetchTaskById(id: string): Promise<ITask | undefined> {
      return this.tasks.find((task) => task.id === id)
    },
    async appendTask(task: ITask): Promise<void> {
      this.tasks.push(task)
    },
    async clearAllTasks(): Promise<void> {
      this.tasks = []
    },
    async updateTask(taskToUpdate: ITask): Promise<void> {
      if (taskToUpdate.id === '0') {
        const newId = generateObjectId()
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
    async deleteTaskById(taskId: string): Promise<void> {
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
    },
    async updateTaskCompletedStatus(taskId: string, completed: boolean): Promise<void> {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        this.tasks[taskIndex].is_solved = completed
        console.log(`Task ${taskId} completed status updated to ${completed}`)
      } else {
        console.error(`Task with ID ${taskId} not found.`)
      }
    },
    async updateTaskImage(taskId: string, image: string): Promise<void> {
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
    async updateTaskLocation(taskId: string, latitude: number, longitude: number): Promise<void> {
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
