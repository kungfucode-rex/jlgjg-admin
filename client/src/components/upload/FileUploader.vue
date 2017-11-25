<template>
  <div class="form-uploader">
    <Button :id="uploaderId"
            ref="uploadBtn"
            v-if="showUploadBtn"
            class="uploader-btn"
            type="ghost"
            size="small"
            icon="ios-cloud-upload-outline">
    </Button>
    <div v-if="showFileTypeIcon"
         :class="fileTypeIconClass"
         class="file-type-icon"></div>
    <template v-if="showFileControl">
      <div class="file-name">{{fileName}}</div>
      <Progress :percent="percent" :status="status" :stroke-width="17"></Progress>
      <div class="uploader-controller">
        <Button v-if="showPlay" icon="play" size="small" @click="startLoad"></Button>
        <Button v-if="showPause" icon="pause" size="small" @click="startLoad"></Button>
        <Button v-if="showClear" icon="trash-a" size="small" @click="clearLoader"></Button>
        <Button v-if="uploader.multiple && uploader.useAddBtn" icon="plus-round" size="small" @click="addUploader"></Button>
        <Button v-if="uploader.multiple && !uploader.useAddBtn" icon="minus-round" size="small" @click="removeUploader"></Button>
        <!--<Button icon="settings" size="small" @click="test"></Button>-->
      </div>
    </template>
  </div>
</template>
<script>
  import QiniuUtil from '@/scripts/qiniuUtil.js'
  export default {
    props: {
      uploaderId: {
        type: String,
        required: true
      },
      uploader: {
        type: Object,
        require: true
      },
      field: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        showFileControl: false,
        percent: 0,
        showUploadBtn: true,
        showFileTypeIcon: false,
        showClear: false,
        fileTypeIconClass: 'file-icon-file',
        showPlay: false,
        showPause: false,
        status: 'active',
        fileName: this.uploader.value || '',
        value: this.uploader.value || ''
      }
    },
    created () {
      // 如果有初始值，则设置为已完成状态
      if (this.value) {
        this.showUploadBtn = false
        this.showFileControl = true
        this.percent = 100
        this.setFileTypeClass()
        this.showFileTypeIcon = true
        this.showClear = true
      }
    },
    methods: {
      addUploader () {
        this.$emit('addUploader')
        this.uploader.useAddBtn = !this.uploader.useAddBtn
      },
      removeUploader () {
        this.$emit('calculateModel', 'delete', this.value)
        this.$emit('removeUploader', this.uploaderId)
        // console.log('remove...' + this.uploaderId)
      },
      setFileTypeClass (fileName) {
        if (this.fileName.endsWith('.png')) {
          this.fileTypeIconClass = 'file-icon-image'
        } else if (this.fileName.endsWith('.docx') || this.fileName.endsWith('.doc')) {
          this.fileTypeIconClass = 'file-icon-word'
        }
      },
      test () {
        this.$emit('test')
      },
      startLoad () {
        this.showPlay = false
        this.showPause = true
        this.uploader.qiniuLoader.start()
      },
      initLoader (uptoken) {
        let self = this
        self.percent = 0
        this.uploader.qiniuLoader = QiniuUtil.upload(this.uploaderId, {
          filters: this.field.config.filters,
          uptoken: uptoken,
          FilesAdded (up, files) {
            self.showFileControl = true
            self.showPlay = true
            self.showUploadBtn = false
            self.showFileTypeIcon = true
            self.fileName = files[0].name
            self.setFileTypeClass()
          },
          UploadProgress (up, file) {
            self.percent = file.percent
            // console.log('self.percent:' + self.percent)
          },
          UploadComplete (up, files) {
            self.value = files[0].target_name
            self.$emit('calculateModel', 'add', self.uploader.qiniuLoader.settings.domain + '/' + files[0].target_name)
            self.showClear = true
            self.showPlay = false
            self.showPause = false
          },
          Error (up, err, errTip, option) {
            self.status = 'wrong'
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
      clearLoader () {
        this.$emit('calculateModel', 'delete', this.value)
        this.showFileControl = false
        this.showUploadBtn = true
        this.showFileTypeIcon = false
        // this.$refs.uploadBtn.detachEvent('onclick')
        this.$nextTick(function () {
          this.initLoader()
        })
        // this.$emit('test')
      }
    },
    mounted () {
      if (!this.value) {
        let self = this
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
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .form-uploader
    display: flex
    border: 1px solid #dddee1
    border-left: none
    box-sizing: border-box
    border-radius: 0 4px 4px 0
    height: 32px;
    width: 100%
    line-height: 32px;
    +.form-uploader
      margin-top: 10px
    .file-name
      position: absolute
      left: 35px
      padding: 0 5px
      z-index: 1
      font-size: 12px
      color: #666
      height: 25px
    .uploader-btn
      width: 30px
      border: none
      cursor: pointer
      background: transparent
      padding: 4px 5px
      font-size: 24px
      line-height: 25px
      &:focus
        outline: none
    .file-type-icon
      width: 30px
      height: 32px
      color: #666
      font-family: Ionicons
      font-size: 24px;
      padding-left: 10px;
      z-index: 1
    .ivu-progress
      flex-grow: 1
      flex-shrink: 1
      padding-left: 5px
      width: auto
      .ivu-progress-inner
        margin-top: -4px
    .uploader-controller
      padding: 0 3px
      button
        margin-top: -4px
  .file-icon-file
    &:before
      content: '\F12F'
  .file-icon-image
    background-image: url(../../../static/images/image.png);
    background-size: 70%;
    background-position: center;
    background-repeat: no-repeat;
  .file-icon-word
    background-image: url(../../../static/images/word.png);
    background-size: 80%;
    background-position: center;
    background-repeat: no-repeat;
</style>
