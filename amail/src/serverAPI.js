const baseURL = 'http://www.lvxiaoluo.com/lvxiaoluo'
const api = {
  getType: baseURL + '/ShopTypeController/showAll', // 获取商品类型接口
  allGoods: baseURL + '/ShopGoodsController/selectAllGoods/', // 获取全部商品接口
  selectTypeGoods: baseURL + '/ShopGoodsController/searchGoodsInfoByType/', // 根据类型展示商品
  searchGoods: baseURL + '/ShopGoodsController/searchGoods', // 获取搜索结果接口
  addShopCar: baseURL + '/ShopCarController/shopCarUpdateGoods', // 添加进购物车接口
  showGoodsInShopCar: baseURL + '/ShopCarController/showGoodsInShopCar', // 获取购物车信息接口
  shopCarDelGoods: baseURL + '/ShopCarController/shopCarDelGoods', // 删除购物车商品接口
  customerShopOrder: baseURL + '/ShopOrderController/customerShopOrder', // 获取订单信息
  refundRequest: baseURL + '/ShopRefundRecordController/refundRequest', // 退款或者退货申请接口
  RefundLogistics: baseURL + '/LogisticsController/RefundLogistics', // 发送物流信息
  updateOrderIsDel: baseURL + '/ShopOrderController/updateOrderIsDel', // 删除订单接口
  confirmReceipt: baseURL + '/ShopOrderController/confirmReceipt', // 确认收货接口
  getKdMessage: baseURL + '/getKdMessage', // 获取物流信息接口
  selectPublicityGoods: baseURL + '/ShopGoodsController/selectPublicityGoods', // 推荐商品接口
  placeOrder: baseURL + '/ShopOrderController/placeOrder', // 生成订单接口
  weixinPayForShopGoods: baseURL + '/WXPay/weixinPayForShopGoods', // 微信支付接口
  weixinResultShopOrder: baseURL + '/WXPay/weixinResultShopOrder' // 支付结果接口
}

export default api
