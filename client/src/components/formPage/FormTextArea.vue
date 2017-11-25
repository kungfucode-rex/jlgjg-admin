<template>
  <Form-item :prop="name"
             :label="field.label"
             :label-width="computedLabelWidth"
             :class="formItemClass">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <quill-editor v-model="formModel[name]"
                  v-if="field.config && field.config.useRichText === true"
                  class="x2-quill-editor"
                  :style="{height: field.config.height || '300px'}"
                  :options="field.config.quillEditorOptions"></quill-editor>
    <i-input v-else type="textarea"
             :rows="3"
             v-model="formModel[name]"
             :readonly="field.readonly"
             :maxlength="field.maxlength"
             :disabled="field.disabled"
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
          'full-column': true,
          'half-column': false
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
  .ivu-input-wrapper
    textarea
      border-radius: 0 4px 4px 0

  .x2-quill-editor
    height: 100%
    display: flex
    flex-direction: column
    .ql-toolbar
      .ql-formats
        line-height: 24px
        border: 1px solid #dddee1
    .ql-container
      flex-grow: 1
      height: auto !important
</style>
