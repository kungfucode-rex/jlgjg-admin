<template>
  <div class="query-list-wrapper">
    <QueryListPage ref="providerQueryListPage"
        :query-form="queryForm"
        :query-list="queryList"></QueryListPage>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryListPageRef: 'providerQueryListPage',
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
        title: '供应商列表',
        url: `${apiProviderList}`,
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
      this.$load('ProviderAdd')
    }, 
    edit (params) {
      this.$load('ProviderEdit', {
        id: params.row.id
      })
    },
    delete (params) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否删除该供应商：' + params.row.name,
        onOk: this.reallyDelete(params)
      })
    },
    reallyDelete (params) {
      let self = this
      return () => {
        this.$http.post(`${apiProviderDelete}`, {
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

