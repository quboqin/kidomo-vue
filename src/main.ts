/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { systemInfoStore } from '@/stores'
import App from './App.vue'
import router from './router'
import './utils/web_bridge'

const app = createApp(App)

app.use(createPinia())
app.use(router)

function callNativeFunction(jsonObject: any) {
  const sysInfoStore = systemInfoStore()
  const os = sysInfoStore.getOperatingSystem()
  jsonObject['callback'] = os === 'Android' ? 'callbackFromKotlin' : 'callbackFromSwift'
  if (os === 'Android') {
    Android.callFromJavascript(JSON.stringify(jsonObject))
  } else if (os === 'iOS') {
    window.webkit.messageHandlers.Callback.postMessage(jsonObject)
  }
}

app.config.globalProperties.$callNativeFunction = callNativeFunction

// set header
;(function () {
  const header = {
    action: 'set_header',
    auth: {
      BladeAuth: 'bladeAuth_xxx',
      Authorization: 'authorization_xxx'
    }
  }
  callNativeFunction(header)
})()

app.mount('#app')
