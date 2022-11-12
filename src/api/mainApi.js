import request from '../utils/request'

// 轮播图api
export const Carousel = () => {
    return request('/banner?type=0', 'get')
}
// 获取推荐歌单
export const personalized = (num) => {
    return request('personalized?limit=' + num, 'get')
}