<template>
    <div class="list-box" ref="listcontent">
        <div class="list-content">
            <ul>
                <li class="item" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
                    <div class="content">
                        <img :src="item.shopImgs[0].imgUrl">
                        <p class="title">{{item.goodsName}}</p>
                        <div class="item-footer">
                            <p>
                                <span class="price-icon">￥</span>
                                <span class="price">{{item.goodsDetail[0].price}}</span>
                                <span class="had-pay">{{item.goodsPayNum}}人已付款</span>
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
            <transition name="top">
                <i @click="top" v-show="toTop" class="iconfont toTop">&#xe643;</i>
            </transition>
            <div v-show="moreShow" class="receiveMore">加载中...</div>
            <!-- <div v-show="noShow" class="receiveMore">无</div> -->
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import api from '@/serverAPI.js'
export default {
  mounted () {
    this.$refs.listcontent.addEventListener('scroll', this.listScroll, true)
  },
  created () {
    this.getGoodsList()
  },
  props: ['typeName'],
  data () {
    return {
      moreShow: false,
      toTop: false,
      page: 1,
      list: [],
      totalPage: ''
    }
  },
  methods: {
    ...mapMutations({
      setList: 'GET_DETAIL'
    }),
    // 获取商品信息
    getGoodsList () {
      const vm = this
      let page = vm.page
      const name = vm.typeName
      const params = new URLSearchParams()
      params.append('goodsType', name)
      vm.$http.post(api.selectTypeGoods + page, params)
        .then(res => {
          const data = res.data.data
          data.list.map(value => {
            vm.list.push(value)
          })
          vm.totalPage = res.data.data.pages
        })
        .catch(err => {
          console.log(err)
        })
    },
    toDetail (item) {
      const vm = this
      vm.$router.replace({ path: '/goodsDetail' })
      vm.setList(item)
    },
    // 监听滚动事件
    listScroll () {
      const vm = this
      let scrollTop = this.$refs.listcontent.scrollTop
      let windowHeight = this.$refs.listcontent.clientHeight
      let scrollHeight = this.$refs.listcontent.scrollHeight
      if (scrollTop + windowHeight >= scrollHeight - 2) {
        if (vm.page < vm.totalPage) {
          vm.moreShow = true
          vm.page++
          vm.getGoodsList()
        } else {
          vm.moreShow = false
        }
      }
      if (scrollTop > 450) {
        vm.toTop = true
      } else {
        vm.toTop = false
      }
    },
    // 缓慢回到顶部
    top () {
      const vm = this
      let timer = setInterval(() => {
        let scrollTop = vm.$refs.listcontent.scrollTop
        let ispeed = Math.floor(-scrollTop / 6)
        if (vm.$refs.listcontent.scrollTop === 0) {
          clearInterval(timer)
        }
        vm.$refs.listcontent.scrollTop = scrollTop + ispeed
      }, 30)
    }
  }
}
</script>

<style lang="stylus" scoped>
.top-enter-active,.top-leave-active
    transition all .3s
.top-enter,.top-leave-to
    transform translate3d(100%,0,0)
.list-box
    height 76vh
    background #F4F4F4
    position relative
    overflow-y auto
    left 0
    right 0
    top 0
    bottom 0
    .receiveMore
        text-align center
        margin-top .2rem
        margin-bottom .2rem
    .toTop
        position fixed
        right 4%
        background #ffffff
        border 1px solid #eeeeee
        border-radius 50%
        top 82%
        font-size 40px
    .list-content
        width 96%
        position: absolute
        left 2%
        right 2%
        top 0%
        bottom 0
        ul
            margin-top .1rem
            display flex
            flex-wrap wrap
            margin-bottom .2rem
            .item
                width 50%
                // height 5.1rem
                padding .1rem
                box-sizing border-box
                .content
                    background-color #FCFCFC
                    width 100%
                    // height 4.8rem
                    border-radius 10px
                    overflow hidden
                    img
                        width 100%
                        height 3.4rem
                    .title
                        width 90%
                        margin-top .1rem
                        line-height .42rem
                        height .8rem
                        font-size 14px
                        margin-left auto
                        margin-right auto
                        text-overflow: ellipsis
                        overflow: hidden
                    .item-footer
                        margin-top .2rem
                        margin-bottom .2rem
                        p
                            padding-left .2rem
                            .price-icon
                                color #F85300
                                font-size 12px
                            .price
                                color #F85300
                                font-size 17px
                            .had-pay
                                margin-left .25rem
                                font-size 12px
                                color #aaaaaa
</style>
