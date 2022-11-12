
import request from '../utils/request'

// 私人歌单
export const personalFm = () => {
    return request('recommend/songs', 'get')
}