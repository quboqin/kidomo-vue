import { defineStore } from 'pinia'

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
