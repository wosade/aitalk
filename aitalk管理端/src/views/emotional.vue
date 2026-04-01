<script setup>
import Tablesearch from '@/components/tablesearch.vue';
import { getmooddiary } from '@/api/index.js';
import { onMounted, ref } from 'vue'
import { delmooddiary } from '@/api/index.js';
import Articledialog from '@/components/articledialog.vue';
// tablesearch 的传参
const formitem = [
  { comp: 'input', prop: 'userId', label: '用户ID', placeholder: '请输入用户ID', value: '' },
  {
    comp: 'select', prop: 'moodscore', label: '情绪评分', placeholder: '请选择情绪评分', value: '', options: [
      { value: '1-3', label: '低分1-3' },
      { value: '4-6', label: '中分4-6' },
      { value: '7-10', label: '高分7-10' }
    ]
  }
]
onMounted(() => {
  search()
})
// 搜索栏的参数
const currentablesearch = ref({})
const changeformdata = (val) => {
  currentablesearch.value = val
  if(val){currentablesearch.value.minMoodScore = val.moodscore === '1-3' ? 1 : val.moodscore === '4-6' ? 4 : 7
  currentablesearch.value.maxMoodScore = val.moodscore === '1-3' ? 3 : val.moodscore === '4-6' ? 6 : 10}
  search()
}
// 点击搜索后触发的函数
const search = () => {
  // 获取情绪日记列表
  getmooddiary({
    ...currentablesearch.value,
    currentPage: pagesize.currentPage,
    size: pagesize.pageSize
  }).then(res => {
    pagesize.total = res.data.total
    tabledata.value = res.data.records
  })
}
// 表格数据
const tabledata = ref([])
// 分页组件的函数
const pagesize = ref({
  currentPage: 1,
  size: 10,
  total: 0
})
const handleCurrentChange = (val) => {
  pagesize.currentPage = val
  search()
}
const handleSizeChange = (val) => {
  pagesize.pageSize = val
  search()
}
const del = (id) => {
  delmooddiary(id).then(res => {
    search()
  })
}
</script>
<template>
  <Tablesearch @changeformdata="changeformdata" :formitem="formitem">
  </Tablesearch>
  <el-table :data="tabledata" style="width: 100%">
    <el-table-column prop="userId" label="用户ID" width="100" />
    <el-table-column label="情绪评分" width="200">
      <template #default="scope">
        <el-rate v-model="scope.row.moodScore" :max="10" disabled></el-rate>
        </template>
        </el-table-column>
    <el-table-column prop="diaryDate" label="创建时间" width="100" /> 
    <el-table-column prop="emotionTriggers" label="情绪触发"  />
    <el-table-column prop="diaryContentPreview" label="内容"/>
    <el-table-column label="操作" width="100">
      <template #default="scope">
        <el-button type="danger"  @click="del(scope.row.id)" text>删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <div class="fenye" style="display: flex;justify-content: flex-end;">
    <el-pagination background layout="prev, pager, next" v-model:current-page="pagesize.currentPage"
      v-model:page-size="pagesize.pageSize" :total="pagesize.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
<style scoped lang="less"></style>
