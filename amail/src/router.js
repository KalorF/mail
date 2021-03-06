import Vue from 'vue'
import Router from 'vue-router'
import home from './views/home/home.vue'
import shoppingCart from './views/shoppingCart/shoppingCart.vue'
import orderHome from './views/order/orderHome.vue'
import search from './views/search/search.vue'
import goodsDetail from './views/goods/goodsDetail.vue'
import confirmOrder from './views/order/confirmOrder.vue'
import goodsLog from './views/order/goodsLog.vue'
import buyComplete from './views/order/buyComplete.vue'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    { path: '/', redirect: '/shophome' },
    { path: '/shophome', name: 'home', component: home },
    { path: '/shoppingCart', name: 'shoppingCart', component: shoppingCart },
    { path: '/orderHome', name: 'orderHome', component: orderHome },
    { path: '/search', name: 'search', component: search },
    { path: '/goodsDetail', name: 'goodsDetail', component: goodsDetail },
    // { path: '/confirmOrder', redirect: '/lvxiaoluo/confirmOrder' },
    { path: '/confirmOrder', name: 'confirmOrder', component: confirmOrder },
    { path: '/goodsLog', name: 'goodsLog', component: goodsLog },
    { path: '/buyComplete', name: 'buyComplete', component: buyComplete }
  ]
})

export default router
// component: () => import(/* webpackChunkName: "about" */ './views/About.vue') // 按需加载
