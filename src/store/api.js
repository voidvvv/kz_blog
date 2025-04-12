import { defineStore } from 'pinia'
import { getUserInfo } from '../services/api'
import { computed } from 'vue'
import { ref } from 'vue'

export const useUserStore = defineStore('user', {
    state: () => ({
      userInfo: null,
      isLoggedIn: ref(localStorage.getItem('token') != null),
      token: ref(localStorage.getItem('token')),
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
          console.log(response)
          this.userInfo = response
          this.isLoaded = true
          return true
        } catch (error) {
          console.error('认证检查失败:', error)
          this.isLoaded = false
          this.userInfo = null
          return false
        }
      }
    }
  })
