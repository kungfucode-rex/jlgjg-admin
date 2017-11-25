<template>
  <Form-item :prop="name"
             :label-width="computedLabelWidth"
             :class="formItemClass"
             :label="field.label">
    <Tooltip v-if="field.desc" placement="top" class="form-item-help">
      <Icon class="form-item-help-icon" type="help-circled"></Icon>
      <div slot="content">{{field.desc}}</div>
    </Tooltip>
    <Radio-group v-model="formModel[name]"
                 class="form-radio-group"
                 @on-change="changeHandler">
      <template v-for="item in (field.config.data || [])">
        <Radio :label="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Radio>
      </template>
    </Radio-group>
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
        this.formModel[this.name] = this.field.value || ''
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
  .form-radio-group
    border: 1px solid #dddee1;
    box-sizing: border-box;
    min-height: 32px;
    margin-top: 1px;
    padding: 0 10px;
    line-height: 29px;
    width: 100%;
</style>
