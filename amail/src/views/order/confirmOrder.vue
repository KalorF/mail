<template>
    <Transition name="slide">
        <div class="confirm-box">
            <div class="thisHead">
                <i @click="back" class="iconfont">&#xe637;</i>
                <span>确认订单</span>
            </div>
            <div class="cfContent">
                <div class="goods-box">
                    <div class="good-item" v-for="(item,index) in orderList.list" :key="index">
                        <img :src="item.imgUrl" >
                        <div>
                            <p>{{item.goodsName}}</p>
                            <p>规格: {{item.property}}</p>
                            <p>￥{{item.price}}<span>x {{item.goodsAmount}}</span></p>
                        </div>
                    </div>
                </div>
                <div class="address-title">收货地址</div>
                <div class="address-box">
                    <div class="adInput">
                        <input type="text" v-model="userName" placeholder="收货人">
                    </div>
                    <div class="adInput">
                        <input type="tel" v-model="phone" placeholder="手机号码" maxlength="11">
                    </div>
                    <div class="adInput">
                        <input v-model="area" @click="selArea" type="text" readonly placeholder="所在地区">
                    </div>
                    <textarea v-model="adr" class="textarea" placeholder="详细地址: 如道路、门牌号、小区、楼栋号、单元室等" rows="3"></textarea>
                </div>
                <div class="remark">备注</div>
                <div class="remark-box">
                    <textarea v-model="remark" class="textarea" placeholder="填写备注（非必填）" rows="3"></textarea>
                </div>
            </div>
            <div class="confirm-foot">
                <div>总价：<span>￥{{orderList.totalprice}}</span><button @click="toPay" class="zf">立即支付</button></div>
            </div>
            <van-popup v-model="show" position="bottom">
                <van-area @cancel="cancel" @confirm="confirmSel" :area-list="areaList" value="440000" />
            </van-popup>
        </div>
    </Transition>
</template>

<script>
import Vue from 'vue'
import wx from 'weixin-jsapi'
import { mapGetters } from 'vuex'
import { Popup, Area, Toast } from 'vant'
import areaList from '@/areaList.js'
import Transition from '@/components/transition.vue'

