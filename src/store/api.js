import { defineStore } from 'pinia'
import { getUserInfo } from '../services/api'
import { computed } from 'vue'
import { ref } from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: ref(null),
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
          return this.userInfo
        }
        if (this.userInfo != null || this.isLoaded) {
          this.isLoggedIn = true
          return this.userInfo
        }
        // 调用API获取用户信息
        const response = await getUserInfo()
        
        this.userInfo = response
        this.isLoaded = true
        return response
      } catch (error) {
        console.error('认证检查失败:', error)
        this.isLoaded = false
        this.userInfo = null
        return null
      }
    },
    async forceFetchUserInfo() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.isLoggedIn = false
          return false
        }
        const response = await getUserInfo()
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
