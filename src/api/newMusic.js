
import request from '../utils/request'

// 新人专辑
export const topAlbum = (area = '欧美', type = 'new', offset = 0, limit = 100) => {
    return request('/top/album?offset=' + offset + '&limit=' + limit + '&area=' + area + '&type=' + type, 'get')
}
// 新歌速递

export const topExpress = (type = 0) => {
    return request(`/top/song?type=${type}`, 'get')
}
// 歌手
export const songerApi = (songerObj) => {
    return request(`/artist/list?type=${songerObj.type}&area=${songerObj.area}&initial=${songerObj.initial}&offset=${songerObj.offset}&limit=${songerObj.limit}`, 'get')
}