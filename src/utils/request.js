// 创建一个axios实例
import axios from 'axios'
import store from '@/store'
export const baseURL = 'https://www.tangcx.tk/'
const instance = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true
})
// 请求拦截器,对头部设置token
instance.interceptors.request.use(config => {
    const profile = store.state.user.profile
    if (profile.cookie) {
        // console.log(profile.cookie)
        config.headers.Cookie = profile.cookie
    }
    return config
    // 捕获错误
}, function (err) {
    return Promise.reject(err)
})
// 响应拦截器:1. 剥离无效数据  2. 处理token失效
// instance.interceptors.response.use(res => res, err => {
// 401状态码进入错误函数否则取出res数据
// if (err.response && err.response.status === 401) {
//     // 清除无效用户信息
//     store.commit('user/setUser', {})
//     // 当前路由地址: const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
//     // 组件里头：`/user?a=10` $route.path === /user  $route.fullPath === /user?a=10
//     // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据
//     const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
//     // encodeURIComponent 转换uri编码，防止解析地址出问题
//     router.push('/login?redirectUrl=' + fullPath)
// }
//     return Promise.reject(err)
// })
export default (url, method, subdata) => {
    // axios发送请求
    return instance({
        url,
        method,
        [method.toLowerCase() === 'get' ? 'params' : 'data']: subdata
    })
}
