import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import categories from '../components/goods/categories.vue'
import goodsParams from '../components/goods/goodParams.vue'
import goodsList from '../components/goods/goodsList.vue'
import add from '../components/goods/add.vue'
import order from '../components/order/order.vue'

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
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/categories', component: categories },
        { path: '/params', component: goodsParams },
        { path: '/goods', component: goodsList },
        { path: '/goods/add', component: add },
        { path: '/orders', component: order }
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
