<template>
    <div class="cart-box">
        <div ref="list" class="content">
            <div v-show="!showHead" :style="opacityStyle" class="cart-head-scond">
                购物车
            </div>
            <div class="cart-head">
                <div class="head-text">
                    <div class="cart-text">购物车</div>
                    <div class="cart-count">共{{list.length}}件商品</div>
                </div>
                <div class="goshopping" v-if="!list.length">
                  <i class="iconfont goshop">&#xe775;</i>
                  <div>暂无商品，可去逛逛哦~</div>
                </div>
                <div class="cart-good-box">
                    <div class="good-item" v-for="(item,index) in list" :key="index">
                        <van-checkbox
                            v-model="item.checked"
                            class="check"
                            checked-color="#F85300"
                        >
                        </van-checkbox>
                        <img :src="item.shopGoodsGetJson.shopImgs[0].imgUrl" >
                        <div class="content2">
                            <div class="title">
                            {{item.shopGoodsGetJson.goodsName}}
                            </div>
                            <div class="guige">
                                <p>规格：{{item.property}}</p>
                            </div>
                            <div class="footer">
                                <div class="number">
                                    <van-stepper
                                    @change="selCount(item)"
                                    v-model="item.goodsAmount"
                                    class="number"
                                    integer
                                    :min="1"
                                    :max="item.maxNumber"
                                    />
                                </div>
                            </div>
                        </div>
                        <span class="price">￥{{item.price}}</span>
                        <!-- <div class="del">移除</div> -->
                        <i @click="del(item.shopCarId)" class="iconfont del">&#xe714;</i>
                    </div>
                 </div>
            </div>
        </div>
        <div class="cart-foot" v-if="list.length">
            <van-checkbox class="foot-check" checked-color="#F85300" v-model="checkedAll" @change="check(checkedAll)">全选</van-checkbox>
            <div class="jiesuan">
                <button @click="toBalance" class="allButton">结算</button>
                <span class="all">合计：<span>￥{{priceAll}}</span></span>
            </div>
        </div>

        <van-dialog
          v-model="showDialog"
          show-cancel-button
          :before-close="delCfm"
        >
          <div class="dialogCont">
            <p>提示</p>
            <p>是否将此商品从购物车中移除？</p>
          </div>
        </van-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { Checkbox, Stepper, Dialog, Toast } from 'vant'
