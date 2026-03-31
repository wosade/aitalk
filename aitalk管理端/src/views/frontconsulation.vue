<script setup>
import iconurl from '@/assets/robot-fill.png'
import iconurl1 from '@/assets/like.png'
import iconurl2 from '@/assets/users.png'
import { handleError, onMounted, reactive, ref } from 'vue';
import { startsession, getchatrecord, deletechatrecord, getchatdetail, sendChatMessage,getemotiongarden } from '@/api/font';
import { ElMessage } from 'element-plus';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
// 流式接口
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { env } from 'echarts';
// 聊天控制器
let chatController = null;
const createnewsession = () => {
  // 1. 如果有正在进行的 AI 请求，直接掐断
  if (chatController) {
    chatController.abort();
    chatController = null; // 重置控制器
  }
  // 2. 强制重置状态，防止 UI 锁定
  isTyping.value = false;
  inputMessage.value = '';
  // 3. 清空对话列表
  message.value = [];
  // 4. 创建新会话对象
  const newSession = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',
    sessionTitle: '新对话',
  }
  currentSession.value = newSession;
}
onMounted(() => {
  createnewsession()
  getsessionpage()
  
})
// 聊天记录参数
const pageParams = reactive({
  pageNum: '1',
  pageSize: '10'
})
// 会话列表
const sessionList = ref([])
// 获取聊天记录
const getsessionpage = () => {
  getchatrecord(
    pageParams
  ).then(res => {
    if (res.code === '200') {
      console.log(res.data);

      sessionList.value = res.data.records
      if (res.data.total === 0) {
        createnewsession()
      }
    }
    else {
      ElMessage.error(res.data.msg)
    }
  })
}
// AI是否正在输入
const isTyping = ref(false)
// 当前对话对象
const currentSession = ref(null)
// 消息输入框
const inputMessage = ref('')
// 新对话
const handlenewsession = () => {
  if (inputMessage.value.trim() === '') {
    return
  }
  if (isTyping.value) {
    ElMessage.error('AI助手正在发送请稍后')
    return
  }
  const curentmessage = inputMessage.value.trim()
  inputMessage.value = ''
  // 如果没有对话或者是临时对话则创建一个新对话
  if (currentSession.value.status === 'TEMP') {
    createnewsession(curentmessage)
  }
  startnewsession(curentmessage)
}
// 开始新会话
const startnewsession = (curentmessage) => {
  
  // 构建会话参数
  const sessionParams = {
    initialMessage: curentmessage,
    sessionTitle: ''
  }
  // 如果是新会话
  if (currentSession.value.sessionTitle === '新对话') {
    sessionParams.sessionTitle = `'宁渡AI助手'-${new Date().toLocaleString()}` 
    startsession(sessionParams).then(res => {
    if (res.code === '200') {
      console.log(res, currentSession.value);
      ElMessage.success('会话创建成功')
      // 更新当前会话状态
      const sessionData = {
        sessionId: res.data.sessionId,
        status: res.data.status,
        sessionTitle: sessionParams.sessionTitle,
      }
      // 如果是临时对话
      if (currentSession.value && currentSession.value.status === 'TEMP') {
        // 更新为正式对话
        currentSession.value = sessionData
      }
    }
    else {
      ElMessage.error(res.data.msg)
    }
    // 刷新会话列表
    getsessionpage()
    // 添加用户初始信息
    message.value.push({
      id: Date.now(),
      senderType: 1,
      content: curentmessage,
      creatAt: new Date().toLocaleString(),
    })
    console.log(currentSession.value);
    // ai流式对话
    startairesponse(currentSession.value.sessionId, curentmessage)
    // 获取情感花园
    getemotionrecord()
  })
  } else {
    // 如果是历史对话
    sessionParams.sessionTitle = currentSession.value.sessionTitle
    // 刷新会话列表
    getsessionpage()
    // 添加用户初始信息
    message.value.push({
      id: Date.now(),
      senderType: 1,
      content: curentmessage,
      creatAt: new Date().toLocaleString(),
    })
    console.log(currentSession.value);
    // ai流式对话
    startairesponse(currentSession.value.sessionId, curentmessage)
    getemotionrecord()
  }
 
}
// ai流式对话
const startairesponse = (sessionId, currentMessage) => {
  // 防抖
  if (isTyping.value) {
    ElMessage.error('AI助手正在发送请稍后')
    return
  }
  isTyping.value = true
  const aiMessage = {
    // ai唯一标识
    id: `ai_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    senderType: 2,
    content: '',
    creatAt: new Date().toLocaleString(),
  }
  message.value.push(aiMessage)
  const ctrl = new AbortController()
  // 调用流式接口
  fetchEventSource(`/api/psychological-chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('token'),
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify({
      sessionId,
      'userMessage': currentMessage
    }),
    signal: ctrl.signal,
    onopen: (response) => {
      isTyping.value = false
      if (response.headers.get('content-type') !== 'text/event-stream') {
        {
          ElMessage.error('AI助手发送失败')
          ctrl.abort()
          return
        }
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim()
      if (!raw) return
      const eventname = event.event
      // 当前AI消息
      const aimessage = message.value[message.value.length - 1]
      if (eventname === 'done') {
        isTyping.value = false
        ctrl.abort()
        return
      }
      const payload = JSON.parse(raw)
      const ok = String(payload.code) === '200'
      if (ok && payload.data && payload.data.content) {
        aimessage.content += payload.data.content
      } else if (!ok) {
        handlerror(payload.message || 'AI助手发送失败')
      }
    },
    onerror: (err) => {
      handlerror(err.message || 'AI助手发送失败')
      return err
    },
    onclose: () => {
      isTyping.value = false
    }
  })
    .then(res => {
      console.log(res);
      // 处理流式数据
    })
}
// 错误处理函数
const handlerror = (error) => {
  const aimessage = message.value[message.value.length - 1]
  if (aimessage) {
    aimessage.content = 'AI回复失败，请重试'
  }
  isTyping.value = false
  ElMessage.error('AI回复失败')
}
const message = ref([])
// 点击会话
const handlesessionclick = (session) => {
  currentSession.value = session

  getchatdetail(session.id).then(res => {
    if (res.code === '200') {
      message.value = res.data
    }
    else {
      ElMessage.error(res.data.msg)
    }
  })
  // 更新当前会话对象数据
  const sessiondata = {
    sessionId: "session_" + session.id,
    status: 'ACTIVE',
    sessionTitle: session.sessionTitle,
  }
  currentSession.value = sessiondata
  // 获取情绪记录
  getemotionrecord()
}
// 是否在删除
const  deleting=ref(false)
// 删除会话
const handledeletesession = (sessionId) => {
  deleting.value=true
  deletechatrecord(sessionId).then(res => {
    if (res.code === '200') {
      getsessionpage()
      ElMessage.success('会话删除成功')
      deleting.value=false
    }
    else {
      ElMessage.error(res.data.msg)
    }
  })
}
// 处理换行逻辑
const formmatemessagecontent = (content) => {
  return content.replace(/\n/g, '<br>')
}
// 情绪花园
const currentemotion=ref({
  primaryEmotion:'中性',
  emotionScore:50,
  isNegative:false,
  riskLevel:0,
  suggestion:'',
})
// 获取情绪记录
const getemotionrecord=()=>{
  getemotiongarden(currentSession.value.sessionId).then(res => {
    if (res.code === '200') {
      console.log(res.data);
      currentemotion.value = res.data
    }
    else {
      ElMessage.error(res.data.msg)
    }
  })
}
// 获取情绪强度类名
const getintensityclass=(score)=>{
  if(score>=61){
    return 3
  }
  else if(score>=31){
    return 2
  }
  return 1
}
// 获取情绪强度文本
const getintensitytext=(level)=>{
  if(level===0){
    return '正常'
  }
  else if(level===1){
    return '关注'
  }
  else if(level===2){
    return '预警'
  }
  else if(level===3){
    return '危机'
  }
  else{
    return '正常'
  }
}
</script>
<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="iconurl" style="width: 25px; height: 25px;" alt="AI助手图标" />
        </div>
        <h3 class="assistant-name">AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>
      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">
            情绪花园
          </div>
        </div>
          <div class="emotion-info">
             <div class="emotion-name">{{ currentemotion.primaryEmotion }}</div>
             <div class="emotion-score">{{ currentemotion.emotionScore }}</div>
          </div>
          <div class="warm-tips">
            <div class="emotion-status-text">
              <span class="status-label">今天感觉</span>
              <span class="status-emotion">{{currentemotion.isNegative?'需要关注':'很不错'}}</span>
            </div>
            <div class="emotion-intensity">
              <div class="intensity-dots">
                <span v-for="dot in 3" :key="dot" class="dot" :class="{'active':getintensityclass(currentemotion.emotionScore)>=dot}"></span>
              </div>
              <div class="intensity-text">
                {{  getintensitytext(currentemotion.riskLevel) }}
              </div>
            </div>
            <!-- 建议卡片 -->
             <div class="warm-suggestion">
              <div class="suggestion-icon">💝</div>
              <div class="suggestion-content">
                <div class="suggestion-title">
                  给你的小建议
                </div>
                <div class="suggestion-text"></div>
                {{ currentemotion.suggestion }}
              </div>
             </div>
             <!-- 治愈卡片 -->
              <div class="healing-actions">
                <div class="actions-title">
                  治愈小行动
                </div>
                <div class="actions-list">
                  <div v-for="action in currentemotion.improvementSuggestions" :key="action" class="action-item">
                    <div class="action-icon">
                      ✨
                    </div>
                    <div class="action-text">
                      {{ action }}
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
      <!-- 会话列表区域 -->
      <div class="session-history">
        <div class="section-title">
          会话列表
        </div>
        <div class="session-list">
          <div v-for="item in sessionList" :key="item.id" class="session-item" @click="handlesessionclick(item)"">
              <div class=" session-info">
            <div class="session-title">
              {{ item.sessionTitle }}
              <div class="session-meta">
                {{ item.startedAt }}
              </div>
              <div class="session-preview">
                {{ item.lastMessageContent || 0 }}
              </div>
              <div class="session-stats">
                <span>
                  <el-icon>
                    <ChatRound></ChatRound>
                  </el-icon>
                  {{ item.
                    messageCount || 0 }}</span>
                <span>
                  <el-icon>
                    <Clock />
                  </el-icon>
                  {{ sessionList?.durationMinutes || 0 }}
                </span>
              </div>
            </div>
            <div class="session-actions">
              <el-button text @click="handledeletesession(item.id)" :disabled="deleting" type="danger" size="small">
                <el-icon>
                  <DeleteFilled />
                </el-icon>
              </el-button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  <div class="chat-main">
    <div class="chat-header">
      <div class="header-left">
        <div class="chat-avatar">
          <el-image :src="iconurl1" style="width: 40px; height: 40px;" alt="AI助手图标" />
        </div>
        <div class="chat-info">
          <h2>宁渡AI助手</h2>
          <p>您贴心的AI心理健康助手</p>
        </div>
      </div>
      <el-button circle @click="createnewsession" :disabled="isTyping" title="创建新会话">+</el-button>
    </div>
    <!-- 聊天内容 -->
    <div class="chat-messages">
      <!-- 欢迎用语 -->
      <div class="message-item ai-message" v-if="message?.length === 0">
        <div class="message-avatar">
          <el-image :src="iconurl" style="width: 18px; height: 18px;" alt="AI助手图标" />
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <p>您好！我是小暖。您的AI助手，我可以为您提供心理健康相关的建议和帮助，今天您感觉怎么样有什么要告诉我吗？</p>
          </div>
          <div class="message-time">刚刚</div>
        </div>
      </div>
      <!-- 消息列表 -->
      <div v-for="msg in message" :key="msg.id" :class="msg.senderType === 2 ? 'ai-message' : 'user-message'"
        class="message-item">
        <div class="message-avatar" style="display: flex;">
          <el-image v-if="msg.senderType === 1" style="width: 18px; height: 18px;" :src="iconurl2" alt="用户图标" />
          <el-image v-else :src="iconurl" style="width: 18px; height: 18px;" alt="AI助手图标" />
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <div v-if="msg.senderType === 2 && isTyping && !msg.content" class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
            <!-- ai错误提示 -->
            <div v-else-if="msg.isError" class="error-message ai-message">
              <p>{{ msg.content }}</p>
            </div>
            <!-- ai正常回复 -->
            <MarkdownRenderer v-else-if="msg.senderType === 2 && !msg.isError" :content="msg.content" :is-ai="true">
            </MarkdownRenderer>
            <p v-else-if="msg.content" class="user-message" v-html="formmatemessagecontent(msg.content)"></p>
          </div>
          <div class="message-time">{{msg.createdAt }}
          </div>
        </div>
      </div>
    </div>
    <!-- 消息输入区域 -->
    <div class="chat-input">
      <div class="input-container">
        <el-input type="textarea" v-model="inputMessage" placeholder="请输入想分享的内容" :disabled="isTyping" :rows="3"
          class="message-input" clearable @keyup.enter="handlenewsession">

        </el-input>
        <div class="input-footer">
          <span>按enter发送，shift+enter换行</span>
          <span>{{ inputMessage.length }}/500</span>
        </div>
      </div>
      <el-button :disabled="inputMessage.trim() === '' || inputMessage.length > 500" class="send-btn"
        @click="handlenewsession">
        <el-icon>
          <Promotion />
        </el-icon>
      </el-button>
    </div>
  </div>
  </div>
