<script setup>
import { useUserStore } from '@/store/api'
import { ref, computed, onMounted } from 'vue'

const userStore = useUserStore()
const userInfoErr = ref(false)
const loading = ref(true)

// 使用计算属性安全地访问用户信息
const userInfo = ref(null)

onMounted(async () => {
    try {
        
        userInfo.value = await userStore.fetchUserInfo()
        if (!userInfo.value || Object.keys(userInfo.value).length === 0) {
            userInfoErr.value = true
        }

    } catch (error) {
        console.error('获取用户信息失败:', error)
        userInfoErr.value = true
    } finally {
        loading.value = false
    }
})

function formatDate(timestamp) {
    if (!timestamp) return '未知'
    const date = new Date(timestamp)
    return date.toLocaleString()
}
</script>

<template>
    <div class="user-detail">
        <h1>用户详情</h1>
        
        <div v-if="loading" class="loading">
            加载中...
        </div>
        
        <div v-else-if="userInfoErr" class="error">
            用户信息获取失败，请稍后重试
        </div>
        
        <div v-else class="user-info">
            <div class="avatar-container">
                <img 
                    :src="userInfo.avatar || '/default-avatar.png'" 
                    alt="用户头像"
                    class="avatar"
                >
            </div>
            
            <div class="info-container">
                <p><strong>用户名:</strong> {{ userInfo.username || '未设置' }}</p>
                <p><strong>邮箱:</strong> {{ userInfo.email || '未设置' }}</p>
                <p><strong>注册时间:</strong> {{ formatDate(userInfo.createdAt) }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.loading, .error {
    text-align: center;
    padding: 20px;
    color: #666;
}

.user-info {
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

.avatar-container {
    flex-shrink: 0;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #eee;
}

.info-container {
    flex: 1;
}

.info-container p {
    margin: 10px 0;
    font-size: 16px;
}

.info-container strong {
    color: #333;
    margin-right: 10px;
}
</style>
