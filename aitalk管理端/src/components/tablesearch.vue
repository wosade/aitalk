<!-- 封装表格的搜索框 -->
 <script setup>
 import { computed, ref } from 'vue';
 const props=defineProps({
  formitem:{
    type:Array,
    default:()=>[]
  }
 })
 console.log(props.formitem);
//  判断传入的组件类型 返回对应的组件名称
 const checkcomp=(comp)=>{
    if(comp==='input'){
      return 'el-input' }
    else if(comp==='select'){
      return 'el-select' }
 }
//  定义表单数据
 const formdata=ref([])
 const formitemattrs=computed(()=>{
  const {formitem}=props;
  // 当屏幕大小不同时 去动态判断一行有几个组件
  formitem.forEach(item=>{
    item.col={xs:24,sm:12,md:8,lg:6,xl:6}
 })
  return formitem
  })
  const emit=defineEmits(['search'])
  const formref=ref(null)
  // 搜索表单
  const search=(formel)=>{
    emit('search',formdata)
  }
  // 重置表单
  const reset=(formel)=>{
    formel.resetFields();
    emit('search',formdata)
  }
</script>
<template>
<el-form ref="formref" :model="formdata">
  <el-row :gutter="24">
    <template v-for="item in formitemattrs" :key="item.prop">
      <el-col v-bind="item.col"> <!-- 判断组件 -->
    <!-- v-bind 绑定动态属性 -->
    <el-form-item :label="item.label" :prop="item.prop">
      <component :is="checkcomp(item.comp)" :placeholder="item.placeholder"  v-model="formdata[item.prop]">
        <!-- 如果是 select组件 -->
         <template v-if="item.comp==='select'">
          <el-option v-for="option in item.options" :key="option.value" :value="option.value" :label="option.label" ></el-option>
         </template>
      </component>
    </el-form-item>
  </el-col>
    </template>
  </el-row>
</el-form>
  <el-row > 
  <el-button type="primary" @click="search(formref)">查询</el-button>
      <el-button type="info" @click="reset(formref)"
      >重置</el-button>
      </el-row>
</template>