import request from "@/utils/request";
// 发送消息
export const startsession=(data)=>{
  return request.post('/psychological-chat/session/start',
  data)
}
// 获取聊天记录
export const getchatrecord=(params)=>{
  return request.get('/psychological-chat/sessions',
  {params})
}
// 删除会话
export const deletechatrecord=(sessionId)=>{
  return request.delete(`/psychological-chat/sessions/${sessionId}`)
}
//  获取聊天详情
export const getchatdetail=(sessionId)=>{
  return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
// 发送后续消息 (参考你的流式接口截图)
export const sendChatMessage = (data) => {
  return request.post('/psychological-chat/stream', data)
}
// 获取情绪花园
export const getemotiongarden=(sessionId)=>{
  return request.get(`/psychological-chat/session/${sessionId}/emotion` )
}
// 提交情绪日记
export const submitemotiondiary=(data)=>{ 
  return request.post('/emotion-diary',
  data)
}
// 获取知识文章列表
export const getknowledgearticle=(params)=>{
  return request.get('/knowledge/article/page',
  {params})
}
// 获取知识文章详情
export const getknowledgearticledetail=(id)=>{ 
  return request.get(`/knowledge/article/${id}`)
}


