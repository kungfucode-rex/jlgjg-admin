<template>
  <div id="app">
    <template v-if="this.$store.state.getUserFinished">
      <template v-if="this.$store.state.user">
        <PageHeader></PageHeader>
        <PageContent></PageContent>
        <PageFooter></PageFooter>
      </template>
      <template v-else>
        <Login></Login>
      </template>
    </template>
  </div>
</template>

<script>
  import PageHeader from 'components/common/PageHeader.vue'
  import PageFooter from 'components/common/PageFooter.vue'
  import PageContent from 'components/common/PageContent.vue'
  import Login from './Login.vue'
  export default {
    name: 'app',
    components: {
      PageHeader,
      PageContent,
      PageFooter,
      Login
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "styles/common.styl"

  #app
    display: flex
    flex-direction: column
    height: 100%
    width: 100%
    position: relative
    overflow-x: hidden
</style>
