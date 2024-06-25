import '@/assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Define your global function
function globalLogger(message: string) {
  console.log(`[Global Logger]: ${message}`)
}

// Add the function to globalProperties
app.config.globalProperties.$globalLogger = globalLogger

app.use(createPinia())
app.use(router)

app.mount('#app')
