<template lang="">
  <div class="login_box">
    <div class="title">
      <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3649178992,1821853682&fm=26&gp=0.jpg">
    </div>
    <el-form ref="login_form_ref" :rules='rules' :model = 'login_form' label-width="30px">
      <el-form-item prop="uname">
        <el-input v-model='login_form.uname' prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
      <el-form-item prop='upwd'>
        <el-input type='password' v-model='login_form.upwd' prefix-icon="iconfont icon-lock"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click='submit'>登录</el-button>
        <el-button type="info" @click='reset'>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  // data选项必须是一个函数，这里使用了 ES6 语法
  data () {
    // 函数中返回数据
    return {
      login_form: {
        uname: '',
        upwd: ''
      },
      rules: {
        uname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        upwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.login_form_ref.resetFields()
    },
    submit () {
      // this.$refs.login_form_ref 表单对象
      this.$refs.login_form_ref.validate(async valid => {
        if (!valid) return
        // result 为服务端发送的数据
        const { data: result } = await this.$http.post('login', this.$qs.stringify({
          uname: this.login_form.uname,
          upwd: this.login_form.upwd
        }))
        if (result.status === 400) {
          this.$message.error('登录失败')
        } else {
          // 将服务端的 token 保存到 Cookie 中
          window.sessionStorage.setItem('token', result.token)
          this.$message.success('登录成功')
          // 登录成功之后跳转到 home 页面
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<!-- 需要使用 lang=css 指定样式文件，选择合适的loader执行 -->
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
