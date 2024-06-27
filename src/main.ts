import '@/assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import WebBridge from './utils/web-bridge'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(WebBridge)

app.mount('#app')
