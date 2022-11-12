
import request from '../utils/request'

// 获取关注列表
export const followsApi = (uid, offset = 0) => {
    return request(`user/follows?uid=${uid}&offset=${offset}`, 'get', { withCredentials: true })
}
// 获取动态消息
export const eventList = (lasttime = -1) => {
    return request(`event?pagesize=50&lasttime=${lasttime}`, 'get')
}
// 获取动态话题
export const topicEvent = (actid) => {
    return request(`/topic/detail/event/hot?actid=${actid}&limit=50`, 'get')
}
// 获取动态评论
export const eventComment = (commentId) => {
    return request(`comment/event?threadId=${commentId}`, 'get')
}
// 获取关注列表
export const careListApi = (uid) => {
    return request(`user/follows?uid=${uid}`, 'get')
}
// 获取粉丝列表
export const followedsApi = (uid) => {
    return request(`user/followeds?uid=${uid}`, 'get')
}
// 关注 /follow?id=32953014&t=1
export const likeFollowApi = (id) => {
    return request(`follow?id=${id}&t=1`, 'get')
}
// 获取用户动态
export const userEvent = (uid) => {
    return request(`user/event?uid=${uid}`, 'get')
}
