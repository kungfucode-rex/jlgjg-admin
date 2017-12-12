<template>
  <div class="query-list-wrapper">
    <QueryListPage ref="buyQueryListPage"
        :query-form="queryForm"
        :query-list="queryList"></QueryListPage>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryListPageRef: 'buyQueryListPage',
      queryForm: {
        queryObject: {
          no: {
            type: 'text',
            label: '编号'
          },
          provider_name: {
            type: 'text',
            label: '供应商'
          },
          goods_name: {
            type: 'text',
            label: '商品名称'
          },
          creater_name: {
            type: 'text',
            label: '经办人'
          },
          dateRange: {
            type: 'datetimerange',
            fieldsName: ['start_time', 'end_time'],
            label: '查询时间段'
          }
        },
        beforeQuery: this.beforeQuery
      },
      queryList: {
        title: '购货记录',
        url: `${apiBuyList}`,
        actions: [
          {text: '购货', handler: this.add}
        ],
        columns: [
          {title: '编号', key: 'no'},
          {title: '供应商', key: 'provider_name'},
          {title: '商品名称', key: 'goods_name'},
          {title: '规格', key: 'goods_guige'},
          {title: '数量', key: 'quantity'},
          {
            title: '单位', 
            key: 'goods_unit',
            render: (h, params) => {
              return this._v(this.$SysCode.translate(params.row.goods_unit, 'UnitType'))
            }
          },
          {title: '单价', key: 'price'},
          {title: '金额', key: 'money'},
          {title: '经办人', key: 'creater_name'},
          {
            title: '创建时间', 
            key: 'createtime',
            render: (h, params) => {
              return this._v(this.$moment(params.row.createtime).format('YYYY-MM-DD HH:mm:ss'))
            },
            width: 150
          }
        ]
      }
    }
  },
  methods: {
    add () {
      this.$load('BuyAdd')
    }
  }
}
</script>

