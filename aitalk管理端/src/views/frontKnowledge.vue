<script setup>
import { getknowledgearticle } from '@/api/font.js'
import { ref, onMounted, reactive } from 'vue'
import imgurl from '@/assets/book.png'
import { useRouter } from 'vue-router'
const router = useRouter()
// 推荐文章
const knowledgearticle = ref([])
// 左侧推荐文章参数
const recommendpagelist=reactive({
  sortField:'readCount',
  sortDirection:'desc',
  currentPage:1,
  size:5,
})
// 右侧文章列表参数
const pagelist=reactive({
  currentPage:1,
  size:5,
  total:0
})
// 右侧文章列表
const articlelist = ref([])
const getlist=(params)=>{
  getknowledgearticle(params).then(res => {
    if (res.code == 200) {
      pagelist.total=res.data.total
      articlelist.value=res.data.records
  }
})
}

onMounted(() => {
  getknowledgearticle(recommendpagelist).then(res => {
    if (res.code == 200) {
      knowledgearticle.value = res.data.records
    }
  })
 getlist(pagelist)
})
// 获取图片
const getimage=(url)=>{
  if(!url){
    return 'https://file.itndedu.com/psychology_ai.png'
  }
  if(url.startsWith('http')){
    return url
  }
  return 'http://159.75.169.224:1235'+url
}
// 分页组件的函数
const handleCurrentChange = (val) => {
  pagelist.currentPage = val
  getlist(pagelist)
}
const handleSizeChange = (val) => {
  pagelist.pageSize = val
  getlist(pagelist)
}
// 跳转详情页
const toDetail=(id)=>{
  router.push(`/articledetail?id=${id}`)
}
</script>
<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="imgurl" style="width: 40px; height: 40px;"></el-image>
        <h1>情绪日记</h1>
      </div>
    </div>
    <div class="content">
      <!-- 左侧菜单 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div class="recommend-list">
          <div v-for="item in knowledgearticle" :key="item.id" class="recommend-item" @click="toDetail(item.id)">
            <span class="section-title">{{item.title}}</span>
            <span class="read-count">
              <el-icon><View/></el-icon>
              阅读量：{{item.readCount}}</span>
          </div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="article-list">
        <div v-for="item in articlelist" :key="item.id" class="article-item" @click="toDetail(item.id)">
              <el-image :src="getimage(item.coverImage)"  style="width: 240px; height: 150px; border-radius: 8px;"></el-image>
              <div class="info">
                <div class="title">
                  <h3>{{item.title}}</h3>
                  <el-tag Plain type="primary">{{item.categoryName}}</el-tag>
                </div>
                <div style="margin-top: 10px;"></div>
                <div class="flex-box">
                  <el-icon><Avatar/></el-icon>
                  <span>{{item.authorName}}</span>
                </div>
                <div class="flex-box">
                  <el-icon><List/></el-icon>
                  <span>{{ item.createdAt }}</span>
                </div>
                <div class="flex-box" style="margin-top: 20px;">
              <el-icon>
                <Platform />
              </el-icon>
              <span>观看人数：{{ item.watchCount || 0 }}</span>
            </div>
              </div>
        </div>
      </div>
    </div>
     <div class="pagination-wrapper">
      <!-- 分页组件 -->
      <el-pagination background layout="prev, pager, next" v-model:current-page="pagelist.currentPage"
        v-model:page-size="pagelist.size" :total="pagelist.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
        </div>
  </div>
</template>
<style scoped lang="less">
.knowledge-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
  overflow: hidden;
  .flex-box {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }

  .header-section {
    background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
    color: white;
    padding: 48px;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .content {
  overflow: hidden;
    display: flex;
    gap: 20px;
    margin: 0 auto;
    padding: 20px;

    .recommend-section {
      width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      padding: 15px;
      height: 400px;

      .section-title {
        font-size: 12;
        font-weight: 600;
        color: #374151;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .recommend-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .recommend-item {
          border-left: 4px solid #f59e0b;
          padding-left: 10px;
          cursor: pointer;

          .read-count {
            margin-top: 15px;
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }

    .article-list {
      flex: 1;
      .article-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 15px;
        margin-bottom: 20px;
        display: flex;

        .info {
          margin-left: 20px;

          .title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
  }
}
</style>