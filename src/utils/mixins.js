// 混入
// 获取播放量
import { ref, reactive } from 'vue'
import store from '@/store'
export const getPlayCount = (num) => {
    if (num > 100000000) {
        return (num / 100000000).toFixed(1) + '亿'
    }
    if (num > 100000 && num < 100000000) {
        return (num / 10000).toFixed(1) + '万'
    }
    if (num < 99999) {
        return num
    }
}

export const clickAll = (songDatas) => {
    let songDetailObj = reactive({})
    const songData = ref([])
    const songsArr = ref([])
    const index = ref('')
    const temp = ref(false)
    songData.value = songDatas
    if (songData.value.length) {
        store.commit('showOrHide/songlist', songData.value)
    } else {
        store.commit('showOrHide/songlist', songsArr.value)
    }
    // 获取歌曲id 和 index
    index.value = songData.value[0].songIndex
    songDetailObj.picUrl = songData.value[0].al.picUrl
    songDetailObj.title = songData.value[0].ar[0].name
    songDetailObj.name = songData.value[0].name
    songDetailObj.id = songData.value[0].id
    songDetailObj.uid = songData.value[0].ar[0].id
    songDetailObj.rowsIndex = songData.value[0].songIndex
    store.commit('showOrHide/picUrl', songDetailObj)
    // audio.value.play()
    temp.value = true
    store.commit('showOrHide/discisShow', temp.value)
}