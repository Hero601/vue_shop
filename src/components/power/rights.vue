<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table stripe :data="rightsList" border style="width: 100%">
        <el-table-column align='center' label="#" type="index" width="40">
        </el-table-column>
        <el-table-column align='center' prop="authName" label="权限名称"></el-table-column>
        <el-table-column align='center' prop="path" label="路径"> </el-table-column>
        <el-table-column align='center' prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
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
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: result } = await this.$http.get('rights/list')
      this.rightsList = result.data
      console.log(this.rightsList)
    }
  }
}
</script>
<style lang="css" scoped></style>
