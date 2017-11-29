<template>
  <div>
    <FormPage ref="userEditForm"
              :form-config="formConfig"></FormPage>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formConfig: {
          formTitle: '修改用户',
          formUrl: `${apiUserEdit}`,
          formModel: {},
          formItems: {
            name: {
              type: 'text',
              label: '用户名',
              maxlength: 20,
              disabled: true,
              halfColumn: true
            },
            cnname: {
              type: 'text',
              label: '姓名',
              maxlength: 20,
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
            ],
            cnname: [
              {required: true, message: '不能为空', trigger: 'blur'}
            ]
          }
        }
      }
    },
    methods: {},
    mounted () {
      this.$http.get(`${apiUserById}`, {
        params: {
          id: this.$route.query.id
        }
      }).then(response => {
        if (response.data.code === 200) {
          let user = response.data.data
          this.$refs['userEditForm'].initFormData(user)
          this.formConfig.formModel.id = user.id
        }
      })
    }
  }
</script>
