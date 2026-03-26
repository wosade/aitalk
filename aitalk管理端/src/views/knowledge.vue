<script setup>
import { reactive, ref,nextTick,watch,computed } from 'vue';
import { useRoute } from 'vue-router';
import Panelhead from '../components/panelhead.vue';
import Tablesearch from '../components/tablesearch.vue';
import { getcategory,getarticle ,getarticleDetail, register, updatearticle, updatearticleStatus,deletearticle} from '../api';
import { ElMessage } from 'element-plus';
import { onMounted } from 'vue';
import Articledialog from '../components/articledialog.vue';
// 记录每个id对应的名字
const categorymap=reactive({})
const categorylist=ref([])
onMounted(()=>{
  // 获取分类列表
  getcategory().then(res=>{
    categorylist.value=res.data
    console.log(res.data);
    
    // 处理分类列表，添加 value 属性
    categorylist.value=res.data.map(item=>{
      categorymap[item.id]=item.categoryName
      return {
        label:item.categoryName,
        value:item.id
      }
    }
    )
console.log('categorylist', categorylist.value);
})
  search()
  getarticleDetail({
  }).then(res => {
    console.log(res.data);
  })
})
const route = useRoute()
// tablesearch 的传参
const formitem = [
  { comp: 'input', prop: 'title', label: '标题', placeholder: '请输入标题' ,value:''},
  {
    comp: 'select', prop: 'categoryId', label: '分类', placeholder: '请选择分类', value:'',options: [
      { value: '1', label: '心理健康基础' },
      { value: '2', label: '情绪管理' },
      { value: '3', label: '压力缓解' }
    ]
  },
  {
    comp: 'select', prop: 'status', label: '状态', placeholder: '请选择状态', value: '', options: [
      { value: '0', label: '草稿' },
      { value: '1', label: '已发布' },
      { value: '2', label: '已下线' }
    ]
  }
]
// 搜索栏的参数
const currentablesearch=ref({})
const changeformdata=(val)=>{
  currentablesearch.value=val
  search()
}
// 点击搜索后触发的函数
const search=()=>{
  // 获取文章列表
  getarticle({
    ...currentablesearch.value,
    currentPage:pagesize.currentPage,
    size:pagesize.pageSize
  }).then(res=>{
    console.log(res);
    pagesize.total=res.data.total
    tabledata.value=res.data.records
  })
}
// 表格数据
const tabledata=ref([])
// 分页组件
const pagesize=reactive({
  currentPage:1,
  pageSize:5,
  total:0
})
// 分页组件的函数
const handleCurrentChange=(val)=>{
  pagesize.currentPage=val
  search()
}
const handleSizeChange=(val)=>{
  pagesize.pageSize=val
  search()
}
// 文章详情弹窗
const dialogVisible=ref(false)
// 编辑文章详情
const currentarticle=ref({})
const check=ref(0)
const edit=(row)=>{
  ref.value=1
  console.log(row);
  if(!row.id){
    return 
  }
  else{
    getarticleDetail({id:row.id}).then(res=>{
      console.log(res.data);
      currentarticle.value=res.data
      dialogVisible.value=true
    })
  }
}
// 新增
const add=()=>{
  ref.value=0
  currentarticle.value = {}
    dialogVisible.value=true
}
// 更新文章状态
const updatestatus=(id,status)=>{
  updatearticleStatus(id,status).then(res=>{
    console.log(res);
    if(res.code==="200"){
      ElMessage.success('更新成功')
      search()
    }
  }).catch(err=>{
    ElMessage.error(err.message)
  })
}
// 删除文章
const del=(id)=>{
  deletearticle(id).then(res=>{
    console.log(res);
    if(res.code==="200"){
      ElMessage.success('删除成功')
      search()
    }
  }).catch(err=>{
    ElMessage.error(err.message)
  })
}
</script>
<template>
  <Panelhead :title="route.meta.title">
    <template #button>
      <el-button type="primary" @click="add">新增</el-button>
      <el-button type="primary">删除</el-button>
    </template>
  </Panelhead>
  <tablesearch @search ="search" :formitem="formitem" @changeformdata="changeformdata"></tablesearch>
  <el-table :data="tabledata">
    <el-table-column label="文章标题" >
      <template #default="scope">
        <div style="display: flex;align-items: center;">
          <el-icon>
            <Timer />
          </el-icon>
          {{scope.row.title}}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="分类">
      <template #default="scope">
        <div style="display: flex;align-items: center;">
          <el-icon>
            <Timer />
          </el-icon>
          {{ scope.row.categoryName }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="作者">
      <template #default="scope">
        <div style="display: flex;align-items: center;">
          <el-icon>
            <Timer />
          </el-icon>
          {{ scope.row.authorName }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <div style="display: flex;align-items: center;">
          <el-button text type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button text type="success" v-if="scope.row.status===0||scope.row.status===2" @click="updatestatus(scope.row.id,1)">发布</el-button>
          <el-button text type="info" v-else @click="updatestatus(scope.row.id,2)">下线</el-button>
          <el-button text type="danger" @click="del(scope.row.id)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
   <div class="fenye" style="display: flex;justify-content: flex-end;">
    <el-pagination background layout="prev, pager, next" 
    v-model:current-page="pagesize.currentPage"
      v-model:page-size="pagesize.pageSize"
    :total="pagesize.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" /></div>
      <!-- 文章详情弹窗 -->
      <Articledialog :id="4" :modelValue="dialogVisible" @update:modelValue="newvalue=>dialogVisible=newvalue" :categorylist="categorylist" :currentarticle="currentarticle" v-if="dialogVisible" :search="search"></Articledialog>
</template>
<style scoped lang="less"></style>