Vue.use(Checkbox)
Vue.use(Stepper)
Vue.use(Dialog)
Vue.use(Toast)
export default {
  data () {
    return {
      showHead: true,
      showDialog: false,
      checkedAll: '',
      opacityStyle: {
        opacity: 0
      },
      value: 1,
      delIndex: '',
      list: []
    }
  },
  computed: {
    priceAll () {
      let total = 0
      const vm = this
      const list = vm.list
      for (let i in list) {
        if (list[i].checked === true) {
          total += list[i].price * list[i].goodsAmount
        }
      }
      return total
    }
  },
  // beforeRouteLeave (to, from, next) {
  //   this.$destroy()
  //   next()
  // },
  activated () {
    this.$refs.list.addEventListener('scroll', this.listScroll, true)
    this.getData()
  },
  methods: {
    // 监听滚动事件
    listScroll () {
      const top = this.$refs.list.scrollTop
      if (top > 15) {
        let opacity = top / 60
        opacity = opacity > 1 ? 1 : opacity
        this.opacityStyle = { opacity }
        this.showHead = false
      } else {
        this.showHead = true
      }
    },
    // 选择数量
    selCount (item) {
      if (item.goodsAmount === item.maxNumber) {
        Toast('已达到最大库存')
      }
    },
    // 获取购物车信息
    getData () {
      const vm = this
      vm.$http.post('/ShopCarController/showGoodsInShopCar')
        .then(res => {
          vm.list = res.data.data.shopCars
          vm.list.map(item => {
            vm.$set(item, 'checked', false)
            item.shopGoodsGetJson.goodsDetail.map(value => {
              if (item.property === value.property) {
                vm.$set(item, 'maxNumber', value.stock)
              }
            })
          })
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择需要购买的商品
    check (data) {
      const vm = this
      console.log(vm.list)
      if (!data) {
        vm.list.map((item) => {
          if (item.checked === true) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
      } else if (data) {
        vm.list.map((item) => {
          item.checked = true
        })
      }
    },
    // 删除商品
    del (index) {
      const vm = this
      vm.showDialog = true
      vm.delIndex = index
    },
    delCfm (action, done) {
      const vm = this
      if (action === 'confirm') {
        vm.delshopCarId()
        setTimeout(done, 500)
      } else {
        done()
      }
    },
    delshopCarId () {
      const vm = this
      const params = new URLSearchParams()
      params.append('shopCarId', vm.delIndex)
      vm.$http.post('/ShopCarController/shopCarDelGoods', params)
        .then(res => {
          Toast('已移除')
          vm.getData()
        })
        .catch(err => {
          console.log(err)
        })
    },
    ...mapMutations({
      setOrder: 'GET_ORDER'
    }),
    // 结算
    toBalance () {
      const vm = this
      let list = []
      let shopCars = []
      for (let i in vm.list) {
        if (vm.list[i].checked === true) {
          const goodsId = vm.list[i].goodsId
          const goodsName = vm.list[i].shopGoodsGetJson.goodsName
          const price = vm.list[i].price
          const property = vm.list[i].property
          const goodsAmount = vm.list[i].goodsAmount
          const imgUrl = vm.list[i].shopGoodsGetJson.shopImgs[0].imgUrl
          const shopCarId = vm.list[i].shopCarId
          // const item2 = { shopCarId }
          const item = { goodsId, goodsName, price, property, goodsAmount, imgUrl }
          list.push(item)
          shopCars.push(shopCarId)
        }
      }
      const status = 1
      const totalprice = vm.priceAll
      const orderDetail = { list, totalprice, status, shopCars }
      vm.$router.replace({ path: '/confirmOrder' })
      vm.setOrder(orderDetail)
    }
  },
  watch: {
    list: {
      handler (value) {
        let vm = this
        let count = 0
        for (let i in value) {
          if (value[i].checked === true) {
            count++
          }
        }
        if (count === value.length) {
          vm.checkedAll = true
        } else {
          vm.checkedAll = false
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/common.styl'
.cart-box
    position relative
    left 0
    right 0
    top 0
    bottom 0
    background #F4F4F4
    height 91vh
    .content
        position absolute
        width 100%
        overflow-y auto
        height 82vh
        .cart-head-scond
            width 100%
            position fixed
            color #ffffff
            border 0
            background $cartColor
            font-size 20px
            line-height 7vh
            height 7vh
            z-index 12
            text-align center
        .cart-head
            background $cartColor
            height 24vh
            .head-text
                margin-left 6%
                padding-top 7%
                .cart-text
                    font-weight bold
                    font-size 21px
                    color #ffffff
                .cart-count
                    margin-top .3rem
                    font-size 13px
                    color #ffffff
            .goshopping
              margin-top 20vh
              text-align center
              color #666666
              .goshop
                font-size 54px
              div
                margin-top .3rem
            .cart-good-box
                width 94%
                margin-left auto
                margin-top 3.8vh
                margin-right auto
                .good-item
                    width 98%
                    background-color #ffffff
                    margin-left auto
                    margin-right auto
                    margin-bottom .4rem
                    border-radius 10px
                    height 3.6rem
                    display flex
                    .check
                        position relative
                        top 36%
                        left 5%
                        width 10%
                    img
                        position relative
                        top 13%
                        width 2rem
                        height 2rem
                        border-radius 2px
                        left 5%
                    .content2
                        position relative
                        left 8%
                        top 13%
                        // height 2.8rem
                        width 48%
                        .title
                            height 1rem
                            font-size 15px
                            line-height .4rem
                            color #393E46
                        .guige
                            background-color #f3f3f3
                            border-radius 2px
                            height 1rem
                            p
                                padding .1rem
                                font-size 13px
                                color #a39e9e
                        .footer
                            margin-top .3rem
                            span
                                font-size 16px
                            .number
                                float right
                                height 10%
                    .price
                        position relative
                        left -80%
                        top 82%
                        font-size 15px
                        color #F85300
                    // .del
                    //     position absolute
                    //     left 82%
                    //     color #E8222D
                    //     border 1px solid #E8222D
                    //     width .8rem
                    //     height 15px
                    //     border-radius 20px
                    //     font-size 12px
                    //     line-height 15px
                    //     text-align center
                    //     margin-top .1rem
                    .del
                      position absolute
                      right 5.5%
                      margin-top .08rem
                      font-size 18px
                      color #E8222D
    .cart-foot
        position absolute
        bottom 0
        background #ffffff
        width 100%
        height 9vh
        display flex
        border-top 1px solid #eeeeee
        .foot-check
            height 9vh
            line-height 9vh
            margin-left .3rem
            width 20%
            color #393E46
            font-size 16px
        .jiesuan
            height 9vh
            line-height 9vh
            margin-left .2rem
            width 70%
            .all
                float right
                font-size 17px
                margin-right .2rem
                span
                    color #F85300
                    font-size 16px
            .allButton
                float right
                height 7vh
                width 35%
                margin-top 1vh
                font-size 18px
                border-radius 30px
                background $cartColor
                color #ffffff
</style>
