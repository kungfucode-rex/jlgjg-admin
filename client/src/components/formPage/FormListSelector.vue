<template>
  <Form-item :prop="name"
             :label-width="0"
             :class="formItemClass">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <Table :columns="field.config.columns"
           :show-header="true"
           size="small"
           no-data-text="无数据"
           :data="field.config.listData">
      <div slot="header">
        <div class="header-title">
          {{field.label}}
        </div>
        <div class="head-actions">
          <template v-for="btn in field.config.actions">
            <Button :type="btn.style"
                    size="small"
                    @click="btn.handler">{{btn.text}}</Button>
          </template>
          <Tooltip content="删除全部" placement="right-start">
            <Button v-if="field.config.cleanBtn === true"
                    class="clean-btn"
                    type="error"
                    size="small"
                    icon="trash-a"
                    @click="deleteAll()"></Button>
          </Tooltip>
        </div>
      </div>
    </Table>
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
    data () {
      return {
        formItemClass: {
          'listSelection': true,
          'margin-top': true,
          'full-column': !this.field.halfColumn,
          'half-column': this.field.halfColumn
        }
      }
    },
    created () {
      // 根据配置初始化 model
      this.refreshValue()
      // 如果canDelete为true,则在表格后追加一列删除按钮
      if (this.field.config.canDelete === true) {
        this.field.config.columns.push({
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.delete(params)
                  }
                }
              }, '删除')
            ])
          }
        })
      }
    },
    methods: {
      deleteAll () {
        this.field.config.listData = []
        this.refreshValue()
      },
      delete (params) {
        this.field.config.listData.splice(params.index, 1)
        this.refreshValue()
      },
      refreshValue () {
        // console.log('field changed')
        // 默认submitFields为 [idKey]
        let listData = this.field.config.listData
        let idKey = this.field.config.idKey || 'id'
        let resultValue
        let submitFields = this.field.config.submitFields
        // 如果为多选
        if (this.field.config.multiple === true) {
          // 提交所有字段
          if (submitFields && submitFields === 'all') {
            resultValue = listData.map(function (obj) {
              return obj
            })
          } else if (submitFields) {
            // 提交指定的字段
            resultValue = listData.map(function (obj) {
              let tempObj = {}
              submitFields.forEach(function (key) {
                tempObj[key] = obj[key]
              })
              return tempObj
            })
          } else {
            // 提交默认idKey
            resultValue = listData.map(function (obj) {
              return obj[idKey]
            })
          }
          // 如果为单选
        } else {
          if (listData.length > 0) {
            let obj = listData[0]
            // 提交所有字段
            if (submitFields && submitFields === 'all') {
              resultValue = obj
            } else if (submitFields) {
              let tempObj = {}
              submitFields.forEach(function (key) {
                tempObj[key] = obj[key]
              })
              resultValue = tempObj
            } else {
              resultValue = obj[idKey]
            }
          }
        }
        this.$set(this.formModel, this.name, resultValue)
        this.$emit('change')
      }
    },
    computed: {},
    beforeDestroy () {
      delete this.formModel[this.name]
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .listSelection
    width: calc(100% - 30px)
    .ivu-form-item-content
      margin-left: 0 !important
    .ivu-table-title
      padding: 0 10px
      height: 32px
      line-height: 32px
      background-color: #eee
      .header-title
        float: left
      .head-actions
        line-height: 30px
        float: right
    .clean-btn
      i
        font-size: 14px
</style>
