<template>
  <div class="index-page">
    <mt-header :title="title">
      <router-link to="/mobile/store/list/StoreList" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="more" slot="right" @click="toggleSideMenu"></mt-button>
    </mt-header>
    <router-view></router-view>
    <mt-popup
      class="side-menu-container"
      v-model="sideMenu"
      position="right">
      <SideMenu></SideMenu>
    </mt-popup>
    <mt-tabbar v-model="selectedTab">
      <mt-tab-item id="store">
        <img slot="icon" src="../static/images/store.png">
        库存
      </mt-tab-item>
      <mt-tab-item id="buy">
        <img slot="icon" src="../static/images/buy.png">
        购货
      </mt-tab-item>
      <mt-tab-item id="sale">
        <img slot="icon" src="../static/images/sale.png">
        销货
      </mt-tab-item>
      <mt-tab-item id="taizhang">
        <img slot="icon" src="../static/images/taizhang.png">
        台账
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
import SideMenu from 'components/common/SideMenu.vue'
export default {
  components: {
    SideMenu
  },
  data () {
    return {
      title: '库存',
      selectedTab: 'store',
      sideMenu: false,
      tabRoutes: {
        store: {path: '/mobile/store/list/StoreList'},
        buy: {path: '/mobile/buy/list/BuyList'},
        sale: {path: '/mobile/buy/list/BuyList'},
        taizhang: {path: '/mobile/buy/list/BuyList'}
      } 
    }
  },
  watch: {
    selectedTab: function () {
      this.$router.push(this.tabRoutes[this.selectedTab])
    }
  },
  methods: {
    toggleSideMenu () {
      this.sideMenu = !this.sideMenu
    }
  },
  mounted () {
    this.$router.push({path: '/mobile/store/list/StoreList'})
    console.log('hello')
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .index-page
    height: 100%
  .side-menu-container
    height: 100%
    width: 80%
    background: linear-gradient(20deg, #2196F3 30%, #3F51B5 70%);
</style>
