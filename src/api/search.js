
import request from '../utils/request'
//  获取搜索意见
export const search = () => {
    return request('search/hot/detail', 'get')
}
// 搜索结果
export const searchsuggest = (keywords) => {
    return request('/search/suggest?keywords=' + keywords, 'get')
}
// 默认关键词
export const defaultSearch = () => {
    return request('/search/default', 'get')
}
// 多重匹配
export const multimatchApi = (keywords) => {
    return request(`/search/multimatch?keywords=${keywords}`, 'get')
}
// 搜索分类
export const cloudSearch = (keyWords, type = 1, offset = 0) => {
    return request(`/cloudsearch?keywords=${keyWords}&type=${type}&offset=${offset}&limit=10`, 'get')
}
