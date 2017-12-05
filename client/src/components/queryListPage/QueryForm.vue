<template>
  <Card style="margin-bottom: 10px;font-size: 0" class="query-form-card">
    <Row>
      <i-col span="20">
        <Form ref="queryForm"
              :model="formModel"
              :label-position="labelPosition" class="query-form"
              :label-width="labelWidth" inline>
          <template v-for="(field, name) in queryObject">
            <template v-if="checkFieldType(field.type, 'text', name)">
              <Form-item :prop="name"
                         :label="field.label"
                         :label-width="getLabelWidth(field)"
                         class="margin-top">
                <i-input type="text"
                         v-model="formModel[name]"
                         :style="{width: (field.width || widgetWidth) + 'px'}"
                         :placeholder="field.placeholder"></i-input>
              </Form-item>
            </template>
            <template v-else-if="checkFieldType(field.type, 'date', name)">
              <Form-item :prop="name"
                         :label-width="getLabelWidth(field)"
                         :label="field.label">
                <Date-picker type="date"
                             v-model="formModel[name]"
                             :style="{width: '110px'}"
                             :placeholder="field.placeholder || '选择日期'"></Date-picker>
              </Form-item>
            </template>
            <template v-else-if="checkFieldType(field.type, 'daterange', name)">
              <Form-item :prop="name"
                         :label-width="getLabelWidth(field)"
                         :label="field.label">
                <Date-picker type="daterange"
                             v-model="formModel[name]"
                             :style="{width: '180px'}"
                             :placeholder="field.placeholder || '选择日期段'"></Date-picker>
              </Form-item>
            </template>
            <template v-else-if="checkFieldType(field.type, 'time', name)">
              <Form-item :prop="name"
                         :label-width="getLabelWidth(field)"
                         :label="field.label">
                <Time-picker type="time"
                             v-model="formModel[name]"
                             :style="{width: '90px'}"
                             :placeholder="field.placeholder || '选择时间'"></Time-picker>
              </Form-item>
            </template>
            <template v-else-if="checkFieldType(field.type, 'timerange', name)">
              <Form-item :prop="name"
                         :label-width="getLabelWidth(field)"
                         :label="field.label">
                <Time-picker type="timerange"
                             v-model="formModel[name]"
                             :style="{width: '160px'}"
                             :placeholder="field.placeholder || '选择时间段'"></Time-picker>
              </Form-item>
            </template>
            <template v-else-if="checkFieldType(field.type, 'datetime', name)">
              <Form-item :prop="name"
                         :label-width="getLabelWidth(field)"
                         :label="field.label">
                <Date-picker type="datetime"
                             v-model="formModel[name]"
                             :style="{width: '150px'}"
                             :placeholder="field.placeholder || '选择日期时间'"></Date-picker>
              </Form-item>
            </template>
            <template v-else-if="checkFieldType(field.type, 'datetimerange', name)">
              <Form-item :prop="name"
                         :label-width="getLabelWidth(field)"
                         :label="field.label">
                <Date-picker type="datetimerange"
                             v-model="formModel[name]"
                             :style="{width: '280px'}"
                             :placeholder="field.placeholder || '选择日期时间段'"></Date-picker>
              </Form-item>
            </template>
            <template v-else-if="checkFieldType(field.type, 'select', name)">
              <Form-item :prop="name"
                         :label-width="getLabelWidth(field)"
                         class="margin-top"
                         :label="field.label">
                <Select v-model="formModel[name]"
                        v-if="field.show !== false"
                        :ref="name"
                        :multiple="field.config.multiple"
                        :clearSingleSelect="true"
                        :clearable="true"
                        :placeholder="field.placeholder || '请选择'"
                        :filterable="field.config.filterable"
                        @on-change="changeHandler(name)"
                        :style="{width: (field.width || widgetWidth) + 'px'}">
                  <template v-if="field.config.data instanceof Array ? true : !(needRefreshSelects[name] = true)"
                            v-for="(item, index) in field.config.data">
                    <Option :value="item.value" :key="index">{{ item.label }}</Option>
                  </template>
                </Select>
              </Form-item>
            </template>
          </template>
        </Form>
      </i-col>
      <i-col span="4" style="text-align: right;">
        <Button type="primary" @click="query" :disabled="!canQuery">查询</Button>
        <!-- <Button type="ghost" @click="test">Test</Button> -->
      </i-col>
    </Row>
  </Card>
