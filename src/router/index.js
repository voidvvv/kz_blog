import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BlogDetail from '../components/BlogDetail.vue'
import Login from '../views/Login.vue'
import PostEditor from '../components/PostEditor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: BlogDetail,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/editor',
      name: 'editor',
      component: PostEditor
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 