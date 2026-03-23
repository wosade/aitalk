<script setup>
defineProps({
  title:String
})
</script>
<template>
  <!-- 封装头部 -->
   <div class="panelhead">
    <div class="title">
      {{title}}
    </div>
    <div class="button">
    <slot name="button"></slot></div>
    </div>
</template>
<style lang="less" scoped>
  .panelhead{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>