Vue.use(Popup)
Vue.use(Area)
Vue.use(Toast)
let frompath = ''
export default {
  components: {
    Transition
  },
  beforeRouteEnter (to, from, next) {
    frompath = from.path
    next()
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy()
    next()
  },
  data () {
    return {
      show: false,
      areaList: areaList,
      userName: '',
      phone: '',
      area: '',
      adr: '',
      remark: '',
      path: '',
      outTradeNo: ''
    }
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  methods: {
    back () {
      const vm = this
      vm.$router.replace({ path: frompath })
    },
    selArea () {
      const vm = this
      vm.show = true
    },
    cancel () {
      const vm = this
      vm.show = false
    },
    confirmSel (e) {
      const vm = this
      const area = e[0].name + e[1].name + e[2].name
      vm.area = area
      vm.show = false
    },
    toPay () {
      const vm = this
      let orderDetail = ''
      const thisList = vm.orderList.list
      const address = vm.area + vm.adr
      for (let i in thisList) {
        const Detail = thisList[i].goodsId +
        '*' + thisList[i].property +
        '*' + thisList[i].goodsAmount +
        '*' + thisList[i].goodsName +
        '*' + thisList[i].price +
        '*' + thisList[i].imgUrl
        orderDetail += Detail + ','
      }
      if (vm.userName === '' || vm.area === '' || vm.adr === '' || vm.phone === '') {
        Toast('请将信息填写完整')
      } else {
        const params = new URLSearchParams()
        params.append('userName', vm.userName)
        params.append('orderDetail', orderDetail.substring(0, orderDetail.length - 1))
        params.append('price', vm.orderList.totalprice)
        params.append('orderNote', vm.remark)
        params.append('address', address)
        params.append('phone', vm.phone)
        vm.$http.post('/ShopOrderController/placeOrder', params)
          .then(res => {
            console.log(res)
            vm.outTradeNo = res.data.outTradeNo
            vm.weixinPay()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    weixinPay () {
      const vm = this
      const address = vm.area + vm.adr
      const params = new URLSearchParams()
      params.append('outTradeNo', vm.outTradeNo)
      params.append('price', vm.orderList.totalprice)
      params.append('status', vm.orderList.status)
      params.append('shopCars', vm.orderList.shopCars)
      vm.$http.post('/WXPay/weixinPayForShopGoods', params)
        .then(res => {
          let outTradeNo = res.data.outTradeNo
          let status = res.data.status
          let shopCars = res.data.shopCars
          wx.ready(function () {
            wx.chooseWXPay({
              appId: res.data.data.appId, // 公众号名称，由商户传入
              timeStamp: res.data.data.timeStamp, // 时间戳，自1970年以来的秒数
              nonceStr: res.data.data.nonceStr, // 随机串
              package: res.data.data.package,
              signType: res.data.data.signType, // 微信签名方式：
              paySign: res.data.data.paySign, // 微信签名
              success: function (respon) {
                const sucs = new URLSearchParams()
                sucs.append('outTradeNo', outTradeNo)
                sucs.append('status', status)
                sucs.append('shopCars', shopCars)
                sucs.append('payStatus', 1)
                vm.$http.post('/WXPay/weixinResultShopOrder', sucs)
                  .then(res => {
                    let timer = setTimeout(() => {
                      clearTimeout(timer)
                      vm.$router.replace({ path: '/buyComplete', query: { address: address, userName: vm.userName, phone: vm.phone } })
                    }, 500)
                  })
                  .catch(err => {
                    console.log(err)
                  })
              },
              cancel: function (respon) {
                const canl = new URLSearchParams()
                canl.append('outTradeNo', outTradeNo)
                canl.append('status', status)
                canl.append('shopCars', shopCars)
                canl.append('payStatus', 0)
                vm.$http.post('/WXPay/weixinResultShopOrder', canl)
                  .then(res => {
                    console.log(res)
                    Toast('支付已经取消')
                  })
                  .catch(err => {
                    console.log(err)
                  })
              },
              fail: function (respon) {
                const fail = new URLSearchParams()
                fail.append('outTradeNo', outTradeNo)
                fail.append('status', status)
                fail.append('shopCars', shopCars)
                fail.append('payStatus', 0)
                vm.$http.post('/WXPay/weixinResultShopOrder', fail)
                  .then(res => {
                    console.log(res)
                    Toast('支付失败')
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            })
          })
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

.confirm-box
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    background #f4f4f4
    z-index 6
    height 100vh
    .thisHead
        position relative
        height 8vh
        line-height 8vh
        background #ffffff
        border-bottom 1px solid #eeeeee
        i
            font-size 22px
            margin-left .3rem
        span
            font-size 20px
            margin-left .2rem
    .cfContent
        position relative
        // background red
        overflow-y auto
        height 82vh
    .goods-box
        position relative
        background #ffffff
        padding .2rem
        .good-item
            display flex
            margin-bottom .2rem
            img
                width 80px
                height 80px
                border-radius 3px
            div
                margin-left .2rem
                width 72%
                p:nth-child(1)
                    font-size 16px
                p:nth-child(2)
                    margin-top .2rem
                    color #aaaaaa
                p:nth-child(3)
                    margin-top .4rem
                    color #F85300
                    font-size 15px
                    span
                        float right
                        color #333
    .address-title
        padding-left .2rem
        font-size 16px
        color #a39e9e
        margin-top .2rem
        margin-bottom .2rem
    .address-box
        background #ffffff
        height 4.2rem
        .adInput
            height .8rem
            padding-left .2rem
            line-height .8rem
            border-bottom 1px solid #f5f5f5
            input
                width 90%
        .textarea
            margin-top .2rem
            width 94%
            padding-left .2rem
            resize none
    .remark
        margin-left .2rem
        font-size 16px
        color #a39e9e
        margin-top .2rem
        margin-bottom .2rem
    .remark-box
        background #ffffff
        height 2rem
        margin-bottom .3rem
        .textarea
            margin-top .2rem
            width 94%
            padding-left .2rem
            resize none
    .confirm-foot
        position absolute
        bottom 0
        background #ffffff
        height 10vh
        line-height 10vh
        width 100%
        border-top 1px solid #eeeeee
        div
            font-size 17px
            margin-left .2rem
            span
                color #F85300
            .zf
                float right
                margin-right .2rem
                border-radius 30px
                width 35%
                height 8vh
                margin-top 1vh
                background $cartColor
                color #ffffff
</style>
