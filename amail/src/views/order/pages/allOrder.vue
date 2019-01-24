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
                <button @click="sendRef(item.shopOrder.orderId)">申请退货</button>
                <button @click="goLogs(item)">查看物流</button>
                <button @click="del(item.shopOrder.orderId)">删除订单</button>
            </div>
            <!-- <div class="footer" v-if="item.shopOrder.shopStatus === 5">
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
                <button @click="del(item.shopOrder.orderId)">删除订单</button>
            </div>
            <div class="footer" v-if="item.shopOrder.shopStatus === 9">
                <div class="wait">等待商家确认收货</div>
                <button @click="del(item.shopOrder.orderId)">删除订单</button>
            </div> -->
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

        <!-- <van-dialog
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
        </van-dialog> -->
    </div>
</template>

<script>
import Vue from 'vue'
import api from '@/serverAPI.js'
import { Dialog, Toast } from 'vant'
// import { logList } from '@/LogisticalCompany.js'
Vue.use(Dialog).use(Toast)
export default {
  data () {
    return {
      showDialog: false,
      refDialog: false,
      delIndex: '',
      sedIdex: '',
      ref: '',
      list: []
      //   logDialog: false,
      //   logIndex: '',
      //   logName: '',
      //   logisticsCode: '',
      //   logCode: '',
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
      params.append('shopStatus', 2)
      vm.$http.post(api.customerShopOrder, params)
        .then(res => {
          console.log(res)
          vm.list = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 退货申请
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
      params.append('orderId', vm.sedIdex)
      params.append('refundDesc', vm.ref)
      vm.$http.post(api.refundRequest, params)
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
    // 删除订单
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
      vm.$http.post(api.updateOrderIsDel, params)
        .then(res => {
          console.log(res)
          vm.getData()
          Toast('删除成功')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查看物流
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
    height 74.5vh
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
                    font-size 15px
                    line-height 20px
                p:nth-child(2)
                    margin-top .2rem
                    font-size 13px
                    color #aaaaaa
            .number
                margin-left .2rem
                margin-top .3rem
                width 24%
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
