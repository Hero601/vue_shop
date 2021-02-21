<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button @click="showAddCateDialog" type="primary"
        >添加分类</el-button
      >
      <!-- 商品分类列表 -->
      <tree-table
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        :show-row-hover="true"
        :border="true"
        :show-index="true"
        class="tree-table"
        :data="categoriesList"
        :columns="columns"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 添加商品对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="30%"
        :before-close="addCateDialogClose"
      >
        <el-form
          ref="addCateFormRef"
          :model="addCateForm"
          label-width="80px"
        >
          <el-form-item label="分类名称">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options：数据源 -->
            <!-- props：级联选择器的配置对象 -->
            <!-- v-model：当前选择器选中的值 -->
            <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="addClassificationChange"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="addCate"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 数据分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 分类参数
      categoriesList: [],
      // 每列要展示的数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          align: 'left',
          width: '300'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
          align: 'center',
          width: '80'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort',
          align: 'center'
        },
        {
          label: '操作',
          align: 'center',
          type: 'template',
          template: 'operation'
        }
      ],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 添加分类对话框是否显示
      addCateDialogVisible: false,
      // 添加分类对话框表单
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 分类父id
        cat_pid: '',
        // 分类等级
        cat_level: ''
      },
      // 父级分类列表
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        // 选中的值
        value: 'cat_id',
        // 看到的值
        label: 'cat_name',
        // 子级
        children: 'children',
        // 父级可被选中
        checkStrictly: true
      },
      // 级联选择器选中的父级id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
    // 获取商品分类列表
    async getCategoriesList() {
      const { data: result } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (result.meta.status === 200) {
        // data属性是一个对象，对象中的result属性为商品分类列表
        this.categoriesList = result.data.result
        this.total = result.data.total
        return this.$message.success(result.meta.msg)
      }
      return this.$message.error(result.meta.msg)
    },
    // 页大小被改变
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getCategoriesList()
    },
    // 活动页被改变
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getCategoriesList()
    },
    // 添加分类对话框的关闭事件
    addCateDialogClose() {
      // 清空选择的id
      this.selectedKeys = []
      this.addCateForm.cat_name = ''
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      // 关闭对话框
      this.addCateDialogVisible = false
    },
    // 展示添加分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: result } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.parentCateList = result.data
    },
    // 添加分类对话框选项发生变化时触发
    addClassificationChange() {
      // 一级权限
      if (this.selectedKeys.length === 0) {
        // 等级为一级分类
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      } else if (this.selectedKeys.length === 1) {
        this.addCateForm.cat_level = 1
        this.addCateForm.cat_pid = this.selectedKeys[0]
      } else {
        this.addCateForm.cat_level = 2
        this.addCateForm.cat_pid = this.selectedKeys[1]
      }
    },
    // 添加分类请求
    async addCate() {
      const { data: result } = await this.$http.post('categories', this.addCateForm)
      if (result.meta.status !== 201) return this.$message.error(result.meta.msg)
      this.getCategoriesList()
      this.$message.success(result.meta.msg)
      this.addCateDialogClose()
    }
  }
}
</script>
<style lang="css" scoped>
.tree-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
