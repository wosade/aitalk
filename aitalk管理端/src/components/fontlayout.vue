<script setup>
import iconurl1 from '@/assets/机器人.png'
import router from '@/router';
import { onMounted, ref } from 'vue';
// 登录状态
const loginref=ref(true)
onMounted(()=>{
  loginref.value=localStorage.getItem('token')?true:false
})
// 退出登录
const handleLogout=()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  loginref.value=false
  router.push('/')
}
</script>
<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image style="width: 40px;height: 40px;" :src="iconurl1" alt="品牌logo" class="brand-log" />
        <h1 class="brand-name">心理AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/home" class="nav-link">首页</router-link>
        <router-link to="/consulation" class="nav-link" v-if="loginref">AI咨询</router-link>
        <router-link to="/emotion-diary" class="nav-link" v-if="loginref">情感日记分析</router-link>
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <el-button type="primary" @click="handleLogout" v-if="loginref===true" >退出登录</el-button>
        <template v-else>
          <router-link to="/login" class="nav-link"><el-button>登录</el-button></router-link>
          <router-link to="/register" class="nav-link"><el-button>注册</el-button> </router-link>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026 心理AI助手 </p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.frontend-layout {
  // 1. 核心布局：开启 Flex 垂直排列
  display: flex;
  flex-direction: column;
  // 2. 核心高度：确保容器最小高度为 100% 视口高度
  // 这样当 main-content 内容很少时，也会占满全屏，从而把 footer 压到底部
  min-height: 100vh;

  .navbar-container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // 防止在内容极多时，导航栏被 flex 压缩变形
    flex-shrink: 0;

    .brand-section {
      display: flex;
      align-items: center;

      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;

      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        text-decoration: none; // 移除下划线

        &:hover {
          color: #4A90E2;
        }
      }
    }
  }

  .main-content {
    flex: 1;

    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 20px 10px;

    // 确保内部的 router-view 也能正常显示
    box-sizing: border-box;
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;

    // 确保页脚不会被压缩
    flex-shrink: 0;

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;

      p {
        margin: 0;
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
}
</style>