<template>
    <div class="wait-take">
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
            <div class="userMsg">
                <div><span>收货人: </span><span>{{item.shopOrder.userName}}</span></div>
            </div>
            <div class="userMsg">
                <div><span>联系方式: </span><span>{{item.shopOrder.phone}}</span></div>
            </div>
            <div class="address">
                <div>地址:</div>
                <p>{{item.shopOrder.address}}</p>
            </div>
            <div class="footer">
                <button @click="cfmTake(item.shopOrder.orderId)">确认收货</button>
                <button @click="goLogs(item)">查看物流</button>
            </div>
        </div>

        <van-dialog
          v-model="takeDialog"
          show-cancel-button
          :before-close="takeCfm"
        >
          <div class="dialogCont">
            <p>提示</p>
            <p>是否确认收货？</p>
          </div>
        </van-dialog>

    </div>
</template>

<script>
import Vue from 'vue'
import api from '@/serverAPI.js'
import { Dialog, Toast } from 'vant'
Vue.use(Dialog).use(Toast)
export default {
  data () {
    return {
      takeDialog: false,
      refIndex: '',
      takeIndex: '',
      list: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取订单信息
    getData () {
      const vm = this
      const params = new URLSearchParams()
      params.append('shopStatus', 1)
      vm.$http.post(api.customerShopOrder, params)
        .then(res => {
          console.log(res)
          vm.list = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 确认收货
    cfmTake (index) {
      const vm = this
      vm.takeDialog = true
      vm.takeIndex = index
    },
    takeCfm (action, done) {
      if (action === 'confirm') {
        this.sendTake()
        setTimeout(done, 500)
      } else {
        done()
      }
    },
    sendTake () {
      const vm = this
      const params = new URLSearchParams()
      params.append('orderId', vm.takeIndex)
      vm.$http.post(api.confirmReceipt, params)
        .then(res => {
          console.log(res)
          vm.getData()
          Toast('已确认收货')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查看物流信息
    goLogs (item) {
      const vm = this
      const shipper = item.logistics.shipper
      const code = item.logistics.logisticsCode
      vm.$router.replace({ path: '/goodsLog', query: { shipper: shipper, code: code } })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/common.styl'

.wait-take
    height 74.5vh
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
                    font-size 15px
                    line-height 20px
                p:nth-child(2)
                    margin-top .2rem
                    font-size 13px
                    color #aaaaaa
            .number
                margin-left .2rem
                margin-top .2rem
                p:nth-child(1)
                    text-align right
                    font-size 13px
                p:nth-child(2)
                    font-size 13px
                    color #aaaaaa
                    text-align right
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
        .userMsg
            width 89%
            margin-left auto
            margin-right auto
            height .3rem
            line-height .3rem
            margin-bottom .1rem
            border-left 3px solid $themeColor
            color #626262
            font-size 13px
            span:nth-child(1)
                margin-left .1rem
        .address
            width 90%
            margin-left auto
            margin-right auto
            display flex
            padding-bottom .25rem
            color #626262
            font-size 13px
            div:nth-child(1)
                border-left 3px solid $themeColor
                width 15%
                padding-left .1rem
                height .27rem
            p
                line-height 16px
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
