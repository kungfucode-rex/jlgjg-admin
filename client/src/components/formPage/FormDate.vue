<template>
  <Form-item :prop="name"
             :class="formItemClass"
             :label-width="computedLabelWidth"
             :label="field.label">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <Date-picker :type="dateType"
                 v-model="formModel[name]"
                 :readonly="field.readonly"
                 :disabled="field.disabled"
                 :format="field.config && field.config.format"
                 :options="field.config && field.config.options"
                 @on-change="changeHandler"
                 :placeholder="field.placeholder || '选择日期'"></Date-picker>
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
    methods: {
      changeHandler () {
        this.$emit('change')
      }
    },
    data () {
      return {
        formItemClass: {
          'full-column': !this.field.halfColumn,
          'half-column': this.field.halfColumn
        }
      }
    },
    computed: {
      computedLabelWidth () {
        let width = (this.field.label.length + 1) * 12 + 20
        return Math.max(this.labelWidth, width)
      },
      dateType () {
        if (this.field.config) {
          if (this.field.config.onlyYear === true) {
            return 'year'
          } else if (this.field.config.onlyMonth === true) {
            return 'month'
          }
        } else {
          return 'date'
        }
      }
    },
    beforeDestroy () {
      console.log('before destroy:' + this.formModel[this.name])
      delete this.formModel[this.name]
      console.log('after destroy:' + this.formModel[this.name])
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
