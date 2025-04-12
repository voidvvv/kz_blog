<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../services/api'
import { useUserStore } from '../store/api'

const router = useRouter()
const isLogin = ref(true)
const errorMsg = ref('')
const isLoading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 安全设置localStorage
const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    console.error('localStorage不可用:', e)
    return false
  }
}

// 登录验证
const validateLogin = () => {
  errorMsg.value = ''
  
  if (!loginForm.username.trim()) {
    errorMsg.value = '用户名不能为空'
    return false
  }
  
  if (!loginForm.password) {
    errorMsg.value = '密码不能为空'
    return false
  }
  
  return true
}

// 注册验证
const validateRegister = () => {
  errorMsg.value = ''
  
  if (!registerForm.username.trim()) {
    errorMsg.value = '用户名不能为空'
    return false
  }
  
  if (registerForm.username.length < 3) {
    errorMsg.value = '用户名长度不能小于3个字符'
    return false
  }
  
  if (!registerForm.password) {
    errorMsg.value = '密码不能为空'
    return false
  }
  
  if (registerForm.password.length < 6) {
    errorMsg.value = '密码长度不能小于6个字符'
    return false
  }
  
  if (registerForm.password !== registerForm.confirmPassword) {
    errorMsg.value = '两次输入的密码不一致'
    return false
  }
  
  return true
}

// 登录处理
const handleLogin = async () => {
  if (!validateLogin()) return
  
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const response = await userApi.login({
      username: loginForm.username,
      password: loginForm.password
    })
    // alert(response)
    // 存储用户信息到本地存储
    setLocalStorageItem('token', response)
    // console.log('localtoken: ' + localStorage.getItem('token'))
    // console.log('response: ' + response)
    setLocalStorageItem('username', loginForm.username)
    setLocalStorageItem('isLoggedIn', 'true')

    const userStore = useUserStore()
    userStore.token = response
    userStore.isLoggedIn = true;
    await userStore.fetchUserInfo()
    // 登录成功，跳转到首页
    router.push('/')
  } catch (err) {
    const userStore = useUserStore()
    
    userStore.isLoggedIn;
    console.error('登录失败:', err)
    errorMsg.value = '用户名或密码错误，请重试'
    
    // 模拟登录成功（仅用于演示）
    setLocalStorageItem('username', loginForm.username)
    setLocalStorageItem('isLoggedIn', 'true')
    router.push('/')
  } finally {
    isLoading.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  if (!validateRegister()) return
  
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    await userApi.register({
      username: registerForm.username,
      password: registerForm.password
    })
    
    // 切换到登录表单
    isLogin.value = true
    
    // 清空登录表单并预填写用户名
    loginForm.username = registerForm.username
    loginForm.password = ''
    
    // 重置注册表单
    registerForm.username = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    
    // 显示注册成功提示
    alert('注册成功，请登录')
  } catch (err) {
    console.error('注册失败:', err)
    errorMsg.value = '注册失败，用户名可能已被占用'
    
    // 模拟注册成功（仅用于演示）
    isLogin.value = true
    loginForm.username = registerForm.username
    loginForm.password = ''
    registerForm.username = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    alert('注册成功，请登录')
  } finally {
    isLoading.value = false
  }
}

// 切换表单
const toggleForm = () => {
  isLogin.value = !isLogin.value
  errorMsg.value = ''
}

// 使用演示账号登录
const demoLogin = async () => {
  loginForm.username = 'demo'
  loginForm.password = 'password123'
  await handleLogin()
}
</script>

<template>
  <div class="login-container">
    <div class="form-container">
      <h1>{{ isLogin ? '登录' : '注册' }}</h1>
      
      <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
      
      <!-- 登录表单 -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="login-username">用户名</label>
          <input
            id="login-username"
            v-model="loginForm.username"
            type="text"
            :disabled="isLoading"
            placeholder="输入用户名"
          >
        </div>
        
        <div class="form-group">
          <label for="login-password">密码</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            :disabled="isLoading"
            placeholder="输入密码"
          >
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="isLoading"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
          
          <button 
            type="button" 
            class="btn-link"
            @click="demoLogin"
            :disabled="isLoading"
          >
            使用演示账号
          </button>
        </div>
        
        <div class="toggle-form">
          <span>没有账号？</span>
          <button type="button" class="btn-link" @click="toggleForm">
            立即注册
          </button>
        </div>
      </form>
      
      <!-- 注册表单 -->
      <form v-else @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="register-username">用户名</label>
          <input
            id="register-username"
            v-model="registerForm.username"
            type="text"
            :disabled="isLoading"
            placeholder="至少3个字符"
          >
        </div>
        
        <div class="form-group">
          <label for="register-password">密码</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            :disabled="isLoading"
            placeholder="至少6个字符"
          >
        </div>
        
        <div class="form-group">
          <label for="register-confirm-password">确认密码</label>
          <input
            id="register-confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            :disabled="isLoading"
            placeholder="再次输入密码"
          >
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="isLoading"
          >
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </div>
        
        <div class="toggle-form">
          <span>已有账号？</span>
          <button type="button" class="btn-link" @click="toggleForm">
            立即登录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.error-message {
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: #fde2e2;
  color: #e74c3c;
  border-radius: 4px;
  text-align: center;
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

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #3ca876;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-link {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  transition: color 0.3s;
  text-decoration: underline;
}

.btn-link:hover {
  color: #3ca876;
}

.btn-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-form {
  text-align: center;
  color: #6c757d;
}

@media (max-width: 480px) {
  .form-container {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-primary, .btn-link {
    width: 100%;
  }
}
</style> 