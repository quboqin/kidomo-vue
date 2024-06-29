import '@/assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import webBridge from './utils/web-bridge'
import { useTaskStore } from './stores'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(webBridge)

const taskStore = useTaskStore()
taskStore.$subscribe(() => {
  taskStore.saveTasks()
})

app.mount('#app')
