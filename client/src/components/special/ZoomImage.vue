<template>
  <div class="zoom-img-wrapper"
       :class="{in: status === 0, out: status === 1}"
       :style="wrapperStyle">
    <img :ref="'img'"
      :src="useReadyUrl === true ? imgReadyUrl : imgUrl"
      :style="imgStyle"
         :class="{in: status === 0, out: status === 1}"
      @click="toggleStatus"
      alt="">
    <div class="zoom-img-bg"></div>
  </div>
</template>
<script>
  export default {
    props: {
      imgReadyUrl: {
        type: String,
        require: true
      },
      imgUrl: {
        type: String,
        require: true
      }
    },
    data () {
      return {
        status: 0,
        useReadyUrl: true,
        useWidth: '' // 是否用宽度来计算
      }
    },
    mounted () {
      this.$nextTick(() => {
        let originHeight = this.$refs.img.naturalHeight
        let originWidth = this.$refs.img.naturalWidth
        if (originWidth >= originHeight && originWidth !== 0 && originHeight !== 0) {
          // 宽大于高
          this.useWidth = true
        } else {
          this.useWidth = false
        }
        // 移除缩略图
        this.useReadyUrl = false
      })
    },
    computed: {
      imgStyle: function () {
        // console.log('imgStyle compute....')
        let resultStyle = {}
        let paddingValue = this.status === 0 ? 10 : 40
        if (this.useWidth === true) {
          resultStyle.width = 'calc(100% - ' + paddingValue + 'px)'
          resultStyle.height = 'auto'
          console.log('height: auto')
        } else {
          resultStyle.height = 'calc(100% - ' + paddingValue + 'px)'
          resultStyle.width = 'auto'
          // console.log('width: auto, height:' + 'calc(100% - ' + paddingValue + 'px)')
        }
        resultStyle.position = 'absolute'
        return resultStyle
      },
      wrapperStyle: function () {
        // console.log('wrapperStyle compute....')
        let resultStyle = {}
        if (this.status === 1) {
          resultStyle.minWidth = window.document.body.clientWidth + 'px'
          resultStyle.minHeight = window.document.body.clientHeight + 'px'
        }
        resultStyle.transition = 'all .2s linear'
        return resultStyle
      }
    },
    methods: {
      toggleStatus () {
        this.status = this.status === 0 ? 1 : 0
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .zoom-img-wrapper
    display: flex
    justify-content: center
    align-items: center
    flex-direction:column
    position: relative
    height: 40px
    &.in
      transition: all 0.5s linear
    &.out
      position:fixed
      z-index: 9999
      left: 0
      top: 0
      right: 0
      bottom: 0
      padding: 20px!important
      transition: all 0.5s linear
    img
      transition: all 0.1s linear
      transform:transition3d(0,0,0)
      transform:translateZ(0)
    .zoom-img-bg
      fix-position(0, 0, 0, 0)
      filter: blur(15px)
      background: inherit
      z-index: -1
      height: 100%;
      position: absolute;
      width: 100%;
      background-color: rgba(255,255,255,0.9);
</style>
