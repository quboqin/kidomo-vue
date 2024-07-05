import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  firstName: string
  lasrName: string
  jwtToken: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User | null
  }),
  actions: {
    async getUser(): Promise<User | null> {
      return this.user
    }
  }
})
