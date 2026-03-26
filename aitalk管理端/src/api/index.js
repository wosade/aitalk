import request from '@/utils/request'
export const login=(data)=>{
  return request.post('/user/login',
data)
}
// 获取分类接口
export const getcategory=(params)=>{
  return request.get('/knowledge/category/tree',
  {params})
}
// 获取知识文章列表
export const getarticle=(params)=>{
  return request.get('/knowledge/article/page',
  {params})
}
// 获取知识文章详情
export const  getarticleDetail=(params)=>{
  return request.get(`/knowledge/article/${params.id}`,params)}
// 上传文件
export const upload = (file, businessId)=>{
  const formdata=new FormData()
  formdata.append('file',file)
  formdata.append('businessField','cover')
  formdata.append('businessType','ARTICLE')
  formdata.append('businessId',businessId)
  return request.post('/file/upload',
  formdata)
}
// 新增知识文章
export const addarticle=(data)=>{
  return request.post('/knowledge/article',
  data)
}
// 注册接口
export const register=(data)=>{ 
  return request.post('/user/add', { username: '486253', password: '123456', email: '486253@qq.com', confirmPassword:'123456',gender:'1',userType:2})
}
// 更新知识文章
export const updatearticle=(data,id)=>{
  return request.put(`/knowledge/article/${id}`,data)
}
// 更新文章状态
export const updatearticleStatus=(id,status)=>{
  return request.put(`/knowledge/article/${id}/status`,{'status':status })
}
// 获取咨询记录
export const getconslutations=(params)=>{
  return request.get('/psychological-chat/sessions',
  {params})
}
// 删除知识文章
export const deletearticle=(id)=>{
  return request.delete(`/knowledge/article/${id}`)
  }
  // 获取会话消息列表
  export const getmessages=(id)=>{
    return request.get(`/psychological-chat/sessions/${id}/messages`,
      {sessionId:id})
  }
  // 获取情绪日记
  export const getmooddiary=(params)=>{  
    return request.get('/emotion-diary/admin/page',{params})}