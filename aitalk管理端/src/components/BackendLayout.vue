<script setup>
import Besides from './besides.vue';
import Header from './Header.vue';

</script>
<template>
  <div class="contaner">
    <div class="common-layout">
      <el-container>
        <el-aside width="200px">
          <besides />
        </el-aside>
        <el-container>
          <el-header class="header">
            <Header></Header>
          </el-header>
          <el-main class="main">
            <div class="main-container"><router-view /></div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<style scoped lang="less">
.contaner{
  height: 100vh;
}
.header{
  height: 60px !important;
  background-color: #fff;
  border-bottom:2px solid #e5e5e5;
  border:0
}
.common-layout{
  height: 100%;
}
.main{
  padding:10px;
  height: 100%;
  .main-container{
    background-color: #fff;
    height: 100%;
  }
}
</style>