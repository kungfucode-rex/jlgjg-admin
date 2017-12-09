<template>
  <div class="query-list-wrapper">
    <QueryListPage ref="customerQueryListPage"
        :query-form="queryForm"
        :query-list="queryList"></QueryListPage>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryListPageRef: 'customerQueryListPage',
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
        title: '客户列表',
        url: `${apiCustomerList}`,
        actions: [
          {text: '新增', handler: this.add}
        ],
        columns: [
          {title: '编号', key: 'no'},
          {title: '名称', key: 'name'},
          {
            title: '税务登记类型', 
            key: 'shuiwu',
            render: (h, params) => {
              return this._v(this.$SysCode.translate(params.row.shuiwu, 'ShuiwuType'))
            }
          },
          {title: '联系人', key: 'person'},
          {title: '电话', key: 'phone'},
          {
            title: '创建时间', 
            key: 'createtime',
            render: (h, params) => {
              return this._v(this.$moment(params.row.createtime).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
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
      this.$load('CustomerAdd')
    }, 
    edit (params) {
      this.$load('CustomerEdit', {
        id: params.row.id
      })
    },
    delete (params) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否删除该客户：' + params.row.name,
        onOk: this.reallyDelete(params)
      })
    },
    reallyDelete (params) {
      let self = this
      return () => {
        this.$http.post(`${apiCustomerDelete}`, {
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

