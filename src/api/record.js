
import request from '../utils/request'
// 最近播放
export const recentApi = () => {
    return request('record/recent/song', 'get')
}
