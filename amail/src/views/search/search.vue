<template>
    <transition name="slide">
        <div class="search-box">
            <div class="head">
                <i class="iconfont back" @click="$router.replace({path: '/shophome'})">&#xe600;</i>
                <div class="thisInput">
                    <input type="search" v-focus='true' v-model="searchValue" @keyup="searchGoods" placeholder="请输入要搜索的商品">
                    <button v-if="searchValue" @click="$router.replace({path: '/shophome'})">取消</button>
                </div>
            </div>
            <div class="search-history">
                <div class="title">搜索历史 <span v-if="list.length" @click="empty">清空</span></div>
                <div class="content">
                    <div v-for="(item,index) in list" :key="index" @click="selThis">{{item}}</div>
                </div>
            </div>
            <div class="search-result" v-if="showSearch">
                <div class="nosearch" v-if="!searchList.length">无搜索结果</div>
                <div v-for="(item,index) in searchList" :key="index" @click="selgoods(item)">{{item.goodsName}}</div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      searchValue: '',
      list: [],
      searchList: []
    }
  },
  directives: {
    focus: {
      inserted: function (el, { value }) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  computed: {
    showSearch () {
      const vm = this
      if (vm.searchValue === '' || vm.searchValue === null) {
        return false
      } else {
        return true
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy()
    next()
  },
  mounted () {
    this.getHistory()
  },
  methods: {
    ...mapMutations({
      setList: 'GET_DETAIL'
    }),
    searchGoods () {
      const vm = this
      vm.getResult()
    },
    // 获取搜索结果
    getResult () {
      const vm = this
      const params = new URLSearchParams()
      params.append('goodsName', vm.searchValue)
      vm.$http.post('/ShopGoodsController/searchGoods', params)
        .then(res => {
          vm.searchList = res.data.data.shopGoodses
          console.log(vm.searchList)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择搜索结果并且存入localStorage
    selgoods (item) {
      const vm = this
      const value = item.goodsName
      let list = localStorage.getItem('history')
      if (list === null || list === '') {
        vm.list = []
      } else {
        vm.list = JSON.parse(list)
      }
      console.log(vm.list)
      if (vm.list.indexOf(value) >= 0) {
        vm.$router.replace({ path: '/goodsDetail' })
        vm.setList(item)
      } else {
        vm.list.push(value)
        localStorage.setItem('history', JSON.stringify(vm.list))
        vm.$router.replace({ path: '/goodsDetail' })
        vm.setList(item)
      }
    },
    // 获取localStorage
    getHistory () {
      const vm = this
      let list = localStorage.getItem('history')
      if (list === null || list === '') {
        vm.list = []
      } else {
        vm.list = JSON.parse(list)
      }
    },
    // 清空localStorage
    empty () {
      const vm = this
      localStorage.setItem('history', '')
      vm.list = []
    },
    selThis (e) {
      const vm = this
      vm.searchValue = e.target.innerHTML
      vm.getResult()
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
    // opacity 0
.search-box
    position fixed
    height 100vh
    left 0
    right 0
    top 0
    bottom 0
    z-index 2
    background #ffffff
    .head
        height 1rem
        background $bgcolor
        text-align center
        .back
            position absolute
            height 1rem
            line-height 1rem
            left 5%
            color #ffffff
            font-size 23px
        .thisInput
            height 1rem
            line-height 1rem
            input
                width 65%
                height .6rem
                margin-left .4rem
                padding-left .3rem
                border-radius 20px
                color #393E46
            input::-webkit-search-cancel-button
                -webkit-appearance: none
            button
                position relative
                background transparent
                color #ffffff
                font-size 18px
                left 4%
    .search-history
        position relative
        top .4rem
        width 90%
        left 5%
        right 5%
        .title
            color $themeColor
            font-size 17px
            span
                float right
                font-size 14px
                color #a39e9e
        .content
            margin-top .25rem
            div
                padding .2rem
                margin-right .15rem
                margin-bottom .2rem
                float left
                height .2rem
                line-height .2rem
                text-align center
                background-color #f5f5f5
                color #6d6d6d
                border-radius 15px
                border 1px solid #f5f5f5
    .search-result
        position absolute
        top 1rem
        height 91vh
        background #ffffff
        width 90%
        left 5%
        right 5%
        padding-top .5rem
        overflow-y auto
        .nosearch
            text-align center
        div
            margin-bottom .3rem
            padding-left .2rem
            color #393E46
            font-size 16px
            padding-bottom .1rem
            border-bottom 1px solid #eeeeee
        div:last-child
            border none
</style>
