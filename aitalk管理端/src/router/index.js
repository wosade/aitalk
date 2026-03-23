import { createRouter, createWebHashHistory } from 'vue-router'
import BackendLayout from '../components/BackendLayout.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path:'/',
      component:BackendLayout,
      children:[
        {
          path:'/dashbord',
          component:()=>import('../views/dashboard.vue'),
          meta:{
            title:'数据分析',
            icon:'pieChart',
          }
        },
        {
          path:'/knowledge',
          component:()=>import('../views/knowledge.vue'),
          meta:{
            title:'知识文章',
            icon:'SetUp'
          }
        },
        {
          path: '/conslutations',
          component: () => import('../views/conslutations.vue'),
          meta: {
            title: '咨询记录',
            icon: 'SetUp'
          }
        },
        {
          path: '/emotional',
          component: () => import('../views/emotional.vue'),
          meta: {
            title: '情绪日志',
            icon: 'SetUp'
          }
        },
      ]
    },
    {
      path:'/login',
      component:()=>import('../views/login.vue'),
      meta:{
        title:'登录',
      },
    },
    {
      path:'/register',
      component:()=>import('../views/register.vue'),
      meta:{
        title:'注册',
      } 
    }
  ]
})
export default router