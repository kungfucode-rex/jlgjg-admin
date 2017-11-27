<template>
  <div class="list-page"
       :style="{height: queryList.height ? 'auto' : listPageHeight}">
    <QueryForm :queryObject="queryForm.queryObject"
               v-show="!(queryForm.show === false)"
               :labelWidth="queryForm.labelWidth"
               v-on:changPage="changePage"
               ref="form"
               :pager-config="currentpagerConfig"
               :can-query="canQuery"
               v-on:disableQuery="disableQuery"
               v-on:updateHeight="updateTableHeight"
               :before-query="queryForm.beforeQuery"></QueryForm>
    <Tabs v-if="queryForm.tabFilter" v-model="queryForm.tabFilter.value"
          @on-click="activeQueryTab"
          :class="tabFilterClass"
          class="query-list-tab">
      <template v-for="(item, index) in queryForm.tabFilter.items">
        <Tab-pane :label="item.label"
                  :name="item.value"></Tab-pane>
      </template>
    </Tabs>
    <div></div>
    <Table :columns="queryList.columns" ref="table"
           show-header
           highlight-row
           @on-select="onSelect"
           @on-select-all="onSelectAll"
           @on-selection-change="onSelectionChange"
           :no-data-text="noDataText"
           :height="queryList.height || tableHeight"
           :data="queryList.data" size="small" border>
      <div slot="header" class="table-header">
        <div class="title">{{queryList.title || ''}}</div>
        <div class="actions">
          <template v-for="button in queryList.actions">
            <Button type="primary" size="small" @click="button.handler">{{button.text}}</Button>
          </template>
        </div>
      </div>
    </Table>
    <div class="page-container">
      <Page :total="queryList.total"
            :page-size="pageSize"
            :current="pageIndex"
            placement="top"
            @on-change="changePage"
            @on-page-size-change="pageSizeChange"
            show-total
            show-elevator
            show-sizer></Page>
    </div>
  </div>
