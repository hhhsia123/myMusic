import { createStore } from 'vuex'
import user from './modules/user'
import showOrHide from './modules/showOrHide'
// 可持久化
import createPersistedstate from 'vuex-persistedstate'
export default createStore({
  modules: {
    user,
    showOrHide
  },
  // vuex可持久化
  plugins: [
    createPersistedstate({
      // 键名
      key: 'Wyy_mousic',
      // 路径
      paths: ['user', 'showOrHide']
    })
  ]
})
