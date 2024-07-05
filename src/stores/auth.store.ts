import { defineStore } from 'pinia'
import { result, request } from '@/utils/axios-wrapper'

export interface IUser {
  id: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {} as IUser | null,
    token: {} as string | null,
    refreshTokenTimeout: null as NodeJS.Timeout | null
  }),
  actions: {
    async login(username: string, password: string) {
      const data: {
        user: IUser
        token: string
      } | null = await result('post', `/users`, {
        email: username,
        password
      })
      this.user = data?.user ?? null
      this.token = data?.token ?? null
      this.startRefreshTokenTimer()
    },
    logout() {
      request('post', `/revoke-token`, { credentials: 'include' })
      this.stopRefreshTokenTimer()
      this.user = null
    },
    async refreshToken() {
      this.user = await request('post', `/refresh-token`, { credentials: 'include' })
      this.startRefreshTokenTimer()
    },
    startRefreshTokenTimer() {
      // parse json object from base64 encoded jwt token
      const jwtBase64 = this.token?.split('.')[1] ?? ''
      const jwtToken = JSON.parse(atob(jwtBase64))

      // set a timeout to refresh the token a minute before it expires
      const expires = new Date(jwtToken.exp * 1000)
      const timeout = expires.getTime() - Date.now() - 60 * 1000
      this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout)
    },
    stopRefreshTokenTimer() {
      clearTimeout(this.refreshTokenTimeout as NodeJS.Timeout)
    }
  }
})
