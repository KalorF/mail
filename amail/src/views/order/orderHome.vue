<template>
    <div class="order-box">
        <div class="order-head">我的订单</div>
        <van-tabs v-model="activeTab" @change="change" color='#31C27C' :line-width='22' swipeable animated class="thisTab">
            <van-tab :title="'已完成'"><allOrder></allOrder></van-tab>
            <van-tab :title="'待付款'"><obligation></obligation></van-tab>
            <van-tab :title="'待发货'"><waitSend></waitSend></van-tab>
            <van-tab :title="'待收货'"><waitTake></waitTake></van-tab>
            <van-tab :title="'售后服务'"><afterSaleService></afterSaleService></van-tab>
        </van-tabs>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { Tab, Tabs } from 'vant'
import allOrder from './pages/allOrder.vue'
import obligation from './pages/obligation.vue'
import waitSend from './pages/waitSend.vue'
import waitTake from './pages/waitTake.vue'
import afterSaleService from './pages/afterSaleService.vue'
Vue.use(Tab).use(Tabs)
export default {
  components: {
    allOrder,
    obligation,
    waitSend,
    waitTake,
    afterSaleService
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy()
    next()
  },
  computed: {
    ...mapGetters(['activeTab'])
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations({
      setActive: 'ACTIVE_TAB'
    }),
    change (e) {
      const vm = this
      vm.setActive(e)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/common.styl'
.order-box
    position relative
    left 0
    right 0
    top 0
    bottom 0
    background #F4F4F4
    height 91vh
    .order-head
        position relative
        width 100%
        height 8vh
        text-align center
        line-height 8vh
        font-size 20px
        color #ffffff
        background $cartColor
    .thisTab
        position relative
        height 6vh
        z-index 5
</style>
