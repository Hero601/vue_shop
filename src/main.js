import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

import App from './App.vue'
import router from './router'

import './plugins/element.js'
// 导入图标文件
import './assets/font_t2plubdjwe9/iconfont.css'
// 引入全局样式
import './assets/css/global.css'

// 设置默认请求路径
axios.defaults.baseURL = 'http://localhost:3000/'

// 请求拦截器，将token添加到请求头
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 挂载到根组件的模块
Vue.prototype.$http = axios
Vue.prototype.$qs = qs

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
