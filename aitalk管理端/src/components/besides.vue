<script setup>
import { useRouter } from 'vue-router';
  const router=useRouter()  
  // 拿到侧边栏路由
  const routes=router.options.routes[0].children;
  // 点击侧边栏路由跳转
  const selectmenu=(item)=>{
    router.push(item.path);
  }
</script>
  <template>
    <div class="besides">
      <div class="besidestop">
        <el-image style="width:50px;height:50px" src="/src//assets/机器人.png"></el-image>
        <div class="text">
          <div class="text1">心理智能AI助手</div>
          <div class="text2">陪伴你的心理健康</div>
        </div>
      </div>
        <el-menu default-active="2" class="el-menu">
          <el-menu-item v-for="item in routes" :key="item.path" :index="item.path" class="el-menu-item" @click="selectmenu(item)">
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