<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { blogApi } from '../services/api'
import 'md-editor-v3/lib/style.css'

const router = useRouter()
const posts = ref([])
const isLoading = ref(true)
const error = ref(null)

const searchQuery = ref('')
// 添加安全检查避免localStorage不可用的情况
const isLoggedIn = ref(false)

// 安全地检查localStorage
const checkLocalStorage = () => {
  try {
    return localStorage.getItem('isLoggedIn') === 'true'
  } catch (e) {
    console.error('localStorage不可用:', e)
    return false
  }
}

// 初始化isLoggedIn
isLoggedIn.value = checkLocalStorage()

// 筛选文章
const filteredPosts = computed(() => {
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 获取文章列表
const fetchPosts = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // 从API获取文章
    const response = await blogApi.getPosts({page:1,pageSize:10})
    
    // 确保posts.value始终为数组
    if (Array.isArray(response)) {
      posts.value = response
    } else if (response && Array.isArray(response.data)) {
      // 如果API返回{data: [...]}结构
      posts.value = response.data
    } else if (response && Array.isArray(response.list)) {
      // 如果API返回{list: [...]}结构
      posts.value = response.list
    } else {
      // 其他情况，默认为空数组
      console.error('API返回的数据结构不是预期的数组格式:', response)
      posts.value = []
    }
    
    isLoading.value = false
  } catch (err) {
    console.error('获取文章失败:', err)
    error.value = '获取文章列表失败，请稍后再试'
    isLoading.value = false
    
    // 使用静态数据作为备份
    posts.value = [
      {
        id: 1,
        title: '我的第一篇博客',
        excerpt: '这是我的第一篇博客文章，让我们开始这段旅程吧！',
        date: '2024-03-31',
        author: '博主',
        content: '# 欢迎来到我的博客\n\n这是我的第一篇博客文章。\n\n## Markdown 支持\n\n现在我们的博客支持 Markdown 了！\n\n- 列表项 1\n- 列表项 2\n- 列表项 3\n\n```javascript\nconst hello = () => {\n  console.log("Hello, World!");\n};\n```',
        tags: ['Vue.js', '前端开发', '技术分享']
      },
      {
        id: 2,
        title: 'Vue.js 开发技巧',
        excerpt: '分享一些实用的 Vue.js 开发技巧和最佳实践。',
        date: '2024-03-30',
        author: '博主',
        content: '# Vue.js 开发技巧\n\n本文分享一些实用的 Vue.js 开发技巧和最佳实践。\n\n## 响应式系统\n\nVue.js 的响应式系统是其核心特性之一。\n\n```javascript\n// 组合式 API 示例\nimport { ref, computed } from "vue";\n\nconst count = ref(0);\nconst doubled = computed(() => count.value * 2);\n```\n\n## 组件设计\n\n良好的组件设计可以提高代码的可维护性和复用性。',
        tags: ['Vue.js', '开发技巧', '最佳实践']
      },
      {
        id: 3,
        title: '前端开发趋势',
        excerpt: '探讨2024年前端开发的最新趋势和技术栈。',
        date: '2024-03-29',
        author: '博主',
        content: '# 2024年前端开发趋势\n\n本文探讨2024年前端开发的最新趋势和技术栈。\n\n## 1. AI 驱动的开发工具\n\n人工智能正在改变前端开发的方式，从代码补全到自动生成组件。\n\n## 2. WebAssembly\n\nWebAssembly 继续获得更多支持和应用场景。\n\n## 3. 微前端架构\n\n微前端架构为大型应用提供了更好的可维护性和团队协作。',
        tags: ['前端开发', '技术趋势', '2024']
      }
    ]
  }
}

// 查看文章详情
const viewPost = (post) => {
  router.push({
    name: 'post-detail',
    params: { id: post.id }
  })
}

// 跳转到编辑器页面
const createNewPost = () => {
  router.push({ name: 'editor' })
}

const navigateTo = (route) => {
  router.push(route)
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="home">
    <!-- 头部区域 -->
    <section class="hero-section">
      <h1>欢迎访问我的博客</h1>
      <p>分享技术知识、开发经验和生活感悟</p>
      
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索文章..." 
          class="search-input"
        >
      </div>
      
      <div class="action-buttons" v-if="isLoggedIn">
        <button class="new-post-btn" @click="createNewPost">
          写新文章
        </button>
      </div>
    </section>
    
    <!-- 加载中提示 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载文章...</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchPosts" class="retry-btn">重试</button>
    </div>
    
    <!-- 文章列表 -->
    <section v-else class="posts-grid">
      <div v-if="filteredPosts.length === 0" class="no-results">
        <p>没有找到匹配的文章</p>
      </div>
      
      <div 
        v-for="post in filteredPosts" 
        :key="post.id" 
        class="post-card"
        @click="viewPost(post)"
      >
        <h2>{{ post.title }}</h2>
        <div class="post-meta">
          <span class="post-date">{{ post.date }}</span>
          <span class="post-author">{{ post.author }}</span>
        </div>
        <p class="post-excerpt">{{ post.excerpt }}</p>
        <div class="post-tags">
          <span 
            v-for="tag in post.tags" 
            :key="tag" 
            class="post-tag"
          >
            {{ tag }}
          </span>
        </div>
        <div class="read-more">阅读全文 →</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.hero-section h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

.search-box {
  max-width: 600px;
  margin: 0 auto 1.5rem;
}

.search-input {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 30px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.action-buttons {
  margin-top: 1.5rem;
}

.new-post-btn {
  padding: 0.8rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.new-post-btn:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.loading-container {
  text-align: center;
  padding: 3rem 0;
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(66, 185, 131, 0.2);
  border-radius: 50%;
  border-top-color: #42b983;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 2rem;
  background-color: #fff3f3;
  border-radius: 8px;
  color: #e74c3c;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.post-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  padding: 1.5rem;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.post-card h2 {
  color: #2c3e50;
  margin-bottom: 0.8rem;
  font-size: 1.5rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.post-excerpt {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.post-tag {
  background-color: #f1f1f1;
  color: #666;
  padding: 0.3rem 0.7rem;
  border-radius: 16px;
  font-size: 0.8rem;
}

.read-more {
  color: #42b983;
  font-weight: 500;
  text-align: right;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-section {
    padding: 1.5rem;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
}
</style> 