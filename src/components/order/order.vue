<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索订单 -->
          <el-input
            @clear="getOrdersList"
            clearable
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
          >
            <el-button
              @click="getOrdersList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <template>
        <!-- 用户表格 -->
        <el-table :data="orderList" stripe border style="width: 100%">
          <!-- 索引列 -->
          <el-table-column prop="username" label="#" type="index" width="40">
          </el-table-column>
          <!-- 订单编号 -->
          <el-table-column width="300" prop="order_number" label="订单编号">
          </el-table-column>
          <el-table-column prop="order_price" label="订单价格">
          </el-table-column>
          <el-table-column prop="pay_status" label="是否付款">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
              <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"> </el-table-column>
          <el-table-column prop="create_time" label="下单时间">
            <template slot-scope="scope">
              {{ scope.row.create_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- 修改地址 -->
            <el-button
              @click="showEditOrderDialog"
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 查看物流进度 -->
            <el-button
              @click="showLogisticsInfo"
              size="mini"
              type="success"
              icon="el-icon-location"
            ></el-button>
          </el-table-column>
        </el-table>
        <!-- 修改订单dialog -->
        <el-dialog
          title="修改订单"
          :visible.sync="editOrderDialogVisible"
          width="30%"
          :before-close="editOrderDialogClose"
        >
          <el-form ref="editPostionFormRef"          :rules="editPostionFormRules" :model="editPostionForm" label-width="80px">
            <el-form-item prop="address1" label="省市区">
              <el-cascader
                v-model="editPostionForm.address1"
                :options="cityData"></el-cascader>
            </el-form-item>
            <el-form-item prop="address2" label="详细地址">
              <el-input v-model="editPostionForm.address2"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editOrderDialogClose">取 消</el-button>
            <el-button type="primary" @click="editAddress">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 物流信息对话框 -->
        <el-dialog
          title="物流信息"
          :visible.sync="logisticsDialogVisible"
          width="30%"
          :before-close="logisticsDialogClose">
          <span>这是一段信息</span>
        </el-dialog>
        <!-- 表格的数据分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 7]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </template>
    </el-card>
  </div>
</template>
<script>
import cityData from './citydata'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单数据列表
      orderList: [],
      // 总订单数
      total: 0,
      // 是否展示修改订单对话框
      editOrderDialogVisible: false,
      // 是否展示物流信息对话框
      logisticsDialogVisible: false,
      // 修改地址表单对象
      editPostionForm: {
        address1: [],
        address2: ''
      },
      // 修改地址表单验证规则对象
      editPostionFormRules: {
        address1: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      // 城市数据
      cityData: cityData,
      // 物流信息列表
      logisticsList: []
    }
  },
  methods: {
    // 获取订单数据
    async getOrdersList() {
      const { data: result } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.orderList = result.data.goods
      this.total = result.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrdersList()
    },
    // 展示修改订单对话框
    showEditOrderDialog() {
      this.editOrderDialogVisible = true
    },
    // 修改订单对话框关闭事件
    editOrderDialogClose() {
      this.$refs.editPostionFormRef.resetFields()
      this.editOrderDialogVisible = false
    },
    // 物流信息对话框的关闭事件
    logisticsDialogClose() {
      this.logisticsDialogVisible = false
    },
    // 发送修改地址请求
    editAddress() {
      console.log(this.editPostionForm.address1)
    },
    // 展开查看物流信息对话框
    async showLogisticsInfo() {
      // this.logisticsDialogVisible = true
      // const { data: result } = await this.$http.get(`/kuaidi/${804909574412544580}`)
      // if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      // this.logisticsList = result.data
      this.$message.error('待开发')
      // console.log(this.logisticsList)
    }
  },
  created() {
    this.getOrdersList()
  }
}
</script>
<style lang="css" scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin: 20px 0;
}
</style>
