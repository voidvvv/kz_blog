<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const username = ref('')

// 检查登录状态
const checkLoginStatus = () => {
  try {
    isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
    username.value = localStorage.getItem('username') || '用户'
  } catch (e) {
    console.error('localStorage不可用:', e)
    isLoggedIn.value = false
    username.value = '用户'
  }
}

// 退出登录
const logout = () => {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.setItem('isLoggedIn', 'false')
  } catch (e) {
    console.error('localStorage不可用:', e)
  }
  
  isLoggedIn.value = false
  username.value = ''
  
  router.push('/')
}

// 移动端菜单
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 用户下拉菜单
const userMenuOpen = ref(false)
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

// 计算样式
const mobileMenuClass = computed(() => {
  return {
    'mobile-menu': true,
    'is-active': mobileMenuOpen.value
  }
})

// 监听窗口点击，关闭菜单
const closeMenus = (event) => {
  const clickedOnUserMenu = event.target.closest('.user-menu-container')
  const clickedOnMobileMenu = event.target.closest('.mobile-menu-btn')
  
  // 如果点击在菜单外部，关闭菜单
  if (!clickedOnUserMenu && userMenuOpen.value) {
    userMenuOpen.value = false
  }
  
  if (!clickedOnMobileMenu && mobileMenuOpen.value && !event.target.closest('.mobile-menu')) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  checkLoginStatus()
  window.addEventListener('click', closeMenus)
  window.addEventListener('storage', checkLoginStatus)
})
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="logo">
          KZ.Blog
        </router-link>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">首页</router-link>
          <router-link to="/categories" class="navbar-item">分类</router-link>
          <router-link to="/archives" class="navbar-item">归档</router-link>
          <router-link to="/about" class="navbar-item">关于</router-link>
        </div>

        <div class="navbar-end">
          <div v-if="isLoggedIn" class="user-menu-container">
            <button class="user-menu-btn" @click.stop="toggleUserMenu">
              <span class="username">{{ username }}</span>
              <span class="arrow-down"></span>
            </button>
            
            <div v-if="userMenuOpen" class="user-menu">
              <router-link to="/profile" class="user-menu-item">
                个人资料
              </router-link>
              <router-link to="/editor" class="user-menu-item">
                写文章
              </router-link>
              <router-link to="/drafts" class="user-menu-item">
                我的草稿
              </router-link>
              <div class="user-menu-divider"></div>
              <button class="user-menu-item logout" @click="logout">
                退出登录
              </button>
            </div>
          </div>
          
          <router-link v-else to="/login" class="login-btn">
            登录
          </router-link>
          
          <button class="mobile-menu-btn" @click.stop="toggleMobileMenu">
            <span class="hamburger-icon"></span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 移动菜单 -->
    <div :class="mobileMenuClass">
      <div class="mobile-menu-items">
        <router-link to="/" class="mobile-menu-item" @click="mobileMenuOpen = false">
          首页
        </router-link>
        <router-link to="/categories" class="mobile-menu-item" @click="mobileMenuOpen = false">
          分类
        </router-link>
        <router-link to="/archives" class="mobile-menu-item" @click="mobileMenuOpen = false">
          归档
        </router-link>
        <router-link to="/about" class="mobile-menu-item" @click="mobileMenuOpen = false">
          关于
        </router-link>
        
        <div class="mobile-menu-divider"></div>
        
        <template v-if="isLoggedIn">
          <router-link to="/profile" class="mobile-menu-item" @click="mobileMenuOpen = false">
            个人资料
          </router-link>
          <router-link to="/editor" class="mobile-menu-item" @click="mobileMenuOpen = false">
            写文章
          </router-link>
          <router-link to="/drafts" class="mobile-menu-item" @click="mobileMenuOpen = false">
            我的草稿
          </router-link>
          <button class="mobile-menu-item logout" @click="logout">
            退出登录
          </button>
        </template>
        <router-link v-else to="/login" class="mobile-menu-item" @click="mobileMenuOpen = false">
          登录
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.navbar-start {
  display: flex;
  margin-left: 2rem;
}

.navbar-end {
  display: flex;
  align-items: center;
}

.navbar-item {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.navbar-item:hover {
  color: #42b983;
}

.router-link-active {
  color: #42b983;
  font-weight: bold;
}

.login-btn {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #3ca876;
}

/* 用户菜单 */
.user-menu-container {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #2c3e50;
}

.username {
  margin-right: 0.5rem;
  font-weight: 500;
}

.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #2c3e50;
}

.user-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 180px;
  z-index: 10;
}

.user-menu-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.3s;
}

button.user-menu-item {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.user-menu-item:hover {
  background-color: #f5f5f5;
}

.user-menu-divider {
  height: 1px;
  background-color: #eee;
  margin: 0.5rem 0;
}

.logout {
  color: #e74c3c;
}

/* 移动菜单 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.hamburger-icon {
  display: block;
  width: 24px;
  height: 3px;
  background-color: #2c3e50;
  position: relative;
  transition: background-color 0.3s;
}

.hamburger-icon::before,
.hamburger-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 3px;
  background-color: #2c3e50;
  transition: transform 0.3s;
}

.hamburger-icon::before {
  top: -8px;
}

.hamburger-icon::after {
  bottom: -8px;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 99;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
}

.mobile-menu.is-active {
  transform: translateY(0);
}

.mobile-menu-items {
  padding: 1rem 0;
}

.mobile-menu-item {
  display: block;
  padding: 0.75rem 1.5rem;
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

button.mobile-menu-item {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.mobile-menu-item:hover {
  background-color: #f5f5f5;
}

.mobile-menu-divider {
  height: 1px;
  background-color: #eee;
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .navbar-start {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
    margin-left: 1rem;
  }
  
  .mobile-menu {
    display: block;
  }
}
</style> 