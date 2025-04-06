import { defineStore } from 'pinia'
import { getUserInfo } from '../services/api'

export const useUserStore = defineStore('user', {
    state: () => ({
      userInfo: null,
      isLoggedIn: false,
      isLoaded: false
    }),
  
    actions: {
      async fetchUserInfo() {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            this.isLoggedIn = false
            return false
          }
          if (this.userInfo != null || this.isLoaded) {
            this.isLoggedIn = true
            return true
          }
          // 调用API获取用户信息
          const response = await getUserInfo()
          this.userInfo = response
          this.isLoggedIn = true
          this.isLoaded = true
          return true
        } catch (error) {
          console.error('认证检查失败:', error)
          this.isLoggedIn = false
          this.isLoaded = false
          return false
        }
      }
    }
  })
