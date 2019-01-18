<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
    <home-footer></home-footer>
  </div>
</template>

<script>
import HomeFooter from './components/Footer.vue'
export default {
  components: {
    HomeFooter
  },
  methods: {

  }
}
</script>

<style lang="stylus">
#app
  -webkit-overflow-scrolling: touch
</style>
