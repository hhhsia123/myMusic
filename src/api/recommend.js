
import request from '../utils/request'

// 私人歌单
export const recommend = () => {
    return request('/recommend/resource', 'get')
}
// 高质量歌单 /top/playlist/highquality?before=1503639064232&limit=3
export const highquality = (offset = 0, cat = '') => {
    return request(`/top/playlist?&offset=${offset}&cat=${cat}`, 'get')
}
// 获取歌单分类
export const catlist = () => {
    return request('/playlist/catlist', 'get')
}
