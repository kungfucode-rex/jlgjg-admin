<template>
  <div>
    <FormPage ref="goodsAddForm"
              :form-config="formConfig"></FormPage>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formConfig: {
          formTitle: '新增商品',
          formUrl: `${apiGoodsAdd}`,
          formModel: {},
          formItems: {
            name: {
              type: 'text',
              label: '名称',
              halfColumn: true
            },
            guige: {
              type: 'text',
              label: '规格',
              halfColumn: true
            },
            unit: {
              type: 'select',
              label: '单位',
              config: {
                data: this.$SysCode.UnitType
              },
              halfColumn: true
            },
            conversion: {
              type: 'text',
              label: '换算公式',
              halfColumn: true
            },
            quantity: {
              type: 'text',
              label: '数量',
              halfColumn: true
            },
            aprice: {
              type: 'text',
              label: '加权平均单价',
              halfColumn: true
            }
          },
          formActions: [
            {text: '确定', type: 'submit'},
            {text: '取消', type: 'cancel'}
          ],
          formRules: {
            name: [
              {required: true, message: '不能为空', trigger: 'blur'}
            ]
          },
          beforeSubmit: this.beforeSubmit
        }
      }
    },
    methods: {
      beforeSubmit (data) {
        data.creater = this.$loginUser.id
        return data
      }
    }
  }
</script>
