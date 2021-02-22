import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font_t2plubdjwe9/iconfont.css'
import './assets/font_mydjawqhlo/iconfont.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */)

// 设置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 当发起数据请求时，显示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 将axios配置到$http属性中
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', treeTable)

// 时间过滤器
Vue.filter('dateFormat', function (val) {
  const dt = new Date(val)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, 0)
  const d = (dt.getDate() + '').padStart(2, 0)
  const hh = (dt.getHours() + 1 + '').padStart(2, 0)
  const mm = (dt.getMinutes() + '').padStart(2, 0)
  const ss = (dt.getSeconds() + '').padStart(2, 0)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
