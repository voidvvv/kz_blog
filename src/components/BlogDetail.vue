<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor, MdPreview, MdCatalog } from 'md-editor-v3'
import { blogApi, commentApi } from '../services/api'
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const comments = ref([])
const isLoading = ref(true)
const isCommentLoading = ref(false)
const error = ref(null)
const isUserLoggedIn = ref(false)


const scrollElement = document.documentElement;

// 安全获取localStorage值
const getLocalStorageItem = (key, defaultValue = '') => {
  try {
    return localStorage.getItem(key) || defaultValue
  } catch (e) {
    console.error('localStorage不可用:', e)
    return defaultValue
  }
}

// 检查登录状态
const checkLoginStatus = () => {
  try {
    isUserLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  } catch (e) {
    console.error('localStorage不可用:', e)
    isUserLoggedIn.value = false
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(); // 根据浏览器本地设置格式化
}

// 获取文章数据
const fetchPost = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const postId = parseInt(route.params.id)
    // 从API获取文章
    const response = await blogApi.getPost(postId)
    post.value = response.data
    post.value.date = formatTimestamp(post.value.createDate)
    isLoading.value = false
    
    // 获取评论
    fetchComments(postId)
  } catch (err) {
    console.error('获取文章失败:', err)
    error.value = '获取文章详情失败，请稍后再试'
    isLoading.value = false
    
    // 使用备用数据
    const mockPosts = [
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
    
    const postId = parseInt(route.params.id)
    post.value = mockPosts.find(p => p.id === postId) || null
    
    // 模拟评论数据
    comments.value = [
      {
        id: 1,
        author: '张三',
        content: '写得很好，学习了！',
        date: '2024-03-31'
      },
      {
        id: 2,
        author: '李四',
        content: '期待更多精彩内容！',
        date: '2024-03-30'
      }
    ]
  }
}

// 获取评论列表
const fetchComments = async (postId) => {
  isCommentLoading.value = true
  
  try {
    const response = await commentApi.getComments(postId)
    comments.value = response
  } catch (err) {
    console.error('获取评论失败:', err)
    // 使用备用数据
    comments.value = [
      {
        id: 1,
        author: '张三',
        content: '写得很好，学习了！',
        date: '2024-03-31'
      },
      {
        id: 2,
        author: '李四',
        content: '期待更多精彩内容！',
        date: '2024-03-30'
      }
    ]
  } finally {
    isCommentLoading.value = false
  }
}

const newComment = ref('')
const showCommentForm = ref(false)
const isSubmitting = ref(false)

// 添加评论
const addComment = async () => {
  if (!newComment.value.trim()) return
  
  isSubmitting.value = true
  
  try {
    const commentData = {
      content: newComment.value,
      author: getLocalStorageItem('username', '访客'),
      date: new Date().toISOString().split('T')[0]
    }
    
    await commentApi.addComment(post.value.id, commentData)
    
    // 重新获取评论列表
    await fetchComments(post.value.id)
    
    newComment.value = ''
    showCommentForm.value = false
  } catch (err) {
    console.error('添加评论失败:', err)
    // 模拟成功
    comments.value.unshift({
      id: Date.now(),
      author: getLocalStorageItem('username', '访客'),
      content: newComment.value,
      date: new Date().toISOString().split('T')[0]
    })
    
    newComment.value = ''
    showCommentForm.value = false
  } finally {
    isSubmitting.value = false
  }
}

// 编辑文章
const editPost = () => {
  router.push({ 
    name: 'editor',
    params: { id: post.value.id }
  })
}


onMounted(() => {
  checkLoginStatus()
  fetchPost()
})
</script>

