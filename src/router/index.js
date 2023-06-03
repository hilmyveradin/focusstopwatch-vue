import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'home',
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: () => import('../views/SignInView.vue')
    }
  ]
})

export default router
