<template>
    <transition name="slide">
        <div class="detail-box">
            <div class="content" ref="content" >
                <div class="head-first">
                    <div @click="back"><span class="iconfont">&#xe637;</span></div>
                    <div @click="$router.replace({path: '/shophome'})"><span class="iconfont">&#xe602;</span></div>
                    <div @click="$router.replace({path: '/shoppingCart'})"><span class="iconfont">&#xe672;</span></div>
                </div>
                <div class="head-second" :style="opacityStyle" v-show="!showHead">
                    <span @click="back" class="iconfont">&#xe637;</span>
                    <span @click="$router.replace({path: '/shophome'})" class="iconfont">&#xe602;</span>
                    <span @click="$router.replace({path: '/shoppingCart'})" class="iconfont">&#xe672;</span>
                </div>
                <van-swipe @change="onChange" class="swiper" :autoplay='3000'>
                    <van-swipe-item v-for="(item,index) in detail.shopImgs" :key="index" ><img :src="item.imgUrl" ></van-swipe-item>
                    <div class="custom-indicator" slot="indicator">
                        {{ current + 1 }}/{{detail.shopImgs.length}}
                    </div>
                </van-swipe>
                <div class="price-title">
                    <p>￥<span>{{detail.goodsDetail[0].price}}</span></p>
                    <p>{{detail.goodsName}}</p>
                    <div><span>快递:00.00</span><span>销量:{{detail.goodsPayNum}}</span></div>
                </div>
                <div class="seleect">
                    <div><span>服务</span><span>正品保证 · 急速发货</span><i class="iconfont">&#xe601;</i></div>
                    <div @click="selSpec"><span>规格</span><span>{{spec}}</span><i class="iconfont">&#xe601;</i></div>
                </div>
                <div class="detail">
                    <div class="title"><span>商品详情</span></div>
                    <div class="detail-content">
                        {{detail.goodsInfo}}
                    </div>
                </div>
            </div>
            <div class="footer">
                <span>总价:<span>{{totalPrice}}</span></span>
                <button class="button1" @click="toPay">立即购买</button>
                <button class="button2" @click="addToCart">加入购物车</button>
            </div>
            <div v-show="showSelect" @click="hideSel" class="select-spec"></div>
            <transition name="select">
                <div v-show="showSelect" class="spec-content">
                    <i @click="hideSel" class="iconfont cancel">&#xe714;</i>
                    <img :src="detail.shopImgs[0].imgUrl">
                    <div class="selPrice">
                        <p>￥<span>{{price}}</span></p>
                        <p>库存{{stock}}件</p>
                    </div>
                    <div class="selcontent">
                        <div class="guigeT">选择规格</div>
                        <div class="selItem">
                            <div ref="sel" @click="selItem(index)" :class="{active:index == active}" v-for="(item,index) in detail.goodsDetail" :key="index">{{item.property}}</div>
                        </div>
                        <div class="selNum">数量
                            <van-stepper
                            @change="selCount"
                            v-model="number"
                            class="number"
                            integer
                            :min="1"
                            :max="maxNumber"
                            /></div>
                    </div>
                    <button @click="confirmSel">确认选择</button>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue'
import api from '@/serverAPI.js'
import { Swipe, SwipeItem, Stepper, Toast } from 'vant'
import { mapGetters, mapMutations } from 'vuex'

Vue.use(Swipe).use(SwipeItem)
Vue.use(Stepper)
Vue.use(Toast)

