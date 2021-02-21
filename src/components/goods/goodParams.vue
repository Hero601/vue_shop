<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-alert
        :closable="false"
        show-icon
        title="警告：只允许为第三级分类设置相关参数！"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="goodsCate">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cascaderData"
            :props="cascaderProps"
            @change="cascaderChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 页签 -->
      <el-tabs v-model="tabsActiveName" @tab-click="tabsClickChange">
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            :disabled="isDisabled"
            type="primary"
            class="add"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table border :data="manyTableData" style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="props">
                <!-- 遍历vals属性 -->
                <el-tag @close="tagHandleClose(index, props.row)" closable v-for="(item, index) in props.row.attr_vals" :key="index">{{item}}</el-tag>
                <!-- 新增tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#" width="100">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button @click='delParams(scope.row.attr_id)' type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            class="add"
            type="primary"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table border :data="onlyTableData" style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="props">
                <!-- 遍历vals属性 -->
                <el-tag @close="tagHandleClose(index, props.row)" closable v-for="(item, index) in props.row.attr_vals" :key="index">{{item}}</el-tag>
                <!-- 新增tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row.inputVisible)"
                  @blur="handleInputConfirm(props.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#" width="100">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="primary"
                    @click="showEditParamsDialog(scope.row.attr_id)"
                    icon="el-icon-edit"
                    >编辑</el-button
                  >
                  <el-button @click='delParams(scope.row.attr_id)' type="danger" icon="el-icon-delete">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + dialogActiveText"
      :visible.sync="addDialogVisible"
      width="30%"
      :before-close="addDialogClose"
    >
      <el-form ref="addParamsFormRef" :model="addParamsForm" label-width="80px">
        <el-form-item :label="dialogActiveText">
          <el-input v-model="addParamsForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClose">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + dialogActiveText"
      :visible.sync="editDialogVisible"
      width="30%"
      :before-close="editDialogClose"
    >
      <el-form
        ref="editParamsFormRef"
        :model="editParamsForm"
        label-width="80px"
      >
        <el-form-item :label="dialogActiveText">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 级联选择框数据源
      cascaderData: [],
      // 级联选择框配置
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 级联选择框选中的选项
      selectedKeys: [],
      // 当前活动页签名
      tabsActiveName: 'many',
      // 动态参数表格数据
      manyTableData: [],
      // 静态属性表格数据
      onlyTableData: [],
      // 是否显示添加参数对话框
      addDialogVisible: false,
      // 是否显示修改参数对话框
      editDialogVisible: false,
      // 添加参数表单数据
      addParamsForm: {
        name: ''
      },
      // 修改参数表单数据
      editParamsForm: {
        name: '',
        id: ''
      }
    }
  },
  created() {
    this.getCascaderData()
  },
  methods: {
    // 获取级联选择框的数据源
    async getCascaderData() {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status === 200) {
        this.cascaderData = result.data
        return
      }
      return this.$message.error(result.meta.msg)
    },
    // 级联选择框中的数据改变事件函数
    cascaderChange() {
      this.getParamsData()
    },
    // 获取分类参数列表
    async getParamsData() {
      // 如果选择的不是三级菜单阻止执行
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: result } = await this.$http.get(
        `categories/${this.selectedKeys[2]}/attributes`,
        {
          params: {
            sel: this.tabsActiveName
          }
        }
      )
      // 将响应参数中的 vals 属性转为数组
      result.data.forEach(element => {
        // 当前项的attr_vals是否为空，如果为空直接为[]
        element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        element.inputVisible = false
        // 文本框中输入的值
        element.inputValue = ''
      })
      // 根据当前页签不同，将数据写入不同的表格
      if (this.tabsActiveName === 'many') {
        this.manyTableData = result.data
      } else {
        this.onlyTableData = result.data
      }
    },
    // 页签点击切换事件
    tabsClickChange() {
      // tabsActiveName 随着当前显示的页签的name属性切换
      this.getParamsData()
    },
    // 添加参数对话框关闭
    addDialogClose() {
      this.addParamsForm.name = ''
      this.addDialogVisible = false
    },
    // 修改参数对话框关闭
    editDialogClose() {
      this.editParamsForm.name = ''
      this.editParamsForm.id = ''
      this.editDialogVisible = false
    },
    // 添加参数、属性
    async addParams() {
      const { data: result } = await this.$http.post(
        `categories/${this.selectedKeys[2]}/attributes`,
        {
          attr_name: this.addParamsForm.name,
          attr_sel: this.tabsActiveName
        }
      )
      if (result.meta.status !== 201) return this.$message.error(result.meta.msg)
      // 添加成功
      this.$message.success(result.meta.msg)
      this.addDialogClose()
      this.getParamsData()
    },
    // 展示修改参数对话框
    async showEditParamsDialog(id) {
      this.editDialogVisible = true
      const { data: result } = await this.$http.get(`categories/${this.selectedKeys[2]}/attributes/${id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      // 获取成功将input赋值
      this.editParamsForm = result.data
    },
    // 修改参数、属性
    async editParams() {
      const { data: result } = await this.$http.put(`categories/${this.selectedKeys[2]}/attributes/${this.editParamsForm.attr_id}`, {
        attr_name: this.editParamsForm.attr_name,
        attr_sel: this.tabsActiveName
      })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      this.editDialogClose()
      this.getParamsData()
    },
    // 删除参数、属性
    async delParams(id) {
      const { data: result } = await this.$http.delete(`categories/${this.selectedKeys[2]}/attributes/${id}`)
      if (result.meta.status === 200) {
        this.$notify({
          title: result.meta.msg,
          message: '',
          type: 'success'
        })
        this.getParamsData()
        return
      }
      this.$notify({
        title: result.meta.msg,
        message: '',
        type: 'error'
      })
    },
    // 新增tag标签的input输入框，确认事件
    async handleInputConfirm(props) {
      // 如果没有输入任何内容（不包括空格）
      if (props.inputValue.trim().length === 0) {
        // 将input置空
        props.inputValue = ''
        // 隐藏输入框
        props.inputVisible = false
        return
      }
      // input中输入了内容保存到当前页面的数组中
      props.attr_vals.push(props.inputValue)
      // 置空输入框
      props.inputValue = ''
      // 隐藏
      props.inputVisible = false
      // 向数据库发起请求
      this.saveAttrValues(props)
    },
    async saveAttrValues(props) {
      const { data: result } = await this.$http.put(`categories/${this.selectedKeys[2]}/attributes/${props.attr_id}`, {
        attr_name: props.attr_name,
        attr_sel: props.attr_sel,
        attr_vals: props.attr_vals.join(' ')
      })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      return this.$message.success(result.meta.msg)
    },
    // 展示input
    showInput(props) {
      props.inputVisible = true
      // $nextTick 表示当页面中的元素重新被渲染时执行回调函数
      this.$nextTick(_ => {
        // input自动获取焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // tag标签删除事件
    tagHandleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrValues(row)
    }
  },
  computed: {
    // 按钮是否需要禁用
    isDisabled() {
      return !(this.selectedKeys.length === 3)
    },
    // 对话框标题
    dialogActiveText() {
      if (this.tabsActiveName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>
<style lang="css" scoped>
.goodsCate {
  margin-top: 20px;
}
.add {
  margin-bottom: 20px !important;
}
.input-new-tag {
  width: 120px !important;
}
.el-tag{
  margin: auto 10px;
}
</style>
