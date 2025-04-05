<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import { blogApi } from '../services/api'
import 'md-editor-v3/lib/style.css'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref(null)

// 安全获取localStorage值
const getLocalStorageItem = (key, defaultValue = '') => {
  try {
    return localStorage.getItem(key) || defaultValue
  } catch (e) {
    console.error('localStorage不可用:', e)
    return defaultValue
  }
}

const post = reactive({
  id: null,
  title: '',
  content: '',
  excerpt: '',
  tags: [],
  author: getLocalStorageItem('username', '博主'),
  date: new Date().toISOString().split('T')[0]
})

const newTag = ref('')
const isEditMode = ref(false)

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !post.tags.includes(tag)) {
    post.tags.push(tag)
    newTag.value = ''
  }
}

// 移除标签
const removeTag = (index) => {
  post.tags.splice(index, 1)
}

// 保存草稿
const saveDraft = async () => {
  if (!post.title || !post.content) {
    error.value = '标题和内容不能为空'
    return
  }

  isSaving.value = true
  error.value = null

  try {
    // 如果摘要为空，自动生成摘要
    if (!post.excerpt) {
      post.excerpt = post.content
        .replace(/#|`|_|\*|\[|\]/g, '')
        .substring(0, 150) + '...'
    }

    if (isEditMode.value) {
      await blogApi.updatePost(post.id, post)
    } else {
      const response = await blogApi.createPost(post)
      post.id = response.data.id
      isEditMode.value = true
    }

    isSaving.value = false
    alert('草稿保存成功！')
  } catch (err) {
    console.error('保存草稿失败:', err)
    error.value = '保存草稿失败，请稍后再试'
    isSaving.value = false
    
    // 模拟成功状态
    if (!isEditMode.value) {
      post.id = Date.now()
      isEditMode.value = true
    }
    
    alert('草稿保存成功！')
  }
}

// 发布文章
const publishPost = async () => {
  if (!post.title || !post.content) {
    error.value = '标题和内容不能为空'
    return
  }
  
  if (!post.tags || post.tags.length === 0) {
    error.value = '请至少添加一个标签'
    return
  }

  if (!post.excerpt) {
    post.excerpt = post.content
      .replace(/#|`|_|\*|\[|\]/g, '')
      .substring(0, 150) + '...'
  }
  alert(isEditMode.value)
  isSaving.value = true
  error.value = null

  try {
    if (isEditMode.value) {
      post.published = true
      await blogApi.updatePost(post.id, post)
    } else {
      post.published = true
      const response = await blogApi.createPost(post)
      post.id = response.data.id
    }

    isSaving.value = false
    router.push('/')
  } catch (err) {
    console.error('发布文章失败:', err)
    error.value = '发布文章失败，请稍后再试'
    isSaving.value = false
    
    // 模拟成功
    router.push('/')
  }
}

// 取消编辑
const cancelEdit = () => {
  if (confirm('确定要取消编辑吗？未保存的内容将丢失。')) {
    router.push('/')
  }
}

// 获取文章数据进行编辑
const fetchPost = async (id) => {
  isLoading.value = true
  error.value = null

  try {
    const data = await blogApi.getPost(id)
    
    // 更新表单数据
    post.id = data.id
    post.title = data.title
    post.content = data.content
    post.excerpt = data.excerpt
    post.tags = data.tags || []
    post.author = data.author
    post.date = data.date
    
    isEditMode.value = true
    isLoading.value = false
  } catch (err) {
    console.error('获取文章失败:', err)
    error.value = '获取文章失败，请稍后再试'
    isLoading.value = false
    
    // 模拟数据用于演示
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
    
    const editId = parseInt(id)
    const mockPost = mockPosts.find(p => p.id === editId)
    
    if (mockPost) {
      post.id = mockPost.id
      post.title = mockPost.title
      post.content = mockPost.content
      post.excerpt = mockPost.excerpt
      post.tags = mockPost.tags || []
      post.author = mockPost.author
      post.date = mockPost.date
      
      isEditMode.value = true
    }
    
    isLoading.value = false
  }
}

onMounted(() => {
  // 检查是否是编辑模式
  if (route.params.id) {
    fetchPost(parseInt(route.params.id))
  }
})
</script>

<template>
  <div class="post-editor">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    <div v-else>
      <div class="editor-header">
        <h1>{{ isEditMode ? '编辑文章' : '创建新文章' }}</h1>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
  
      <form @submit.prevent="publishPost" class="editor-form">
        <div class="form-group">
          <label for="post-title">标题</label>
          <input 
            id="post-title" 
            v-model="post.title" 
            type="text" 
            placeholder="请输入文章标题"
            required
          >
        </div>
  
        <div class="form-group">
          <label for="post-excerpt">摘要 (选填)</label>
          <textarea 
            id="post-excerpt" 
            v-model="post.excerpt" 
            placeholder="请输入文章摘要，留空将自动从内容生成"
          ></textarea>
        </div>
  
        <div class="form-group">
          <label>标签</label>
          <div class="tags-container">
            <div v-if="post.tags.length > 0" class="tags-list">
              <span 
                v-for="(tag, index) in post.tags" 
                :key="index"
                class="tag"
              >
                {{ tag }}
                <button 
                  type="button" 
                  class="tag-remove" 
                  @click="removeTag(index)"
                >
                  &times;
                </button>
              </span>
            </div>
            <div v-else class="tags-empty">
              <span>目前没有标签，请添加至少一个标签</span>
            </div>
            <div class="tag-input-container">
              <input 
                v-model="newTag" 
                type="text" 
                placeholder="添加标签" 
                @keydown.enter.prevent="addTag"
              >
              <button 
                type="button" 
                class="btn-add-tag" 
                @click="addTag"
              >
                添加
              </button>
            </div>
          </div>
        </div>
  
        <div class="form-group">
          <label for="post-content">内容</label>
          <MdEditor
            v-model="post.content"
            height="500px"
          />
        </div>
  
        <div class="form-actions">
          <button 
            type="button" 
            class="btn-cancel" 
            @click="cancelEdit"
            :disabled="isSaving"
          >
            取消
          </button>
          <button 
            type="button" 
            class="btn-save" 
            @click="saveDraft"
            :disabled="isSaving"
          >
            {{ isSaving ? '保存中...' : '保存草稿' }}
          </button>
          <button 
            type="submit" 
            class="btn-publish"
            :disabled="isSaving"
          >
            {{ isSaving ? '发布中...' : '发布文章' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.post-editor {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-container {
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

.editor-header {
  margin-bottom: 2rem;
  text-align: center;
}

.editor-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #fde2e2;
  border-radius: 4px;
}

.editor-form {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.tags-container {
  margin-top: 0.5rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tags-empty {
  margin-bottom: 1rem;
  color: #666;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  background-color: #e9ecef;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #495057;
}

.tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background-color: #dee2e6;
  color: #495057;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

.tag-remove:hover {
  background-color: #ced4da;
}

.tag-input-container {
  display: flex;
  gap: 0.5rem;
}

.tag-input-container input {
  flex: 1;
}

.btn-add-tag {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-add-tag:hover {
  background-color: #5a6268;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save,
.btn-publish {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-cancel {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ddd;
}

.btn-save {
  background-color: #6c757d;
  color: white;
}

.btn-publish {
  background-color: #42b983;
  color: white;
}

.btn-cancel:hover {
  background-color: #e9ecef;
}

.btn-save:hover {
  background-color: #5a6268;
}

.btn-publish:hover {
  background-color: #3ca876;
}

.btn-cancel:disabled,
.btn-save:disabled,
.btn-publish:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .post-editor {
    padding: 1rem;
  }
  
  .editor-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-save,
  .btn-publish {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style> 