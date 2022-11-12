import request from '../utils/request'

// 获取歌单详情接口
export const videoNavApi = () => {
    return request('video/category/list', 'get')
}
// 视频组列表
export const videoGroupList = () => {
    return request('video/group/list', 'get')
}
// 获取视频资源
export const videoResource = (id, offset = 0) => {
    return request(`video/group?id=${id}&offset=${offset}`, 'get')
}
// 获取视频
export const videoDetailApi = (vid) => {
    return request('/video/detail?id=' + vid, 'get')
}
// 获取视频地址
export const videoUrl = (vid) => {
    return request(`/video/url?id=${vid}`, 'get')
}
// 收藏视频
export const starVideo = (t, vid) => {
    return request(`video/sub?t=${t}&id=${vid}`, 'get')
}
// 视频点赞 t1点赞 t0取消点赞
export const likeVideo = (t, vid) => {
    return request(`resource/like?t=${t}&type=5&id=${vid}`, 'get')
}
// 获取相关视频
export const relatedVideo = (vid) => {
    return request(`/related/allvideo?id=${vid}`, 'get')
}
// 获取视频评论
export const commentVideo = (vid, offset, limit) => {
    return request(`/comment/video?id=${vid}&offset=${offset}&limit=${limit}&timestamp=${Date.now()}`, 'get')
}