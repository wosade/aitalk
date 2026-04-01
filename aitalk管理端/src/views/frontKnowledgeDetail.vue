<script setup>
import { onMounted, ref } from 'vue'
import { getknowledgearticledetail } from '@/api/font'
import { useRoute } from 'vue-router'
const route = useRoute()
const iconurl = new URL('@/assets/book.png', import.meta.url).href
const knowledgeDetail = ref({})
onMounted(() => {
  getknowledgearticledetail(route.query.id).then(res => {
    knowledgeDetail.value = res.data
  })
})
// 格式化文章内容
const formatContent = (content) => {
  if (!content) return ''

  // 基本的HTML清理和格式化
  let formatted = content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')

  return formatted
}
</script>
<template>
  <div class="articleDetail-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconurl" alt="文章封面" style="width: 100px; height: 100px; " />
        <h1>知识文章详情</h1>
      </div>
    </div>
    <div class="content">
      <div class="diary-card">
        <div class="title">文章信息</div>
        <div class="sub-title" v-if="knowledgeDetail.summary">
          <el-tag type="primary">{{ knowledgeDetail.categoryName }}</el-tag>
          <div class="flex-box" style="margin-left: 20px;">
            <el-icon>
              <List />
            </el-icon>
            <span>{{ knowledgeDetail.createdAt }}</span>
          </div>
        </div>
        <h1 class="article-title">{{ knowledgeDetail.title }}</h1>
        <div v-if="knowledgeDetail.summary" class="summary-content">
          {{ knowledgeDetail.summary }}
        </div>
        <div class="item flex-box" style="margin-top: 20px;">
          <div class="item flex-box">
            <el-icon>
              <Avatar />
            </el-icon>
            <span>{{ knowledgeDetail.authorName }}</span>
          </div>
          <div class="item flex-box">
            <el-icon>
              <Platform />
            </el-icon>
            <span>观看人数：{{ knowledgeDetail.watchCount || 0 }}</span>
          </div>
        </div>
      </div>
      <div class="diary-card">
        <div class="title">
          文章内容
        </div>
        <div class="content-wrapper" v-html="formatContent(knowledgeDetail.content)"></div>

        <div class="tags-content" v-if="knowledgeDetail.tagArray && knowledgeDetail.tagArray.length > 0">
          <div class="title">
            文章标签
          </div>
          <el-tag type="primary" style="margin-right: 5px;" v-for="tag in knowledgeDetail.tagArray" :key="tag">{{ tag
            }}</el-tag>
        </div>

      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.articleDetail-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);

  .flex-box {
    display: flex;
    align-items: center;

    .item {
      margin-right: 20px;

      span {
        margin-left: 5px;
      }
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
    margin: 0 auto;
    width: 980px;
    padding: 20px;

    .diary-card {
      margin-bottom: 20px;
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

      .title {
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: 600;
        color: #374151;
      }

      .sub-title {
        margin-top: 20px;
        display: flex;
        align-items: center;

        .category-tag {
          margin-right: 20px;
        }
      }

      .article-title {
        font-size: 28px;
        font-weight: bold;
        color: #111827;
        margin-top: 30px;
        margin-bottom: 10px;
      }

      .summary-content {
        background: rgba(126, 211, 33, 0.1);
        border-left: 4px solid #7ED321;
        padding: 10px 15px;
        border-radius: 0 8px 8px 0;
        position: relative;
      }

      .content-wrapper {
        font-size: 15px;
        color: #374151;

        :deep(p) {
          margin-bottom: 10px;
        }

        :deep(h1),
        :deep(h2),
        :deep(h3),
        :deep(h4),
        :deep(h5),
        :deep(h6) {
          margin: 15px 0 10px;
          color: #111827;
          font-weight: 600;
        }

        :deep(h2) {
          font-size: 15px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
        }

        :deep(h3) {
          font-size: 13px;
        }

        :deep(ul),
        :deep(ol) {
          padding-left: 15px;
          margin-bottom: 10px;
        }

        :deep(li) {
          margin-bottom: 5px;
        }
      }

      .tags-content {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #e5e7eb;

        .tags-title {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
      }
    }
  }
}
</style>