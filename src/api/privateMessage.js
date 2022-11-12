import request from '../utils/request'

// 获取私信
export const privateLetter = (offset = 0) => {
    return request(`msg/private?limit=8&offset=${offset}&timestamp=${Date.now()}`, 'get')
}
// 获取评论内容
export const commentMessage = (uid, before = '') => {
    return request(`msg/comments?uid=${uid}&limit=30&before=${before}`, 'get')
}
// 获取@我
export const repliedMe = (offset = 0) => {
    return request('msg/forwards?limit=20&offset=' + offset, 'get')
}
// 通知
export const notice = (lastTime = '') => {
    return request(`msg/notices?limit=10&lasttime=${lastTime}`, 'get')
}
// 私信内容
export const privateContentApi = (uid, before = '') => {
    return request(`msg/private/history?uid=${uid}&limit=10&before=${before}`, 'get')
}
// 发送私信
export const sendPrivate = (singerId, msg) => {
    return request(`send/text?user_ids=${singerId}&msg=${msg}&timestamp=${Date.now()}`, 'get')
}