import request from '../utils/request'

// 获取歌单详情接口
export const toplist = (id) => {
    return request('/toplist', 'get')
}
// 获取热门详情
export const hotTopic = (offset = 0) => {
    return request('hot/topic?limit=50&offset=' + offset, 'get')
}