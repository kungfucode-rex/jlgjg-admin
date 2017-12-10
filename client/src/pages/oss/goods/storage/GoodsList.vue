<template>
  <div class="query-list-wrapper">
    <QueryListPage ref="goodsQueryListPage"
        :query-form="queryForm"
        :query-list="queryList"></QueryListPage>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryListPageRef: 'goodsQueryListPage',
      queryForm: {
        queryObject: {
          no: {
            type: 'text',
            label: '编号'
          },
          name: {
            type: 'text',
            label: '名称'
          }  
        },
        beforeQuery: this.beforeQuery
      },
      queryList: {
        title: '商品列表',
        url: `${apiGoodsList}`,
        actions: [
          {text: '添加商品', handler: this.add}
        ],
        columns: [
          {title: '编号', key: 'no'},
          {title: '名称', key: 'name'},
          {title: '规格', key: 'guige'},
          {title: '数量', key: 'quantity'},
          {
            title: '单位', 
            key: 'unit',
            render: (h, params) => {
              return this._v(this.$SysCode.translate(params.row.unit, 'UnitType'))
            }
          },
          {title: '加权平均单价', key: 'aprice'},
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return this.$getListOperationBtns(h, params, [
                {label: '编辑', handler: this.edit},
                {label: '删除', type: 'error', handler: this.delete}
              ])
            }
          }
        ]
      }
    }
  },
  methods: {
    add () {
      this.$load('GoodsAdd')
    }, 
    edit (params) {
      this.$load('GoodsEdit', {
        id: params.row.id
      })
    },
    delete (params) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否删除该商品：' + params.row.name,
        onOk: this.reallyDelete(params)
      })
    },
    reallyDelete (params) {
      let self = this
      return () => {
        this.$http.post(`${apiGoodsDelete}`, {
          id: params.row.id
        }).then(response => {
          if (response.data.code === 200) {
            self.$Message.success(response.data.msg)
            self.queryList.reload()
          }
        })
      }
    }
  }
}
</script>

