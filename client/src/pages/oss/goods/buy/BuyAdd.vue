<template>
  <div>
    <FormPage ref="buyForm"
              :form-config="formConfig">
      <Form-item slot="goodsInfo">
        <div>
          规格：{{selectedGoodsInfo.guige}}　
          库存：{{selectedGoodsInfo.quantity}}　
          单位：{{this.$SysCode.translate(selectedGoodsInfo.unit, 'UnitType')}}
        </div>          
      </Form-item>              
    </FormPage>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        providerSelectLoading: false,
        goodsSelectLoading: false,
        selectedGoodsInfo: {},
        formConfig: {
          formTitle: '购买商品',
          formUrl: `${apiBuyAdd}`,
          formModel: {},
          formItems: {
            provider_no: {
              type: 'select',
              submitLabelTo: 'provider_name',
              label: '供应商',
              config: {
                data: [],
                remoteMethod: this.blurQueryProviderByName,
                filterable: true,
                loading: this.providerSelectLoading
              },
              halfColumn: false
            },
            goods_no: {
              type: 'select',
              submitLabelTo: 'goods_name',
              label: '商品',
              config: {
                data: [],
                remoteMethod: this.blurQueryGoodsByName,
                filterable: true,
                loading: this.goodsSelectLoading
              },
              onChange: this.changeGoods,
              halfColumn: false
            },
            quantity: {
              type: 'text',
              label: '数量',
              halfColumn: true
            },
            price: {
              type: 'text',
              label: '单价',
              halfColumn: true
            },
            goodsInfo: {
              slot: true
            },
            selectedGoods: {
              type: 'listSelector',
              label: '已选择的商品',
              config: {
                idKey: 'id',
                submitFields: 'all',
                columns: [
                  {title: '商品编号', key: 'no', width: 100},
                  {title: '名称', key: 'name'},
                  {title: '规格', key: 'guige'},
                  {title: '数量', key: 'quantity', width: 100},
                  {title: '单价', key: 'price', width: 100},
                  {title: '金额', key: 'money', width: 100}
                ],
                listData: [],
                clearBtn: true,
                canDelete: true,
                multiple: true,
                actions: [
                  {style: 'info', text: '添加', handler: this.appendGoods}
                ]
              }
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
            provider_no: [
              {required: true, message: '不能为空', trigger: 'blur'}
            ],
            goods_no: [
              {required: true, message: '不能为空', trigger: 'blur'}
            ],
            quantity: [
              {required: true, message: '不能为空', trigger: 'blur'},
              {
                type: 'number', 
                message: '必须位数字', 
                trigger: 'blur', 
                transform: value => {
                  return Number(value)
                }
              }
            ],
            price: [
              {required: true, message: '不能为空', trigger: 'blur'},
              {
                type: 'number', 
                message: '必须位数字', 
                trigger: 'blur', 
                transform: value => {
                  return Number(value)
                }
              }
            ],
            selectedGoods: [
              {required: true, type: 'array', message: '不能为空'}
            ]
          },
          beforeSubmit: this.beforeSubmit
        }
      }
    },
    methods: {
      beforeSubmit (data) {
        let self = this
        let results = []
        data.selectedGoods.forEach(item => {
          let buyRecord = {}
          buyRecord.provider_no = data.provider_no
          buyRecord.provider_name = data.provider_name
          buyRecord.goods_no = item.no
          buyRecord.goods_name = item.name
          buyRecord.goods_guige = item.guige
          buyRecord.goods_unit = item.unit
          buyRecord.quantity = item.quantity
          buyRecord.price = item.price
          buyRecord.money = item.money
          buyRecord.creater = self.$loginUser.id
          buyRecord.creater_name = self.$loginUser.cnname
          buyRecord.comment = data.comment
          results.push(buyRecord)
        })
        return results
      },
      blurQueryProviderByName (query) {
        console.log(query)
        this.providerSelectLoading = true
        this.$http.get(`${apiProviderByName}?name=${query}`)
          .then(response => {
            let result = response.data.data
            result.forEach(item => {
              item.value = item.no
              item.label = item.name
            })
            this.$refs['buyForm'].acceptData('provider_no', result)
            this.providerSelectLoading = false
          })
      },
      blurQueryGoodsByName (query) {
        console.log(query)
        this.goodsSelectLoading = true
        this.$http.get(`${apiGoodsByName}?name=${query}`)
          .then(response => {
            let result = response.data.data
            result.forEach(item => {
              item.value = item.no
              item.label = item.name
            })
            this.$refs['buyForm'].acceptData('goods_no', result)
            this.goodsSelectLoading = false
          })
      },
      changeGoods (value) {
        console.log('changed:' + value)
        this.formConfig.formModel.quantity = ''
        this.formConfig.formModel.price = ''
        let self = this
        let existGoods = false
        this.formConfig.formItems.goods_no.config.data.forEach(item => {
          if (value === item.no) {
            self.selectedGoodsInfo = item
            existGoods = true
            return false
          }
        })
        if (!existGoods) {
          self.selectedGoodsInfo = {}
        }
      },
      appendGoods () {
        if (this.selectedGoodsInfo.id) {
          let goods = Object.assign({}, this.selectedGoodsInfo)
          goods.quantity = this.formConfig.formModel.quantity
          goods.price = this.formConfig.formModel.price
          goods.money = goods.quantity * goods.price
          this.$refs['buyForm'].acceptData('selectedGoods', goods)
        } else {
          this.$Notice.warning({
            titel: '提示',
            desc: '请选择商品后再点击添加按钮'
          })
        }
      }
    }
  }
</script>
