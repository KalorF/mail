<template>
    <div class="after-sale">
        <div class="noOrder" v-if="!list.length">
            <i class="iconfont">&#xe603;</i>
            <div>无相关信息</div>
        </div>
        <div class="all-item" v-for="(item,index) in list" :key="index">
            <div v-for="(goods, index) in item.shopOrderDetailList" :key="index " class="one-item">
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
            <div class="footer" v-if="item.shopOrder.shopStatus === 5">
                <div class="wait" v-if="item.logistics === null">等待商家审核退款</div>
                <div class="wait" v-if="item.logistics !== null">等待商家审核退货</div>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 6">
                <div class="wait" v-if="item.logistics !== null">退货审核通过</div>
                <button v-if="item.logistics !== null" @click="writeLogs(item.shopOrder.shopRefundRecord.shopRefundId)">填写物流</button>
                <div class="wait" v-if="item.logistics === null">退款审核通过，待商家退款</div>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 7">
                <div class="wait" v-if="item.logistics === null">商家拒绝退款</div>
                <button v-if="item.logistics === null" @click="refund(item.shopOrder.orderId)">再次申请</button>
                <div class="wait" v-if="item.logistics !== null">商家拒绝退货</div>
                <button v-if="item.logistics !== null" @click="refundgoods(item.shopOrder.orderId)">再次申请</button>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 8">
                <div class="wait">退款成功</div>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 9">
                <div class="wait">商品已寄出，等待商家收货</div>
            </div>
        </div>
        <van-dialog
          v-model="showDialog"
          show-cancel-button
          :confirmButtonText="'提交'"
          :before-close="refCfm"
        >
            <div class="refDialog">
            <p>退款申请</p>
            <textarea v-model="ref" class="textarea" placeholder="请填写退款原因" rows="3"></textarea>
            </div>
        </van-dialog>

        <van-dialog
          v-model="goodsDialog"
          show-cancel-button
          :confirmButtonText="'提交'"
          :before-close="goodsrefCfm"
        >
            <div class="refDialog">
            <p>退货申请</p>
            <textarea v-model="goodsref" class="textarea" placeholder="请填写退货原因" rows="3"></textarea>
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
                    <select v-model='selected'>
                      <option value="" selected disabled style="display:none;">选择物流公司</option>
                      <option v-for="(item, index) in loglist" :key="index" :value ="item.value">
                        {{item.value}}
                      </option>
                    </select>
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
      list: [],
      selected: '',
      refIndex: '',
      ref: '',
      goodsDialog: false,
      goodsref: '',
      goodsrefIndex: '',
      logDialog: false,
      logIndex: '',
      logName: '',
      logisticsCode: '',
      logCode: ''
    }
  },
  created () {
    this.getData()
  },
  computed: {
    loglist () {
      return logList
    }
  },
  methods: {
    // 获取订单信息
    getData () {
      const vm = this
      const params = new URLSearchParams()
      params.append('shopStatus', 5)
      vm.$http.post('/ShopOrderController/customerShopOrder', params)
        .then(res => {
          console.log(res)
          vm.list = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 退款申请
    refund (index) {
      const vm = this
      vm.showDialog = true
      vm.refIndex = index
    },
    refCfm (action, done) {
      const vm = this
      if (action === 'confirm') {
        if (vm.ref === '' || vm.ref === null) {
          Toast('请填写退款原因')
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
      params.append('orderId', vm.refIndex)
      params.append('refundDesc', vm.ref)
      vm.$http.post('/ShopRefundRecordController/refundRequest', params)
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
    // 退货申请
    refundgoods (index) {
      const vm = this
      vm.goodsDialog = true
      vm.goodsrefIndex = index
    },
    goodsrefCfm (action, done) {
      const vm = this
      if (action === 'confirm') {
        if (vm.goodsref === '' || vm.goodsref === null) {
          Toast('请填写退货原因')
          setTimeout(done, 500)
        } else {
          vm.goodsreqRef()
          setTimeout(done, 500)
        }
      } else {
        vm.goodsref = ''
        done()
      }
    },
    goodsreqRef () {
      const vm = this
      const params = new URLSearchParams()
      params.append('orderId', vm.refIndex)
      params.append('refundDesc', vm.ref)
      vm.$http.post('/ShopRefundRecordController/refundRequest', params)
        .then(res => {
          console.log(res)
          vm.goodsref = ''
          vm.getData()
          Toast('提交成功')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 填写物流
    writeLogs (index) {
      const vm = this
      vm.logDialog = true
      vm.logIndex = index
    },
    logCfm (action, done) {
      const vm = this
      if (action === 'confirm') {
        if (vm.selected === '' || vm.logisticsCode === '') {
          Toast('请填写完整信息')
          setTimeout(done, 500)
        } else {
          logList.forEach(item => {
            if (vm.selected === item.value) {
              vm.logCode = item.code
              vm.sendLogs()
              setTimeout(done, 500)
            }
          })
        }
      } else {
        vm.selected = ''
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
      params.append('shipperName', vm.selected)
      vm.$http.post('/LogisticsController/RefundLogistics', params)
        .then(res => {
          console.log(res)
          vm.selected = ''
          vm.logisticsCode = ''
          Toast('提交成功')
          vm.getData()
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

.after-sale
    height 74.5vh
    background #f5f5f5
    position relative
    overflow-y auto
    left 0
    right 0
    top 0
    bottom 0
    .refDialog
        padding .2rem
        text-align center
        .textarea
            margin-top .2rem
            width 94%
            padding-left .1rem
            border 1px solid #eeeeee
            resize none
    .logDialog
        padding .2rem
        text-align center
        div
            display flex
            height .6rem
            margin-top .3rem
            span
                line-height .6rem
                font-size 13px
            select
                margin-left .2rem
                border 1px solid #eee
                width 66%
            input
                width 64%
                margin-left .2rem
                padding-left .1rem
                border 1px solid #eee
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
            span:nth-child(1)
                margin-left .1rem
        .address
            width 90%
            margin-left auto
            margin-right auto
            display flex
            height .5rem
            padding-bottom .3rem
            color #393E46
            div:nth-child(1)
                border-left 3px solid $themeColor
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
