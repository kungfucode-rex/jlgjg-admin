<template>
  <Modal v-model="formConfig.open"
         class="form-modal"
         @on-ok="onOk"
         :ok-text="formConfig.okText"
         @on-cancel="onCancel"
         :cancel-text="formConfig.cancelText"
         :closable="false"
         :mask-closable="false"
         :title="title">
    <Form :model="formModel" inline
          :rules="formRules"
          ref="form"
          :style="formStyle"
          :label-position="labelPosition"
          :label-width="labelWidth">
      <template v-for="(field, name) in formItems">
        <template v-if="checkFieldType(field.type, 'text', name)">
          <FormInput :name="name"
                     :field="field"
                     :label-width="labelWidth"
                     :form-model="formModel"></FormInput>
        </template>
        <template v-if="checkFieldType(field.type, 'date', name)">
          <FormDate :name="name"
                    :field="field"
                    :label-width="labelWidth"
                    v-on:change="changeHandler(name, field)"
                    :form-model="formModel"></FormDate>
        </template>
        <template v-if="checkFieldType(field.type, 'time', name)">
          <FormTime :name="name"
                    :field="field"
                    :label-width="labelWidth"
                    v-on:change="changeHandler(name, field)"
                    :form-model="formModel"></FormTime>
        </template>
        <template v-if="checkFieldType(field.type, 'datetime', name)">
          <FormDateTime :name="name"
                        :field="field"
                        :label-width="labelWidth"
                        v-on:change="changeHandler(name, field)"
                        :form-model="formModel"></FormDateTime>
        </template>
        <template v-if="checkFieldType(field.type, 'daterange', name)">
          <FormDateRange :name="name"
                         :field="field"
                         :label-width="labelWidth"
                         v-on:change="changeHandler(name, field)"
                         :form-model="formModel"></FormDateRange>
        </template>
        <template v-if="checkFieldType(field.type, 'timerange', name)">
          <FormTimeRange :name="name"
                         :field="field"
                         :label-width="labelWidth"
                         v-on:change="changeHandler(name, field)"
                         :form-model="formModel"></FormTimeRange>
        </template>
        <template v-if="checkFieldType(field.type, 'datetimerange', name)">
          <FormDateTimeRange :name="name"
                             :field="field"
                             :label-width="labelWidth"
                             v-on:change="changeHandler(name, field)"
                             :form-model="formModel"></FormDateTimeRange>
        </template>
        <template v-if="checkFieldType(field.type, 'select', name)">
          <FormSelect :name="name"
                      :field="field"
                      :label-width="labelWidth"
                      v-on:change="changeHandler(name, field)"
                      :form-model="formModel"></FormSelect>
        </template>
        <template v-if="checkFieldType(field.type, 'radio', name)">
          <FormRadio :name="name"
                     :field="field"
                     :label-width="labelWidth"
                     v-on:change="changeHandler(name, field)"
                     :form-model="formModel"></FormRadio>
        </template>
        <template v-if="checkFieldType(field.type, 'checkbox', name)">
          <FormCheckBox :name="name"
                        :field="field"
                        :label-width="labelWidth"
                        v-on:change="changeHandler(name, field)"
                        :form-model="formModel"></FormCheckBox>
        </template>
      </template>
    </Form>
  </Modal>
