<template>
  <div class="query-list-wrapper">
    <QueryListPage ref="taizhangQueryListPage"
        :query-form="queryForm"
        :query-list="queryList"></QueryListPage>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryListPageRef: 'taizhangQueryListPage',
      queryForm: {
        queryObject: {
          no: {
            type: 'text',
            label: '编号'
          },
          deal_no: {
            type: 'text',
            label: '购销单号'
          },
          goods_name: {
            type: 'text',
            label: '商品名称'
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
        title: '台账记录',
        url: `${apiTaizhangList}`,
        actions: [],
        columns: [
          {title: '编号', key: 'no', width: 63},
          {
            title: '购销货时间', 
            key: 'time',
            render: (h, params) => {
              return this._v(this.$moment(params.row.createtime).format('YYYY-MM-DD HH:mm:ss'))
            },
            width: 135
          },
          {title: '购销货单号', key: 'deal_no', width: 125},
          {title: '商品编号', key: 'goods_no', width: 85},
          {title: '商品名称', key: 'goods_name', width: 85},
          {title: '商品规格', key: 'goods_guige', width: 120},
          {title: '购买数量', key: 'buy_quantity', width: 85},
          {title: '购买单价', key: 'buy_price', width: 85},
          {title: '购买金额', key: 'buy_money', width: 85},
          {title: '销售数量', key: 'sale_quantity', width: 85},
          {title: '销售单价', key: 'sale_price', width: 85},
          {title: '销售金额', key: 'sale_money', width: 85},
          {title: '累计数量', key: 'store_quantity', width: 85},
          {title: '累计金额', key: 'store_money', width: 85},
          {title: '加权单价', key: 'store_aprice', width: 85},
          {title: '备注', key: 'comment', width: 260}
        ]
      }
    }
  }
}
</script>

