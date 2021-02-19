<template>
  <div>
    <!-- 面包屑导航 -->
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 主体区 -->
    <div class="main">
      <!-- 卡片视图 -->
      <el-card class="box-card">
        <!-- 栅格布局 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <!-- 搜索功能 -->
            <el-input
              @clear="getUserList"
              clearable
              v-model="queryInfo.query"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <el-button
                @click="getUserList"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
        <template>
          <!-- 用户表格 -->
          <el-table :data="userList" stripe border style="width: 100%">
            <!-- 索引列 -->
            <el-table-column prop="username" label="#" type="index" width="40">
            </el-table-column>
            <!-- 用户名 -->
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <!-- 邮箱 -->
            <el-table-column prop="email" label="邮箱 "> </el-table-column>
            <!-- 电话 -->
            <el-table-column prop="mobile" label="电话 "> </el-table-column>
            <!-- 角色 -->
            <el-table-column prop="role_name" label="角色"> </el-table-column>
            <!-- 状态 -->
            <el-table-column prop="mg_state" label="状态">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-switch
                  @change="userStateChanged(scope.row)"
                  v-model="scope.row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <!-- 修改用户 -->
                <el-button
                  @click="showEditDialogVisible(scope.row.id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                ></el-button>
                <!-- 删除用户 -->
                <el-button
                  @click="deleteUser(scope.row.id)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
                <!-- 悬停提示 -->
                <el-tooltip
                  :enterable="false"
                  class="item"
                  effect="dark"
                  content="分配角色"
                  placement="top"
                >
                  <!-- 分配角色 -->
                  <el-button
                    size="mini"
                    type="warning"
                    icon="el-icon-setting"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 添加用户对话框 -->
          <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="30%"
            :before-close="addHandleClose"
          >
            <el-form
              :rules="addUserFormRules"
              :model="addUserForm"
              ref="addUserFormRef"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item prop="username" label="用户名">
                <el-input v-model="addUserForm.username"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="用户密码">
                <el-input v-model="addUserForm.password"></el-input>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="addUserForm.email"></el-input>
              </el-form-item>
              <el-form-item prop="mobile" label="手机号">
                <el-input v-model="addUserForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisibleQuit">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 修改用户对话框 -->
          <el-dialog
            title="修改用户信息"
            :visible.sync="editDialogVisible"
            width="30%"
            :before-close="editHandleClose"
          >
            <el-form
              :rules="editUserFormRules"
              ref="editUserFormRef"
              :model="editUserForm"
              label-width="80px"
            >
              <el-form-item label="用户名">
                <el-input disabled v-model="editUserForm.username"></el-input>
              </el-form-item>
              <el-form-item prop="mobile" label="手机号">
                <el-input v-model="editUserForm.mobile"></el-input>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="editUserForm.email"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 切换每页显示多少条时，触发handleSizeChange事件 -->
          <!-- 切换页码时，触发handleCurrentChange事件 -->
          <!-- :current-page当前活动页 -->
          <!-- :page-size每页显示的数据 -->
          <!-- :total数据总数 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 3, 4]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </template>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 邮箱符合规则
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }

    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 邮箱符合规则
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 用户列表
      userList: [],
      // 用户列表请求参数
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 一页显示的数据
        pagesize: 2
      },
      total: 0,
      // 添加用户对话框
      addDialogVisible: false,
      // 修改用户对话框
      editDialogVisible: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户表单
      editUserForm: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      // 添加用表单校验规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      // 获取用户列表
      const { data: result } = await this.$http('users', {
        params: this.queryInfo
      })
      // 获取成功
      if (result.meta.status === 200) {
        this.userList = result.data.users
        this.total = result.data.total
        // 弹出提示
        return this.$message.success(result.meta.msg)
      }
      return this.$message.error(result.meta.msg)
    },
    // 页大小被改变时
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 活动页被改变
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    // 用户状态的修改
    async userStateChanged(newState) {
      const { data: result } = await this.$http.put(
        `users/${newState.id}/state/${newState.mg_state}`
      )
      if (result.meta.status === 200) {
        return this.$message.success(result.meta.msg)
      }
      newState.mg_state = !newState.mg_state
      return this.$message.error(result.meta.msg)
    },
    // 关闭添加用户对话框
    addHandleClose() {
      this.addDialogVisible = false
      this.$refs.addUserFormRef.resetFields()
    },
    // 关闭修改用户对话框
    editHandleClose() {
      this.editDialogVisible = false
      this.$refs.editUserFormRef.resetFields()
    },
    // 取消添加用户
    addDialogVisibleQuit() {
      this.addDialogVisible = false
      this.$refs.addUserFormRef.resetFields()
    },
    // 修改用户按钮被点击
    async showEditDialogVisible(id) {
      this.editDialogVisible = true
      // scope中携带有用户的id
      const { data: result } = await this.$http.get(`users/${id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.editUserForm = result.data
    },
    // 添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post(
          'users',
          this.addUserForm
        )
        if (result.meta.status === 201) {
          // 弹出成功消息
          this.$message.success(result.meta.msg)
          // 获取用户列表
          this.getUserList()
        } else {
          this.$message.error(result.meta.msg)
        }
        // 关闭添加用户对话框
        this.addDialogVisible = false
      })
    },
    // 修改用户
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        // 这里的id使用的是保存在editUserForm中的id
        const { data: result } = await this.$http.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.$message.success(result.meta.msg)
        this.getUserList()
        // 关闭对话框
        this.editDialogVisible = false
      })
    },
    // 删除用户
    deleteUser(id) {
      this.$confirm('此操作将永久该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: result } = await this.$http.delete(`users/${id}`)
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.getUserList()
        return this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>
<style lang="css">
.el-card {
  margin-top: 20px;
}
</style>
