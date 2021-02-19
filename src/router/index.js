import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 默认跳转到登录页面
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users }
      ]
    }
  ]
})

router.beforeEach((to, form, next) => {
  // 如果访问的是登录页面，放行
  if (to.path === '/login') return next()
  // 获取token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token，跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