</template>
<style scoped lang="less">
.consultation-container {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  gap: 20px;
  padding: 20px;

  .sidebar {
    width: 320px;

    .ai-assistant-info {
      margin-bottom: 20px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(251, 146, 60, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
        position: relative;
      }

      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #fb923c, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        background-clip: text;
        margin: 0 0 12px;
      }

      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #059669;
        font-size: 12px;
        font-weight: 600;

        .status-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
        }
      }
    }

    .session-history {
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      min-height: 250px;
      display: flex;
      flex-direction: column;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;

      }

      .session-list {
        overflow-y: auto;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;

        .session-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;

          &:hover {
            background: #f8f9ff;
            border-color: #e6f0ff;
          }

          &.active {
            background: #e6f0ff;
            border-color: #4096ff;
          }

          .session-info {
            flex: 1;

            .session-title {
              font-weight: 500;
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              .session-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
                font-size: 12px;
                color: #999;

                .session-time {
                  font-size: 12px;
                  color: #999;
                }
              }

              .session-preview {
                width: 200px;
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;

                span {
                  font-size: 12px;
                  color: #999;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }

            .session-actions {
              position: absolute;
              top: 6px;
              right: 8px;
            }
          }
        }

        .no-sessions-text {
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
    }

    .emotion-garden {
      background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      min-height: 300px;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
        
        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #8b4513;
        }
      }

      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
        color: #fff;

        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }

        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }

      .warm-tips {
        text-align: center;
        margin-bottom: 16px;

        .emotion-status-text {
          margin-bottom: 12px;

          .status-label {
            font-size: 14px;
            color: #8b7355;
            margin-right: 8px;
          }

          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 16px;
            display: inline-block;
          }
        }

        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          .intensity-dots {
            display: flex;
            gap: 4px;

            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;

              &.active {
                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }

          .intensity-text {
            font-size: 12px;
            color: #8b7355;
            font-weight: 500;
          }
        }

        .warm-suggestion {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);

          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .suggestion-content {
            text-align: left;
            flex: 1;

            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: #8b7355;
              margin-bottom: 6px;
            }

            .suggestion-text {
              font-size: 13px;
              color: #6b5b47;
              line-height: 1.5;
            }
          }
        }

        .healing-actions {
          margin-bottom: 16px;

          .actions-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #8b7355;
            margin-bottom: 16px;
          }

          .actions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .action-item {
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
              border-radius: 12px;
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
              text-align: left;

              .action-icon {
                font-size: 14px;
                color: #ffd700;
                flex-shrink: 0;
              }

              .action-text {
                font-size: 12px;
                color: #6b5b47;
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }

        .risk-notice {
          background: linear-gradient(135deg, #fff9e6, #ffeaa7);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 234, 167, 0.6);
          box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);

          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .notice-content {
            flex: 1;

            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: #d4840f;
              margin-bottom: 6px;
            }

            .notice-text {
              font-size: 13px;
              color: #b8740c;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }

  .chat-main {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(251, 146, 60, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;

    .chat-header {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;

      .header-left {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }

        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          p {
            font-size: 14px;
          }
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
      min-height: 0;
      max-height: calc(100vh - 200px);
      scrollbar-width: thin;
      scrollbar-color: rgba(251, 146, 60, 0.3) transparent;

      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }

        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #fb923c, #f59e0b);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
          }
        }

        &.user-message {
          .message-avatar {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
        }

        .message-content {
          max-width: 70%;

          .message-bubble {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            border: 1px solid rgba(251, 146, 60, 0.1);
            box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);

            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;

              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;

                &:nth-child(2) {
                  animation-delay: 0.2s;
                }

                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }

            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
              border: 1px solid #F87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991B1B;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }

          .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
      }
    }

    .chat-input {
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      padding: 20px 24px;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
      backdrop-filter: blur(10px);
      flex-shrink: 0;

      .input-container {
        flex: 1;
      }

      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #78716c;
        font-weight: 500;
      }

      .send-btn {
        height: 60px;
        width: 60px;
        border-radius: 16px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
        transition: all 0.3s ease;
      }

    }

  }
}
</style>