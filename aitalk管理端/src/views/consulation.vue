<script setup>
import Panelhead from '@/components/panelhead.vue';
import { onMounted, reactive, ref } from 'vue';
import { getconslutations,getmessages} from '@/api';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
onMounted(()=>{
  // 获取咨询记录
  search()
})
// 分页参数 
const pagesize=reactive({
  currentPage:1,
  size:5,
  emotionTag:'',
  total:0
})
const tableData=ref([])
// 弹窗是否显示
const modelValue=ref(true)
// modelValue
const currentarticle=ref({})
// 会话消息列表
const messagesList=ref([])
// 渲染列表
const search=()=>{
  getconslutations(pagesize).then(res=>{
    console.log(res);
    tableData.value=res.data.records
    pagesize.total=res.data.total
  })
}
// 分页组件的函数
const handleCurrentChange = (val) => {
  pagesize.currentPage = val
  search()
}
const handleSizeChange = (val) => {
  pagesize.pageSize = val
  search()
}
const dialogvisble=ref(false)
// 弹窗数据
const dialogData=ref({})
// 查看详情
const edit=(row)=>{
  dialogvisble.value=true
  dialogData.value=row
  console.log(row);
  // 获取会话消息列表
  getmessages(row.id).then(res=>{
    console.log(res);
    messagesList.value=res.data
  })
}
</script>
<template>
  <Panelhead title="咨询记录"></Panelhead>
  <el-table :data="tableData">
    <el-table-column label="会话id" width="100">
      <template #default="scope">
        {{scope.row.userId}}
      </template>
    </el-table-column>
    <el-table-column label="内容">
      <template #default="scope">
        {{scope.row.sessionTitle}}
        {{ scope.row.lastMessageContent
        }}
      </template>
    </el-table-column>
    <el-table-column width="200"  label="咨询时间">
      <template #default ="scope">
        {{scope.row.startedAt }}</template>
    </el-table-column>
    <el-table-column label="消息数" width="100">
      <template #default="scope">
        {{scope.row.messageCount }}
      </template>
    </el-table-column>
    <el-table-column width="100">
      <template #default="scope">
        <el-button type="primary" size="small" @click="edit(scope.row)">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <div class="fenye" style="display: flex;justify-content: flex-end;">
    <el-pagination background layout="prev, pager, next" v-model:current-page="pagesize.currentPage"
      v-model:page-size="pagesize.size" :total="pagesize.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
      <!-- 弹窗 -->
       <el-dialog v-model="dialogvisble">
        <div class="session-detail">
          <div class="detail-header">
            <div class="detail-label">
              用户：
            </div>
            <div class="detail-value">
              {{dialogData.userNickname}}
            </div>
          <div class="detail-row">
            <div class="detail-label">
              开始时间:
            </div>
            <div class="detail-value">
              {{dialogData.startedAt}}
            </div>
          </div>
        <div class="detail-row">
          <div class="detail-label">
            消息数:
          </div>
          <div class="detail-value">
            {{dialogData.messageCount}}
          </div>
        </div>
        </div>
        <div class="messages-container">
          <div class="messages-header">
            <h4>消息列表</h4>
          </div>
        <div class="messages-list">
          <div v-for="item in messagesList" :key="item.id" class="message-item">
            <div class="message-header">
              <div class="sender">
                {{ item.senderType  === 1 ? '用户' : 'AI' }}
              </div>
              <div class="time">{{ item.createdAt }}</div>
            </div>
            <div class="message-content">
              {{ item.content }}
            </div>
          </div>
          </div>
        </div>
        </div>
       </el-dialog>>
  </div>

</template>
<style scoped lang="less">
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.session-preview {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.session-detail {
  max-height: 70vh;
  overflow-y: auto;

  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    :last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-weight: 500;
      color: #495057;
      min-width: 80px;
      margin-right: 8px;
    }

    .detail-value {
      color: #333;
    }
  }
}

.messages-container {
  margin-top: 20px;

  .messages-header {
    margin-bottom: 16px;

    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .messages-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;

    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;

      :last-child {
        margin-bottom: 0;
      }

      &.user-message {
        background: #e8f4fd;
      }

      &.ai-message {
        background: #f0f9f0;
      }
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .sender {
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }

      .message-content {
        color: #333;
        line-height: 1.6;
        white-space: pre-wrap;
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
}
</style>
