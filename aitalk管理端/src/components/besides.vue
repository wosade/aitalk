<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
// 后台布局子路由（不依赖 routes 数组顺序）
const routes = computed(() => {
  const back = router.options.routes.find((r) => r.path === '/back')
  return back?.children || []
})
const selectmenu = (item) => {
  router.push(`/back/${item.path}`)
}
const imgUrl = new URL(`../assets/机器人.png`, import.meta.url).href
</script>
  <template>
    <div class="besides">
      <div class="besidestop">
        <el-image style="width:50px;height:50px" :src="imgUrl"></el-image>
        <div class="text">
          <div class="text1">心理智能AI助手</div>
          <div class="text2">陪伴你的心理健康</div>
        </div>
      </div>
        <el-menu default-active="2" class="el-menu">
          <el-menu-item v-for="item in routes" :key="item.path" :index="`/back/${item.path}`" class="el-menu-item" @click="selectmenu(item)">
            <!-- vue3动态组件 通过传入组件名称可以实现组件动态渲染 -->
            <el-icon><component :is="item.meta.icon" /></el-icon>
            {{item.meta.title}}
          </el-menu-item>
        </el-menu>
      </div>
  </template> 
  <style scoped lang="less">
.besides{
  border: 2px solid #e5e5e5;
  height: 100vh;
  background-color:#fff;
  .besidestop{
    display: flex;
    align-items: center;
    justify-content: center;
    padding:10px;
    .text{
      height: 50px;
      .text2{
        font-size: 12px;
        color:#6b7280
      }
    }
  }
  .el-menu{
    border: 0px;
    .el-menu-item{
      width: 100%;
    }
  }
}
  </style>