<template>
  <Card class="form-page" :class="{'just-form-items': this.justFormItems}">
    <p slot="title">{{this.formConfig.formTitle}}</p>
    <Form :model="formModel" inline
          :rules="getFormRules()"
          ref="form"
          :style="formStyle"
          :label-position="labelPosition"
          :label-width="labelWidth">
      <template v-for="(field, name) in formItems">
        <template v-if="field.slot">
          <slot :name="name"></slot>
        </template>
        <template v-else>
          <template v-if="field.type === 'spliter'">
            <div class="form-spliter">{{field.label}}</div>
          </template>
          <template v-if="checkFieldType(field.type, 'text', name)">
            <FormInput :name="name"
                       v-if="field.show !== false"
                       :field="field"
                       :label-width="labelWidth"
                       :form-model="formModel"></FormInput>
          </template>
          <template v-if="checkFieldType(field.type, 'textarea', name)">
            <FormTextArea :name="name"
                          v-if="field.show !== false"
                          :field="field"
                          :label-width="labelWidth"
                          :form-model="formModel"></FormTextArea>
          </template>
          <template v-if="checkFieldType(field.type, 'date', name)">
            <FormDate :name="name"
                      v-if="field.show !== false"
                      :field="field"
                      :label-width="labelWidth"
                      v-on:change="changeHandler(name, field)"
                      :form-model="formModel"></FormDate>
          </template>
          <template v-if="checkFieldType(field.type, 'time', name)">
            <FormTime :name="name"
                      v-if="field.show !== false"
                      :field="field"
                      :label-width="labelWidth"
                      v-on:change="changeHandler(name, field)"
                      :form-model="formModel"></FormTime>
          </template>
          <template v-if="checkFieldType(field.type, 'datetime', name)">
            <FormDateTime :name="name"
                          v-if="field.show !== false"
                          :field="field"
                          :label-width="labelWidth"
                          v-on:change="changeHandler(name, field)"
                          :form-model="formModel"></FormDateTime>
          </template>
          <template v-if="checkFieldType(field.type, 'daterange', name)">
            <FormDateRange :name="name"
                           v-if="field.show !== false"
                           :field="field"
                           :label-width="labelWidth"
                           v-on:change="changeHandler(name, field)"
                           :form-model="formModel"></FormDateRange>
          </template>
          <template v-if="checkFieldType(field.type, 'timerange', name)">
            <FormTimeRange :name="name"
                           v-if="field.show !== false"
                           :field="field"
                           :label-width="labelWidth"
                           v-on:change="changeHandler(name, field)"
                           :form-model="formModel"></FormTimeRange>
          </template>
          <template v-if="checkFieldType(field.type, 'datetimerange', name)">
            <FormDateTimeRange :name="name"
                               v-if="field.show !== false"
                               :field="field"
                               :label-width="labelWidth"
                               v-on:change="changeHandler(name, field)"
                               :form-model="formModel"></FormDateTimeRange>
          </template>
          <template v-if="checkFieldType(field.type, 'select', name)">
            <FormSelect :name="name"
                        v-if="field.show !== false"
                        :ref="name"
                        :field="field"
                        :label-width="labelWidth"
                        v-on:change="changeHandler(name, field)"
                        :be-cascaded-fields="beCascadedFields"
                        :form-model="formModel"></FormSelect>
          </template>
          <template v-if="checkFieldType(field.type, 'radio', name)">
            <FormRadio :name="name"
                       v-if="field.show !== false"
                       :field="field"
                       :label-width="labelWidth"
                       v-on:change="changeHandler(name, field)"
                       :form-model="formModel"></FormRadio>
          </template>
          <template v-if="checkFieldType(field.type, 'checkbox', name)">
            <FormCheckBox :name="name"
                          v-if="field.show !== false"
                          :field="field"
                          :label-width="labelWidth"
                          v-on:change="changeHandler(name, field)"
                          :form-model="formModel"></FormCheckBox>
          </template>
          <template v-if="checkFieldType(field.type, 'fileuploader', name)">
            <FormFileUploader :name="name"
                              v-if="field.show !== false"
                              :field="field"
                              :label-width="labelWidth"
                              v-on:change="changeHandler(name, field)"
                              :form-model="formModel"></FormFileUploader>
          </template>
          <template v-if="checkFieldType(field.type, 'picuploader', name)">
            <FormPicUploader :name="name"
                             v-if="field.show !== false"
                             :field="field"
                             :label-width="labelWidth"
                             v-on:change="changeHandler(name, field)"
                             :form-model="formModel"></FormPicUploader>
          </template>
          <template v-if="checkFieldType(field.type, 'listSelector', name)">
            <FormListSelector :name="name"
                              v-if="field.show !== false"
                              :ref="name"
                              :field="field"
                              :label-width="labelWidth"
                              v-on:change="changeHandler(name, field)"
                              :form-model="formModel"></FormListSelector>
          </template>
        </template>
      </template>
      <Row justify="center" class="form-actions-container" v-if="!this.justFormItems">
        <iCol span="24">
          <Form-item>
            <template v-for="btn in formActions">
              <template v-if="btn.type === 'submit'">
                <Button type="primary" :disabled="submitDisabled"
                        @click="actionHandler(btn)">{{btn.text}}
                </Button>
              </template>
              <template v-else>
                <Button :type="btn.type === 'cancel' ? 'ghost' : btn.style"
                        @click="actionHandler(btn)">{{btn.text}}
                </Button>
              </template>
            </template>
          </Form-item>
        </iCol>
      </Row>
    </Form>
  </Card>