</template>
<script>
  import QueryForm from 'components/queryListPage/QueryForm'
  import qs from 'qs'
  import { mapGetters } from 'vuex'
  export default {
    props: {
      queryForm: {
        type: Object,
        required: true
      },
      pagerConfig: {
        type: Object
      },
      queryList: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters({
        globalPagerConfig: 'pagerConfig'
      }),
      offset: function () {
        return (this.pageIndex - 1) * this.pageSize
      }
    },
    components: {
      QueryForm
    },
    data () {
      return {
        tabFilterClass: {
          'active-tab-index-is-1': false,
          'active-tab-index-is-2': false,
          'active-tab-index-is-3': false,
          'active-tab-index-is-4': false,
          'active-tab-index-is-5': false,
          'active-tab-index-is-6': false,
          'active-tab-index-is-7': false,
          'active-tab-index-is-8': false,
          'active-tab-index-is-9': false
        },
        // 记录查询条件
        queryData: {},
        currentpagerConfig: {},
        noDataText: '数据加载中',
        listPageHeight: '100%',
        tableHeight: 0,
        pageSize: 10,
        pageIndex: 1,
        pageOffset: 0,
        queryTrigger: 'url',
        canQuery: true // 查询按钮是否可点
      }
    },
    created () {
      // debugger
      let self = this
      // tabFilter的顺序
      if (this.queryForm.tabFilter) {
        this.queryForm.tabFilter.order = {}
        this.queryForm.tabFilter.items.forEach((item, index) => {
          this.queryForm.tabFilter.order[item.value] = index + 1
        })
        this.tabFilterClass['active-tab-index-is-' + this.queryForm.tabFilter.order[this.queryForm.tabFilter.value]] = true
      }
      // queryList 如果没有data属性,就创建并赋值为[]
      if (!this.queryList.data) {
        this.$set(this.queryList, 'data', [])
      }
      // queryList 如果没有total属性,就创建并赋值为0
      if (!this.queryList.total) {
        this.$set(this.queryList, 'total', 0)
      }
      // 如果设置了pageConfig就使用它,否则使用globalPageConfig
      if (!this.pagerConfig) {
        this.currentpagerConfig = Object.assign({}, this.globalPagerConfig)
      } else {
        this.currentpagerConfig = Object.assign({}, this.pagerConfig)
      }
      // 如果表格可选，给column数组添加复选框列
      if (this.queryList.selectable === true) {
        this.queryList.columns.unshift({
          type: 'selection',
          width: 60,
          align: 'center'
        })
      }
      // 给queryList添加数据重载的方法
      this.queryList.reload = function () {
        self.commitQuery(self.$route)
      }
    },
    mounted () {
      /* let self = this
      // iview表格的高度是 标题+表头+tbody 的高度
      // 让表格的高度刚好沾满剩余页面
      this.$nextTick(() => {
        debugger
        let polyfillHeight = 0
        let totalTableHeight = self.$refs.table.$el.offsetHeight // 表格总高度
        let tabFilterHeight = 45 // tab过滤器高度
        if (self.queryForm.show === false) {
          polyfillHeight += 0
        } else {
          if (self.queryForm.tabFilter) {
            polyfillHeight += -tabFilterHeight // 除去tab过滤器高度
          }
        }
        self.tableHeight = totalTableHeight + polyfillHeight
      }) */
      this.updateTableHeight()
    },
    methods: {
      updateTableHeight () {
        let self = this
        this.$nextTick(() => {
          let polyfillHeight = -2
          if (self.queryForm.tabFilter) {
            polyfillHeight += -2 // 除去tab过滤器影响的高度
          }
          self.tableHeight = self.$refs.table.$el.offsetHeight + polyfillHeight
        })
      },
      activeQueryTab (value) {
        // 让当前的tab置为isActive:true
        // 将此过滤信息混合到查询条件中, 再push到路由里去
        let filterObj = {}
        filterObj[this.queryForm.tabFilter.field] = value
        Object.assign(this.queryData, filterObj)
        this.queryForm.tabFilter.vlaue = value
        for (let key in this.tabFilterClass) {
          this.tabFilterClass[key] = false
        }
        this.tabFilterClass['active-tab-index-is-' + this.queryForm.tabFilter.order[value]] = true
        // 更新路由
        this.$router.push({
          path: this.$route.path,
          query: this.queryData
        })
      },
      /**
       * 翻页方法
       * pageIndex: 翻页后是第几页
       * params: 查询条件
       **/
      changePage (pageIndex, params) {
        this.pageIndex = pageIndex
        this.pageOffset = (this.pageIndex - 1) * this.pageSize
        if (params) {
          // 如果是点查询按钮到这来的，不用混合分页信息，已经有默认的第一页信息
          this.queryData = params
          // 以防pageSize改变, 重新赋值
          this.queryData[this.currentpagerConfig.pageSize] = this.pageSize
        } else {
          // 如果是点翻页按钮到这来的，把分页信息混合到this.queryData里
          this.mixinBackPageInfoToQueryData()
        }
        // 如果有tabFilter, 则将tabFilter的值放进this.queryData
        if (this.queryForm.tabFilter) {
          this.queryData[this.queryForm.tabFilter.field] = this.queryForm.tabFilter.value
        }
        // 加时间戳
        this.queryData._time = this.$moment()._d.getTime()
        // 更新路由
        if (this.$route.query.hasOwnProperty(this.currentpagerConfig.pageSize)) {
          this.$router.push({
            path: this.$route.path,
            query: this.queryData
          })
        } else {
          this.$router.replace({
            path: this.$route.path,
            query: this.queryData
          })
        }
      },
      /**
       * 改变分页大小回调函数，执行完毕后，iview会自动触发changePage事件，去查第一页数据
       */
      pageSizeChange (newPageSize) {
        if (newPageSize) {
          // this.pageOffset = (this.pageIndex - 1) * this.pageSize
          this.pageSize = newPageSize
          // this.mixinBackPageInfoToQueryData()
          this.changePage(1, this.queryData)
        }
      },
      /**
       * 把分页信息混合到this.queryData里
       * @param trigger 触发此函数的来源，url：从url解析分页信息， pager: 手工翻页的，使用this.pageIndex, this.pageSize
       */
      mixinBackPageInfoToQueryData (trigger) {
        // 当前的分页信息
        let pagerParams = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          pageOffset: this.pageOffset
        }
        let tempPagerParams = {}
        // 如果是从url触发的,可能没有分页信息
        if (trigger === 'url') {
          // 肯定要有pageSize
          tempPagerParams[this.currentpagerConfig.pageSize] = this.queryData[this.currentpagerConfig.pageSize] || pagerParams.pageSize
          // 判断使用 pageIndex 还是 pageOffset
          if (this.currentpagerConfig.pageIndex) {
            // 使用 pageIndex
            tempPagerParams[this.currentpagerConfig.pageIndex] = this.queryData[this.currentpagerConfig.pageIndex] || pagerParams.pageIndex
          } else {
            // 使用 pageOffset
            tempPagerParams[this.currentpagerConfig.pageOffset] = this.queryData[this.currentpagerConfig.pageOffset] || pagerParams.pageOffset
          }
        } else {
          // 肯定要有pageSize
          tempPagerParams[this.currentpagerConfig.pageSize] = pagerParams.pageSize || this.queryData[this.currentpagerConfig.pageSize]
          // 判断使用 pageIndex 还是 pageOffset
          if (this.currentpagerConfig.pageIndex) {
            // 使用 pageIndex
            tempPagerParams[this.currentpagerConfig.pageIndex] = pagerParams.pageIndex || this.queryData[this.currentpagerConfig.pageIndex]
          } else {
            // 使用 pageOffset
            tempPagerParams[this.currentpagerConfig.pageOffset] = pagerParams.pageOffset !== undefined ? pagerParams.pageOffset : this.queryData[this.currentpagerConfig.pageOffset]
          }
        }
        // 将分页信息封装到查询条件中
        this.queryData = {...this.queryData, ...tempPagerParams}
      },
      preCommitQueryHandler () {
        // 填充表单
        this.$refs.form.initFormData(this.queryData)
        // 预设分页组件
        this.pageIndex = parseInt(this.queryData[this.currentpagerConfig.pageIndex] || this.pageIndex)
        this.pageSize = parseInt(this.queryData[this.currentpagerConfig.pageSize])
      },
      commitQuery (newRoute) {
        // debugger
        this.disableQuery()
        this.queryData = newRoute.query
        this.mixinBackPageInfoToQueryData('url')
        // 用新路由参数预处理查询列表页面
        this.preCommitQueryHandler()
        // 用新路由参数查询数据
        let self = this
        this.noDataText = '数据加载中...'
        // console.log(`提交到后台的数据：`)
        // console.log(this.queryData)
        // 回调用户的查询函数
        let postData = this.queryForm.beforeQuery ? this.queryForm.beforeQuery(this.queryData) : this.queryData
        if (postData === false) {
          // 如果beforeQuery返回的是false, 则退出, 不做任何处理
          this.enableQuery()
          return
        }
        // 封装ajax配置对象
        let ajaxConfig = {}
        ajaxConfig.url = this.queryList.url
        ajaxConfig.method = this.queryList.actionType || 'get'
        if ('putpostpatch'.indexOf(ajaxConfig.method) !== -1) {
          // 如果是put,post,patch
          ajaxConfig.data = postData || {}
        } else {
          // 如果不是put,post,patch
          ajaxConfig.params = postData || {}
          ajaxConfig.paramsSerializer = function (params) {
            return qs.stringify(params)
          }
        }
        this.$http(ajaxConfig)
          .then((response) => {
            self.enableQuery()
            self.noDataText = '无数据'
            let resultData = {}
            // 如果查询结果需要处理
            if (this.queryList.afterQuery) {
              resultData = this.queryList.afterQuery(response)
            } else {
              resultData = response.data
            }
            debugger
            self.queryList.data = resultData.data.list
            self.queryList.total = resultData.data.total
            // 表格加载完成后，给queryList.selection中装载数据
            self.$nextTick(() => {
              if (this.queryList.selectable === true) {
                self.queryList.selection = self.$refs.table.getSelection()
              }
            })
          })
          .catch(function (err) {
            console.log(err)
            self.enableQuery()
          })
      },
      enableQuery () {
        this.canQuery = true
      },
      disableQuery () {
        // 禁止查询按钮
        this.canQuery = false
        // 清空表格的数据
        this.queryList.data = []
      },
      onSelect (selection, row) {
        // debugger
        this.queryList.onSelect && this.queryList.onSelect(selection, row)
        this.queryList.selection = selection
      },
      onSelectAll (selection) {
        this.queryList.onSelectAll && this.queryList.onSelectAll(selection)
        this.queryList.selection = selection
      },
      onSelectionChange (selection) {
        this.queryList.onSelectionChange && this.queryList.onSelectionChange(selection)
        this.queryList.selection = selection
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  table-header-height = 40px
  .list-page
    display: flex
    flex-direction: column
    flex-grow: 1
    height: 100%
    flex-grow: 1
    .query-form-card
      flex-grow: 0
      .ivu-card-body
        padding-bottom: 0
    .query-list-tab
      display:block
      .ivu-tabs-bar
        margin-bottom: 0
        .ivu-tabs-nav
          .ivu-tabs-ink-bar
            height: 1px
            width: 50px
            background: linear-gradient(to right, #3b75d6, #fff, #3b75d6);
          .ivu-tabs-tab
            background-color: #eeeeee
            border-radius: 10px 10px 0 0
            &.ivu-tabs-tab-active
              background-color: #3b75d6
              color: white
    .form-filters
      .filter:not(:last-child)
        border-right: 2px solid rgba(247, 243, 243, 0.25)
    .ivu-table-wrapper
      flex-grow: 1
      overflow-y: auto
      border-top: none
      border-left: none
      .ivu-table
        &:after
          width: 0
        .ivu-table-title
          height: table-header-height
          .table-header
            display: flex
            justify-content: space-between
            background-color: rgb(59, 117, 214)
            font-size: 0
            height: table-header-height
            line-height: table-header-height
            .title
              color: #fff
              font-size: 14px
              padding-left: 10px
            .actions
              padding-right: 1px
              button
                border-radius: 0
                height: table-header-height
                border-left: 1px solid rgba(37, 83, 160, 0.5)
                font-size: 14px
                padding: 2px 10px

        .ivu-table-header, .ivu-table-body, .ivu-table-tip
          border-left: 1px solid #dddee1
          border-right: 1px solid #dddee1
        .ivu-table-tip td
          border-right: 0
        .ivu-table-body
          .ivu-table-cell
            padding-left: 10px;
            padding-right: 10px;

    .page-container
      .ivu-page
        margin-top: 10px
        float: right
</style>
