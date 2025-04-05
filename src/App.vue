<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')

const navigateTo = (route) => {
  router.push(route)
}
</script>

<template>
  <div class="blog-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-brand" @click="navigateTo('/')">我的博客</div>
      <div class="nav-links">
        <router-link 
          to="/" 
          class="nav-link"
          :class="{ active: route.path === '/' }"
        >
          首页
        </router-link>
        <router-link 
          to="/editor" 
          class="nav-link"
          :class="{ active: route.path === '/editor' }"
        >
          写文章
        </router-link>
        <router-link 
          to="/login" 
          class="nav-link"
          :class="{ active: route.path === '/login' }"
        >
          {{ isLoggedIn ? '个人中心' : '登录' }}
        </router-link>
      </div>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索文章..."
          class="search-input"
        >
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于博客</h3>
          <p>这是一个使用 Vue.js 构建的个人博客，用于分享技术和生活。</p>
        </div>
        <div class="footer-section">
          <h3>联系方式</h3>
          <p>邮箱：example@email.com</p>
          <p>GitHub：github.com/example</p>
        </div>
        <div class="footer-section">
          <h3>订阅</h3>
          <p>订阅我的博客，获取最新文章通知。</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 我的博客. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.blog-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #42b983;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 3rem 2rem 1rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }

  .nav-links {
    margin: 1rem 0;
  }

  .search-box {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
