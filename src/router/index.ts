import { createRouter, createWebHashHistory } from 'vue-router'
import ListView from '../views/ListView.vue'
import DetailView from '../views/DetailView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ListView },
    { path: '/task/:id', component: DetailView }
  ]
})

export default router
