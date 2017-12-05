<template>
  <div class="page-content">
    <SiderMenu></SiderMenu>
    <div class="main-work-container">
      <PageBreadcrumb></PageBreadcrumb>
      <div class="work-area">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import SiderMenu from '@/components/common/SiderMenu.vue'
  import PageBreadcrumb from '@/components/common/Breadcrumb.vue'
  export default {
    components: {
      SiderMenu,
      PageBreadcrumb
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../styles/common.styl"
  .page-content
    display: flex
    flex-grow: 1
    background-color: #ccc
    .main-work-container
      display: flex
      flex-direction: column
      flex-grow: 1
      max-width: "calc(100% - %s)" % G_SIDE_MENU_OUT_WRAPPER
      .work-area
        display: flex
        flex-direction: column
        flex-grow: 1
        background-color: #fff
        margin: 10px
        padding: 10px
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.24)
        height: calc(100% - 60px)
        overflow-y: auto
</style>
