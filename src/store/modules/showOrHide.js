export default {
    namespaced: true,
    state() {
        return {
            discShowHide: false,
            songDetail: {

                id: 1403435714,
                name: 'everything i wanted',
                picUrl: 'https://p1.music.126.net/MsDJyNBSzrU9INfOLN8-2A==/109951164487035684.jpg',
                rowsIndex: 0,
                title: 'Billie Eilish',
                uid: 11972054

            },
            currentTime: '',
            durationTime: '',
            // scrollTop: false
            contextsong: '',
            FmcontextSong: 'next',
            currentDuration: {
                currentSecs: '',
                currentMins: '',
                durationMins: '',
                durationSecs: ''

            },
            songData: [
                {
                    rtUrls: [],
                    ar: [
                        {
                            id: 11972054,
                            name: 'Billie Eilish',
                            tns: [
                                '比莉·艾利什'
                            ]
                        }
                    ],
                    al: {
                        id: 83326623,
                        name: 'everything i wanted',
                        picUrl: 'https://p1.music.126.net/MsDJyNBSzrU9INfOLN8-2A==/109951164487035684.jpg',
                        pic_str: '109951164487035684',
                        pic: 109951164487035680
                    },
                    alia: [],
                    dt: '04:05',
                    songIndex: 0,
                    name: 'everything i wanted',
                    id: 1403435714
                }
            ],
            path: '',
            historyScore: [],
            asideIndex: 0,
            prvacyFmList: [],
            prvacyFmDetail: {
                picUrl: '',
                title: '',
                name: '',
                id: '',
                uid: '',
                rowsIndex: 5

            }

        }
    },
    mutations: {
        // 磁盘是否做动画
        discisShow(state, isShow) {
            state.discShowHide = isShow
        },
        picUrl(state, obj) {
            state.songDetail = obj
        },
        // 播放的当前时间
        cTimer(state, time) {
            state.currentTime = time
        },
        // 播放的当前时间
        dTimer(state, time) {
            state.durationTime = time
        },
        // 下一首歌
        contextSong(state, next) {
            state.contextsong = next
        },
        // 下一首歌
        FmcontextSong(state, next) {
            state.FmcontextSong = next
        },
        // 保存时间
        currentDuration(state, timer) {
            state.currentDuration = timer
        },
        // 保存歌曲列表的数据
        songlist(state, data) {
            state.songData = data
        },
        // 存放路径
        herfPath(state, data) {
            state.path = data
        },
        // 保存历史记录
        history(state, data) {
            state.historyScore = data
        },
        // 保存侧边栏的索引
        asideIndex(state, index) {
            state.asideIndex = index
        },
        // 私人fm
        prvacyFmList(state, data) {
            state.prvacyFmList = data
        },
        prvacyFmObj(state, obj) {
            state.prvacyFmDetail = obj
        }
    }
}