<template>
  <div class="blog-detail" v-if="post && !isLoading">
    <article class="post-content">
      <header class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span class="author">作者：{{ post.author }}</span>
          <span class="date">发布于：{{ post.date }}</span>
        </div>
        
        <div class="post-actions" v-if="isUserLoggedIn">
          <button class="edit-btn" @click="editPost">编辑文章</button>
        </div>
      </header>

      <div class="post-body">
        <!-- <MdEditor 
          :modelValue="post.content" 
          previewOnly 
        /> -->
        <MdPreview :id="my-editor" :modelValue="post.content"  />
        <MdCatalog
          :editorId="my-editor"
          :scrollElement="scrollElement"
        />

      </div>

      <div class="post-tags">
        <span 
          v-for="tag in post.tags" 
          :key="tag" 
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </article>

    <section class="comments-section">
      <h2>评论区</h2>
      
      <div class="comment-form" v-if="!showCommentForm">
        <button class="btn-comment" @click="showCommentForm = true">
          发表评论
        </button>
      </div>

      <div class="comment-form" v-else>
        <textarea 
          v-model="newComment" 
          placeholder="写下你的评论..."
          class="comment-input"
          :disabled="isSubmitting"
        ></textarea>
        <div class="comment-actions">
          <button class="btn-cancel" @click="showCommentForm = false" :disabled="isSubmitting">取消</button>
          <button class="btn-submit" @click="addComment" :disabled="isSubmitting">
            {{ isSubmitting ? '提交中...' : '提交' }}
          </button>
        </div>
      </div>
      
      <div v-if="isCommentLoading" class="comments-loading">
        <p>加载评论中...</p>
      </div>
      
      <div v-else-if="comments.length === 0" class="comments-empty">
        <p>暂无评论，快来发表第一条评论吧！</p>
      </div>

      <div v-else class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-date">{{ comment.date }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
    </section>

    <section class="related-posts">
      <h2>相关文章</h2>
      <div class="related-grid">
        <div class="related-card">
          <h3>Vue.js 组件设计模式</h3>
          <p>探索 Vue.js 中常用的组件设计模式...</p>
        </div>
        <div class="related-card">
          <h3>前端性能优化实践</h3>
          <p>分享一些实用的前端性能优化技巧...</p>
        </div>
        <div class="related-card">
          <h3>现代 CSS 技术</h3>
          <p>了解最新的 CSS 特性和最佳实践...</p>
        </div>
      </div>
    </section>
  </div>
  <div v-else-if="error" class="error-container">
    <div class="error-message">
      <h2>出错了！</h2>
      <p>{{ error }}</p>
      <button @click="fetchPost" class="retry-btn">重试</button>
      <button @click="router.push('/')" class="back-btn">返回首页</button>
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>加载中...</p>
  </div>
</template>

<style scoped>
.blog-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
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
  max-width: 500px;
}

.retry-btn, .back-btn {
  margin: 1rem 0.5rem 0;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn {
  background-color: #e74c3c;
  color: white;
}

.back-btn {
  background-color: #3498db;
  color: white;
}

.post-header {
  margin-bottom: 2rem;
  text-align: center;
}

.post-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.post-meta {
  color: #666;
  font-size: 0.9rem;
}

.post-meta span {
  margin: 0 1rem;
}

.post-actions {
  margin-top: 1.5rem;
}

.edit-btn {
  padding: 0.5rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.post-body {
  margin-bottom: 2rem;
}

.post-tags {
  margin: 2rem 0 3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: #e9ecef;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #495057;
}

.comments-section {
  margin-top: 3rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.comments-loading, .comments-empty {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-input {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  resize: vertical;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-comment,
.btn-submit,
.btn-cancel {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-comment {
  background-color: #42b983;
  color: white;
  border: none;
}

.btn-submit {
  background-color: #42b983;
  color: white;
  border: none;
}

.btn-cancel {
  background-color: #fff;
  color: #666;
  border: 1px solid #ddd;
}

.btn-submit:disabled, .btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.comment-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: bold;
  color: #2c3e50;
}

.comment-date {
  color: #666;
  font-size: 0.9rem;
}

.comment-content {
  color: #2c3e50;
  line-height: 1.6;
}

.related-posts {
  margin-top: 3rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.related-card {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s;
  cursor: pointer;
}

.related-card:hover {
  transform: translateY(-5px);
}

.related-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.related-card p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .blog-detail {
    padding: 1rem;
  }

  .post-header h1 {
    font-size: 2rem;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
