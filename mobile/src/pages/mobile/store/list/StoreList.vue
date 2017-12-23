<template>
  <div class="page-container">
    <div 
      class="product-container"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10" 
      ref="loadmore">
      <div class="product-item" v-for="item in list" :key="item.no">
        <div class="product-title">
          <div class="title">{{item.name}}</div>
          <div class="guige">{{item.guige}}</div>
          <div class="no">{{item.no}}</div>
        </div>  
        <div class="product-detail">
          <div class="product-icon" :style="{'background-image': 'url(' + typeImgs[item.type] + ')'}"></div>
          <div class="product-info">
            <div class="aprice">加权单价：{{item.aprice}}</div>
            <div class="money">累计金额：{{(item.aprice * item.quantity).toFixed(3)}}</div>
            <div class="money">换算公式：{{item.aprice}}</div>
          </div>
          <div class="product-quantity">
            <span class="quantity">{{String(item.quantity).split('.')[0]}}.</span>
            <span class="unit">{{String(item.quantity).split('.')[1]}}</span>
            <span class="unit">{{item.unit}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      typeImgs: {
        H: '../../../../../static/images/Hgang.png',
        C: '../../../../../static/images/Cgang.png',
        G: '../../../../../static/images/Ggang.png'
      },
      list: [
        {no: 'S0000001', name: '安泰Ｈ刚', guige: '135 x 180 x 56', unit: '吨', quantity: 100.000, aprice: 3920, type: 'H'},
        {no: 'S0000002', name: '安泰槽刚', guige: '135 x 180 x 56', unit: '吨', quantity: 2.362, aprice: 3920, type: 'C'},
        {no: 'S0000003', name: '安泰Ｈ刚', guige: '135 x 180 x 56', unit: '吨', quantity: 561.326, aprice: 3920, type: 'H'},
        {no: 'S0000004', name: '安泰Ｈ刚', guige: '135 x 180 x 56', unit: '吨', quantity: 0.254, aprice: 3920, type: 'H'},
        {no: 'S0000005', name: '安泰工字刚', guige: '135 x 180 x 56', unit: '吨', quantity: 28.200, aprice: 3920, type: 'G'},
        {no: 'S0000006', name: '安泰工字刚', guige: '135 x 180 x 56', unit: '吨', quantity: 13.520, aprice: 3920, type: 'G'},
        {no: 'S0000007', name: '安泰Ｈ刚', guige: '135 x 180 x 56', unit: '吨', quantity: 59.326, aprice: 3920, type: 'H'},
        {no: 'S0000008', name: '安泰槽刚', guige: '135 x 180 x 56', unit: '吨', quantity: 150.300, aprice: 3920, type: 'C'},
        {no: 'S0000009', name: '安泰Ｈ刚', guige: '135 x 180 x 56', unit: '吨', quantity: 56.258, aprice: 3920, type: 'H'}
      ]
    }
  },
  methods: {
    loadMore () {
      console.log('加载更多')
      /* this.loading = true;
      setTimeout(() => {
        let last = this.list[this.list.length - 1];
        for (let i = 1; i <= 10; i++) {
          this.list.push(last + i);
        }
        this.loading = false;
      }, 2500); */
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .page-container
    height: calc(100% - 95px)
    .product-container
      height: 100%
      overflow-y: scroll
      .product-item
        display: flex
        flex-direction column
        width: 90%;
        height: 80px;
        margin: 10px auto;
        padding: 5px 10px
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 3px 2px 5px #1e5a9c;
        .product-title
          display: flex  
          justify-content: space-between
          align-items center
          padding: 5px 0
          border-bottom: 1px solid #ccc
          .title
            font-size: 14px
            font-weight: bold
          .guige
            font-size: 14px
          .no
            font-size: 12px
            color: #666  
        .product-detail
          display: flex
          justify-content space-between
          align-items center
          .product-icon  
            height: 30px;
            width: 30px;
            background-size: 60%;
            background-color: #607d8b29;
            padding: 8px;
            margin-top: 5px
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 10px;
          .product-info   
            flex-grow: 1
            margin-left: 10px
            padding-top: 5px
            font-size: 10px
            line-height 1.5
            color: #aaa
          .product-quantity
            .quantity
              font-size: 34px  
</style>

