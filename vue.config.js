module.exports = {
  chainWebpack: config => {


    // 如果是development环境
    config.when(process.env.NODE_ENV === 'development', config => {
      // 清除原来的app入口，新增入口为src下的main-dev.js文件
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
      
      // 开发环境置为false
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })


    // 如果使production环境
    config.when(process.env.NODE_ENV === 'production', config => {
      // 清除原来的app入口，新增入口为src下的main-prod.js文件
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      
      // 将import的第三方库以cdn形式导入
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      // 开发环境置为true
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
  }
}
