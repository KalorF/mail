<template>
    <div class="obligation-box">
        <div class="noOrder" v-if="!list.length">
            <i class="iconfont">&#xe603;</i>
            <div>无相关信息</div>
        </div>
        <div class="all-item" v-for="(item,index) in list" :key="index">
            <div v-for="(goods, index) in item.shopOrderDetailList" :key="index" class="one-item">
                <img :src="goods.imgUrl" >
                <div class="title-text">
                    <p>{{goods.goodsName}}</p>
                    <p>规格：{{goods.goodsProperty}}</p>
                </div>
                <div class="number">
                    <p>￥{{goods.unitPrice}}</p>
                    <p>x {{goods.goodsNumber}}</p>
                </div>
            </div>
            <div class="total">
                <p>
                    <span>共{{item.shopOrderDetailList.length}}件商品</span>
                    <span>合计:</span>
                    <span>￥{{item.shopOrder.price}}</span>
                </p>
            </div>
            <div class="address">
                <div>地址:</div>
                <p>{{item.shopOrder.address}}</p>
            </div>
            <div class="footer">
                <button>立即付款</button>
                <button @click="cancel(item.shopOrder.orderId)">取消订单</button>
            </div>
        </div>

        <van-dialog
          v-model="showDialog"
          show-cancel-button
          :before-close="calCfm"
        >
          <div class="dialogCont">
            <p>提示</p>
            <p>是否取消此订单？</p>
          </div>
        </van-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import { Dialog, Toast } from 'vant'
Vue.use(Dialog).use(Toast)
export default {
  data () {
    return {
      showDialog: false,
      calIndex: '',
      list: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      const vm = this
      const params = new URLSearchParams()
      params.append('shopStatus', -1)
      vm.$http.post('/ShopOrderController/customerShopOrder', params)
        .then(res => {
          console.log(res)
          vm.list = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancel (index) {
      const vm = this
      vm.showDialog = true
      vm.calIndex = index
    },
    calCfm (action, done) {
      if (action === 'confirm') {
        this.sendCal()
        setTimeout(done, 500)
      } else {
        done()
      }
    },
    sendCal () {
      const vm = this
      const params = new URLSearchParams()
      params.append('orderId', vm.calIndex)
      vm.$http.post('/ShopOrderController/updateOrderIsDel', params)
        .then(res => {
          console.log(res)
          vm.getData()
          Toast('取消成功')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/common.styl'

.obligation-box
    height 76vh
    background #f5f5f5
    position relative
    overflow-y auto
    left 0
    right 0
    top 0
    bottom 0
    .noOrder
        margin-top 12vh
        text-align center
        color #aaaaaa
        i
            font-size 50px
        div
            font-size 16px
            margin-top .25rem
    .all-item
        margin-top .2rem
        padding-bottom .3rem
        width 90%
        margin-left auto
        margin-bottom .4rem
        background #ffffff
        margin-right auto
        border-radius 10px
        .one-item
            width 90%
            padding-top .1rem
            display flex
            margin-left auto
            margin-right auto
            img
                width 70px
                height 70px
                border-radius 10px
                margin-top .2rem
            .title-text
                width 55%
                margin-top .2rem
                margin-left .35rem
                p:nth-child(1)
                    font-size 16px
                p:nth-child(2)
                    margin-top .2rem
                    font-size 13px
                    color #aaaaaa
            .number
                margin-left .2rem
                margin-top .2rem
                p:nth-child(1)
                    font-size 13px
                p:nth-child(2)
                    font-size 13px
                    color #aaaaaa
                    float right
                    margin-top .1rem
        .total
            margin-top .3rem
            width 90%
            margin-left auto
            margin-right auto
            height .5rem
            p
                float right
                font-size 13px
                span:nth-child(1)
                    margin-right .2rem
                span:nth-child(3)
                    font-size 15px
        .address
            width 90%
            margin-left auto
            margin-right auto
            display flex
            height .5rem
            padding-bottom .3rem
            color #393E46
            div:nth-child(1)
                border-left 3px solid #eeeeee
                width 15%
                padding-left .1rem
                height .27rem
            p
                line-height 15px
        .footer
            width 90%
            height .6rem
            margin-left auto
            margin-right auto
            button
                float right
                color #393E46
                background-color #ffffff
                width 28%
                margin-left .2rem
                height .6rem
                border 1px solid #a39e9e
                border-radius 20px
</style>