let frompath = ''
export default {
  mounted () {
    this.$refs.content.addEventListener('scroll', this.contentScroll, true)
    this.getFirstPriceStock()
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy()
    next()
  },
  data () {
    return {
      current: 0,
      active: -1,
      showSelect: false,
      showHead: true,
      number: 1,
      price: '',
      stock: 0,
      cost: 0,
      maxNumber: '10',
      property: '',
      totalPrice: 0,
      spec: '选择规格',
      selName: '',
      opacityStyle: {
        opacity: 0
      }
    }
  },
  computed: {
    ...mapGetters(['detail'])
  },
  beforeRouteEnter (to, from, next) {
    frompath = from.path
    next()
  },
  methods: {
    // 监听滚动事件
    contentScroll () {
      const vm = this
      const top = vm.$refs.content.scrollTop
      if (top > 30) {
        let opacity = top / 70
        opacity = opacity > 1 ? 1 : opacity
        vm.opacityStyle = { opacity }
        vm.showHead = false
      } else {
        vm.showHead = true
      }
    },
    onChange (index) {
      this.current = index
    },
    selSpec () {
      this.showSelect = true
    },
    hideSel () {
      this.showSelect = false
    },
    getFirstPriceStock () {
      const vm = this
      vm.detail.goodsDetail.map(item => {
        vm.stock += item.stock
      })
      //   vm.stock = vm.detail.goodsDetail[0].stock
      vm.price = vm.detail.goodsDetail[0].price
    },
    // 选择规格
    selItem (index) {
      const vm = this
      let sel = vm.$refs.sel
      if (vm.detail.goodsDetail[index].stock === 0) {
        Toast('库存不足')
      } else {
        vm.active = index
        vm.price = vm.detail.goodsDetail[index].price
        vm.stock = vm.detail.goodsDetail[index].stock
        vm.maxNumber = vm.detail.goodsDetail[index].stock
        vm.property = vm.detail.goodsDetail[index].property
        vm.cost = vm.detail.goodsDetail[index].cost
        vm.selName = sel[index].innerHTML
      }
    //   for (let i in sel) {
    //     if (index === i) {
    //       sel[i].style.border = '1px solid #F85300'
    //       sel[i].style.color = '#F85300'
    //     } else {
    //       sel[i].style.border = '1px solid #f5f5f5'
    //       sel[i].style.color = '#2d2d2d'
    //     }
    //   }
    //   sel[index].style.border = '1px solid #F85300'
    //   sel[index].style.color = '#F85300'
    //   vm.selName = sel[index].innerHTML
    },
    // 选择数量
    selCount () {
      const vm = this
      if (vm.number === vm.maxNumber) {
        Toast('已达到最大库存')
      }
    },
    confirmSel () {
      const vm = this
      if (vm.selName === '' || vm.selName === null) {
        Toast('请选择规格')
      } else {
        vm.showSelect = false
        vm.spec = vm.selName + ' ' + 'x' + vm.number
        vm.totalPrice = vm.price * vm.number
      }
    },
    // 添加到购物车
    addToCart () {
      const vm = this
      if (vm.spec === '选择规格') {
        Toast('请选择规格')
      } else {
        const params = new URLSearchParams()
        params.append('goodsAmount', vm.number)
        params.append('goodsId', vm.detail.goodsId)
        params.append('property', vm.property)
        params.append('price', vm.price)
        vm.$http.post(api.addShopCar, params)
          .then(res => {
            Toast('已加入购物车')
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    ...mapMutations({
      setOrder: 'GET_ORDER'
    }),
    // 直接购买
    toPay () {
      const vm = this
      let list = []
      let prices = []
      let costs = []
      let amounts = []
      if (vm.spec === '选择规格') {
        Toast('请选择规格')
      } else {
        const goodsId = vm.detail.goodsId
        const goodsName = vm.detail.goodsName
        const price = vm.price
        const property = vm.selName
        const cost = vm.cost
        const goodsAmount = vm.number
        const imgUrl = vm.detail.shopImgs[0].imgUrl
        const item = { goodsId, goodsName, price, cost, property, goodsAmount, imgUrl }
        list.push(item)
        prices.push(price)
        costs.push(cost)
        amounts.push(goodsAmount)
        const status = 0
        const shopCars = -1
        const totalprice = vm.totalPrice
        const orderDetail = { list, totalprice, status, goodsId, shopCars, prices, costs, amounts }
        vm.$router.replace({ path: '/confirmOrder' })
        vm.setOrder(orderDetail)
      }
    },
    // 返回上一页
    back () {
      const vm = this
      let path = ''
      if (frompath === '/lvxiaoluo/confirmOrder') {
        path = '/shophome'
      } else {
        path = frompath
      }
      vm.$router.replace({ path: path })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/common.styl'
.slide-enter-active, .slide-leave-active
    transition all .4s
    // opacity 1
.slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
.select-enter-active, .select-leave-active
    transition all .4s ease
    // opacity 1
.select-enter, .select-leave-to
    transform translate3d(0, 100%, 0)
.detail-box
    position fixed
    height 100vh
    left 0
    right 0
    top 0
    bottom 0
    z-index 2
    background #f5f5f5
    .content
        position relative
        height 90vh
        overflow-y auto
        .head-first
            position absolute
            z-index 3
            // display flex
            width 94%
            left 3%
            right 3%
            top 1%
            height .7rem
            div
                background #000000
                border-radius 50%
                height .68rem
                line-height .68rem
                width .68rem
                font-size 18px
                opacity  .5
                color #ffffff
                text-align center
            div:nth-child(1)
                float left
            div:nth-child(2)
                float right
                // margin-left 68%
            div:nth-child(3)
                float right
                margin-right .2rem
        .head-second
            position fixed
            height 1rem
            background #ffffff
            width 100%
            line-height 1rem
            color #2d2d2d
            font-size 22px
            z-index 5
            border-bottom 1px solid #f5f5f5
            span:nth-child(1)
                font-size 24px
                margin-left .25rem
            span:nth-child(2)
                float right
                margin-right .3rem
            span:nth-child(3)
                float right
                margin-right .2rem
        .swiper
            width 100%
            height 4.8rem
            img
                width 100%
                height 100%
            .custom-indicator
                position absolute
                background #000000
                opacity .5
                color #fff
                width 50px
                height .5rem
                border-radius 30px
                line-height .5rem
                text-align center
                bottom 4%
                right 4%
        .price-title
            background #fff
            padding .2rem
            p:nth-child(1)
                font-size 13px
                color #F85300
                span
                    font-size 20px
            p:nth-child(2)
                margin-top .2rem
                line-height 20px
                font-size 17px
                font-weight bold
            div
                margin-top .4rem
                color #aaa
                span:nth-child(2)
                    float right
        .seleect
            margin-top .12rem
            padding .2rem
            height 1rem
            background #ffffff
            font-size 15px
            div
                margin-bottom .3rem
                span:nth-child(1)
                    color #aaa
                span:nth-child(2)
                    margin-left .4rem
                    color #393E46
                i
                    float right
                    color #aaa
        .detail
            margin-top .2rem
            .title
                text-align center
                margin-bottom .2rem
                color #a39e9e
                font-size 17px
                span
                    display inline-block
                    background-color #f5f5f5
                    position relative
                    padding-left .2rem
                    padding-right .2rem
            .title:before
                content ''
                position relative
                left 25%
                display block
                height 1px
                top 8px
                width 50%
                background #dddddd
            .detail-content
                padding .2rem
                line-height 23px
                font-size 15px
                background #ffffff
                color #626262

    .footer
        position absolute
        bottom 0
        background #FCFCFC
        width 100%
        height 10vh
        line-height 10vh
        border-top 1px solid #eeeeee
        span
            margin-left .2rem
            font-size 17px
            span
                color #F85300
        .button1
            float right
            height 6.5vh
            margin-top 1.5vh
            color #fff
            margin-right .2rem
            font-weight bold
            font-size 16px
            padding-right .3rem
            background $themeColor
            padding-left .2rem
            border-top-right-radius 30px
            border-bottom-right-radius 30px
        .button2
            float right
            height 6.5vh
            margin-top 1.5vh
            color #fff
            font-size 16px
            padding-left .2rem
            padding-right .2rem
            font-weight bold
            background #FFDC00
            border-top-left-radius 30px
            border-bottom-left-radius 30px
    .select-spec
        position fixed
        height 100vh
        left 0
        right 0
        top 0
        bottom 0
        z-index 5
        background #000000
        display inline-block
        opacity .5
    .spec-content
        position absolute
        width 100%
        bottom 0
        height 70vh
        border-top-left-radius 12px
        border-top-right-radius 12px
        z-index 6
        background #ffffff
        .cancel
            position absolute
            right 3%
            font-size 20px
            top 2.5%
        button
            position absolute
            bottom 4%
            width 92%
            left 4%
            right 4%
            height .8rem
            color #ffffff
            font-size 16px
            border-radius 20px
            background $cartColor
        img
            position absolute
            top 2.5%
            left 4%
            width 100px
            border-radius 10px
            height 100px
        .selPrice
            width 50%
            position relative
            left 38%
            top 6%
            p:nth-child(1)
                color #F85300
                font-size 13px
                span
                    margin-left .1rem
                    font-size 20px
            p:nth-child(2)
                margin-top .35rem
                color #aaaaaa
        .selcontent
            position relative
            top 13%
            height 39vh
            overflow-y auto
            padding 3%
            border-bottom 1px solid #eeeeee
            width 100%
            .guigeT
                font-size 15px
                margin-top .1rem
            .selItem
                width 100%
                position relative
                margin-top .2rem
                border-bottom 1px solid #f5f5ff
                display inline-block
                div
                    padding .15rem
                    font-size 15px
                    margin-right .2rem
                    margin-bottom .2rem
                    border 1px solid #f5f5f5
                    border-radius 5px
                    background #f5f5f5
                    float left
                div.active
                    border 1px solid #F85300
                    color #F85300
            .selNum
                font-size 15px
                height 1rem
                line-height 1rem
                border-bottom 1px solid #f5f5ff
                .number
                    float right
                    margin-right .45rem
</style>
