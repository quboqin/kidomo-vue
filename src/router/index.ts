import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import ListView from '../views/ListView.vue'
import DetailView from '../views/DetailView.vue'

const shouldUseLegacy = import.meta.env.BASE_URL === './'

console.log(import.meta.env.BASE_URL)

const router = createRouter({
  history: shouldUseLegacy
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ListView },
    { path: '/task/:id', component: DetailView }
  ]
})

export default router
