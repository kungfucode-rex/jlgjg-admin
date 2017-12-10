<template>
  <div>
    <FormPage ref="goodsEditForm"
              :form-config="formConfig"></FormPage>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formConfig: {
          formTitle: '修改商品',
          formUrl: `${apiGoodsEdit}`,
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
        // data.creater = this.$loginUser.id
        return data
      }
    },
    mounted () {
      this.formConfig.formModel.id = this.$route.query.id
      this.$http.get(`${apiGoodsById}?id=${this.$route.query.id}`)
        .then(response => {
          if (response.data.code === 200) {
            let goods = response.data.data
            this.$refs['goodsEditForm'].initFormData(goods)
            this.formConfig.formTitle = '修改商品 编号：' + goods.no
          }
        })
    }
  }
</script>
