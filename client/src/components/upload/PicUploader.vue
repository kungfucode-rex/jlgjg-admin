<template>
  <div class="pic-upload-container">
    <div class="pic-upload-image" v-for="(item, id) in uploadList">
      <template v-if="item.percent === 0">
        <Spin></Spin>
      </template>
      <template v-else-if="item.percent === 100">
        <img :src="item.url"
             ref="img"
             alt="加载中...">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress :percent="item.percent" hide-info></Progress>
      </template>
    </div>
    <Button :id="uploadBtnId"
            v-show="showUploadBtn"
            class="pic-uploader-btn"
            type="ghost"
            icon="plus-round">
    </Button>
    <!--<Button type="ghost" @click="test">Test</Button>-->
    <Modal title="查看图片" v-model="visible">
      <img :src="viewImageUrl" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
  import QiniuUtil from '@/scripts/qiniuUtil.js'
  export default {
    props: {
      model: {
        type: [Set, String],
        required: true
      },
      fieldName: {
        type: String,
        required: true
      },
      field: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        viewImageUrl: '',
        uploadBtnId: this.fieldName + 'PicUploadBtn',
        visible: false,
        qiniuLoader: null,
        uploadList: {}
      }
    },
    watch: {
      // 观察文件数有变化时是否需要显示添加按钮
      uploadList: function () {
        if (this.field.config && this.field.config.multiple) {
          this.showUploadBtn = true
        } else {
          this.showUploadBtn = (this.model.size === 0)
          console.log('this.showUploadBtn' + (this.model.size === 0))
        }
      }
    },
    created () {
      // 初始化上传组件, 如果有默认值，将他们列出来
      if (this.model.size > 0) {
        this.model.forEach((url, index) => {
          this.uploadList[index] = {
            id: index,
            url: url,
            percent: 100
          }
        })
      }
      // 初始时是否显示增加按钮
      if (this.field.config && this.field.config.multiple) {
        this.showUploadBtn = true
      } else {
        this.showUploadBtn = (this.model.size === 0)
      }
    },
    methods: {
      // 预览图片
      handleView (url) {
        this.viewImageUrl = url + '?time=' + new Date()
        this.visible = true
      },
      // 删除图片
      handleRemove (item) {
        // 从 upload 实例删除数据
        this.$delete(this.uploadList, item.id)
        this.model.delete(item.url)
      },
      // 初始化7牛组件, 页面挂载后调用此方法
      initLoader (uptoken) {
        let self = this
        self.percent = 0
        this.qiniuLoader = QiniuUtil.upload(this.uploadBtnId, {
          filters: this.field.config.filters,
          uptoken: uptoken,
          auto_start: true,
          FilesAdded (up, files) {
            let file = files[files.length - 1]
            // debugger
            self.$set(self.uploadList, file.id, {
              id: file.id,
              name: file.name,
              percent: 0
            })
          },
          UploadProgress (up, file) {
            self.uploadList[file.id].percent = file.percent
            console.log('percent:' + file.percent)
            // 如果上传进度是100, 则将返回的图片url,加到model中
            if (file.percent === 100) {
              let url = self.qiniuLoader.settings.domain + '/' + file.target_name
              if (!self.model[url]) {
                self.model.add(url)
                self.uploadList[file.id].url = url
                // self.$http.get(url)
                self.updateImgsAfterUpdated()
                if (self.field.config && self.field.config.multiple) {
                  self.showUploadBtn = true
                } else {
                  self.showUploadBtn = (self.model.size === 0)
                  console.log('this.showUploadBtn' + (self.model.size === 0))
                }
              }
            }
          },
          UploadComplete (up, files) {
          },
          Error (up, err, errTip, option) {
            if (err.code === -600) {
              self.$Notice.error({
                title: err.message,
                desc: '超出上传限制:' + option.filters.max_file_size
              })
            } else {
              self.$Notice.error({
                title: err.message,
                desc: errTip
              })
            }
          }
        })
      },
      updateImgsAfterUpdated () {
        // 图片上传成功后必须等一会才能显示
        this.$refs.img && this.$refs.img.forEach(function (image) {
          setTimeout(function () {
            if (image.src.indexOf('?') === -1) {
              image.src = image.src + '?imageView2/2/h/46'
              image.style.display = 'block'
            }
          }, 100)
        })
      },
      test () {
        // debugger
      }
    },
    mounted () {
      let self = this
      // 页面挂载后初始化7牛上传,
      // 如果给定的是tokenUrl, 则先请求token
      if (QiniuUtil.config.uptokenUrl) {
        this.$http.get(QiniuUtil.config.uptokenUrl, {
          withCredentials: false
        })
          .then(function (response) {
            self.initLoader(response.data.data.token)
            // console.log(response.data.data.token)
          })
      } else {
        self.initLoader()
      }
      this.updateImgsAfterUpdated()
    },
    updated () {
      // this.updateImgsAfterUpdated()
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .pic-upload-container
    display: flex
    flex-wrap: wrap
    align-items: center
    border: 1px solid #dddee1
    border-radius: 0 4px 4px 0
    box-sizing: border-box
    padding: 5px
    padding-top: 0
    min-height: 60px
    .moxie-shim.moxie-shim-html5
      width: 0 !important
    .pic-uploader-btn
      height: 48px
      font-size: 30px
      line-height: 38px;
      cursor: pointer
      margin-top: 5px;
    .pic-upload-image
      display: inline-block;
      height: 48px;
      min-width: 40px
      text-align: center;
      line-height: 60px;
      border: 1px solid #dddee1;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      margin-right: 5px;
      margin-top: 5px
      img
        width: auto;
        height: 100%;
        display: none
      .demo-upload-list-cover
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
        i
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          margin: 0 2px;
      &:hover
        .demo-upload-list-cover
          display: block;
</style>
