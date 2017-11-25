<template>
  <Form-item :prop="name"
             :label="field.label"
             :label-width="computedLabelWidth"
             :class="formItemClass">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <template v-for="(uploader, uploaderId) in uploaders">
      <FileUploader :uploader-id="uploaderId"
                    :ref="uploaderId"
                    v-on:addUploader="addUploader"
                    v-on:removeUploader="removeUploader"
                    v-on:calculateModel="calculateModel"
                    v-on:test="test"
                    :field="field"
                    :uploader="uploader"></FileUploader>
    </template>
  </Form-item>
</template>
<script>
  import FileUploader from 'components/upload/FileUploader'
  export default {
    props: {
      name: {
        type: String,
        required: true
      },
      field: {
        type: Object,
        required: true
      },
      formModel: {
        type: Object,
        required: true
      },
      labelWidth: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        uploaderIndex: 2,
        uploaders: {},
        formItemClass: {
          'full-column': true
        }
      }
    },
    created () {
      this.formModel[this.name] = new Set()
      // 如果有默认值，则初始化默认文件列表
      if (this.field.value) {
        if (this.field.config && this.field.config.multiple === true) {
          // 如果是多选
          this.field.value.forEach((item) => {
            this.formModel[this.name].add(item)
            this.$set(this.uploaders, this.name + 'uploader' + this.uploaderIndex++, {
              useAddBtn: false,
              multiple: true,
              qiniuLoader: null,
              value: item
            })
          })
          this.addUploader()
        } else {
          // 如果是单选
          this.formModel[this.name].add(this.field.value)
          this.$set(this.uploaders, this.name + 'uploader' + this.uploaderIndex++, {
            useAddBtn: false,
            qiniuLoader: null,
            value: this.field.value
          })
        }
      } else {
        this.addUploader()
      }
    },
    methods: {
      // 增加文件上传条
      addUploader () {
        this.$set(this.uploaders, this.name + 'uploader' + this.uploaderIndex++, {
          useAddBtn: true,
          multiple: this.field.config && this.field.config.multiple,
          qiniuLoader: null
        })
        this.updateLabelHeight()
      },
      // 删除文件上传条
      removeUploader (uploaderId) {
        // this.$delete(this.uploaders, uploaderId)
        this.$refs[uploaderId][0].$el.remove()
        this.updateLabelHeight()
      },
      // 更新表单控件label高度
      updateLabelHeight () {
        this.$nextTick(function () {
          let itemContentEl = this.$el.querySelector('.ivu-form-item-content')
          if (itemContentEl) {
            let height = itemContentEl.offsetHeight
            this.$el.querySelector('label').style.height = height + 'px'
            this.$el.querySelector('label').style.lineHeight = (height - 18) + 'px'
          }
        })
      },
      calculateModel (type, targetName) {
        if (type === 'add') {
          this.formModel[this.name].add(targetName)
        } else {
          this.formModel[this.name].delete(targetName)
        }
      },
      test () {
        // debugger
      }
    },
    components: {
      FileUploader
    },
    computed: {
      computedLabelWidth () {
        let width = (this.field.label.length + 1) * 12 + 20
        return Math.max(this.labelWidth, width)
      }
    },
    mounted () {
      this.updateLabelHeight()
    },
    beforeDestroy () {
      delete this.formModel[this.name]
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
