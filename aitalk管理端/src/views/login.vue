<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { login } from '../api';
import { useRouter } from 'vue-router';
const formdata=reactive({
  username:'',
  password:''
})
const router=useRouter()
const formref=ref(null)
const rules=ref({
  username:[{    
    required:true,
    message:'请输入用户名',
    trigger:'blur'
  }],
  password:[{
    required:true,
    message:'请输入密码',
    trigger:'blur'
  }]
})
// 登录表单
const submit=(formel)=>{
  if(!formel)return
  formel.validate((valid) => {
    if (valid) {
      login(formdata).then(res=>{
        if(res.code==='200'){
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('userInfo',JSON.stringify(res.data.userInfo)
        )
        ElMessage.success('登录成功')
        // 判断用户登录类型来决定跳转页面
        if(res.data.userInfo.userType===2){
        ; router.push('/back')}
        else {
          router.push('/')
        }
        }
        else {
          ElMessage.error(res.data.message);
        }
      })
      
    } else {
      ElMessage.error('请填写完整信息');
    }
  });
}
// 注册表单
</script>
<template>
  <div class="outer">
  <div class="content">
    <p class="text">登录</p>
    <div class="form">
    <el-form :model="formdata" ref="formref" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formdata.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formdata.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <div class="button">
      <el-button type="primary" @click="submit(formref)">登录</el-button>
    </div>
    </el-form>
    <div class="footer">
      <p>还没账户？<router-link to="/register">去注册</router-link></p>
    </div>
  </div>
  </div>
  </div>
</template>
<style scoped lang="less">

/* 让页面背景不再是死白的，透出一点高级感 */
:deep(body) {
  margin: 0;
  background-color: #f0f2f5;
}

.outer {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 渐变背景，增加视觉深度 */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.content {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 30px 40px;
  /* 增加内边距，让内容有呼吸感 */
  width: 400px;
  /* 移除死板的 1px solid #ccc，改用柔和的投影 */
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    /* 鼠标悬停微动，增加交互感 */
  }

  .text {
    margin-top: 0;
    text-align: center;
    font-size: 26px;
    /* 标题加大 */
    font-weight: 600;
    color: #303133;
    margin-bottom: 30px;
    letter-spacing: 2px;
    /* 下划线装饰 */
    position: relative;
  }

  /* 优化表单内的输入框 */
  :deep(.el-form) {
    width: 100%;

    .el-form-item__label {
      font-weight: 500;
      color: #606266;
    }

    .el-input__wrapper {
      border-radius: 8px;
      /* 输入框更圆润 */
      padding: 5px 12px;
      box-shadow: 0 0 0 1px #dcdfe6 inset;

      &:hover {
        box-shadow: 0 0 0 1px #409eff inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px #409eff inset !important;
      }
    }
  }

  .button {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    /* 按钮左右分布 */
    gap: 15px;

    .el-button {
      flex: 1;
      /* 按钮等宽 */
      height: 42px;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s;

      &--primary {
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);

        &:hover {
          box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
        }
      }
    }
  }

  .footer {
    text-align: center;
    margin-top: 25px;
    font-size: 14px;
    color: #909399;

    a {
      color: #409eff;
      text-decoration: none;
      font-weight: 500;
      margin-left: 5px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>