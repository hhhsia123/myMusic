import request from '../utils/request'

// 获取已收藏专辑列表
export const myCollectionApi = () => {
    return request('album/sublist?limit=1000', 'get')
}
// 获取歌手列表收藏
export const artistApi = () => {
    return request('artist/sublist', 'get')
}
// 收藏的视频列表
export const mvSubList = () => {
    return request('mv/sublist', 'get')
}