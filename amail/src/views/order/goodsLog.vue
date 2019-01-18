<template>
    <Transition>
        <div class="log-box">
            <div class="thisHead">
                <i @click="$router.replace({path: '/orderHome'})" class="iconfont">&#xe637;</i>
                <span>物流信息</span>
            </div>
            <div class="log-detail">
                <van-steps
                :active="active"
                icon="logistics"
                :title="expName"
                direction="vertical"
                :description="number"
                >
                    <van-step v-for="(item, index) in list" :key="index">
                        <h3>{{item.status}}</h3>
                        <p>{{item.time}}</p>
                    </van-step>
                </van-steps>
            </div>
        </div>
    </Transition>
</template>

<script>
import Vue from 'vue'
import { Step, Steps } from 'vant'
import Transition from '@/components/transition.vue'

Vue.use(Step).use(Steps)
export default {
  components: {
    Transition
  },
  data () {
    return {
      active: 0,
      expName: '',
      number: '',
      list: []
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy()
    next()
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取物流信息
    getData () {
      const vm = this
      const shipper = vm.$route.query.shipper
      const code = vm.$route.query.code
      const params = new URLSearchParams()
      params.append('type', shipper)
      params.append('no', code)
      vm.$http.post('/getKdMessage', params)
        .then(res => {
          const data = res.data.data.KdMessage.result
          vm.expName = data.expName
          vm.number = data.number
          vm.list = data.list
          vm.active = data.list.length - 1
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.log-box
    position fixed
    left 0
    right 0
    top 0
    z-index 6
    height 100vh
    bottom 0
    background #f5f5ff
    .thisHead
        position relative
        width 100%
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
    .log-detail
        position relative
        width 100%
        height 92vh
        overflow-y auto
        background #FCFCFC
</style>
