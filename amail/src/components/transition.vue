<template>
    <transition name="slide">
        <slot></slot>
    </transition>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
    transition all .4s
    // opacity 1
.slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
