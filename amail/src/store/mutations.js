import * as types from './mutation-types'

const mutations = {
  [types.GET_DETAIL] (state, detail) {
    state.detail = detail
  },
  [types.GET_ORDER] (state, orderList) {
    state.orderList = orderList
  },
  [types.MORE_SELECT] (state, moreSelect) {
    state.moreSelect = moreSelect
  },
  [types.SET_USERINFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.ACTIVE_TAB] (state, activeTab) {
    state.activeTab = activeTab
  }
}

export default mutations
