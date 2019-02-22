<template>
    <div class="home">
        <div>
          <homehead></homehead>
        </div>
        <div class="topTab">
          <van-tabs v-model="active" @change="selTab" color='#31C27C' :line-width='30' swipeable class="thistab" animated>
            <van-tab :title="'全部'"><allgoodsList></allgoodsList></van-tab>
            <van-tab v-for="(item,index) in arrTypes" :title="item.typeName" :key="index"><goodsList :typeName="item.typeName"></goodsList></van-tab>
          </van-tabs>
          <i class="iconfont more" @click="selectMore">&#xe633;</i>
        </div>
        <!-- <div class="nav" ref="navwidth">
          <nav ref="nav">
              <div v-for="(item, index) in arr" @click="toggle(index)" :class="{active:index==active}" :key="index" >{{item}}
                  <p :class="{active:index==active}"></p>
              </div>
          </nav>
        </div> -->
        <!-- <i class="iconfont more" @click="selectMore">&#xe633;</i> -->
        <!-- <goodsList></goodsList> -->
        <transition name="more">
          <div class="select-more" v-show="moreSelect">
              <div class="more-title">
                选择类型
                <span @click="cancelSel">取消</span>
              </div>
              <div class="more-content">
                <div  @click="selectAll" :class="{active: thisIndex == 0}">全部</div>
                <div v-for="(item,index) in arrTypes" :class="{active: thisIndex == index + 1 }" :key="index" @click="select(index+1)">{{item.typeName}}</div>
              </div>
          </div>
        </transition>
        <!-- <router-view></router-view> -->
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { Tab, Tabs } from 'vant'
import api from '@/serverAPI.js'
import homehead from './head'
import goodsList from './goodsList'
import allgoodsList from './allgoodsList'
Vue.use(Tab).use(Tabs)
export default {
  data () {
    return {
      active: 0,
      isMore: false,
      arrTypes: [],
      thisIndex: 0
    }
  },
  components: {
    homehead,
    goodsList,
    allgoodsList
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy()
    next()
  },
  mounted () {
    this.getTypes()
  },
  computed: {
    ...mapGetters(['moreSelect'])
  },
  methods: {
    // search () {
    //   this.$router.push({ path: '/search' })
    // },
    ...mapMutations({
      moreSlect: 'MORE_SELECT'
    }),
    // 获取商品类型
    getTypes () {
      const vm = this
      vm.$http.post(api.getType)
        .then(res => {
          const data = res.data.data
          vm.arrTypes = data.list
          // data.list.map(item => {
          //   vm.typeList.push(item.typeName)
          // })
        })
        .catch(err => {
          console.log(err)
        })
    },
    selTab (e) {
      const vm = this
      vm.thisIndex = e
    },
    // 选择商品类型
    selectMore () {
      const vm = this
      vm.isMore = !vm.isMore
      vm.moreSlect(vm.isMore)
    },
    selectAll () {
      const vm = this
      vm.active = 0
      vm.thisIndex = 0
      vm.isMore = false
      vm.moreSlect(vm.isMore)
    },
    select (index) {
      const vm = this
      vm.active = index
      vm.thisIndex = index
      vm.isMore = false
      vm.moreSlect(vm.isMore)
    },
    cancelSel () {
      const vm = this
      vm.isMore = false
      vm.moreSlect(vm.isMore)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/common.styl'

.van-tab {
    text-align: left;
    padding-left: .1rem
}
.home
  height 100vh
  // background green
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #F4F4F4
  .topTab
    position relative
    height 6vh
    .thistab
      width 100%
      background-color #fff
      z-index 9
    .more
      position absolute
      right 0%
      top 0
      z-index 12
      background #fff
      height .85rem
      width .5rem
      line-height .85rem
      text-align center
      font-size 18px
      color #aaa
      border-bottom 1px solid rgba(239,239,239,.5)
      border-left 2px solid rgba(239,239,239,.2)
  .select-more
    position absolute
    background #ffffff
    top 14.8%
    width 100%
    z-index 13
    padding-bottom .4rem
    border-top 1px solid #eeeeee
    box-shadow #cccccc 1px 3px 8px
    .more-title
      margin-left 4%
      margin-top .25rem
      vertical-align middle
      padding-left .06rem
      border-left 3px solid $themeColor
      // color #a39e9e
      color #6d6d6d
      font-size 15px
      span
        float right
        margin-right 4%
    .more-content
      position relative
      top .25rem
      width 92%
      left 4%
      right 4%
      display inline-block
      div
        float left
        padding .15rem
        margin-right .2rem
        border-radius 5px
        color #3d3d3d
        border 1px solid #aaa
        margin-bottom .2rem
      div.active
        border 1px solid $themeColor
        color $themeColor
.more-enter-active,.more-leave-active
  transition all .3s
.more-enter,.more-leave-to
  opacity 0
  // .nav
  //   width 90%
  //   overflow hidden
  //   height .9rem
  //   nav
  //       padding 0 10px
  //       display -webkit-box
  //       display -ms-flexbox
  //       display flex
  //       background-color #ffffff
  //       -webkit-box-align middle
  //       // border-bottom 1px solid #eeeeee
  //       -ms-flex-align middle
  //       align-items middle
  //       overflow auto
  //       div
  //           text-align center
  //           font-size 16px
  //           -ms-flex-negative 0
  //           flex-shrink 0
  //           padding 10px
  //           border-right 1px solid #eeeeee
  //           margin 5px
  //           p
  //             transition: all .3s
  //           p.active
  //               width 30px
  //               margin-left auto
  //               margin-right auto
  //               margin-top .2rem
  //               height 1px
  //               transform: scale(1.1)
  //               background #31C27C
  //       div.active
  //           font-size: 16px
  //           transition: all .3s ease
  //           transform: scaleZ(1)
  //           color #31C27C
//   .more
//       position absolute
//       right 0
//       top 8%
//       z-index 12
//       background #fff
//       height .88rem
//       width 10%
//       line-height .88rem
//       text-align center
//       font-size 18px
//       color #aaa
//       border-bottom 1px solid rgba(239,239,239,.5)
//       border-left 2px solid rgba(239,239,239,.2)
//   .select-more
//     position absolute
//     background #ffffff
//     top 14.5%
//     width 100%
//     z-index 15
//     padding-bottom .4rem
//     border-top 1px solid #eeeeee
//     .more-title
//       margin-left 4%
//       margin-top .2rem
//       color #aaaaaa
//       font-size 15px
//     .more-content
//       position relative
//       top .2rem
//       width 92%
//       left 4%
//       right 4%
//       display inline-block
//       div
//         float left
//         padding .15rem
//         margin-right .2rem
//         border 1px solid #aaa
//         margin-bottom .2rem
// .more-enter-active,.more-leave-active
//   transition all .3s
// .more-enter,.more-leave-to
//   opacity 0
</style>
