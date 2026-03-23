<script setup>
import { ArrowDown } from '@element-plus/icons-vue';
import { watch,ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 拿到路由实例
const router=useRouter();
// 拿到当前路由对象
const route=ref( useRoute());
console.log(router,route);
</script>
<template>
<div class="header flex-box">
  <div class="header-left" >
    {{ route.meta.title }}
  </div>
  <div class="header-right flex-box">
    <el-avatar src="/src//assets/机器人.png" style="width: 30px;height: 30px;margin-right: 5px;"></el-avatar>
    <p >{{ 123 }}</p>
    <el-icon><ArrowDown /></el-icon>
  </div>
</div>
</template>
<style scoped lang="less">
.flex-box{
  display: flex;
  align-items: center;
}
.header{
  justify-content: space-between;
  .header-left{
    padding-left:5px;
    font-size: larger;
    font-weight: bold;
  }
  .header-right{
    padding-right: 10px;
  }
}
</style>