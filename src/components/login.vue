<template>
  <div class="login_container">
    <div class="login_box">
      <div class="title">
        <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3649178992,1821853682&fm=26&gp=0.jpg">
      </div>
      <el-form ref="loginFormRef" :rules='loginFormRules' :model="loginForm" label-width="80px">
        <el-form-item prop="username" label="用户">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-lock"></el-input>
        </el-form-item>
        <el-button @click='login' type="primary">登录</el-button>
        <el-button @click='loginFormReset' type="info">重置</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormReset () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('login', this.loginForm)
        if (result.meta.status === 200) {
          // 将token保存到sessionStorage中
          window.sessionStorage.setItem('token', result.data.token)
          this.$message({
            message: result.meta.msg,
            type: 'success'
          })
          // 登录之后跳转到后台页面
          this.$router.push('/home')
          return
        }
        return this.$message.error(result.meta.msg)
      })
    }
  }
}
</script>

<style lang="css" scoped>
.login_box {
  width: 400px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 30px 0 lightgray;
  text-align: center;
  font-size: xx-large;

  /* 居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.title{
  width: 150px;
  height: 150px;
  border-radius: 100%;
  overflow: hidden;
  padding: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px 1px #ddd;
  transform: translate(65%, -50%);
  background-color: #fff;
}

form{
  margin-top: -60px;
  margin-right: 30px;
}

.title:hover{
  cursor: pointer;
}

.title:hover img{
  transform: rotateZ(45deg);
}

.title img{
  border-radius: 100%;
  height: 150px;
}
</style>
