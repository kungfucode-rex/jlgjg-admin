<template>
  <div>
    <FormPage ref="userAddForm"
              :form-config="formConfig"></FormPage>
  </div>
</template>
<script>
  import MD5 from 'crypto-js/md5'
  export default {
    data () {
      return {
        formConfig: {
          formTitle: '新增用户',
          formUrl: `${apiUserAdd}`,
          formModel: {},
          formItems: {
            name: {
              type: 'text',
              label: '用户名',
              maxlength: 20,
              halfColumn: true
            },
            cnname: {
              type: 'text',
              label: '姓名',
              maxlength: 20,
              halfColumn: true
            },
            password: {
              type: 'text',
              label: '密码',
              maxlength: 20,
              config: {
                isPassword: true
              },
              halfColumn: true
            },
            confirmPwd: {
              type: 'text',
              label: '确认密码',
              config: {
                isPassword: true
              },
              halfColumn: true
            }
          },
          formActions: [
            {text: '确定', type: 'submit'},
            {text: '取消', type: 'cancel'}
          ],
          formRules: {
            name: [
              {required: true, message: '不能为空', trigger: 'blur'},
              {remote: `${apiIsAvailabeUserName}`, message: '名称不可用', trigger: 'blur'}
            ],
            cnname: [
              {required: true, message: '不能为空', trigger: 'blur'}
            ],
            password: [
              {required: true, message: '不能为空', trigger: 'blur'},
              {type: 'string', min: 6, max: 20, message: '必须为6到20位', trigger: 'blur'}
            ],
            confirmPwd: [
              {required: true, message: '不能为空', trigger: 'blur'},
              {validator: this.checkConfirmPwd}
            ]
          },
          beforeSubmit: this.beforeSubmit
        }
      }
    },
    methods: {
      beforeSubmit (data) {
        data.password = MD5(data.password).toString()
        return data
      },
      checkConfirmPwd (rule, value, callback, source, options) {
        if (value === this.formConfig.formModel.password) {
          callback()
        } else {
          callback(new Error('两次密码不一致'))
        }
      }
    }
  }
</script>
