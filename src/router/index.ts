import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/axios-wrapper'

import ListView from '../views/ListView.vue'
import DetailView from '../views/DetailView.vue'
import SigninView from '../views/SigninView.vue'
import SignupView from '../views/SignupView.vue'

const shouldUseLegacy = import.meta.env.BASE_URL === './'

const router = createRouter({
  history: shouldUseLegacy
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ListView, meta: { requiresAuth: true } },
    { path: '/task/:id', component: DetailView, meta: { requiresAuth: true } },
    { path: '/signin', component: SigninView },
    { path: '/signup', component: SignupView }
  ]
})

router.beforeEach(async (to, from, next) => {
  const token = await getToken()
  if (!token && to.matched.some((record) => record.meta.requiresAuth)) {
    return next({
      path: '/signin'
    })
  }
  return next()
})

export default router
