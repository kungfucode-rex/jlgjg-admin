<template>
  <Form-item :prop="name"
             :label-width="computedLabelWidth"
             :class="formItemClass"
             :label="field.label">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <Dropdown style="position: absolute;left:-15px;">
      <Icon type="arrow-down-b"></Icon>
      <Dropdown-menu slot="list">
        <Dropdown-item @click.prevent.native="handleCheckAll">全选</Dropdown-item>
        <Dropdown-item @click.prevent.native="handleReverseCheck">反选</Dropdown-item>
      </Dropdown-menu>
    </Dropdown>
    <Checkbox-group v-model="formModel[name]"
                    class="form-checkbox-group"
                    @on-change="changeHandler">
      <template v-if="field.config.data && field.config.data.constructor === Array"
                v-for="item in field.config.data">
        <Checkbox :label="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Checkbox>
      </template>
    </Checkbox-group>
  </Form-item>
</template>
<script>
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
    created () {
      // 如果formModel中没有此控件, 则加进去
      if (this.formModel[this.name] === undefined) {
        this.$set(this.formModel, this.name, this.field.value || [])
      }
    },
    methods: {
      changeHandler () {
        this.$emit('change')
      },
      handleCheckAll () {
        // 全选
        if (this.formModel[this.name].length !== (this.allEnableData.concat(...this.allDisabledDefaultData)).length) {
          this.$set(this.formModel, this.name, this.allEnableData.concat(this.allDisabledDefaultData))
        } else {
          // 反选
          this.formModel[this.name] = [].concat(this.allDisabledDefaultData)
        }
      },
      handleReverseCheck () {
        let needChecked = []
        let needUnChecked = []
        this.allEnableData.forEach((item) => {
          if (this.formModel[this.name].indexOf(item) === -1) {
            needChecked.push(item)
          } else {
            needUnChecked.push(item)
          }
        })
        this.formModel[this.name] = needChecked.concat(this.allDisabledDefaultData)
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
    data () {
      return {
        formItemClass: {
          'margin-top': true,
          'full-column': !this.field.halfColumn,
          'half-column': this.field.halfColumn
        }
      }
    },
    mounted () {
      // 判断如果使用了没有加载好的全局状态码
      if (this.field.config.data && this.field.config.data.codeName) {
        this.waitingDataBySyscode()
      }
    },
    computed: {
      computedLabelWidth () {
        let width = (this.field.label.length + 2) * 12 + 20
        return Math.max(this.labelWidth, width)
      },
      allEnableData () {
        let resultData = []
        this.field.config.data.forEach(item => {
          if (!item.disabled) {
            resultData.push(item.value)
          }
        })
        return resultData
      },
      allDisabledDefaultData () {
        let resultData = []
        this.field.config.data.forEach(item => {
          if (item.disabled && this.field.value.indexOf(item.value) !== -1) {
            resultData.push(item.value)
          }
        })
        return resultData
      }
    },
    beforeDestroy () {
      delete this.formModel[this.name]
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .form-checkbox-group
    border: 1px solid #dddee1;
    box-sizing: border-box;
    min-height: 32px;
    margin-top: 1px;
    padding: 0 10px;
    line-height: 29px;
    width: 100%;
</style>
