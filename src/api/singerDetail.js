
import request from '../utils/request'
// 歌手详情
export const singerDetail = (id) => {
    return request('/artist/detail?id=' + id, 'get')
}
// 歌手热门前50首
export const artistTop = (id) => {
    return request(`/artist/top/song?id=${id}`, 'get')
}
// 获取歌手专辑
export const artistAlbum = (id) => {
    return request(`/artist/album?id=${id}`, 'get')
}
// 获取专辑内容
export const albumText = (id) => {
    return request(`/album?id=${id}`, 'get')
}
// 获取歌曲描述
export const artistDescApi = (id) => {
    return request(`/artist/desc?id=${id}`, 'get')
}
// 获取相似歌手
export const simiSinger = (id) => {
    return request(`simi/artist?id=${id}`, 'get')
}
// 获取已收藏专辑列表
export const albumSublist = (limit = 1000) => {
    return request(`/album/sublist?limit=${limit}`, 'get')
}
// 专辑评论
export const albumComment = (id, offset, limit, timestamp) => {
    return request(`/comment/album?id=${id}&offset=${offset}&limit=${limit}&timestamp=${Date.now()}`, 'get')
}
// 歌手mv
export const artistMv = (id) => {
    return request(`/artist/mv?id=${id}&limit=100`, 'get')
}
// 收藏歌手 /artist/sub?id=6452&t=1
export const collectArtist = (t, id) => {
    return request(`http://localhost:3000/artist/sub?id=${id}&t=${t}`, 'get')
}
// 收藏专辑
export const collectAlbum = (id) => {
    return request('http://localhost:3000/album/sub?t=' + id, 'get')
}