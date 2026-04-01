<script setup>
import { ref } from 'vue'
import robot from '@/assets/robot-fill.png' 
import { ElMessage } from 'element-plus'
import { register } from '@/api'
import { useRouter } from 'vue-router'
const form = ref({
  "username": '2908487619',
  "email": 'jhj@qq.com',
  "phone": '18171963289',
  "password": '123',
  "nickname": 'jhj',
  "confirmPassword": '123',
  "userType":2,
  "gender": 1,
})
const router=useRouter()
const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
})
const submitForm = async (formel) => {
  if(!formel)return 
  await formel.validate()
    register(form.value).then(res=>{
      if(res.code==='200'){
        ElMessage.success('注册成功')
        router.push('/login')
      }
      else{
        ElMessage.error(res.data.msg)
      }
    })
  } 
const formRef = ref(null)
</script>
<template>
  <div class="registercontainer">
    <div class="left-panel">
      <div class="content-wrapper">
        <h1>心理AI助手</h1>
        <p>每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
        <div class="robot-icon">
          <div class="img">
          <img :src="robot" alt="Robot"></div>
        </div>
      </div>
    </div>

  <div class="container flex-box right-panel">
    <div class="title">
      <div class="title-text">
      <h2>创建您的账户</h2>
      <p>请填写注册信息</p>
      </div>
    </div>
  
  <div class="form-container" style="padding-bottom: 40px;">
    <el-form label-position="top" :model="form" :rules="rules" ref="formRef" label-width="120px" >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item> 
        <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-button class="btn" type="primary" @click="submitForm(formRef)">注册</el-button>
    </el-form>
    </div>
  </div>
  </div>
</template>
<style scoped lang="less">
  .registercontainer {
    display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
  .left-panel {
      flex: 1;
      background-color: #5d8271;
      /* 还原图中的墨绿色 */
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      padding: 0 40px;
    }
  
    .content-wrapper h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      letter-spacing: 2px;
    }
  
    .content-wrapper p {
      font-size: 1.1rem;
      line-height: 1.8;
      max-width: 400px;
      opacity: 0.9;
    }
  
    .robot-icon {
      margin-top: 40px;
        /* 半透明白色背景 */
        .img{
          width: 150px;
          height: 150px;
          padding: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          border: 1px solid #e0d7d7;
        }
    }
    .robot-icon img {
      width: 120px;
      /* 根据实际图标大小调整 */
    }
.right-panel {
      flex: 1;
      background-color: #fff;
      padding: 40px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
.container {
  width: 384px;

  .flex-box {
    display: flex;
    align-items: center;
  }

  .title {
    .title-text {
      text-align: center;

      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }

  .form-container {
    margin-top: 30px;

    .btn {
      width: 100%;
    }

    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
  }
</style>