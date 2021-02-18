<template lang="">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- path: 'home' 当点击首页时跳转到 /home 路由 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              clearable
              @clear="get_user_list"
              v-model="query_info.query"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <el-button
                @click="get_user_list"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button @click="add_dialog_visible = true" type="primary"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="user_list" border stripe>
          <el-table-column
            align="center"
            prop="username"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="email"
            label="邮箱"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="mobile"
            label="电话"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="role_name"
            label="角色"
          ></el-table-column>
          <el-table-column align="center" prop="mg_state" label="状态">
            <template slot-scope="status">
              <el-switch
                @change="user_state_change(status.row)"
                v-model="status.row.mg_state"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="status">
              <div>
                <el-tooltip
              class="item"
              effect="dark"
              content="编辑信息"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="show_edit_dialog(status.row._id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              :enterable="false"
              placement="top"
            >
              <el-button
                @click='del_user(status.row._id)'
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query_info.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="query_info.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>

        <!-- 添加用户对话框 -->
        <el-dialog
          @close="close_add_dialog"
          title="提示"
          :visible.sync="add_dialog_visible"
          width="50%"
        >
          <!-- 对话框主体内容 -->
          <el-form
            :model="add_form"
            :rules="add_form_rules"
            ref="add_form_ref"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="add_form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="add_form.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="add_form.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="add_form.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 按钮 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="add_dialog_visible = false">取消</el-button>
            <el-button type="primary" @click="addUser">确定</el-button>
          </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
          title="提示"
          :visible.sync="edit_dialog_visible"
          width="50%"
          @close='edit_dialog_closed'
        >
          <el-form :model="edit_form" :rules='edit_form_rules' ref="edit_form_ref" label-width="100px" >
            <el-form-item label="姓名">
              <el-input v-model="edit_form.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop='email'>
              <el-input v-model="edit_form.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop='mobile'>
              <el-input v-model="edit_form.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot='footer' class="dialog-footer">
            <el-button @click="edit_dialog_visible = false">取消</el-button>
            <el-button @click="edit_user()">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义校验规则
    var checkEmail = (rule, value, callback) => {
      const check = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (check.test(value)) {
        callback()
      }
      callback(new Error('输入合法的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const check = /^1[0-9]{10}$/
      if (check.test(value)) {
        callback()
      }
      callback(new Error('输入合法的手机号'))
    }
    return {
      query_info: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      user_list: [],
      total: 0,
      add_dialog_visible: false,
      edit_dialog_visible: false,
      add_form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      add_form_rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          // 是否填写
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 自定义校验规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 通过 id 查询到的待修改数据
      edit_form: {},
      edit_form_rules: {
        email: [
          // 是否填写
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 自定义校验规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.get_user_list()
  },
  methods: {
    // 删除用户功能
    async del_user(id) {
      const confirm = await this.$messageBox('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirm === 'confirm') {
        const { data: result } = await this.$http.delete(`users/${id}`)
        if (result.meta.status === 200) {
          this.get_user_list()
          this.$message.success(result.meta.msg)
        } else {
          this.$messgae.error(result.meta.msg)
        }
      }
    },
    // 修改用户
    async show_edit_dialog(_id) {
      this.edit_dialog_visible = true
      const { data: result } = await this.$http.get(`users/${_id}`)
      this.edit_form = result.data
    },
    // 获取用户数据
    async get_user_list() {
      const { data: result } = await this.$http.get('users', {
        params: this.query_info
      })
      // 获取信息失败了
      if (result.meta.status === 200) {
        this.$message.success(result.meta.msg)
      } else if (result.meta.status === 201) {
        this.$message.success(result.meta.msg)
      } else {
        return this.$message.error(result.meta.msg)
      }
      this.user_list = result.data.users
      this.total = result.data.total
    },
    handleSizeChange(size) {
      this.query_info.pagesize = size
      // 重新发请求
      this.get_user_list()
    },
    // 当页码改变时，触发该事件函数
    handleCurrentChange(num) {
      this.query_info.pagenum = num
      // 重新发请求
      this.get_user_list()
    },
    close_add_dialog() {
      // 重置表单
      this.$refs.add_form_ref.resetFields()
    },

    // 修改用户信息重置对话框
    edit_dialog_closed() {
      this.$refs.edit_form_ref.resetFields()
    },

    // 修改用户信息提交事件
    edit_user() {
      this.$refs.edit_form_ref.validate(async vaild => {
        if (!vaild) return
        // 发起请求
        const { data: result } = await this.$http.put(`users/${this.edit_form._id}`, {
          email: this.edit_form.email,
          mobile: this.edit_form.mobile
        })
        if (result.meta.status === 200) {
          this.edit_dialog_visible = false
          this.get_user_list()
          return this.$message.success(result.meta.msg)
        }
        this.$message.error(result.meta.msg)
      })
    },

    // 添加用户
    addUser() {
      this.$refs.add_form_ref.validate(async vaild => {
        // 如果表单有错误，则禁止提交
        if (!vaild) return
        // 如果表单没有错误，提交数据
        const { data: result } = await this.$http.post('http://localhost:3000/users/add', this.add_form)
        if (result.meta.status === 400) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        // 关闭对话框
        this.add_dialog_visible = false
        // 重新加载用户列表
        this.get_user_list()
      })
    },
    async user_state_change(state) {
      const { data: result } = await this.$http.put(
        `http://localhost:3000/users/${state._id}/state/${state.mg_state}`
      )
      // 成功
      if (result.meta.status === 200) {
        return this.$message.success(result.meta.msg)
        // 警告
      } else if (result.meta.status === 300) {
        return this.$message.warning(result.meta.msg)
        // 失败
      } else {
        return this.$message.error(result.meta.msg)
      }
    }
  }
}
</script>
<style lang="css">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
