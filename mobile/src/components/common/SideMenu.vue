<template>
  <div class="page-container dev-page">
    <div class="developing" @click="logout">退出</div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex'
  export default {
    methods: {
      ...mapActions([
        'logout'
      ])
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .dev-page
    display: flex
    justify-content center
    align-items center
  .developing
    height: 100px;
    width: 100px;
    background-color: #fff;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.6)
</style>
