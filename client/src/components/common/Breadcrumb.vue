<template>
  <div class="breadcrumb-container">
    <Breadcrumb>
      <template v-for="item in this.$store.state.selectedMenus">
        <Breadcrumb-item v-if="item">{{item.text}}</Breadcrumb-item>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
  export default {}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../styles/common.styl"
  .breadcrumb-container
    padding: 0 20px;
    height: G_BREADCRUMB_HEIGHT
    min-height: G_BREADCRUMB_HEIGHT
    line-height: G_BREADCRUMB_HEIGHT
    background-color:#ddd
    .ivu-breadcrumb-item-separator
      color: #333
    .ivu-breadcrumb>span:last-child
      font-weight: normal
</style>
