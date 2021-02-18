import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import welcome from '../views/welcome.vue'
import users from '../views/users/users.vue'
import rights from '../views/power/rights.vue'
import roles from '../views/power/roles.vue'

Vue.use(VueRouter)

const routes = [
  // 路由重定向，当访问 localhost 8080 默认访问login
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  // 为 home 路由新增子路由，并且在访问 home 路由时自动跳转到欢迎页面
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是 login 页面，直接通过
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  // 如果token为空（未登录）
  if (!token) return next('/login')
  // 已登录
  next()
})

export default router
