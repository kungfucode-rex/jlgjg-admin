<template>
  <div id="app">
    <template v-if="this.$store.state.getUserFinished">
      <template v-if="this.$store.state.user">
        <Index></Index>
      </template>
      <template v-else>
        <Login></Login>
      </template>
    </template>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import Login from './Login.vue'
  import Index from './Index.vue'
  export default {
    name: 'app',
    components: {
      Login,
      Index
    },
    methods: {
      ...mapActions([
        'changeactiveRootMenuId',
        'logout'
      ])
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
