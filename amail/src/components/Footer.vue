<template>
    <div class="foot-tab">
        <router-link tag="div" class="tab-item" :to="{path: '/shophome'}" replace>
            <span class="tab-link">
                <i v-if="'/shophome' === $route.path" class="iconfont">&#xe659;</i>
                <i v-else class="iconfont">&#xe602;</i>
                <p>首页</p>
            </span>
        </router-link>
        <router-link tag="div" class="tab-item" :to="{path: '/shoppingCart'}" replace>
            <span class="tab-link">
                <i v-if="'/shoppingCart' === $route.path" class="iconfont">&#xe60b;</i>
                <i v-else class="iconfont">&#xe672;</i>
                <p>购物车</p>
            </span>
        </router-link>
        <router-link tag="div" class="tab-item" :to="{path: '/orderHome'}" replace>
            <span class="tab-link">
                <i v-if="'/orderHome' === $route.path" class="iconfont">&#xe69a;</i>
                <i v-else class="iconfont">&#xe61e;</i>
                <p>订单</p>
            </span>
        </router-link>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/common.styl'
.foot-tab
  position fixed
  height 9.2vh
  width 100%
  display flex
  bottom 0
  border-top 1px solid #eeeeee
  justify-content center
  align-items center
  background-color #fdfdfd
//   z-index 12
  .tab-item
      flex: 1
      text-align: center
    //   margin-top .15rem
      .tab-link
        // padding-bottom: 2px
        color: #2d2d2d
        i
          font-size 24px
        p
          font-size 12px
          margin-top .11rem
        // .active
        //   font-size 25px
      &.router-link-active
        .tab-link
          color: $themeColor
</style>
