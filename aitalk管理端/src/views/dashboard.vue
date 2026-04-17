<script setup>
import { getanalysis } from '@/api/index'
import { ref, onMounted, nextTick } from 'vue'
import iconUrl1 from '@/assets/users.png'
import iconUrl2 from '@/assets/like.png'
import iconUrl3 from '@/assets/comments.png'
import iconUrl4 from  '@/assets/smile.png'
// 引入所有echarts组件
import * as echarts from 'echarts/core'
// 分析数据
const analysis = ref({})
onMounted(() => {
  getanalysis().then(res => {
    analysis.value = res.data
    nextTick(()=>{
      initEmotionChart()
      initConsultationChart()
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize)
    })
  })
})
// 定义 resize 处理函数
const handleResize = () => {
  if (emotionChart) {
    emotionChart.resize()
  }
  if (consultationChart) {
    consultationChart.resize()
  }
}
// 情绪趋势图表
let emotionChart=null
// 获取情绪趋势 dom
const emotionChartRef=ref(null)
// 创建图表
const initEmotionChart=()=>{
  if(!emotionChartRef.value){
    return
  }
  // 销毁已经有的图标
  if(emotionChart){
    emotionChart.dispose()
  }
    emotionChart=echarts.init(emotionChartRef.value)
    const option={
      // 图表标题
      title:{
        text:'情绪趋势分析',
        textStyle:{
          color:'black',
          fontSize:16
        },
        left:'center',
        top:0
      },
      // 提示框
      tooltip:{
        trigger:'axis',
        borderColor:'#fab1a0',
        borderWidth:1,
        textStyle:{
          color:'#2d3436'
        }
      },
      // 图例
      legend:{
        data:['平均情绪评分','记录数量'],
        top:40
      },
      // 图表轴
      xAxis:{
        // 分类轴
        type:'category',
        axisLabel: {
          interval: 5,
          rotate: 0, // 如果不挤了，可以把旋转角度改回 0，更整齐
          margin: 15  // 调大文字和轴线之间的距离，视觉上更空旷
        },
        data:analysis.value.emotionTrend.map(item=>item.date),
        axisline:{
          lineStyle:{
            color:'#dfe6e9'
          }
        }
      },
      yAxis:[{
        // 数值轴
        type:'value',
        position:'left',
        name:'平均情绪评分',
        axisline:{
          lineStyle:{
            color:'black'
          }
        },
      },
        {
          // 数值轴
          type: 'value',
          position:'right',
          name: '记录数量',
          axisline: {
            lineStyle: {
              color: 'black'
            }
          },
        }
    ],
      series: [
        {
          name: '平均情绪评分',
          type: 'line',
          smooth: true,
          data: analysis.value.emotionTrend.map(item => item.avgMoodScore),
          itemStyle: { color: '#667eea' }
        },
        {
          name: '记录数量',
          type: 'bar',
          yAxisIndex: 1, // 使用右侧 Y 轴
          data: analysis.value.emotionTrend.map(item => item.recordCount),
          itemStyle: { color: '#fab1a0' }
        }
      ],
      // 控制容器
      grid: {         
        top: 100, // 增加顶部间距
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      }
    }
emotionChart.setOption(option)
}
// 咨询会话统计图表
let consultationChart=null
const consultationChartRef=ref(null)
const initConsultationChart=()=>{
  if(!consultationChartRef.value){
    return
  }
  // 销毁已经有的图标
  if(consultationChart){
    consultationChart.dispose()
  }
    consultationChart=echarts.init(consultationChartRef.value)
    const dailyTrend=analysis.value.consultationStats.dailyTrend
    const option = {
    title: {
      text: '咨询活动统计',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['会话数量', '参与用户数'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dailyTrend.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '会话数量',
        type: 'bar',
        data: dailyTrend.map(item => item.sessionCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#74b9ff' },
              { offset: 1, color: '#0984e3' }
            ]
          }
        },
        barWidth: '40%'
      },
      {
        name: '参与用户数',
        type: 'bar',
        data: dailyTrend.map(item => item.userCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#fdcb6e' },
              { offset: 1, color: '#f39c12' }
            ]
          }
        },
        barWidth: '40%'
      }
    ]
  }
  consultationChart.setOption(option)
}
</script>
<template>
  <!-- 头部 -->
  <div class="dashboard-container" v-if="analysis.systemOverview">
    <el-row :gutter="24" >
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar users">
              <el-image style="width: 40px; height: 40px;" :src="iconUrl1" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ analysis.systemOverview.totalUsers }}</p>
              <p class="subtitle-title">活跃用户:{{ analysis.systemOverview.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar like">
              <el-image style="width: 40px; height: 40px;" :src="iconUrl2" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ analysis.systemOverview.totalDiaries }}</p>
              <p class="subtitle-title">今日新增:{{ analysis.systemOverview.todayNewDiaries }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar comments">
              <el-image style="width: 40px; height: 40px;" :src="iconUrl3" />
            </div>
            <div class="info">
              <p class="title">咨询对话</p>
              <p class="number">{{ analysis.systemOverview.totalSessions }}</p>
              <p class="subtitle-title">今日新增:{{ analysis.systemOverview.todayNewSessions }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar smile">
              <el-image style="width: 40px; height: 40px;" :src="iconUrl4" />
            </div>
            <div class="info">
              <p class="title">平均心情</p>
              <p class="number">{{ analysis.systemOverview.avgMoodScore}}</p>
              <p class="subtitle-title">用户新增:{{ analysis.systemOverview.todayNewUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  <!-- 图表 -->
  <el-row style="margin-top: 20px;" :gutter="20">
    <el-col :span="12">
      <el-card style="width:100%;height: 400px;">
        <template #header>
          <div class="123">
            情绪趋势分析
          </div>
        </template>
        <div ref="emotionChartRef" class="chart-content" style="height: 300px;"></div>
      </el-card>
      </el-col>
       <el-col :span="12">
          <el-card style="width:100%;height: 400px;">
            <template #header>咨询会话统计</template>
              <div class="chart-content">
                <div class="consultation-stats">
                  <div class="stat-item">
                    <div class="stat-label">总会话数</div>
                    <div class="stat-value">{{ analysis.consultationStats.totalSessions }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="title">平均时长</div>
                    <p class="number">{{ analysis.consultationStats.avgDurationMinutes }}</p>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">活跃用户</div>
                    <div class="stat-value">{{ analysis.systemOverview.activeUsers }}</div>
                  </div>
                </div>
              
              <div ref="consultationChartRef" class="chart-content" style="height: 200px;">
               </div> 
              </div>
          </el-card>
  
    </el-col>
  </el-row>
  </div>
</template>
<style scoped lang="less">
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;

    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #2b8287 100%);
      }

      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #218472 100%);
      }
    }

    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }

      .value {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px
      }

      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }
canvas {
      width: 100% !important;
      height: 100% !important;
    }
  .chart-content {
    position: relative;
    display: flex;
    flex-direction: column;
    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>