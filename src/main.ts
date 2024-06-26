/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { systemInfoStore } from '@/stores'
import App from './App.vue'
import router from './router'

const app = createApp(App)

window.callbackFromKotlin = function (jsonObject: any) {
  alert('callbackFromKotlin')
}

window.callbackFromSwift = function (jsonObject: any) {
  alert('callbackFromSwift')
}

function showActionSheet() {
  Android.showActionSheet(true)
}

app.use(createPinia())
app.use(router)

const sysInfoStore = systemInfoStore()

;(function () {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  if (/android/i.test(userAgent)) {
    sysInfoStore.setOperatingSystem('Android')
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    sysInfoStore.setOperatingSystem('iOS')
  }
})()

const os = sysInfoStore.getOperatingSystem()

;(function () {
  const header = {
    action: 'set_header',
    auth: {
      BladeAuth: 'bladeAuth_xxx',
      Authorization: 'authorization_xxx'
    }
  }
  if (os === 'Android') {
    Android.callFromJavascript(JSON.stringify(header))
  } else if (os === 'iOS') {
    window.webkit.messageHandlers.Callback.postMessage(header)
  }
})()

app.mount('#app')
