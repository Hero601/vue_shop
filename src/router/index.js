import Vue from 'vue'
import VueRouter from 'vue-router'

// import login from '../components/login.vue'
// import home from '../components/home.vue'
// import welcome from '../components/welcome.vue'

const login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
const home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const welcome = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

// import users from '../components/user/users.vue'
// import rights from '../components/power/rights.vue'
// import roles from '../components/power/roles.vue'

const users = () =>
  import(
    /* webpackChunkName: "users_rights_roles" */ '../components/user/users.vue'
  )
const rights = () =>
  import(
    /* webpackChunkName: "users_rights_roles" */ '../components/power/rights.vue'
  )
const roles = () =>
  import(
    /* webpackChunkName: "users_rights_roles" */ '../components/power/roles.vue'
  )

// import categories from '../components/goods/categories.vue'
// import goodsParams from '../components/goods/goodParams.vue'
// import goodsList from '../components/goods/goodsList.vue'

const categories = () =>
  import(
    /* webpackChunkName: "categories_goodsParams_goodsList" */ '../components/goods/categories.vue'
  )
const goodsParams = () =>
  import(
    /* webpackChunkName: "categories_goodsParams_goodsList" */ '../components/goods/goodParams.vue'
  )
const goodsList = () =>
  import(
    /* webpackChunkName: "categories_goodsParams_goodsList" */ '../components/goods/goodsList.vue'
  )

// import add from '../components/goods/add.vue'
// import order from '../components/order/order.vue'
// import report from '../components/report/report.vue'

const add = () =>
  import(/* webpackChunkName: "add_order_report" */ '../components/goods/add.vue')
const order = () =>
  import(/* webpackChunkName: "add_order_report" */ '../components/order/order.vue')
const report = () =>
  import(/* webpackChunkName: "add_order_report" */ '../components/report/report.vue')

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
        { path: '/orders', component: order },
        { path: '/reports', component: report }
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
