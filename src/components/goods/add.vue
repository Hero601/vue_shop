<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 消息提示 -->
      <el-alert
        :closable='false'
        center
        title="添加商品信息"
        type="info"
        show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps align-center :active="active - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 添加商品表单 -->
      <el-form ref="addGoodsFormRef" :model="addGoodsForm" label-width="80px">
        <!-- tab标签 -->
        <el-tabs @tab-click='tabsClick' :before-leave='beforeTabLeave' v-model="active" tab-position="left">
          <!-- 基本信息 -->
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品动态参数 -->
          <el-tab-pane name="1" label="商品参数">
            <el-form-item v-for="(item) in manyTableData" :key="item.id" :label="item.attr_name"><br>
              <!-- 属性多选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(subItem, index) in item.attr_vals" :key="index" :label="subItem"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane name="2" label="商品属性">
            <el-form-item class="labelText" :label="item.attr_name" v-for="(item) in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane name="3" label="商品图片">
            <!-- 图片上传 -->
            <!-- action：上传的服务端地址 -->
            <!-- upload组件自动封装了一套ajax，但是除登录之外的接口都需要验证token，所以需要使用headers属性指定Authorization字段 -->
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headerObj"
              :on-success='successUpload'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button class="addGoodsBtn" type="primary" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览 -->
      <el-dialog
        title="预览"
        :visible.sync="previewDialogVisible"
        width="50%"
        :before-close="previewDialogClose">
        <img class="preview" :src="previewPath">
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      active: 0,
      addGoodsForm: {
        // 名字
        goods_name: '',
        // 价格
        goods_price: '',
        // 重量
        goods_weight: '',
        // 数量
        goods_number: '',
        // 分类列表
        goods_cat: [],
        // 图片列表
        pics: [],
        // 商品介绍
        goods_introduce: '',
        // 商品的参数
        attrs: []
      },
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 上传的图片列表
      fileList: [],
      // 为上传图片指定Authorization字段
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览对话框是否显示
      previewDialogVisible: false,
      // 预览对话框的图片地址
      previewPath: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: result } = await this.$http.get('categories')
      this.cateList = result.data
    },
    handleChange() {
      // 只允许选中三级分类
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // tab页签切换之前的判断
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('先选择分类参数')
        return false
      }
    },
    // 页签被点击时的事件函数
    async tabsClick() {
      // 当前选中的是商品参数
      if (this.active === '1') {
        const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        // 将attr_vals转为数组
        result.data.forEach(element => {
          element.attr_vals = element.attr_vals.length === 0 ? [] : element.attr_vals.split(' ')
        })
        this.manyTableData = result.data
      }
      // 选中的是商品属性
      else if (this.active === '2') {
        const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.onlyTableData = result.data
      }
    },
    // 图片预览
    handlePreview(file) {
      // file中携带有要预览的图片信息
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 关闭预览对话框
    previewDialogClose() {
      this.previewPath = ''
      this.previewDialogVisible = false
    },
    // 删除图片
    handleRemove(file) {
      // 删除图片的临时路径
      const picTemp = file.response.data.tmp_path
      // 在数组中查找删除图片的索引值
      const index = this.addGoodsForm.pics.findIndex(x => x.pic === picTemp)
      // 在数组中删除
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 图片上传成功时的钩子
    successUpload(response) {
      const pic = {
        pic: response.data.tmp_path
      }
      // 将每次添加的图片添加进图片列表中
      this.addGoodsForm.pics.push(pic)
    },
    // 发起添加商品请求
    async add() {
      // 将数据深拷贝
      const form = _.cloneDeep(this.addGoodsForm)
      // 将数组转换为,分隔的字符串
      form.goods_cat = form.goods_cat.join(',')
      // 将静态属性添加到attrs属性中
      this.onlyTableData.forEach(item => {
        const info = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addGoodsForm.attrs.push(info)
      })
      // 将动态参数添加到attrs属性中
      this.manyTableData.forEach(item => {
        const info = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addGoodsForm.attrs.push(info)
      })
      form.attrs = this.addGoodsForm.attrs
      // 发起添加商品请求
      const { data: result } = await this.$http.post('goods', form)
      if (result.meta.status !== 201) return this.$message.error(result.meta.msg)

      this.$message.success(result.meta.msg)
      // 添加商品成功，重定向到商品管理页面
      this.$router.push('/goods')
    }
  },
  // 计算属性
  computed: {
    // 级联选择器中选中的第三级id
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="css" scoped>
  .el-card {
    margin-top: 20px;
  }
  .el-steps {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .el-checkbox {
    margin: 0 5px 0 0 !important;
  }
  .labelText>label {
    width: 300px !important;
    display: block;
  }
  .preview{
    width: 100%;
  }
  .addGoodsBtn {
    margin-top: 20px;
  }
</style>
