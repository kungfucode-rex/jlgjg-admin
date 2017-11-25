<template>
  <Form-item :prop="name"
             :label="field.label"
             :label-width="computedLabelWidth"
             :class="formItemClass">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <i-input :type="(field.config && field.config.isPassword) ? 'password' : 'text'"
             v-model="formModel[name]"
             :readonly="field.readonly"
             :disabled="field.disabled"
             :maxlength="field.maxlength"
             :style="{width: field.width ? field.width + 'px' : ''}"
             :placeholder="field.placeholder"></i-input>
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
          'margin-top': true,
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
