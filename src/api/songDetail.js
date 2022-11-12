
import request from '../utils/request'

// 获取歌单详情接口
export const songDetail = (id) => {
    return request('/playlist/detail?id=' + id, 'get')
}
// 获取歌曲列表
export const song = (songListObj) => {
    return request(`/playlist/track/all?id=${songListObj.id}&limit=${songListObj.limit}&offset=` + songListObj.offset, 'get')
}
// 歌曲评论 /comment/music?id=186016&limit=1
export const musiccomment = (id, offset, limit, timestamp) => {
    return request(`/comment/music/?id=${id}&offset=${offset}&limit=${limit}&timestamp=${Date.now()}`, 'get')
}
//  获取评论

export const commentList = (id, offset, limit) => {
    return request(`/comment/playlist?id=${id}&offset=${offset}&limit=${limit}&timestamp=${Date.now()}`, 'get')
}
// 获取收藏者

export const collection = (id, limit, offset) => {
    return request(`/playlist/subscribers?id=${id}&limit=${limit}&offset=` + offset, 'get')
}
// 获取用户详情
export const userDetail = (uid) => {
    return request(`/user/detail?uid=${uid}`, 'get')
}
// 获取用户列表
export const userList = (uid) => {
    return request(`/user/playlist?uid=${uid}`, 'get')
}
// 获取歌曲url(声音)
export const songUrl = (urlId, level = 'lossless') => {
    return request(`/song/url/v1?id=${urlId}&level=${level}`, 'get')
}
// 获取歌词 /lyric?id=33894312
export const lyricApi = (songid) => {
    return request(`/lyric?id=${songid}`, 'get')
}
// 收藏歌单
export const collectSongSheetApi = (t, id) => {
    return request(`playlist/subscribe?t=${t}&id=${id}`, 'get')
}