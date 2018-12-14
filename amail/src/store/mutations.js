import * as types from './mutation-types'

const mutations = {
  [types.GET_DETAIL] (state, detail) {
    state.detail = detail
  },
  [types.GET_ORDER] (state, orderList) {
    state.orderList = orderList
  }
}

export default mutations
