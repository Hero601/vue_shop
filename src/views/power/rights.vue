<template lang="">
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- path: 'home' 当点击首页时跳转到 /home 路由 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data='rights_list' border stripe>
        <el-table-column type='index'></el-table-column>
        <el-table-column label='权限名称' prop='authName'></el-table-column>
        <el-table-column label='路径' prop='path'></el-table-column>
        <el-table-column label='权限等级' prop='level'>
          <template slot-scope="status">
            <div>
              <el-tag v-if="status.row.level == 1">一级</el-tag>
              <el-tag v-else-if="status.row.level == 2" type="success">二级</el-tag>
              <el-tag v-else type="warning">三级</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rights_list: []
    }
  },
  created() {
    this.get_rights_list()
  },
  methods: {
    async get_rights_list() {
      const { data: result } = await this.$http.get('/rights/list')
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.rights_list = result.data
    }
  }
}
</script>
<style lang="css" scoped></style>