</template>
<script>
  import FormInput from 'components/formPage/FormInput'
  import FormDate from 'components/formPage/FormDate'
  import FormTime from 'components/formPage/FormTime'
  import FormDateTime from 'components/formPage/FormDateTime'
  import FormDateRange from 'components/formPage/FormDateRange'
  import FormTimeRange from 'components/formPage/FormTimeRange'
  import FormDateTimeRange from 'components/formPage/FormDateTimeRange'
  import FormSelect from 'components/formPage/FormSelect'
  import FormRadio from 'components/formPage/FormRadio'
  import FormCheckBox from 'components/formPage/FormCheckBox'
  export default {
    props: {
      formConfig: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        formModel: this.formConfig.formModel,
        open: this.formConfig.open || false,
        formItems: this.formConfig.formItems,
        formRules: this.formConfig.formRules,
        formActions: this.formConfig.formActions,
        formStyle: this.formConfig.formStyle || {width: '80%'},
        labelWidth: this.formConfig.labelWidth || 80,
        title: this.formConfig.title || '没名字的对话框',
        labelPosition: 'left',
        queryFormLabelClass: 'query-form-label',
        timeFields: new Set(),
        dateFields: new Set(),
        datetimeFields: new Set(),
        dateRangeFields: new Set(),
        timeRangeFields: new Set(),
        datetimeRangeFields: new Set()
      }
    },
    components: {
      FormInput,
      FormDate,
      FormTime,
      FormDateTime,
      FormDateRange,
      FormTimeRange,
      FormDateTimeRange,
      FormSelect,
      FormRadio,
      FormCheckBox
    },
    created () {
      // 如果没有设置open属性，则自动添加一个
      if (!this.formConfig.open) {
        this.$set(this.formConfig, 'open', false)
      }
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
      for (let item in this.formItems) {
        this.$set(this.formModel, item, this.formItems[item].value || getDefaultValueByField(this.formItems[item]))
      }
    },
    methods: {
      onOk () {
        let self = this
        this.$refs['form'].validate(valid => {
          if (valid) {
            let resultData = JSON.parse(JSON.stringify(self.formModel))
            // 处理后需要删除的属性
            let needRemoveFiles = new Set()
            // 处理日期字段的数据
            for (let name of self.dateFields) {
              resultData[name] = self.formModel[name]
                ? self.$moment(self.formModel[name]).format('YYYY-MM-DD') : ''
            }
            // 处理时间字段的数据
            for (let name of self.timeFields) {
              resultData[name] = self.formModel[name]
                ? self.$moment(self.formModel[name]).format('HH:mm:ss') : ''
            }
            // 处理日期时间字段的数据
            for (let name of self.datetimeFields) {
              resultData[name] = self.formModel[name]
                ? self.$moment(self.formModel[name]).format('YYYY-MM-DD HH:mm:ss') : ''
            }
            // 处理日期范围字段的数据
            for (let item of self.dateRangeFields) {
              needRemoveFiles.add(item.field)
              resultData[item.subField] = self.formModel[item.field][item.index]
                ? self.$moment(self.formModel[item.field][item.index]).format('YYYY-MM-DD') : ''
            }
            // 处理时间范围字段的数据
            for (let item of self.timeRangeFields) {
              needRemoveFiles.add(item.field)
              resultData[item.subField] = self.formModel[item.field][item.index]
                ? self.$moment(self.formModel[item.field][item.index]).format('HH:mm:ss') : ''
            }
            // 处理时间范围字段的数据
            for (let item of self.datetimeRangeFields) {
              needRemoveFiles.add(item.field)
              resultData[item.subField] = self.formModel[item.field][item.index]
                ? self.$moment(self.formModel[item.field][item.index]).format('YYYY-MM-DD HH:mm:ss') : ''
            }
            // 删掉范围主字段，返回给用户
            for (let item of needRemoveFiles) {
              delete resultData[item]
            }
            this.formConfig.onOk(resultData)
          } else {
            return false
          }
        })
      },
      onCancel () {
        if (this.formConfig.onCancel) {
          this.formConfig.onCancel()
        }
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
          }
          return true
        }
        return false
      },
      changeHandler (name, field) {
        field.onChange && field.onChange()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../styles/common'
  .form-modal
    form
      .ivu-form-item.full-column
        width: G_FORM_FULL_COLUMN_WIDGET_WIDTH
      .ivu-form-item.half-column
        width: G_FORM_HALF_COLUMN_WIDGET_WIDTH
      .ivu-form-item
        margin-bottom: 24px
        >label
          background: #eee
          padding: 9px 10px
          border: 1px solid #dddee1
          box-sizing: border-box
          border-right: 0
          border-radius: 6px 0 0 6px
        input, .ivu-select-selection
          border-radius: 0 4px 4px 0
      .margin-top
        margin-top: -1px
        label
          margin-top: 1px
</style>
