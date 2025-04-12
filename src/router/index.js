import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BlogDetail from '../components/BlogDetail.vue'
import Login from '../views/Login.vue'
import PostEditor from '../components/PostEditor.vue'
import { useUserStore } from '../store/api'
import UserDetail from '../views/UserDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/post/:id(\\d+)',
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
      path: '/editor/:id?',
      name: 'editor',
      component: PostEditor,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user',
      name: 'user',
      component: UserDetail,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // userStore.fetchUserInfo()
  const isAuthenticated = userStore.$state.isLoggedIn
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 