</template>
<script>
  export default {
    props: {
      queryObject: {
        type: Object,
        required: true
      },
      pagerConfig: {
        type: Object,
        required: true
      },
      beforeQuery: {
        type: Function
      },
      labelWidth: {
        type: Number,
        default: 100
      },
      widgetWidth: {
        type: Number,
        default: 150
      },
      canQuery: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        tempIndex: 1,
        labelPosition: 'left',
        needRefreshSelects: [],
        queryFormLabelClass: 'query-form-label',
        beCascadedFields: [],
        timeFields: new Set(),
        dateFields: new Set(),
        datetimeFields: new Set(),
        dateRangeFields: new Set(),
        timeRangeFields: new Set(),
        datetimeRangeFields: new Set()
      }
    },
    computed: {
      /**
       * 将 queryObject 转化为 form model
       * @returns {{}}
       */
      formModel: function () {
        let getDefaultValueByField = function (field) {
          let defaultValue = ''
          switch (field.type) {
            case 'select':
              if (field.config.multiple) {
                defaultValue = []
              } else {
                defaultValue = ''
              }
              break
            case 'daterange':
            case 'timerange':
            case 'datetimerange':
              defaultValue = field.fieldsValue || ''
              break
          }
          return defaultValue
        }
        let model = {}
        for (let item in this.queryObject) {
          model[item] = this.queryObject[item].value || getDefaultValueByField(this.queryObject[item])
        }
        // console.log('queryForm formModel changed...')
        return model
      }
    },
    methods: {
      query () {
        // debugger
        // 禁止重复提交
        // this.$emit('disableQuery')
        let resultData = JSON.parse(JSON.stringify(this.formModel, function (key, value) {
          return (value !== undefined && value !== null) ? value : ''
        }))
        // 处理后需要删除的属性
        let needRemoveFiles = new Set()
        // 处理日期字段的数据
        for (let name of this.dateFields) {
          resultData[name] = this.formModel[name]
            ? this.$moment(this.formModel[name]).format('YYYY-MM-DD') : ''
        }
        // 处理时间字段的数据
        for (let name of this.timeFields) {
          resultData[name] = this.formModel[name]
            ? this.$moment(this.formModel[name]).format('HH:mm:ss') : ''
        }
        // 处理日期时间字段的数据
        for (let name of this.datetimeFields) {
          resultData[name] = this.formModel[name]
            ? this.$moment(this.formModel[name]).format('YYYY-MM-DD HH:mm:ss') : ''
        }
        // 处理日期范围字段的数据
        for (let item of this.dateRangeFields) {
          needRemoveFiles.add(item.field)
          resultData[item.subField] = this.formModel[item.field][item.index]
            ? this.$moment(this.formModel[item.field][item.index]).format('YYYY-MM-DD') : ''
        }
        // 处理时间范围字段的数据
        for (let item of this.timeRangeFields) {
          needRemoveFiles.add(item.field)
          resultData[item.subField] = this.formModel[item.field][item.index]
            ? this.$moment(this.formModel[item.field][item.index]).format('HH:mm:ss') : ''
        }
        // 处理时间范围字段的数据
        for (let item of this.datetimeRangeFields) {
          needRemoveFiles.add(item.field)
          resultData[item.subField] = this.formModel[item.field][item.index]
            ? this.$moment(this.formModel[item.field][item.index]).format('YYYY-MM-DD HH:mm:ss') : ''
        }
        // 删掉范围主字段，返回给用户
        for (let item of needRemoveFiles) {
          delete resultData[item]
        }
        // 对所有的数据进行trim操作
        for (let item in resultData) {
          if (resultData[item].trim) {
            resultData[item] = resultData[item].trim()
          }
        }
        resultData = this.mixinFistPagerInfo(resultData)
        // 回调用户的查询函数
        // resultData = this.beforeQuery ? this.beforeQuery(resultData) : resultData
        this.$emit('changPage', 1, resultData)
      },
      mixinFistPagerInfo (data) {
        // 生成第一页的pager信息
        let defaultPagerParams = {
          pageSize: 10,
          pageIndex: 1,
          pageOffset: 0
        }
        let pagerParams = {}
        // 肯定要有pageSize
        pagerParams[this.pagerConfig.pageSize] = defaultPagerParams.pageSize
        // 判断使用 pageIndex 还是 pageOffset
        if (this.pagerConfig.pageIndex) {
          // 使用 pageIndex
          pagerParams[this.pagerConfig.pageIndex] = defaultPagerParams.pageIndex
        } else {
          // 使用 pageOffset
          pagerParams[this.pagerConfig.pageOffset] = defaultPagerParams.pageOffset
        }
        // 将分页信息封装到查询条件中
        data = {...pagerParams, ...data}
        return data
      },
      checkFieldType (srcType, desType, fieldName) {
        if (srcType === desType) {
          switch (srcType) {
            case 'date':
              this.dateFields.add(fieldName)
              break
            case 'time':
              this.timeFields.add(fieldName)
              break
            case 'datetime':
              this.datetimeFields.add(fieldName)
              break
            case 'daterange':
              let dateFieldsName = this.queryObject[fieldName].fieldsName
              this.dateRangeFields.add({field: fieldName, subField: dateFieldsName[0], index: 0})
              this.dateRangeFields.add({field: fieldName, subField: dateFieldsName[1], index: 1})
              break
            case 'timerange':
              let timeFieldsName = this.queryObject[fieldName].fieldsName
              this.timeRangeFields.add({field: fieldName, subField: timeFieldsName[0], index: 0})
              this.timeRangeFields.add({field: fieldName, subField: timeFieldsName[1], index: 1})
              break
            case 'datetimerange':
              let datetimeFieldsName = this.queryObject[fieldName].fieldsName
              this.datetimeRangeFields.add({field: fieldName, subField: datetimeFieldsName[0], index: 0})
              this.datetimeRangeFields.add({field: fieldName, subField: datetimeFieldsName[1], index: 1})
              break
          }
          return true
        }
        return false
      },
      changeHandler (fieldName) {
        let field = this.queryObject[fieldName]
        // 如果是select 有级联的话，触发级联
        // debugger
        if (field.type === 'select' && field.config.cascade) {
          if (typeof field.config.cascade === 'string') {
            this.requestData(field.config.cascade, {data: this.formModel[fieldName]})
          } else {
            let postData = {}
            postData[field.config.cascade.sendParam] = this.formModel[fieldName]
            this.requestData(field.config.cascade, postData)
          }
        }
        if (field.onChange) {
          field.onChange()
        }
      },
      /**
       * 从url拉取数据，
       * parameter： value 往后台参数
       */
      requestData (fieldName, data) {
        let self = this
        let field = this.queryObject[fieldName]
        // 如果是级联的字段, 且没有传参数过来, 则直接返回
        if (this.beCascadedFields.indexOf(fieldName) !== -1 && data === undefined) return
        let defaultResponseConfig = {
          data: '',
          value: 'value',
          label: 'label'
        }
        let config = field.config
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
          if (data) {
            ajaxConfig.params = data || {}
            ajaxConfig.paramsSerializer = function (params) {
              return self.$qs.stringify(params)
            }
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
            // 如果是级联的select, 被迫这样处理, 后期待优化
            if (self.beCascadedFields.indexOf(fieldName) !== -1 && data !== undefined) {
              self.$set(self.queryObject[fieldName], 'show', false)
              self.$nextTick(() => {
                self.$set(self.queryObject[fieldName].config, 'data', result)
                let valueInModel = false
                // 判断如果之前的的value在result中, 则不用变, 否则选择置为空
                result.forEach((item) => {
                  if (item.value === self.formModel[fieldName]) {
                    valueInModel = true
                  }
                })
                if (valueInModel) {
                  // self.$set(self.queryObject[fieldName], 'value', item.value)
                } else {
                  self.$set(self.queryObject[fieldName], 'value', '')
                }
                self.$set(self.queryObject[fieldName], 'show', true)
              })
            } else {
              config.data = result
            }
          })
          .catch(function (e) {
            console.log(e)
          })
      },
      test () {
        debugger
      },
      // 表单回填
      initFormData (initData) {
        let self = this
        if (typeof initData === 'function') {
          initData = initData()
        }
        // 遍历回填数据对象
        for (let item in initData) {
          // 有级联属性的select回填不了数据了, 先把是select的控件都隐藏起来, 赋完值后再显示出来
          let needHideSelects = []
          if (item in self.formModel) {
            self.$set(self.queryObject[item], 'value', initData[item])
            if (self.queryObject[item].type === 'select') {
              needHideSelects.push(item)
              self.$set(self.queryObject[item], 'show', false)
            }
          } else {
            let finded = false
            let setRangeData = function (rangeField) {
              finded = true
              let tmpFieldsValue = []
              if (rangeField.index === 0) {
                tmpFieldsValue = [initData[item], self.formModel[rangeField.field][1]]
              } else {
                tmpFieldsValue = [self.formModel[rangeField.field][0], initData[item]]
              }
              self.$set(self.queryObject[rangeField.field], 'value', tmpFieldsValue)
            }
            self.dateRangeFields.forEach((rangeField) => {
              if (!finded && item === rangeField.subField) {
                setRangeData(rangeField)
              }
            })
            !finded && self.timeRangeFields.forEach((rangeField) => {
              if (!finded && item === rangeField.subField) {
                setRangeData(rangeField)
              }
            })
            !finded && self.datetimeRangeFields.forEach((rangeField) => {
              if (!finded && item === rangeField.subField) {
                setRangeData(rangeField)
              }
            })
          }
          // 将隐藏的select显示出来
          this.$nextTick(() => {
            needHideSelects.forEach(item => {
              self.$set(self.queryObject[item], 'show', true)
              // 表单的高度变化时刷新列表的高度
              this.$emit('updateHeight')
            })
          })
        }
      },
      getLabelWidth (field) {
        let width = (field.label.length + 1) * 12
        return Math.max(48, width)
      },
      isEmptyObject (e) {
        var t
        for (t in e) {
          return !1
        }
        return !0
      },
      // 页面上如果有引用还没初始化好的全局状态码
      waitingDataBySyscode () {
        let self = this
        setTimeout(() => {
          // 判断需要刷新的控件还有没有
          if (!self.isEmptyObject(self.needRefreshSelects)) {
            for (let fieldName in self.needRefreshSelects) {
              let codeName = self.queryObject[fieldName].config.data.codeName
              if (self.$SysCode[codeName] instanceof Array) {
                self.queryObject[fieldName].config.data = self.$SysCode[codeName]
                delete self.needRefreshSelects[fieldName]
              }
            }
            // 一轮判断完之后,如果还有需要等待的,则再去等待一遍
            if (!self.isEmptyObject(self.needRefreshSelects)) {
              self.waitingDataBySyscode()
            }
          }
        }, 500)
      }
    },
    mounted () {
      this.waitingDataBySyscode()
      // 遍历查询表单项
      for (let name in this.queryObject) {
        let field = this.queryObject[name]
        if (field.type === 'select') {
          // 如果有级联的字段
          if (field.config.cascade) {
            this.beCascadedFields.push(field.config.cascade)
          }
          // 如果有url
          if (field.config.url) {
            this.requestData(name)
          }
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .query-form
    .ivu-form-item
      margin-bottom: 10px
      label
        background: #eee
        padding: 9px 5px
        border: 1px solid #dddee1
        box-sizing: border-box
        border-right: 0
        border-radius: 6px 0 0 6px
      input, .ivu-select-selection
        border-radius: 0 4px 4px 0
      .ivu-date-picker-editor
        margin-top: -1px
    .margin-top
      margin-top: -1px
      label
        margin-top: 0.5px
</style>
