<template lang="">
  <el-container>
    <!-- 标题 -->
    <el-header>
      <div>
        <img
          src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3649178992,1821853682&fm=26&gp=0.jpg"
        />
        <span>某电商管理系统</span>
      </div>
      <el-button @click="quit">退出登录</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 动态绑定宽度，如果为收起状态则宽度为 64 -->
      <el-aside :width="is_folding ? '64px' : '200px'">
        <!-- 控制收起还是展示 -->
        <div class="control" @click="change">|||</div>
        <el-menu
          router
          :default-active="active"
          :collapse="is_folding"
          :collapse-transition="false"
          unique-opened
          background-color="#545c64"
          text-colois_r="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menu_list"
            :key="item.id"
            :index="item.id + ''"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              @click="saveActiveState('/' + item.path)"
              v-for="item in item.children"
              :key="item.id"
              :index="'/' + item.path"
            >
              <!-- er -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menu_list: [],
      // 默认不折叠
      is_folding: false,
      active: ''
    }
  },
  mounted() {
    this.req_data()
    this.active = window.sessionStorage.getItem('active_path')
  },
  methods: {
    quit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async req_data() {
      const { data: result } = await this.$http.get('menu')
      // 如果token验证失败，则弹出错误消息
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      // 若验证成功将数据赋值给 menu_list 数组
      this.menu_list = result.data
    },
    change() {
      this.is_folding = !this.is_folding
    },
    saveActiveState(path) {
      window.sessionStorage.setItem('active_path', path)
      this.active = path
    }
  }
}
</script>
<style lang="css">
#app {
  background-color: #fff;
  height: 100%;
}
.el-header {
  background-color: rgb(54, 60, 63);
  display: flex;
  justify-content: space-between;
}
.el-header div {
  display: flex;
  height: 60px;
  align-items: center;
  color: #fff;
}
.el-header > div > img {
  height: 60px;
  border-radius: 100%;
}
.el-header > div > span {
  margin-left: 15px;
  font-size: 20px;
}
.el-aside {
  background-color: rgb(51, 56, 69);
}
.el-main {
  background-color: rgb(234, 238, 242);
}
.el-container {
  height: 100%;
}
.el-aside .el-menu {
  border-right: none;
}
.el-aside .el-menu * {
  border-right: none;
  color: #fff;
}
.control {
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: rgb(4, 52, 71);
  color: #fff;
  cursor: pointer;
}
</style>
