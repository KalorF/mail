<template>
   <div class="head-box">
       <i class="iconfont headImg">&#xe65a;</i>
       <div class="input-div" @click="$router.push({path: '/search'})">
            <input type="text" class="head-input" readonly placeholder="搜索商品">
       <i class="iconfont search">&#xe60a;</i>
       </div>
   </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/common.styl'
.head-box
    background $bgcolor
    width 100%
    height 8vh
    position relative
    text-align center
    .headImg
        position absolute
        left .3rem
        height 8vh
        line-height 8vh
        color #fff
        font-size 26px
    .input-div
        height 8vh
        line-height 8vh
        .head-input
            margin-left .4rem
            height .65rem
            line-height .65rem
            border-radius 20px
            padding-left 14px
            width 70%
    .search
        position absolute
        height 8vh
        line-height 8vh
        font-size 21px
        color #aaaaaa
        right 14%
</style>
