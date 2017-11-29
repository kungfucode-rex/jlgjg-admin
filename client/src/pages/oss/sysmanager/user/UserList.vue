<template>
  <div class="query-list-wrapper">
    <QueryListPage ref="userQueryListPage"
        :query-form="queryForm"
        :query-list="queryList"></QueryListPage>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        queryListPageRef: 'userQueryListPage',
        queryForm: {
          queryObject: {
            name: {
              type: 'text',
              label: '账号'
            },
            cnname: {
              type: 'text',
              label: '用户名'
            }
          },
          beforeQuery: this.beforeQuery
        },
        queryList: {
          title: '列表',
          url: `${apiUserList}`,
          actions: [
            {text: '新增', handler: this.add}
          ],
          columns: [
            {title: '账号', key: 'name'},
            {title: '用户名', key: 'cnname'},
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
        this.$load('UserAdd')
      },
      edit (params) {
        this.$load('UserEdit', {id: params.row.id})
      },
      delete (params) {
        let self = this
        self.$Modal.confirm({
          title: '提示',
          content: '确认要删除用户 ' + params.row.name + '?',
          onOk () {
            this.$http.post(`${apiUserDelete}`, {
              id: params.row.id
            }).then(response => {
              if (response.data.code === 200) {
                self.$Message.success('删除成功')
                self.queryList.reload()
              }
            })
          }
        })
      }
    }
  }
</script>
<style>

</style>
