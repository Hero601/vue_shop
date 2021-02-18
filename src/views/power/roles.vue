<template lang="">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- path: 'home' 当点击首页时跳转到 /home 路由 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="role_list" border stripe>
        <!-- 展开 -->
        <el-table-column align="center" type="expand">
          <!-- 通过作用域插槽将值传递到 scope 中 -->
          <template slot-scope="scope">
            <div>
              <!-- 遍历传递的值 -->
              <el-row
                :class="[
                  'bd_bottom',
                  index1 === 0 ? 'bd_top' : '',
                  'vertical_center'
                ]"
                v-for="(item1, index1) in scope.row.children"
                :key="item1.id"
              >
                <el-col :span="5">
                  <el-tag>{{ item1.auth_name }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级、三级权限 -->
                <el-col :span="19">
                  <!-- 循环遍历二级权限（一级权限中的children属性） -->
                  <el-row
                    :class="[index2 === 0 ? '' : 'bd_top', 'vertical_center']"
                    v-for="(item2, index2) in item1.children"
                    :key="index2"
                  >
                    <el-col :span="6">
                      <!-- 令 type === success 颜色为绿 -->
                      <el-tag type="success">{{ item2.auth_name }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <!-- 点击 tag 上的 x 时，将当前的角色对象和权限 id 传递过去 -->
                      <el-tag
                        closable
                        @close="
                          remove_rights(
                            scope.row,
                            index1,
                            index2,
                            index3,
                            item3
                          )
                        "
                        type="warning"
                        v-for="(item3, index3) in item2.children"
                        :key="index3"
                        >{{ item3.auth_name }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column
          align="center"
          prop="role_name"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="role_desc"
          label="角色描述"
          size="300px"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit"
                >编辑</el-button
              ><el-button size="mini" type="danger" icon="el-icon-delete"
                >删除</el-button
              ><el-button
                @click="get_tree_data(scope.row)"
                size="mini"
                type="warning "
                icon="el-icon-setting"
                >分配角色</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        @close="rights_dialog_close"
        title="分配权限"
        :visible.sync="set_rights_dialog_visible"
        width="30%"
      >
        <!-- 树形组件展示，使用 :data 指定数据源，使用 :props 指定显示的数据项 -->
        <el-tree
          node-key="id"
          :default-checked-keys="defaultRights"
          default-expand-all
          show-checkbox
          :data="rights_list"
          :props="right_list_props"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="set_rights_dialog_visible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="set_rights_dialog_visible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      role_list: [],
      // 为 true 时显示对话框
      set_rights_dialog_visible: false,
      // 权限列表
      rights_list: [],
      right_list_props: {
        // label 指定显示的内容
        label: 'authName',
        // children 指定下一级的目录
        children: 'children'
      },
      // 当前角色已有权限
      defaultRights: ['4750481280', '384246763']
    }
  },
  created() {
    this.get_roles_list()
  },
  methods: {
    async get_roles_list() {
      const { data: result } = await this.$http.get('/roles')
      this.role_list = result.data
      this.$message.success(result.meta.msg)
    },
    // role 为角色对象，rights 为当前的权限信息
    async remove_rights(role, i1, i2, i3, rights) {
      const confirmResult = await this.$messageBox(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: result } = await this.$http
          .delete(`roles/del/${role._id}/${i1}/${i2}/${i3}/${rights.id}`)
          .catch(err => err)
        if (result.meta.status !== 200) {
          return this.$message.error(`删除失败，${result.meta.msg}`)
        }
        role.children = result.data
      } else {
        this.$message('已取消')
      }
    },
    // 获取树状数据
    async get_tree_data(scope) {
      const { data: result } = await this.$http.get('/rights/tree')
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.rights_list = result.data
      this.get_default(scope, this.defaultRights)
      this.set_rights_dialog_visible = true
      this.$message.success(result.meta.msg)
    },
    // 递归获取角色下的三级权限的id，保存到 defaultRights 中
    get_default(node, arr) {
      // 若不包含 children 则是三级权限
      if (!node.children) {
        // 取 id 放到 arr中
        return arr.push(node.id)
      }
      // 如果不是三级权限，继续遍历 children 属性
      node.children.forEach(element => {
        this.get_default(element, arr)
      })
    },
    rights_dialog_close() {
      this.defaultRights = []
    }
  }
}
</script>
<style lang="css" scoped>
.el-tag {
  margin: 7px;
}
.bd_top {
  border-top: 1px solid #ddd;
}
.bd_bottom {
  border-bottom: 1px solid #ddd;
}
</style>
