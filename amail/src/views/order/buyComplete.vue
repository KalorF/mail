<template>
  <Transition>
  <div class="buyComplete-box">
    <div class="thisHead">
        <i @click="$router.replace({path: '/orderHome'})" class="iconfont">&#xe637;</i>
        <span>下单成功</span>
    </div>
    <div class="content">
      <div class="successimg">
          付款成功
      </div>
      <div class="customer-box">
        <div class="img">
          <i class="iconfont">&#xe605;</i>
        </div>
        <div class="customer">
          <p>收货人：{{userInfo.userName}}<span>{{userInfo.phone}}</span></p>
          <p>收货地址：{{userInfo.address}}</p>
        </div>
      </div>
      <!-- <div class="shop">
        <div class="shopname">
          {{company}}
          <img src="@/images/back1.png" class="shopimage">
        </div>
      </div>
      <div class="leveling">
        <div style="display: flex;justify-content: flex-start;">
          <div class="levelingimg">
            <img :src="shopsrc">
          </div>
          <div class="levelingmessage">
            <div class="describe" style="color:#051B28;font-weight:bold">{{leveling}}</div>
            <div class="number" style="color:#FF0036">￥{{levelingprice}}</div>
            <div class="describe" style="color:#C9C9C9;font-size:12px">{{describe}}</div>
            <div class="number" style="color:#051B28;font-weight:bold">x{{number}}</div>
          </div>
        </div>
        <a class="refund" @click="refund">退款</a>
      </div>-->
      <div class="lovehr">
        <div class="hr1"></div>
        <div class="img1">
          <i class="iconfont">&#xe604;</i>
          <div>猜你喜欢</div>
        </div>
        <div class="hr1"></div>
      </div>

      <div class="productbar">
        <div
          class="product"
          v-for="(item, index) in product"
          :key="index"
          @click="productdetails(item)"
        >
          <img :src="item.shopImgs[0].imgUrl">
          <div class="productmessage">{{item.goodsName}}</div>
          <div class="productprice">￥{{item.goodsDetail[0].price}}</div>
        </div>
      </div>
    </div>
  </div>
  </Transition>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import api from '@/serverAPI.js'
import Transition from '@/components/transition.vue'
export default {
  components: {
    Transition
  },
  data () {
    return {
      consignee: '',
      address: '',
      phone: '',
      company: '',
      leveling: '',
      levelingprice: '',
      describe: '',
      number: '',
      product: [],
      shopsrc: ''
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations({
      setList: 'GET_DETAIL'
    }),
    productdetails (item) {
      const vm = this
      vm.$router.replace({ path: '/goodsDetail' })
      vm.setList(item)
    },
    getData () {
      const vm = this
      const parmas = new URLSearchParams()
      parmas.append('publicityStatus', 1) // 尚未填写publicityStatus
      // shopGoods(parmas)
      vm.$http.post(api.selectPublicityGoods, parmas)
        .then(res => {
          console.log(res)
          vm.product = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/common.styl'

.buyComplete-box {
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background #f5f5f5
  z-index 7
}
* {
  font-family: 'KaiTi';
}
.thisHead {
  position relative
  width 100%
  height 8vh
  line-height 8vh
  background #ffffff
  border-bottom 1px solid #eeeeee
  i {
    font-size 22px
    margin-left .3rem
    }
  span {
    font-size 20px
    margin-left .2rem
    }
}
.content {
  position absolute
  overflow-y auto
  width 100%
  height 92vh
}
.successimg {
  height 2rem
  padding-left .4rem
  line-height 2rem
  font-size 22px
  color #ffffff
  background $cartColor
}
.customer-box {
  margin-top .12rem
  display flex
  background #ffffff
  justify-content center
  align-items center
  padding .15rem
  .img {
    width 14%
    text-align center
    i {
      font-size 25px
    }
  }
  .customer {
    width 83%
    display block
    font-size 16px
    p:nth-child(1) {
      margin-bottom .2rem
      span {
        float right
        // margin-right .2rem
        }
    }
    p:nth-child(2) {
      line-height 20px
    }
  }
}

.shop {
  width: 100%;
  height: 31px;

  .shopname {
    font-size: 13px;
    line-height: 12px;
    padding: 9px 3%;
    font-weight: bold;
    display: flex;
    justify-content: flex-start;
  }
}

.shopimage {
  width: 10px;
  height: 10px;
  margin-left: 3%;
}

.leveling {
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #eeeeee;
  box-shadow: 0px 2px 1px #eeeeee;

  .levelingimg {
    width: 70px;
    height: 70px;
    margin: 1% 5%;
    border: 1px solid #eeeeee;
    box-shadow: 0px 0px 4px #eeeeee;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .levelingmessage {
    width: 70%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    div {
      display: inline-block;
      margin: 1% 0%;
    }

    .describe {
      width: 70%;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 4% 0%;
    }

    .number {
      width: 30%;
      padding-right: 4%;
      font-size: 14px;
      text-align: right;
      margin: 4% 0%;
    }
  }

  .refund {
    display: block;
    margin-top: 4%;
    margin-bottom: 2%;
    margin-left: 74%;
    width: 75px;
    height: 24px;
    padding: 5px 0%;
    border: 1px solid black;
    text-align: center;
    border-radius: 4px;
    font-weight: bold;
    font-size: 14px;
    line-height: 14px;
  }
}

.lovehr {
  display: flex;
  justify-content: flex-start;
  background #ffffff
  margin-top .12rem
  .hr1 {
    width: 30%;
    margin: 4% 2%;
    border-bottom: 1px solid #8B8B83;
  }

  .img1 {
    width: 32%;
    display: flex;
    font-size 16px
    justify-content: flex-start;
    align-items: center;
    i {
      color #EB6368
      margin-left .2rem
    }

    div {
      width: 100%;
      text-align: center;
    }
  }
}

.productbar {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  background #ffffff
  .product {
    width: 45%;
    margin: 2% 2% 5% 2%;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    overflow hidden
    box-shadow: 2px 4px 6px #eee;

    img {
      width: 100%;
      height: 3.4rem
    }

    .productmessage {
      width: 96%;
      margin: 4% 2%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 15px;
      font-weight: bold;
      // border-top: 1px solid #BABABA;
      padding-top: 4%;
    }

    .productprice {
      margin: 4% 2%;
      margin-top: 8%;
      color: #F85300;
      font-size 16px
    }
  }
}
</style>
