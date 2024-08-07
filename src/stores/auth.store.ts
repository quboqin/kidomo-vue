import { defineStore } from 'pinia'
import { result } from '@/utils/axios-wrapper'

export interface IUser {
  id: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {} as IUser | null,
    token: localStorage.getItem('token') ?? null,
    refreshTokenTimeout: null as ReturnType<typeof setTimeout> | null
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null && state.token !== null
  },
  actions: {
    async saveToken() {
      try {
        console.log('token saved to local storage')
        if (this.token) {
          localStorage.setItem('token', this.token)
        }
      } catch (error) {
        console.error('Error saving token to local storage', error)
      }
    },
    async singUp(username: string, password: string) {
      const data: {
        user: IUser
        token: string
      } | null = await result('post', `/users`, {
        email: username,
        password
      })
      this.user = data?.user ?? null
      this.token = data?.token ?? null
      // this.startRefreshTokenTimer()
    },
    async signIn(username: string, password: string) {
      const data: {
        user: IUser
        token: string
      } | null = await result('post', `/users/login`, {
        email: username,
        password
      })
      this.token = data?.token ?? null
      await this.fetchUser()
      // this.startRefreshTokenTimer()
    },
    async fetchUser() {
      this.user = await result('get', `/users`)
    },
    async logout() {
      await result('put', `/users/logout`, this.user)
      // this.stopRefreshTokenTimer()
      this.user = null
      this.token = null
    }
    // async refreshToken() {
    //   this.user = await request('post', `/refresh-token`, { credentials: 'include' })
    //   this.startRefreshTokenTimer()
    // },
    // startRefreshTokenTimer() {
    //   // parse json object from base64 encoded jwt token
    //   const jwtBase64 = this.token?.split('.')[1] ?? ''
    //   const jwtToken = JSON.parse(atob(jwtBase64))

    //   // set a timeout to refresh the token a minute before it expires
    //   const expires = new Date(jwtToken.exp * 1000)
    //   const timeout = expires.getTime() - Date.now() - 60 * 1000
    //   this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout)
    // },
    // stopRefreshTokenTimer() {
    //   clearTimeout(this.refreshTokenTimeout as NodeJS.Timeout)
    // }
  }
})
