<script setup>
import { useRoute } from 'vue-router';
import Panelhead from '../components/panelhead.vue';
import Tablesearch from '../components/tablesearch.vue';
const route = useRoute()
// tablesearch 的传参
const formitem = [
  { comp: 'input', prop: 'title', label: '标题', placeholder: '请输入标题' ,value:''},
  {
    comp: 'select', prop: '选择', label: '标题', placeholder: '请输入标题', value:'',options: [
      { value: '1', label: '全部' },
      { value: '2', label: '已解决' },
      { value: '3', label: '未解决' }
    ]
  }
]

</script>
<template>
  <Panelhead :title="route.meta.title">
    <template #button>
      <el-button type="primary">新增</el-button>
      <el-button type="primary">删除</el-button>
    </template>
  </Panelhead>
  <tablesearch :formitem="formitem"></tablesearch>
</template>
<style scoped lang="less"></style>
