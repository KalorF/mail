<template>
    <div class="all-box">
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
            <div class="footer" v-if="item.shopOrder.shopStatus === 2 || item.shopOrder.shopStatus === 7">
                <button @click="sendRef(item.shopOrder.orderId)">申请退货</button>
                <button @click="goLogs(item)">查看物流</button>
                <button @click="del(item.shopOrder.orderId)">删除订单</button>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 5">
                <div class="wait">等待商家确认退货</div>
                <button @click="goLogs(item)">查看物流</button>
                <button @click="del(item.shopOrder.orderId)">删除订单</button>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 6">
                <div class="wait">商家已确认退货</div>
                <button @click="writeLogs(item.shopOrder.orderId)">填写物流</button>
                <button @click="del(item.shopOrder.orderId)">删除订单</button>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 8">
                <div class="wait">退货成功</div>
                <!-- <button @click="goLogs(item)">查看物流</button> -->
                <button @click="del(item.shopOrder.orderId)">删除订单</button>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 9">
                <div class="wait">等待商家确认收货</div>
                <!-- <button @click="goLogs(item)">查看物流</button> -->
                <button @click="del(item.shopOrder.orderId)">删除订单</button>
            </div>
        </div>
        <van-dialog
          v-model="showDialog"
          show-cancel-button
          :before-close="delCfm"
        >
          <div class="dialogCont">
            <p>提示</p>
            <p>是否删除此订单？</p>
          </div>
        </van-dialog>

        <van-dialog
          v-model="refDialog"
          show-cancel-button
          :confirmButtonText="'提交'"
          :before-close="refCfm"
        >
            <div class="refDialog">
            <p>退货申请</p>
            <textarea v-model="ref" class="textarea" placeholder="请填写退货原因" rows="3"></textarea>
            </div>
        </van-dialog>

        <van-dialog
          v-model="logDialog"
          show-cancel-button
          :confirmButtonText="'提交'"
          :before-close="logCfm"
        >
            <div class="logDialog">
                <p>填写物流信息</p>
                <div>
                    <span>物流公司</span>
                    <input type="text" v-model="logName" placeholder="请填写物流公司" />
                </div>
                <div>
                    <span>物流单号</span>
                    <input type="tel" v-model="logisticsCode" placeholder="请填写物流单号" />
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import { Dialog, Toast } from 'vant'
import { logList } from '@/LogisticalCompany.js'
Vue.use(Dialog).use(Toast)
export default {
  data () {
    return {
      showDialog: false,
      refDialog: false,
      logDialog: false,
      logIndex: '',
      logName: '',
      logisticsCode: '',
      logCode: '',
      delIndex: '',
      sedIdex: '',
      ref: '',
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
      params.append('shopStatus', 2)
      vm.$http.post('/ShopOrderController/customerShopOrder', params)
        .then(res => {
          console.log(res)
          vm.list = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    sendRef (item) {
      const vm = this
      vm.refDialog = true
      vm.sedIdex = item
    },
    refCfm (action, done) {
      const vm = this
      if (action === 'confirm') {
        if (vm.ref === '' || vm.ref === null) {
          Toast('请填写退货原因')
          setTimeout(done, 500)
        } else {
          vm.reqRef()
          setTimeout(done, 500)
        }
      } else {
        vm.ref = ''
        done()
      }
    },
    reqRef () {
      const vm = this
      const params = new URLSearchParams()
      //   params.append('openid', 1)
      params.append('orderId', vm.sedIdex)
      params.append('refundDesc', vm.ref)
      vm.$http.post('/ShopRefundRecordController/refundRequest2', params)
        .then(res => {
          console.log(res)
          vm.ref = ''
          vm.getData()
          Toast('提交成功')
        })
        .catch(err => {
          console.log(err)
        })
    },
    del (id) {
      const vm = this
      vm.showDialog = true
      vm.delIndex = id
    },
    delCfm (action, done) {
      if (action === 'confirm') {
        this.delOrder()
        setTimeout(done, 500)
      } else {
        done()
      }
    },
    delOrder () {
      const vm = this
      const params = new URLSearchParams()
      params.append('orderId', vm.delIndex)
      vm.$http.post('/ShopOrderController/updateOrderIsDel', params)
        .then(res => {
          console.log(res)
          vm.getData()
          Toast('删除成功')
        })
        .catch(err => {
          console.log(err)
        })
    },
    writeLogs (index) {
      const vm = this
      vm.logDialog = true
      vm.logIndex = index
    },
    logCfm (action, done) {
      const vm = this
      if (action === 'confirm') {
        if (vm.logName === '' || vm.logisticsCode === '') {
          Toast('请填写完整信息')
          setTimeout(done, 500)
        } else {
          logList.forEach(item => {
            if (vm.logName === item.value) {
              vm.logCode = item.code
              vm.sendLogs()
              setTimeout(done, 500)
            } else if (vm.logName !== item.value) {
              Toast('物流公司填写错误')
              setTimeout(done, 500)
            }
          })
        }
      } else {
        vm.logName = ''
        vm.logisticsCode = ''
        done()
      }
    },
    sendLogs () {
      const vm = this
      const params = new URLSearchParams()
      params.append('shopRefundId', vm.logIndex)
      params.append('logisticsCode', vm.logisticsCode)
      params.append('shipper', vm.logCode)
      params.append('shipperName', vm.logName)
      vm.$http.post('/LogisticsController/RefundLogistics', params)
        .then(res => {
          console.log(res)
          vm.logName = ''
          vm.logisticsCode = ''
          Toast('提交成功')
          vm.getData()
        })
        .catch(err => {
          console.log(err)
        })
    },
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

.all-box
    height 76vh
    background #f5f5f5
    position relative
    overflow-y auto
    left 0
    right 0
    top 0
    bottom 0
    .logDialog
        padding .2rem
        text-align center
        div
            margin-top .3rem
            span
                font-size 13px
            input
                margin-left .2rem
                padding-left .1rem
                border 1px solid #eee
    .refDialog
        padding .2rem
        text-align center
        .textarea
            margin-top .2rem
            width 94%
            padding-left .1rem
            border 1px solid #eeeeee
            resize none
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
            .wait
                line-height .6rem
                float left
                color $themeColor
            button
                float right
                color #393E46
                background-color #ffffff
                width 25%
                margin-left .2rem
                height .6rem
                line-height .6rem
                border 1px solid #a39e9e
                border-radius 20px
</style>
