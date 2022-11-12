
import request from '../utils/request'

// 轮播图api
export const Carousel = () => {
    return request('/banner?type=0', 'get')
}
// 获取推荐歌单
export const allMV = (songerObj) => {
    return request(`mv/all?area=${songerObj.area}&type=${songerObj.type}&order=${songerObj.order}&offset=${songerObj.offset}`, 'get')
}
// 获取mv详情
export const MVdetail = (mvid) => {
    return request(`mv/detail?mvid=${mvid}`, 'get')
}
// 获取mv视频地址
export const mvUrl = (mvid) => {
    return request(`mv/url?id=${mvid}`, 'get')
}
// 获取mv评论
export const mvComment = (mvid, offset, limit) => {
    return request(`comment/mv?id=${mvid}&offset=${offset}&limit=${limit}&timestamp=${Date.now()}`, 'get')
}