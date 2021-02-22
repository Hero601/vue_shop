<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 2、指定echarts的显示区域 -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
// 1、引入echarts
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 当dom树渲染完毕时执行
  async mounted() {
    // 3、使用init方法初始化echarts图表
    var myChart = echarts.init(document.getElementById('main'))
    const { data: result } = await this.$http.get('reports/type/1')
    if (result.meta.status !== 200) return this.$message.error(result.meta.msg)

    // 配置数据
    const data = _.merge(result.data, this.options)

    // 5、使用数据显示图表
    myChart.setOption(data)
  }
}
</script>
<style lang="css">
.el-card {
  margin-top: 20px;
}
</style>
