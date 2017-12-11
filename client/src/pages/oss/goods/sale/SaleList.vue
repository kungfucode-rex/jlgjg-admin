<template>
  <div class="query-list-wrapper">
    <QueryListPage ref="saleQueryListPage"
        :query-form="queryForm"
        :query-list="queryList"></QueryListPage>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryListPageRef: 'saleQueryListPage',
      queryForm: {
        queryObject: {
          no: {
            type: 'text',
            label: '编号'
          },
          customer_name: {
            type: 'text',
            label: '客户'
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
        title: '销货记录',
        url: `${apiSaleList}`,
        actions: [
          {text: '销货', handler: this.add}
        ],
        columns: [
          {title: '编号', key: 'no'},
          {title: '客户', key: 'customer_name'},
          {title: '商品名称', key: 'goods_name'},
          {title: '规格', key: 'goods_guige'},
          {title: '数量', key: 'quantity'},
          {title: '单位', key: 'goods_unit'},
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
      this.$load('SaleAdd')
    }
  }
}
</script>

