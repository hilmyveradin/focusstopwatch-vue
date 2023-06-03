import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: () => import('../views/SignInView.vue')
    }
  ]
})

export default router
