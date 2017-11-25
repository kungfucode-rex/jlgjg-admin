<template>
  <Form-item :prop="name"
             :label="field.label"
             :label-width="computedLabelWidth"
             :class="formItemClass">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <PicUploader :model="formModel[name]"
                 :fieldName="name"
                 :field="field"></PicUploader>
  </Form-item>
</template>
<script>
  import PicUploader from 'components/upload/PicUploader'
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
          'pic-upload-item': true
        }
      }
    },
    created () {},
    methods: {},
    components: {
      PicUploader
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
  .pic-upload-item
    label
      height: 60px;
      line-height: 40px!important;
</style>
