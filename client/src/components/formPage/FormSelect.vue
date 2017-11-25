<template>
  <Form-item :prop="name"
             :label-width="computedLabelWidth"
             :class="formItemClass"
             :label="field.label">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <Select v-model="formModel[name]"
            :placeholder="field.placeholder || '请选择'"
            :disabled="field.disabled"
            :clearSingleSelect="true"
            :clearable="true"
            :label-in-value="true"
            :multiple="field.config.multiple"
            @on-change="changeHandler"
            :filterable="field.config.filterable">
      <template v-if="field.config.data && field.config.data.constructor === Array" v-for="item in field.config.data">
        <Option :value="item.value" :key="item.value">{{ item.label }}</Option>
      </template>
    </Select>
  </Form-item>
</template>
<script>
  import qs from 'qs'
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
      },
      beCascadedFields: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        formItemClass: {
          'margin-top': true,
          'full-column': !this.field.halfColumn,
          'half-column': this.field.halfColumn
        }
      }
    },
    created () {
      // 如果formModel中没有此控件, 则加进去
      if (this.formModel[this.name] === undefined) {
        if (this.field.config.multiple) {
          this.formModel[this.name] = []
        } else {
          this.formModel[this.name] = ''
        }
      }
      // 如果需要提交label, 我们在formModel里加一项
      if (this.field.submitLabelTo) {
        this.$set(this.formModel, this.field.submitLabelTo, '')
      }
      // 如果没有config.data的话，初始化一个
      if (this.field.config.data === undefined) {
        this.$set(this.field.config, 'data', [])
      }
      if (this.field.config.url) {
        this.requestData()
      }
      // 如果提供了级联配置
      if (this.field.config.cascade) {
        if (typeof this.field.config.cascade === 'string') {
          this.beCascadedFields.push(this.field.config.cascade)
        } else {
          this.beCascadedFields.push(this.field.config.cascade.field)
        }
      }
    },
    computed: {
      computedLabelWidth () {
        let width = (this.field.label.length + 1) * 12 + 20
        return Math.max(this.labelWidth, width)
      }
    },
    methods: {
      changeHandler (option) {
        if (this.field.submitLabelTo && (option.value === '' || option.label !== '')) {
          this.formModel[this.field.submitLabelTo] = option.label
        }
        this.$emit('change')
      },
      /**
       * 从url拉取数据，
       * parameter： value 往后台参数
       */
      requestData (data) {
        // 如果是级联的字段, 且没有传参数过来, 则直接返回
        if (this.beCascadedFields.indexOf(this.name) !== -1 && data === undefined) return
        let defaultResponseConfig = {
          data: '',
          value: 'value',
          label: 'label'
        }
        let config = this.field.config
        let responseConfig = Object.assign({}, defaultResponseConfig, config.responseConfig)
        // 封装ajax配置对象
        let ajaxConfig = {}
        ajaxConfig.url = config.url
        ajaxConfig.method = config.actionType || 'get'
        if ('putpostpatch'.indexOf(ajaxConfig.method) !== -1) {
          // 如果是put,post,patch
          ajaxConfig.data = data || {}
        } else {
          // 如果不是put,post,patch
          ajaxConfig.params = data || {}
          ajaxConfig.paramsSerializer = function (params) {
            return qs.stringify(params)
          }
        }
        this.$http(ajaxConfig)
          .then(function (response) {
            let arr = []
            // 如果给定的属性中有'.', 则遍历将最终的属性值提取出来
            if (responseConfig.data.indexOf('.') !== -1) {
              arr = response.data
              let tempArr = responseConfig.data.split('.')
              tempArr.forEach(item => {
                arr = arr[item]
              })
            } else {
              arr = responseConfig.data ? response.data[responseConfig.data] : response.data
            }
            let result = []
            arr.forEach(function (item) {
              result.push({
                value: item[responseConfig.value],
                label: item[responseConfig.label]
              })
            })
            config.data = result
          })
          .catch(function (e) {
            console.log(`获取下拉控件【${this.name}】数据失败:`)
            console.log(e)
          })
      },
      // 如果使用了没有加载好的全局状态码
      waitingDataBySyscode () {
        let self = this
        let codeName = this.field.config.data.codeName
        // 判断如果使用了全局状态码
        if (codeName) {
          setTimeout(() => {
            if (this.$SysCode[codeName] instanceof Array) {
              // 等全局状态码加载完毕了, 更新选项数据
              this.field.config.data = this.$SysCode[codeName]
            } else {
              self.waitingDataBySyscode()
            }
          }, 500)
        }
      }
    },
    mounted () {
      // 判断如果使用了没有加载好的全局状态码
      if (this.field.config.data && this.field.config.data.codeName) {
        this.waitingDataBySyscode()
      }
    },
    beforeDestroy () {
      delete this.formModel[this.name]
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
