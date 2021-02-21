<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <el-table stripe :data="rolesList" border style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row class="center" :class="['dbBottom', index === 0 ? 'dbTop' : '']" v-for="(item, index) in props.row.children" :key="item.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRights(item.id, props.row)" >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级、三级权限 -->
              <el-col :span="19">
                <el-row :class="[ index===0?'':'dbTop']" class="center" v-for="(item2, index) in item.children" :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag closable @close="deleteRights(item2.id, props.row)" type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span='18'>
                    <!-- tag3Close，表示三级权限被删除，props.row.id为角色id，item3.id为权限id -->
                    <el-tag closable @close="deleteRights(item3.id, props.row)" v-for="(item3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column align='center' label="#" type="index" width="40">
        </el-table-column>
        <el-table-column align='center' prop="roleName" label="角色名称"></el-table-column>
        <el-table-column align='center' prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column align='center' label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
            <el-button @click="showRightsDialog(scope.row)" icon="el-icon-setting" type="warning" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <!-- 树形控件 -->
        <el-tree
          ref="rightsTreeRef"
          default-expand-all
          :data="rightsTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultChecked"
          :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点
      defaultChecked: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取用户列表
    async getRolesList() {
      const { data: result } = await this.$http.get('roles')
      this.rolesList = result.data
    },
    async deleteRights(rightsId, roles) {
      const { data: result } = await this.$http.delete(`roles/${roles.id}/rights/${rightsId}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      roles.children = result.data
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false
      this.defaultChecked = []
    },
    async showRightsDialog(role) {
      // 当前角色的id
      this.roleId = role.id
      // 获取权限列表
      const { data: result } = await this.$http.get('rights/tree')
      this.rightsTree = result.data
      this.getLeafKeys(role, this.defaultChecked)
      this.dialogVisible = true
    },
    // 通过递归函数将三级权限的id添加到arr中
    getLeafKeys(node, arr) {
      // 如果是三级权限
      if (!node.children) {
        // 将id属性添加到arr中
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeafKeys(element, arr)
      })
    },
    // 确定分配权限
    async allotRights() {
      // 获取选中的权限
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      // 将权限数组转换为以 , 分割的字符串
      const strId = keys.join(',')
      // 更改服务端值
      const { data: result } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: strId
      })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      this.getRolesList()
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="css" scoped>
/* 下边框线 */
.dbBottom{
  border-bottom: 1px solid #eee
}
/* 上边框线 */
.dbTop{
  border-top: 1px solid #eee
}

.el-tag{
  margin: 7px;
}

.center{
  display: flex;
  align-items: center;
}
</style>
