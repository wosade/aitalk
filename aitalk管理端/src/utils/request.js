import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
// 创建实例时配置默认值
const baseURL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}`
  : '/api'

const request = axios.create({
  baseURL: baseURL,
  timeout: 5000
});
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token=localStorage.getItem('token')
  if(token){
    config.headers['token']=token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  const {data,config}=response
  if(data.code==='200'){
    return data
  }else{
    
  }
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default request