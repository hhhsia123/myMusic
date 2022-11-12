import request from '../utils/request'

// 获取评论
export const sendCommentApi = (t, type, id, contne, commentId = '') => {
    return request(`http://localhost:3000/comment?t=${t}&type=${type}&id=${id}&content=${contne}&commentId=${commentId}&timestamp=${Date.now()}`, 'get', { withCredentials: true })
}
// 获取点赞
export const thumbsUp = (t, type, id, cid) => {
    return request(`omment/like?t=${t}&type=${type}&id=${id}&cid=${cid}&timestamp=${Date.now()}`, 'get')
}
// 动态id /comment?t=1&type=6&threadId=A_EV_2_6559519868_32953014&content=test
export const threadIdSendComment = (t, type, id, contne, commentId = '') => {
    return request(`comment?t=${t}&type=${type}&threadId=${id}&content=${contne}&commentId=${commentId}&timestamp=${Date.now()}`, 'get')
}
// 获取点赞
export const threadIdthumbsUp = (t, type, id, cid = '') => {
    return request(`like?t=${t}&type=${type}&threadId=${id}&cid=${cid}&timestamp=${Date.now()}`, 'get')
}
// 发送动态 /share/resource?type=djprogram&id=2061034798&msg=测试
export const shareResource = (id, msg) => {
    return request(`share/resource?type=song&id=${id}&msg=${msg}&timestamp=${Date.now()}`, 'get')
}