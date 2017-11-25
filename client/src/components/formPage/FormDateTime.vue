<template>
  <Form-item :prop="name"
             :class="formItemClass"
             :label-width="computedLabelWidth"
             :label="field.label">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <Date-picker type="datetime"
                 v-model="formModel[name]"
                 :readonly="field.readonly"
                 :disabled="field.disabled"
                 @on-change="changeHandler"
                 :placeholder="field.placeholder || '选择日期时间'"></Date-picker>
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
      }
    },
    beforeDestroy () {
      delete this.formModel[this.name]
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
