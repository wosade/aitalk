import { createRouter, createWebHashHistory } from 'vue-router'
import BackendLayout from '../components/BackendLayout.vue'

const backrouter = [
  {
    path: '/back',
    redirect: '/back/dashbord',
    component: BackendLayout,
    children: [
      {
        path: 'dashbord',
        component: () => import('../views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'pieChart',
        },
      },
      {
        path: 'knowledge',
        component: () => import('../views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'SetUp',
        },
      },
      {
        path: 'conslutations',
        component: () => import('../views/consulation.vue'),
        meta: {
          title: '咨询记录',
          icon: 'SetUp',
        },
      },
      {
        path: 'emotional',
        component: () => import('../views/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'SetUp',
        },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('../views/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/register',
    component: () => import('../views/register.vue'),
    meta: {
      title: '注册',
    },
  },
]

const frontrouter = [
  {
    path: '/',
    component: () => import('@/components/fontlayout.vue'),
    meta: {
      title: '首页',
    },
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('../views/home.vue'),
        meta: {
          title: '首页',
          icon: 'pieChart',
        },
      },
      {
        path: 'consulation',
        component: () => import('../views/frontconsulation.vue'),
        meta: {
          title: 'AI咨询',
        },
      },
      {
        path: 'emotion-diary',
        component: () => import('../views/emotionDiary.vue'),
        meta: {
          title: '情绪日记',
        },
      },
      {
        path: 'knowledge',
        component: () => import('../views/frontKnowledge.vue'),
        meta: {
          title: '知识文章',
        },
      },
      {
        path: 'articledetail',
        component: () => import('../views/frontKnowledgeDetail.vue'),
        meta: {
          title: '知识文章详情',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...backrouter, ...frontrouter],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (
    to.path === '/login' ||
    to.path === '/register' ||
    to.path === '/' ||
    to.path === '/home' ||
    to.path === '/knowledge' ||
    to.path === '/articledetail'
  ) {
    return next()
  }

  if (!token) {
    return next('/login')
  }

  const userinfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  if (userinfo.userType === 2) {
    if (!to.path.startsWith('/back')) {
      return next('/back/dashbord')
    }
    next()
  } else if (userinfo.userType === 1) {
    if (to.path.startsWith('/back')) {
      alert('权限不足，无法进入后台')
      return next('/')
    }
    next()
  } else {
    next('/login')
  }
})

export default router
