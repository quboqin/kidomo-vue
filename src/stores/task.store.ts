import { defineStore } from 'pinia'
import { generateObjectId } from '@/utils/mongo-objectid-generator'
import { EventBus } from '@/utils/event-bus'
import { result } from '@/utils/axios-wrapper'

import type { ITask } from './task'
import data from './data.json'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: data as ITask[]
  }),
  actions: {
    // async saveTasks() {
    //   try {
    //     console.log('Tasks saved to local storage')
    //     await localStorage.setItem('tasks', JSON.stringify(this.tasks))
    //   } catch (error) {
    //     console.error('Error saving tasks to local storage', error)
    //   }
    // },
    async fetchTasks(): Promise<ITask[]> {
      const res: any = await result('get', `/tasks`)
      const tasks = res.tasks as ITask[]
      this.tasks = tasks as ITask[]
      return this.tasks
    },
    async fetchTaskById(id: string): Promise<ITask | undefined> {
      return this.tasks.find((task) => task.id === id)
    },
    async clearAllTasks(): Promise<void> {
      this.tasks.forEach(async (task) => {
        await result('del', `/tasks/${task.id}`)
      })
      this.tasks = []
    },
    clearAllLocalTasks(): void {
      this.tasks = []
    },
    async updateTask(taskToUpdate: ITask): Promise<void> {
      if (taskToUpdate.id === '0') {
        const newId = generateObjectId()
        const newTask = { ...taskToUpdate, id: newId }
        this.tasks.push(newTask)
        await result('post', `/tasks`, newTask)
      } else {
        const taskIndex = this.tasks.findIndex((task) => task.id === taskToUpdate.id)
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskToUpdate }
          await result('put', `/tasks/${taskToUpdate.id}`, taskToUpdate)
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
        await result('put', `/tasks/${this.tasks[taskIndex].id}`, this.tasks[taskIndex])
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
        await result('put', `/tasks/${this.tasks[taskIndex].id}`, this.tasks[taskIndex])
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
        await result('put', `/tasks/${this.tasks[taskIndex].id}`, this.tasks[taskIndex])
        EventBus.emit('taskLocationUpdated', {})
      } else {
        console.error(`Task with ID ${taskId} not found.`)
      }
    }
  }
})
