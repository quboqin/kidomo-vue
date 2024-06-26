/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

window.callbackFromKotlin = function (jsonObject: any) {
  alert('jsonObject.key1')
}

function showActionSheet() {
  Android.showActionSheet(true)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
