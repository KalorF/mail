import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
import FastClick from 'fastclick'
import './assets/iconfonts/iconfont.css'
import './assets/styles/border.css'
import './assets/styles/reset.css'
axios.defaults.baseURL = 'http://www.lvxiaoluo.com/lvxiaoluo'
Vue.prototype.$http = axios
FastClick.attach(document.body)
Vue.config.productionTip = false
// Vue.prototype.router = router
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
