<template>
  <div>
    <FormPage ref="providerAddForm"
              :form-config="formConfig"></FormPage>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formConfig: {
          formTitle: '新增供应商',
          formUrl: `${apiProviderAdd}`,
          formModel: {},
          formItems: {
            name: {
              type: 'text',
              label: '名称',
              halfColumn: true
            },
            code: {
              type: 'text',
              label: '信用代码',
              halfColumn: true
            },
            shuiwu: {
              type: 'select',
              label: '税务类型',
              config: {
                data: this.$SysCode.ShuiwuType
              },
              halfColumn: true
            },
            person: {
              type: 'text',
              label: '联系人',
              halfColumn: true
            },
            phone: {
              type: 'text',
              label: '电话',
              halfColumn: true
            },
            mobile: {
              type: 'text',
              label: '手机',
              halfColumn: true
            },
            postcode: {
              type: 'text',
              label: '邮编',
              halfColumn: true
            },
            fax: {
              type: 'text',
              label: '传真',
              halfColumn: true
            },
            url: {
              type: 'text',
              label: '网址',
              halfColumn: true
            },
            email: {
              type: 'text',
              label: '邮箱',
              halfColumn: true
            },
            address: {
              type: 'text',
              label: '地址'
            },
            comment: {
              type: 'textarea',
              label: '备注'
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
