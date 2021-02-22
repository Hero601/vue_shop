<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
          <el-col :span="7">
            <!-- 搜索功能 -->
            <el-input
              @clear="getGoodsList"
              clearable
              v-model="queryInfo.query"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <el-button
                slot="append"
                @click="getGoodsList"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="goAddPage"
              >添加商品</el-button
            >
          </el-col>
      </el-row>
      <template>
        <!-- 商品表格 -->
        <el-table :data='goodsList' stripe border style="width: 100%">
          <!-- 索引列 -->
          <el-table-column label="#" type="index" width="40">
          </el-table-column>
          <el-table-column min-width="500px" prop="goods_name" label="商品名称"> </el-table-column>
          <el-table-column width="95px" prop="goods_price" label="商品价格(元)"> </el-table-column>
          <el-table-column width="70px" prop="goods_weight" label="商品重量"> </el-table-column>
          <el-table-column width="160px" label="创建时间">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column width="130px" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
              <!-- 删除商品 -->
              <el-button
                @click='removeGoodsById(scope.row.goods_id)'
                size="mini"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据分页 -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 4, 7, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 7
      },
      goodsList: [],
      // 总商品数
      total: 0
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: result } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) return this.$message.error(result.meat.msg)
      this.goodsList = result.data.goods
      this.total = result.data.total
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getGoodsList()
    },
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getGoodsList()
    },
    // 根据id删除商品
    async removeGoodsById(id) {
      const status = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (status === 'confirm') {
        const { data: result } = await this.$http.delete(`goods/${id}`)
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.getGoodsList()
      } else {
        this.$message('取消删除')
      }
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>
<style lang="css" scoped>
  .el-card {
    margin-top: 20px;
  }
  .el-table {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
