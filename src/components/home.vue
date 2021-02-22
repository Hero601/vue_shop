<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" />
        <span>津东后台管理系统</span>
      </div>
      <el-button id="logout" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div @click='collapseChange' class="toggle_button">|||</div>
        <el-col>
          <el-menu
            :collapse="isCollapse"
            :collapse-transition="false"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            router
          >
            <el-submenu
              v-for="(item, index) in menuList"
              :key="item.id"
              :index="'/'+item.path"
            >
              <template slot="title">
                <i v-if="index === 0" class="iconfont icon-yonghu"></i>
                <i v-else-if="index === 1" class="iconfont icon-quanxian"></i>
                <i v-else-if="index === 2" class="iconfont icon-shangpin"></i>
                <i v-else-if="index === 3" class="iconfont icon-5"></i>
                <i v-else class="iconfont icon-shuju"></i>
                <span class="alideText">{{ item.authName }}</span>
              </template>
              <el-menu-item
                v-for="subItem in item.children"
                :key="subItem.id"
                :index="'/'+subItem.path"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <!-- 内容区 -->
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
      menuList: [],
      isCollapse: false
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status === 200) {
        this.menuList = result.data
      } else {
        return this.$message.error('数据获取失败')
      }
    },
    collapseChange() {
      this.isCollapse = !this.isCollapse
    }
  },
  created() {
    this.getMenuList()
  }
}
</script>
<style lang="css" scoped>
.el-header {
  background-color: rgb(52, 58, 61);
  display: flex;
  justify-content: space-between;
  color: #fff;
}
.el-header div img {
  height: 100%;
}
.el-header div span {
  height: 100%;
  font-size: xx-large;
  position: relative;
  top: -20px;
  margin-left: 30px;
}
.home_container {
  height: 100%;
}
.el-aside {
  background-color: rgb(49, 54, 67);
}
.el-menu {
  border-right: none;
}
.toggle_button{
  text-align: center;
  cursor: pointer;
  color: #fff;
  height: 30px;
  line-height: 30px;
  background-color: teal;
}
.el-main{
  background-color: rgb(231,236,239);
}
#logout{
  margin-top: 8px;
  height: 40px;
}
.alideText{
  padding-left: 10px;
}
</style>