</template>
<script>
  import FormInput from 'components/formPage/FormInput'
  import FormTextArea from 'components/formPage/FormTextArea'
  import FormDate from 'components/formPage/FormDate'
  import FormTime from 'components/formPage/FormTime'
  import FormDateTime from 'components/formPage/FormDateTime'
  import FormDateRange from 'components/formPage/FormDateRange'
  import FormTimeRange from 'components/formPage/FormTimeRange'
  import FormDateTimeRange from 'components/formPage/FormDateTimeRange'
  import FormSelect from 'components/formPage/FormSelect'
  import FormRadio from 'components/formPage/FormRadio'
  import FormCheckBox from 'components/formPage/FormCheckBox'
  import FormFileUploader from 'components/formPage/FormFileUploader'
  import FormPicUploader from 'components/formPage/FormPicUploader'
  import FormListSelector from 'components/formPage/FormListSelector'
  import qs from 'qs'
  export default {
    props: {
      formConfig: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        beCascadedFields: [], // 标记哪些是被级联的字段
        submitDisabled: false,
        justFormItems: this.formConfig.justFormItems,
        formModel: this.formConfig.formModel,
        formItems: this.formConfig.formItems,
        formRules: this.formConfig.formRules,
        formRulesBackUP: {},
        formActions: this.formConfig.formActions,
        formStyle: this.formConfig.formStyle || {width: '80%'},
        labelWidth: this.formConfig.labelWidth || 80,
        labelPosition: 'left',
        queryFormLabelClass: 'query-form-label',
        timeFields: new Set(),
        dateFields: new Set(),
        datetimeFields: new Set(),
        dateRangeFields: new Set(),
        timeRangeFields: new Set(),
        datetimeRangeFields: new Set(),
        fileUploadFields: new Set(),
        picUploadFields: new Set()
      }
    },
    created () {
      let getDefaultValueByField = function (field) {
        let defaultValue = field.value
        switch (field.type) {
          case 'select':
            if (field.config.multiple) {
              defaultValue = defaultValue || []
            } else {
              defaultValue = defaultValue || ''
            }
            break
          case 'daterange':
          case 'timerange':
          case 'datetimerange':
            defaultValue = field.fieldsValue || []
            break
          case 'picuploader':
            defaultValue = new Set()
            if (field.config && field.config.multiple && field.value) {
              field.value.forEach(url => {
                defaultValue.add(url)
              })
            } else if (field.value) {
              defaultValue.add(field.value)
            }
            break
        }
        return defaultValue
      }
      for (let item in this.formItems) {
        let field = this.formItems[item]
        this.$set(this.formModel, item, getDefaultValueByField(field))
      }
      // 备份验证规则
      this.formRulesBackUP = JSON.parse(JSON.stringify(this.formRules))
    },
    methods: {
      /**
       * 显示表单控件
       */
      showItems (itemNames) {
        let self = this
        itemNames.forEach(item => {
          if (['timerange'].indexOf(self.formItems[item].type) === -1) {
            self.$set(self.formItems[item], 'show', true)
          } else {
            console.log('暂不支持显示[' + self.formItems[item].type + ']类型的控件!')
          }
        })
      },
      /**
       * 隐藏表单控件
       */
      hideItems (itemNames) {
        let self = this
        itemNames.forEach(item => {
          if (['timerange'].indexOf(self.formItems[item].type) === -1) {
            self.$set(self.formItems[item], 'show', false)
          } else {
            console.log('暂不支持隐藏[' + self.formItems[item].type + ']类型的控件!')
          }
        })
      },
      /**
       * 遍历表单校验规则，
       * */
      getFormRules () {
        let self = this
        for (let field in this.formRules) {
          this.formRules[field].forEach((rule) => {
            // 遇到remote时单独处理
            if (rule.remote) {
              rule.validator = this.getRemoteValidator(rule)
            }
            // 遇到上传组件时单独处理
            if (['fileuploader', 'picuploader'].indexOf(self.formItems[field].type) !== -1 && rule.required === true && rule.transform === undefined) {
              rule.transform = function (value) {
                return Array.from(value)
              }
            }
          })
        }
        return this.formRules
      },
      /**
       * 返回一个异步校验的验证器
       * */
      getRemoteValidator (oldRule) {
        let self = this
        return function (rule, value, callback, source, options) {
          var errors = []
          // 获取postData的数据
          let _postData = {}
          if (rule.postData) {
            rule.postData.forEach(field => {
              _postData[field] = self.formModel[field]
            })
          } else {
            _postData[rule.field] = value
          }
          self.$http.post(rule.remote, _postData)
            .then((response) => {
              console.log(response.data)
              if (response.data === false) {
                errors.push(rule.message)
                callback(errors)
              } else {
                callback()
              }
            }, (response) => {
              self.$Notice.warning({
                title: '异步校验请求失败',
                desc: '/isAvailableName post error!'
              })
              callback(new Error('异步校验请求失败'))
            })
        }
      },
      /**
       * 表单操作按钮的处理
       * */
      actionHandler (button) {
        let self = this
        // 如果是提交按钮
        if (button.type === 'submit') {
          // 验证表单
          this.$refs['form'].validate(valid => {
            // 如果验证成功
            if (valid) {
              let postData = this.getFormData()
              // 如果提交前需要处理提交数据
              if (self.formConfig.beforeSubmit) {
                postData = self.formConfig.beforeSubmit(postData)
              }
              // 可以在beforeSubmit中手动返回false, 来阻止发送提交请求
              if (postData === false) {
                return
              }
              console.log('postData:')
              console.log(postData)
              // 提交表单
              self.submitDisabled = true
              if (self.formConfig.formUrl) {
                // 封装ajax配置对象
                let ajaxConfig = {}
                ajaxConfig.url = self.formConfig.formUrl
                ajaxConfig.method = self.formConfig.actionType || 'post'
                if ('putpostpatch'.indexOf(ajaxConfig.method) !== -1) {
                  // 如果是put,post,patch
                  ajaxConfig.data = postData || {}
                } else {
                  // 如果不是put,post,patch
                  ajaxConfig.params = postData || {}
                  ajaxConfig.paramsSerializer = function (params) {
                    return qs.stringify(params)
                  }
                }
                self.$http(ajaxConfig)
                  .then(response => {
                    self.submitDisabled = false
                    if (response.status === 200) {
                      // 如果有afterSubmit
                      if (self.formConfig.afterSubmit) {
                        self.formConfig.afterSubmit(response)
                      } else {
                        self.$Notice.success({
                          title: '操作成功'
                        })
                        self.$router.back()
                      }
                    }
                  })
                  .catch(function (err) {
                    self.submitDisabled = false
                    self.$Notice.error({
                      title: '操作失败',
                      desc: err.message
                    })
                  })
              }
            }
          })
        } else if (button.type === 'cancel') {
          // 如果是取消按钮则直接返回上一页
          if (button.handler) {
            button.handler()
          } else {
            self.$router.back()
          }
        } else {
          button.handler()
        }
      },
      /**
       * 手动触发表单验证方法，如果验证成功，将自动把表单数据也传到回掉函数中
       **/
      validate (callback) {
        this.$refs['form'].validate(valid => {
          let formData = null
          if (valid) {
            // 如果验证成功，将自动把表单数据也传到回掉函数中
            formData = this.getFormData()
          }
          callback(valid, formData)
        })
      },
      /**
       * 重置表单
       **/
      resetFields (callback) {
        this.$refs['form'].resetFields();
      },
      /**
       * 提取表单数据
       * */
      getFormData () {
        let self = this

        let resultData = JSON.parse(JSON.stringify(self.formModel, function (key, value) {
          return (value !== undefined && value !== null) ? value : ''
        }))

        // 处理后需要删除的属性
        let needRemoveFiles = new Set()
        // 处理日期字段的数据
        for (let name of self.dateFields) {
          if (self.formModel[name] !== undefined) {
            resultData[name] = self.formModel[name]
              ? self.$moment(self.formModel[name]).format('YYYY-MM-DD') : ''
          }
        }
        // 处理时间字段的数据
        for (let name of self.timeFields) {
          if (self.formModel[name] !== undefined) {
            resultData[name] = self.formModel[name]
              ? self.$moment(self.formModel[name]).format('HH:mm:ss') : ''
          }
        }
        // 处理日期时间字段的数据
        for (let name of self.datetimeFields) {
          if (self.formModel[name] !== undefined) {
            resultData[name] = self.formModel[name]
              ? self.$moment(self.formModel[name]).format('YYYY-MM-DD HH:mm:ss') : ''
          }
        }
        // 处理日期范围字段的数据
        for (let item of self.dateRangeFields) {
          if (self.formModel[item.field] !== undefined) {
            needRemoveFiles.add(item.field)
            resultData[item.subField] = self.formModel[item.field][item.index]
              ? self.$moment(self.formModel[item.field][item.index]).format('YYYY-MM-DD') : ''
          }
        }
        // 处理时间范围字段的数据
        for (let item of self.timeRangeFields) {
          if (self.formModel[item.field] !== undefined) {
            needRemoveFiles.add(item.field)
            resultData[item.subField] = self.formModel[item.field][item.index]
              ? self.$moment(self.formModel[item.field][item.index]).format('HH:mm:ss') : ''
          }
        }
        // 处理时间范围字段的数据
        for (let item of self.datetimeRangeFields) {
          if (self.formModel[item.field] !== undefined) {
            needRemoveFiles.add(item.field)
            resultData[item.subField] = self.formModel[item.field][item.index]
              ? self.$moment(self.formModel[item.field][item.index]).format('YYYY-MM-DD HH:mm:ss') : ''
          }
        }
        // 处理文件上传字段的数据
        for (let uploadFileItem of self.fileUploadFields) {
          if (self.formModel[uploadFileItem] !== undefined) {
            resultData[uploadFileItem] = ''
            for (let value of self.formModel[uploadFileItem]) {
              resultData[uploadFileItem] += value + ','
            }
            if (resultData[uploadFileItem].endsWith(',')) {
              resultData[uploadFileItem] = resultData[uploadFileItem].substr(0, resultData[uploadFileItem].length - 1)
            }
          }
        }
        // 处理图片上传字段的数据
        for (let uploadPicItem of self.picUploadFields) {
          if (self.formModel[uploadPicItem] !== undefined) {
            resultData[uploadPicItem] = ''
            for (let value of self.formModel[uploadPicItem]) {
              resultData[uploadPicItem] += value + ','
            }
            if (resultData[uploadPicItem].endsWith(',')) {
              resultData[uploadPicItem] = resultData[uploadPicItem].substr(0, resultData[uploadPicItem].length - 1)
            }
          }
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
        // 如果有合并项处理
        if (this.formConfig.collapseRules) {
          this.collapseAttrs(resultData, [], this.formConfig.collapseRules)
        }
        return resultData
      },
      /**
       * 检查表单项类型，范围控件需特殊处理
       * */
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
              let dateFieldsName = this.formItems[fieldName].fieldsName
              this.dateRangeFields.add({field: fieldName, subField: dateFieldsName[0], index: 0})
              this.dateRangeFields.add({field: fieldName, subField: dateFieldsName[1], index: 1})
              break
            case 'timerange':
              let timeFieldsName = this.formItems[fieldName].fieldsName
              this.timeRangeFields.add({field: fieldName, subField: timeFieldsName[0], index: 0})
              this.timeRangeFields.add({field: fieldName, subField: timeFieldsName[1], index: 1})
              break
            case 'datetimerange':
              let datetimeFieldsName = this.formItems[fieldName].fieldsName
              this.datetimeRangeFields.add({field: fieldName, subField: datetimeFieldsName[0], index: 0})
              this.datetimeRangeFields.add({field: fieldName, subField: datetimeFieldsName[1], index: 1})
              break
            case 'fileuploader':
              this.fileUploadFields.add(fieldName)
              break
            case 'picuploader':
              this.picUploadFields.add(fieldName)
              break
          }
          return true
        }
        return false
      },
      /**
       * 触发表单项的onchange函数，如果有的话
       * */
      changeHandler (name, field) {
        field.onChange && field.onChange(this.formModel[name])
        // 如果是select 有级联的话，触发级联
        if (field.type === 'select' && field.config.cascade) {
          if (typeof field.config.cascade === 'string') {
            this.$refs[field.config.cascade][0].requestData({data: this.formModel[name]})
          } else {
            let postData = {}
            postData[field.config.cascade.sendParam] = this.formModel[name]
            this.$refs[field.config.cascade.field][0].requestData(postData)
          }
        }
      },
      /**
       * 表单回填
       * */
      initFormData (initData) {
        let self = this
        if (typeof initData === 'function') {
          initData = initData()
        }
        // 如果有合并项处理
        if (this.formConfig.collapseRules) {
          this.expandAttrs(initData, [], this.formConfig.collapseRules)
        }
        // 遍历回填数据对象
        for (let item in initData) {
          if (item in this.formModel) {
            let formItem = this.formItems[item]
            if (formItem && formItem.type === 'listSelector') {
              this.acceptData(item, initData[item])
            } else if (formItem && formItem.type === 'date') {
              this.formModel[item] = new Date(initData[item])
            } else if (formItem && formItem.type === 'picuploader') {
              let defaultValue = new Set()
              if (this.formItems[item].config.multiple) {
                initData[item].forEach(url => {
                  defaultValue.add(url)
                })
              } else if (initData[item]) {
                defaultValue.add(initData[item])
              }
            } else {
              this.formModel[item] = initData[item]
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
              self.formModel[rangeField.field] = tmpFieldsValue
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
        }
      },
      /**
       * 合并对象属性，以简化后端操作，springMVC会自动的根据接收的数据结构进行对象实体的封装
       * @param data 合并前表单数据对象
       * @param attrsPath 正在合并的对象的路径（相对于根对象）
       * @param collapseItems 合并规则
       */
      collapseAttrs (data, attrsPath, collapseRules) {
        // 获取正在合并到的目标对象
        var settingData = data
        for (var j = 0; j < attrsPath.length; j++) {
          settingData = settingData[attrsPath[j]]
        }
        // 遍历合并目标对象
        for (var targetAttr in collapseRules) {
          settingData[targetAttr] = {}
          // 遍历此合并目标对象需要合并的字段
          for (var i = 0; i < collapseRules[targetAttr].length; i++) {
            var field = collapseRules[targetAttr][i]
            if (typeof field === 'string') {
              // 如果此字段是字符串，则直接合并
              if (this.formModel[field] !== undefined) {
                // 如果表单model中没有这一项, 则不合并此项
                settingData[targetAttr][field] = data[field]
              }
              delete data[field]
            } else {
              // 如果此字段任是合并规则，则继续递归合并
              attrsPath.push(targetAttr)
              this.collapseAttrs(data, attrsPath, field)
            }
          }
        }
      },
      /**
       * 展开对象属性，从后端拉取出来的数据，我们根据给定的属性合并规则，将其展开，主要用于表单回填
       * @param data 展开前需要回填到表单的数据
       * @param attrsPath 正在展开的对象路劲（相对于根对象）
       * @param expandItems 展开规则
       */
      expandAttrs (data, attrsPath, collapseRules) {
        // 获取正在展开的目标对象
        var settingData = data
        for (var j = 0; j < attrsPath.length; j++) {
          settingData = settingData[attrsPath[j]]
        }
        // 遍历需要展开的对象
        for (var targetAttr in collapseRules) {
          // 遍历需要展开的对象的字段
          for (var i = 0; i < collapseRules[targetAttr].length; i++) {
            var field = collapseRules[targetAttr][i]
            // 如果字段是字符串，则直接展开到最外层
            if (typeof field === 'string') {
              data[field] = settingData[targetAttr][field]
            } else {
              // 如果字段是展开规则，则继续递归展开
              attrsPath.push(targetAttr)
              this.expandAttrs(data, attrsPath, field)
            }
          }
          delete data[targetAttr]
        }
      },
      /**
       * 表单数据接收器，负责给各个表单控件填充数据
       * @param fieldName 表单控件对应的字段变量名
       * @param data 此控件需要接收的数据
       */
      acceptData (fieldName, data) {
        let field = this.formItems[fieldName]
        switch (field.type) {
          case 'select':
          case 'radio':
          case 'checkbox':
            // 如果是下拉框，单选框，复选框，则填充其optios选项
            field.config.data = data
            break
          case 'listSelector':
            // 如果是列表选择器，则分单选还是多选
            if (field.config.multiple === true) {
              // 如果是多选，则追加数据
              if (data.constructor === Array) {
                // 如果数据是数组，则连接
                field.config.listData = field.config.listData.concat(data)
              } else {
                // 如果是对象，则push
                field.config.listData.push(data)
              }
              // 给表格数据去重
              let idsArr = []
              let idKey = field.config['idKey'] || 'id'
              field.config.listData = field.config.listData.filter(function (obj) {
                let result = idsArr.indexOf(obj[idKey]) === -1
                idsArr.push(obj[idKey])
                return result
              })
            } else {
              // 如果是单选，则覆盖
              if (data.constructor === Array) {
                this.$Notice.error({title: '请选择单条数据'})
              } else {
                field.config.listData = [data]
              }
            }
            // 改变value的值
            this.$refs[fieldName][0].refreshValue()
            break
        }
      }
    },
    components: {
      FormInput,
      FormTextArea,
      FormDate,
      FormTime,
      FormDateTime,
      FormDateRange,
      FormTimeRange,
      FormDateTimeRange,
      FormSelect,
      FormRadio,
      FormCheckBox,
      FormFileUploader,
      FormPicUploader,
      FormListSelector
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../styles/common'
  .form-page
    .ivu-card-extra
      margin-top: -5px
      button
        margin-left: 10px
    form
      font-size: 0
      .ivu-form-item.full-column
        width: G_FORM_FULL_COLUMN_WIDGET_WIDTH
      .ivu-form-item.half-column
        width: G_FORM_HALF_COLUMN_WIDGET_WIDTH
      .ivu-form-item
        margin-bottom: 24px
        > label
          background: #eee
          padding: 9px 10px
          border: 1px solid #dddee1
          box-sizing: border-box
          border-right: 0
          border-radius: 6px 0 0 6px
        input, .ivu-select-selection
          margin-top: 1px
          border-radius: 0 4px 4px 0
      .margin-top
        margin-top: -1px
        label
          margin-top: 1px
      .form-actions-container
        button
          margin-right: 10px
      .form-item-help
        position: absolute
        right: -15px
        .form-item-help-icon
          font-size: 15px
          color: #ff9900
      .ivu-date-picker
        display: block
        input
          margin-top: 0
      .form-spliter
        font-size: 12px
        margin-bottom: 14px
        width: calc(100% - 30px)
        border-bottom: 1px solid #dddee1
        padding-bottom: 5px


  .ivu-form-inline
    .ivu-form-item
      margin-right: 30px

  .form-page.just-form-items
    border: none
    &:hover
      box-shadow: none
    .ivu-card-head
      display: none

</style>
