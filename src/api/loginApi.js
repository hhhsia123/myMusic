// /
import request from '../utils/request'

// 获取登录接口
export const longinApi = (loginObj) => {
    return request(`login/cellphone?phone=${loginObj.uname}&password=${loginObj.password}&withCredentials=true&timestamp=` + Date.now(), 'get')
}