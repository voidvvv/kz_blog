<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)
const form = ref({
  username: '',
  password: '',
  email: ''
})

// 错误提示状态
const errors = ref({
  username: '',
  password: '',
  email: ''
})

// 验证表单
const validateForm = () => {
  // 重置错误信息
  errors.value = {
    username: '',
    password: '',
    email: ''
  }
  
  let isValid = true
  
  // 验证用户名
  if (!form.value.username) {
    errors.value.username = '请输入用户名'
    isValid = false
  } else if (form.value.username.length < 3) {
    errors.value.username = '用户名至少需要3个字符'
    isValid = false
  }
  
  // 验证密码
  if (!form.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = '密码至少需要6个字符'
    isValid = false
  }
  
  // 如果是注册模式，验证邮箱
  if (!isLogin.value) {
    if (!form.value.email) {
      errors.value.email = '请输入邮箱'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = '请输入有效的邮箱地址'
      isValid = false
    }
  }
  
  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    // 这里添加登录/注册逻辑
    console.log('提交表单:', form.value)
    // 模拟登录成功
    localStorage.setItem('isLoggedIn', 'true')
    router.push('/')
  }
}

// 清除错误提示
const clearError = (field) => {
  errors.value[field] = ''
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            @input="clearError('username')"
            :class="{ 'error': errors.username }"
            placeholder="请输入用户名"
          >
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <div class="form-group" v-if="!isLogin">
          <label for="email">邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            @input="clearError('email')"
            :class="{ 'error': errors.email }"
            placeholder="请输入邮箱"
          >
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            @input="clearError('password')"
            :class="{ 'error': errors.password }"
            placeholder="请输入密码"
          >
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <button type="submit" class="btn-submit">
          {{ isLogin ? '登录' : '注册' }}
        </button>

        <div class="form-footer">
          <p>
            {{ isLogin ? '还没有账号？' : '已有账号？' }}
            <a href="#" @click.prevent="isLogin = !isLogin">
              {{ isLogin ? '立即注册' : '立即登录' }}
            </a>
          </p>
        </div>
      </form>

      <div class="social-login">
        <p>其他登录方式</p>
        <div class="social-icons">
          <button class="social-icon">
            <i class="fab fa-weixin"></i>
          </button>
          <button class="social-icon">
            <i class="fab fa-github"></i>
          </button>
          <button class="social-icon">
            <i class="fab fa-google"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.login-box {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

input.error {
  border-color: #ff4d4f;
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -1.2rem;
  color: #ff4d4f;
  font-size: 0.875rem;
}

.btn-submit {
  width: 100%;
  padding: 0.8rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.btn-submit:hover {
  background-color: #3aa876;
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
}

.form-footer a {
  color: #42b983;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}

.social-login {
  margin-top: 2rem;
  text-align: center;
}

.social-login p {
  color: #666;
  margin-bottom: 1rem;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.social-icon i {
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 480px) {
  .login-box {
    padding: 2rem;
  }
}
</style> 