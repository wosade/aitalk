<!-- 文章详情弹窗 -->
 <script setup> 
import { ref, reactive, onMounted, nextTick, computed,watch} from 'vue'
import { getarticleDetail,upload,addarticle,updatearticle } from '@/api/index'
import { ElInput,ElMessage } from 'element-plus'
import { baseURL } from '@/config/index'
import RichTextEditor from './RichTextEditor.vue'
const prop=defineProps({
// 0 新增 1 编辑
  check:Number,
  // 弹窗是否显示
  modelValue:Boolean,
  // 分类列表
  categorylist:Array,
  // 当前文章详情
  currentarticle:Object,
  // 渲染列表
  search:Function
})

// 子组件通知父组件进行值修改
const emit=defineEmits(['update:modelValue'])
// 弹窗详细值
const articledetail=reactive({
  title:'',
content:'',
coverImage:'',
categoryId:null,
summary:'',
tags:'',
id:''
})
// 图片地址
const imgurl=ref('')
// 监听当前文章变化
watch(() => prop.currentarticle, (newvalue) => {
  if (newvalue) {
    Object.assign(articledetail, newvalue)
    if (newvalue.coverImage) {
      imgurl.value = baseURL + newvalue.coverImage
    } else {
      imgurl.value = ''
    }
    console.log(articledetail);
    
  }
}, { immediate: true, deep: true }) // 重点是 immediate: true
// 标签数组
const tagsarr=ref([])
// 常用标签
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
const rules=reactive({
  title:[
    {required:true,message:'请输入文章标题',trigger:'blur'}
  ],
  content:[
    {required:true,message:'请输入文章内容',trigger:'blur'}
  ],
  summary:[
    {required:true,message:'请输入文章摘要(可选)',trigger:'blur',max:200}
  ],
  categoryId:[
    {required:true,message:'请选择文章分类',trigger:'change'}
  ],
  tags:[
    {required:true,message:'请选择文章标签',trigger:'change'}
  ],
  coverImage:[
    {required:true,message:'请上传文章封面',trigger: 'change' }
  ]
})

// 上传前的操作
const beforeUpload=(file)=>{
  // 判断文件类型 是否为img类型
  const img=file.type.startsWith('image/')
  // 提取文件大小 判断是否小于5MB
  const size=file.size/1024/1024<=5
  if(!img){
    ElMessage.error('请上传图片')
    return false
  }
  if(!size){
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return img
}
// 上传头像
const uploadAvatar=(file)=>{
  // 生成随机字符串 作为业务Id
  const businessId=crypto.randomUUID()
  upload(file.file,businessId).then(res=>{
    // 图片地址
    imgurl.value=baseURL+res.data.filePath
    articledetail.coverImage=res.data.filePath
    formref.value.validateField('coverImage')
  }).catch(err=>{
    ElMessage.error(err.message)
  })
}
// 提交文章内容
const handlecontent=(val)=>{
  articledetail.content=val.html
}
// 富文本编辑器实例
const editorRef=ref(null)
// 富文本编辑器创建时触发的函数
const handleEditorCreated=(editor)=>{
  editorRef.value=editor
  if(articledetail.content&&editorRef.value){
    // 防止编辑器未渲染完成 就直接赋值
    nextTick(()=>{
      editorRef.value.setHtml(articledetail.content)
    })
    
  }
}
// 提交表单
const formref=ref(null)
const submit=()=>{
  formref.value.validate((valid,error)=>{
    if(valid){
      if(prop.check===0 )addarticle(articledetail).then(res=>{
        console.log(res);
        if(res.code==="200"){ElMessage.success('添加成功')
        emit('update:modelValue', false),prop.search()}
      }).catch(err=>{
        ElMessage.error(err.message)
      })
      else{
        updatearticle(articledetail,articledetail.id).then(res=>{
          console.log(res);
          if(res.code==="200"){ElMessage.success('更新成功')
          emit('update:modelValue', false),prop.search()}
        }).catch(err=>{
          ElMessage.error(err.message)
        })
      }
      
    }
    else{
      ElMessage.error('请填写完整信息')
    }
  })
}
// 关闭弹窗前的操作
const beforeClose=()=>{
  formref.value?.clearValidate()
  Object.assign(articledetail, {
    title: '',
    content: '',
    coverImage: '',
    categoryId: null,
    summary: '',
    tags: '',
    id: ''
  })
  imgurl.value=''
  emit('update:modelValue', false)
}
</script>
<template>
  <el-dialog :before-close="beforeClose" :model-value="prop.modelValue">
    <el-form :model="articledetail" :rules="rules" ref="formref">
      <el-form-item label="文章" prop="title">
        <el-input v-model="articledetail.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="articledetail.categoryId" placeholder="请选择文章分类">
          <el-option v-for="item in prop.categorylist" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <el-input v-model="articledetail.summary" placeholder="请输入文章摘要(可选)" type="textarea" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select placeholder="选择标签" v-model="articledetail.tags">
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="上传头像" prop="coverImage">
        <!-- action 上传地址 -->
         <div class="inputimg">
        <el-upload :show-file-list="false"  class="avatar-uploader" :before-upload="beforeUpload" :http-request="uploadAvatar" accept="image/*">
          <div v-if="!imgurl" class="avatar-uploader">
            <p>+</p>
          </div class="inputimg">
          <img v-else :src="imgurl" class="avatar">
        </el-upload>
        <el-button type="danger" @click="imgurl=''" style="margin-top: 10px;" v-if="imgurl">撤销</el-button></div>
      </el-form-item>
      <el-form-item prop="content">
        <RichTextEditor v-model="articledetail.content" placeholder="请输入文章内容" @change="handlecontent" @created="handleEditorCreated" :maxCharCount="5000" min-height="400px"></RichTextEditor>
      </el-form-item>
    </el-form>
      <template #footer>
        <el-button type="primary" @click="beforeClose">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </template>
    
  </el-dialog>
</template>
<style lang="less" scoped>
.avatar-uploader{
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  background-color: #f5f7fa;
  border-radius: 10px;
  p{
    font-size: 20px;
  }
  .avatar{
    width: 100px;
      height: 100px;
  }
  .inputimg{
    display: block;
  }
}
</style>
