<script setup>
import { useUserStore } from '@/store/api'

const userStore = useUserStore()
const userInfo = userStore.$state.userInfo

function formatDate(date) {
  const date = new Date(timestamp);
  return date.toLocaleString(); // 根据浏览器本地设置格式化
}
</script>

<template>
    <div>
        <h1>用户详情</h1>
        <p>用户名: {{ userInfo.username }}</p>
        <p>邮箱: {{ userInfo.email }}</p>
        <p>头像: <img :src="userInfo.avatar" alt="头像"></p>
    </div>
</template>
