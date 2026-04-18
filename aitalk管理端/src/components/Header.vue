<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '@/api/index.js'

const router = useRouter()
const route = useRoute()
const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

const out = () => {
  logout().then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  })
}
</script>
<template>
  <div class="header flex-box">
    <div class="header-left">
      {{ route.meta.title }}
    </div>
    <div class="header-right flex-box">
      <el-popover trigger="hover" placement="top" :width="180">
        <p>你想要退出吗</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" type="primary" @click="out"> 是 </el-button>
        </div>
        <template #reference>
          <div style="display: flex; align-items: center">
            <el-avatar src="/assets/机器人.png" style="width: 30px; height: 30px; margin-right: 5px"></el-avatar>
            <p>{{ userInfo?.nickname }}</p>
            <el-icon><ArrowDown /></el-icon>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<style scoped lang="less">
.flex-box {
  display: flex;
  align-items: center;
}
.header {
  justify-content: space-between;
  .header-left {
    padding-left: 5px;
    font-size: larger;
    font-weight: bold;
  }
  .header-right {
    padding-right: 10px;
  }
}
</style>
