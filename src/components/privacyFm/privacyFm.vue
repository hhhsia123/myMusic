<template>
    <div class="privacyContainer">
        <div class="leftAera">
            <div class="picContainer">
                <img ref="target" :src="item.al.picUrl + '?param=320y320'" alt="" class="pic"
                    v-for="(item, i) in dailySongs" :key="i">
                <div class="anniu" v-for="(item, i) in dailySongs" :key="i">
                    <div class="bofang">
                        <transition name="h2">
                            <i class="icon iconfont icon-bofang" v-on:click="clickbtn(i)" v-if="isClose"></i>
                        </Transition>
                    </div>
                    <div class="close">
                        <transition name="h1">
                            <i v-if="!isClose" class="icon iconfont icon-bofang-copy" v-on:click="clickbtn(i)"></i>
                        </Transition>
                    </div>

                </div>
            </div>
            <div class="icons">
                <div class="pre" @click="clickPic(-1)"> <i class="icon iconfont icon-zuobian-tianchong"></i> </div>
                <div class="rubbish"> <i class="icon iconfont icon-lajitong"></i></div>
                <div v-if="like" class="heart" @click="likeMusic"> <i class="icon iconfont icon-shoucang"></i>
                </div>
                <div v-if="!like" class="heart" @click="likeMusic"> <i class="icon iconfont icon-shoucang"
                        style="color:#EC4141 ;"></i></div>
                <div class="next" @click="clickPic(1)"> <i class="icon iconfont icon-youbian-tianchong"></i></div>

            </div>
        </div>
        <div class="songtextCon">
            <div class="title">{{ songObj.name }}</div>
            <RouterLink :to="`/singerDetail/${songObj.uid}`">
                <div class="smallTitle">{{ songObj.title }}</div>
            </RouterLink>
            <el-scrollbar height="400px" ref="lyricScrollTop">
                <!-- 歌词部分 -->

                <div class="lyricName" v-for="(item, i) in arrlyric" :key="i">
                    <div class="text"
                        :class="[item.timer < parseInt(currentTime * 1000) && parseInt(currentTime * 1000) < item.pre ? 'textActive' : 'text']">
                        {{ item.lrc }}</div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script>
import { $MsgSucc } from '@/utils/Message'
import pubsub from 'pubsub-js'
import { lyricApi, songUrl } from '../../api/songDetail'
import { useStore } from 'vuex'
import { onMounted, ref, reactive, watch, computed, onBeforeUnmount } from 'vue'
import { personalFm } from '../../api/privacyApi'
export default {
    name: 'privacyFm',
    components: {

    },
    setup() {
        const lyricStr = ref('')
        let arrlyric = ref([])
        let timer = ref(null)
        // 请求歌词
        let lyricScrollTop = ref(null)
        let set = null
        let sun = 0
        let songObj = reactive({})
        const currentTime = ref(null)
        const indexCarousel = ref(5)
        const index = ref()
        let songDetailObj = reactive({})
        const store = useStore()
        const isClose = ref(false)
        const dailySongs = ref([])
        const temp = ref(false)
        const getpersonalFm = () => {
            personalFm().then(res => {
                console.log(res.data)
                dailySongs.value = res.data.data.dailySongs
                res.data.data.dailySongs.forEach((item, i) => {
                    item.songIndex = i
                    item.fm = 'fmIcon'
                })
                if (store.state.showOrHide.prvacyFmDetail.rowsIndex === '') {
                    clickbofang(5)
                } else {
                    clickbofang(store.state.showOrHide.prvacyFmDetail.rowsIndex)
                }
            })
        }
        const target = ref(null)
        const opity = ref(1)
        const like = ref(true)
        // 轮播核心代码
        const getCarousel = (indexCarousel) => {
            if (indexCarousel !== '') {
                target.value[indexCarousel].style.opacity = '1'
                target.value[indexCarousel - 1].style.opacity = '1'
                target.value[indexCarousel + 1].style.left = '240px'
                target.value[indexCarousel - 2].style.left = '-100px'
                target.value[indexCarousel - 1].style.left = '-0px'
                target.value[indexCarousel].style.left = '100px'
                target.value[indexCarousel].style.zIndex = 50
                target.value[indexCarousel].style.transform = 'scale(1.3)'
                target.value[indexCarousel - 2].style.transform = 'scale(0.8)'
            }
        }
        // 订阅消息
        pubsub.subscribe('bofang', (message, data) => {
            if (data === 'next') {
                clickPic(1)
            } else {
                clickPic(-1)
            }
        })
        // 收藏该音乐
        const likeMusic = () => {
            like.value = !like.value
            if (!like.value) {
                $MsgSucc('收藏成功')
            } else {
                $MsgSucc('已经取消收藏')
            }
        }
        let data
        // 上下首
        watch(() => [store.state.showOrHide.FmcontextSong, store.state.showOrHide.prvacyFmDetail.rowsIndex], (newValue) => {
            console.log(newValue)
            let songData = store.state.showOrHide.prvacyFmList
            store.commit('showOrHide/FmcontextSong', '')
            if (newValue[0] === 'next') {
                if (songData.length - 1 !== newValue[1]) {
                    data = songData.find(item => {
                        return item.songIndex === newValue[1] + 1
                    })
                } else {
                    data = songData.find(item => {
                        return item.songIndex === 0
                    })
                }
                console.log(data)
                if (!(data.al === undefined)) {
                    songDetailObj.picUrl = data.al.picUrl
                    songDetailObj.title = data.al.name
                    songDetailObj.name = data.name
                    songDetailObj.id = data.id
                    songDetailObj.uid = data.ar[0].id
                    songDetailObj.rowsIndex = data.songIndex
                    index.value = data.songIndex
                    store.commit('showOrHide/prvacyFmObj', songDetailObj)
                } else if (data.album) {
                    songDetailObj.picUrl = data.album.picUrl
                    songDetailObj.title = data.artists[0].name
                    songDetailObj.name = data.name
                    songDetailObj.id = data.id
                    songDetailObj.rowsIndex = data.songIndex
                    index.value = data.songIndex
                    store.commit('showOrHide/prvacyFmObj', songDetailObj)
                }
            } else if (newValue[0] === 'up') {
                if (newValue[1] !== 0) {
                    data = songData.find(item => {
                        return item.songIndex === newValue[1] - 1
                    })
                } else {
                    data = songData.find(item => {
                        return item.songIndex === songData.length - 1
                    })
                }
                // clickButtom(true)
                if (!(data.al === undefined)) {
                    console.log(data)
                    songDetailObj.picUrl = data.al.picUrl
                    songDetailObj.title = data.al.name
                    songDetailObj.name = data.name
                    songDetailObj.id = data.id
                    songDetailObj.uid = data.ar[0].id
                    songDetailObj.rowsIndex = data.songIndex
                    index.value = data.songIndex
                    store.commit('showOrHide/prvacyFmObj', songDetailObj)
                } else if (data.album) {
                    console.log(data)
                    songDetailObj.picUrl = data.album.picUrl
                    songDetailObj.title = data.artists[0].name
                    songDetailObj.name = data.name
                    songDetailObj.id = data.album.id
                    songDetailObj.rowsIndex = data.songIndex
                    index.value = data.songIndex
                    store.commit('showOrHide/prvacyFmObj', songDetailObj)
                }
            }
        }, { immediate: true })
        // 获取表格的索引
        let num = 0
        const clickbofang = (i) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            if (dailySongs.value.length) {
                store.commit('showOrHide/prvacyFmList', dailySongs.value)
            } else {
                store.commit('showOrHide/prvacyFmList', dailySongs.value)
            }
            // 获取歌曲id 和 index
            // index.value = rows.songIndex
            // console.log(rows, rows.songIndex)
            songDetailObj.picUrl = dailySongs.value[i].al.picUrl
            songDetailObj.title = dailySongs.value[i].al.name
            songDetailObj.name = dailySongs.value[i].name
            songDetailObj.id = dailySongs.value[i].id
            songDetailObj.uid = dailySongs.value[i].ar[0].id
            songDetailObj.rowsIndex = dailySongs.value[i].songIndex
            store.commit('showOrHide/prvacyFmObj', songDetailObj)
            // store.commit('showOrHide/picUrl', {})
            // audio.value.play()
            temp.value = true
            if (num !== 0) {
                store.commit('showOrHide/discisShow', temp.value)
            }
            num = num + 1
        }
        const clickbtn = (i) => {
            isClose.value = !isClose.value
            if (!isClose.value) {
                store.commit('showOrHide/discisShow', isClose.value)
            } else {
                clickbofang(indexCarousel.value)
            }
        }
        // ---------------------------------------
        // 轮播核心代码
        // index===1
        const getCarouselone = (indexCarousel) => {
            target.value[indexCarousel].style.opacity = '1'
            target.value[indexCarousel - 1].style.opacity = '1'
            target.value[indexCarousel + 1].style.left = '240px'
            target.value[target.value.length - 1].style.left = '-100px'
            target.value[indexCarousel - 1].style.left = '-0px'
            target.value[indexCarousel].style.left = '100px'
            target.value[indexCarousel].style.zIndex = 50
            target.value[indexCarousel].style.transform = 'scale(1.3)'
            target.value[target.value.length - 1].style.transform = 'scale(0.8)'
        }
        // index===0
        const getCarouselzero = (indexCarousel) => {
            target.value[indexCarousel].style.opacity = '1'
            target.value[target.value.length - 1].style.opacity = '1'
            target.value[indexCarousel + 1].style.left = '240px'
            target.value[target.value.length - 2].style.left = '-100px'
            target.value[target.value.length - 1].style.left = '-0px'
            target.value[indexCarousel].style.left = '100px'
            target.value[indexCarousel].style.zIndex = 50
            target.value[indexCarousel].style.transform = 'scale(1.3)'
            target.value[target.value.length - 2].style.transform = 'scale(0.8)'
        }
        // index===32
        const getCarousellengone = (indexCarousel) => {
            target.value[indexCarousel].style.opacity = '1'
            target.value[target.value.length - 2].style.opacity = '1'
            target.value[indexCarousel - (target.value.length - 1)].style.left = '240px'
            target.value[target.value.length - 3].style.left = '-100px'
            target.value[target.value.length - 2].style.left = '-0px'
            target.value[indexCarousel].style.left = '100px'
            target.value[indexCarousel].style.zIndex = 50
            target.value[indexCarousel].style.transform = 'scale(1.3)'
            target.value[target.value.length - 3].style.transform = 'scale(0.8)'
        }
        // index===31
        const getCarousellengtwo = (indexCarousel) => {
            target.value[indexCarousel].style.opacity = '1'
            target.value[target.value.length - 3].style.opacity = '1'
            target.value[indexCarousel - (target.value.length - 2)].style.left = '240px'
            target.value[target.value.length - 4].style.left = '-100px'
            target.value[target.value.length - 3].style.left = '-0px'
            target.value[indexCarousel].style.left = '100px'
            target.value[indexCarousel].style.zIndex = 50
            target.value[indexCarousel].style.transform = 'scale(1.3)'
            target.value[target.value.length - 4].style.transform = 'scale(0.8)'
        }
        // ----------------------------------
        const getCarouselINdex = (i, data) => {
            if (indexCarousel.value <= target.value.length - 2 && indexCarousel.value >= 2) {
                // 这里是索引为2以上到31的时候的正常代码如何不在这个范围内那么需要另外进行计算
                target.value[indexCarousel.value - 2].style.opacity = '1'
                target.value[indexCarousel.value + 1].style.opacity = '1'
                // let arrshift = target.value[target.value.length - 1]
                // // 删除第最后一个
                // target.value.pop()
                // // 添加到第一一个
                // target.value.unshift(arrshift)
                for (let i = 0; i <= target.value.length - 1; i++) {
                    target.value[i].style.transform = 'scale(1)'
                    target.value[i].style.zIndex = i
                    target.value[i].style.left = '0'
                    target.value[i].style.opacity = '0'
                }
                if (i === 1 && data !== 'next') {
                    if (indexCarousel.value === target.value.length - 2) {
                        getCarousellengtwo(indexCarousel.value + 1)
                    } else {
                        getCarousel(indexCarousel.value + 1)
                    }
                } else if (i === -1 && data !== 'up') {
                    getCarouselone(indexCarousel.value - 1)
                } else {
                    getCarousel(indexCarousel.value)
                }
            } else {
                // 这里是索引为2以下到31的索引范围的代码
                if (indexCarousel.value === 1) {
                    target.value[target.value.length - 1].style.opacity = '1'
                    target.value[indexCarousel.value + 1].style.opacity = '1'
                    for (let i = 0; i <= target.value.length - 1; i++) {
                        target.value[i].style.transform = 'scale(1)'
                        target.value[i].style.zIndex = i
                        target.value[i].style.left = '0'
                        target.value[i].style.opacity = '0'
                    }
                    if (i === 1 && data !== 'next') {
                        getCarouselzero(indexCarousel.value + 1)
                    } else if (i === -1 && data !== 'up') {
                        getCarouselzero(indexCarousel.value - 1)
                    } else {
                        getCarouselone(indexCarousel.value)
                    }
                } else if (indexCarousel.value === 0) {
                    target.value[target.value.length - 2].style.opacity = '1'
                    target.value[indexCarousel.value + 1].style.opacity = '1'
                    for (let i = 0; i <= target.value.length - 1; i++) {
                        target.value[i].style.transform = 'scale(1)'
                        target.value[i].style.zIndex = i
                        target.value[i].style.left = '0'
                        target.value[i].style.opacity = '0'
                    }
                    if (i === 1 && data !== 'next') {
                        getCarouselone(indexCarousel.value + 1)
                    } else if (i === -1 && data !== 'up') {
                        getCarousellengone(target.value.length - 1)
                    } else {
                        getCarouselzero(indexCarousel.value)
                    }
                } else if (indexCarousel.value === target.value.length - 1) {
                    target.value[target.value.length - 3].style.opacity = '1'
                    target.value[indexCarousel.value - (target.value.length - 1)].style.opacity = '1'
                    for (let i = 0; i <= target.value.length - 1; i++) {
                        target.value[i].style.transform = 'scale(1)'
                        target.value[i].style.zIndex = i
                        target.value[i].style.left = '0'
                        target.value[i].style.opacity = '0'
                    }
                    if (i === 1 && data !== 'next') {
                        getCarouselzero(target.value.length - (indexCarousel.value + 1))
                    } else if (i === -1 && data !== 'up') {
                        getCarousellengtwo(indexCarousel.value - 1)
                    } else {
                        getCarousellengone(indexCarousel.value)
                    }
                }
            }
        }
        onMounted(() => {
            getpersonalFm()
            setTimeout(() => {
                if (!(target.value === null)) {
                    for (let i = 0; i <= target.value.length - 1; i++) {
                        target.value[i].style.zIndex = i
                        target.value[i].style.opacity = '0'
                    }
                }
                watch(() => store.state.showOrHide.prvacyFmDetail.rowsIndex, (newValue) => {
                    console.log(newValue)
                    indexCarousel.value = newValue
                }, { immediate: true })
                if (indexCarousel.value === 1) {
                    getCarouselone(indexCarousel.value)
                } else if (indexCarousel.value === 0) {
                    getCarouselzero(indexCarousel.value)
                } else if (indexCarousel.value === target.value.length - 1) {
                    getCarousellengone(indexCarousel.value)
                } else if (indexCarousel.value === target.value.length - 1) {
                    getCarousellengtwo(indexCarousel.value)
                } else {
                    getCarousel(indexCarousel.value)
                }
            }, 1000)
        })
        // -----------------------------------------
        const clickPic = (i) => {
            console.log(i)
            // 下一首
            if (i === 1) {
                store.commit('showOrHide/FmcontextSong', 'next')
                getCarouselINdex(i, data)
            }
            // 上一首
            if (i === -1) {
                store.commit('showOrHide/FmcontextSong', 'up')
                getCarouselINdex(i, data)
            }
        }
        // 监听关闭按钮关闭了fm也要关闭
        watch(() => store.state.showOrHide.discShowHide, (newValue) => {
            isClose.value = newValue
        }, { immediate: true })
        // 歌词
        const getDom = () => {
            if (currentTime.value >= 1 && currentTime.value <= 3) {
                lyricScrollTop.value.setScrollTop(0)
            }
            let textActive = document.querySelector('.textActive')
            console.log([textActive])
            timer = setTimeout(() => {
                clearTimeout(timer)
                if (!(textActive === null)) {
                    if (textActive.offsetTop >= 200) {
                        let scroll = textActive.offsetTop - 175
                        scroll = parseInt(scroll)
                        clearInterval(set)
                        set = setInterval(() => {
                            let i = 1
                            lyricScrollTop.value.setScrollTop(sun)
                            if (sun >= scroll) {
                                clearInterval(set)
                                sun = scroll
                            }
                            sun = sun + i
                        })
                        // console.log(lyricScrollTop.value)
                    }
                }
            })
        }
        // 根据其滚动scrolltop的距离来定在歌词中间
        watch(() => store.state.showOrHide.currentTime, (newValue) => {
            currentTime.value = store.state.showOrHide.currentTime
            console.log(currentTime.value)
            console.dir(lyricScrollTop.value.setScrollTop())
            getDom()
        })
        const getLyricApi = (Obj) => {
            lyricApi(Obj.id).then(res => {
                console.log(res.data)
                if (!res.data.code === 200) {
                    return console.log('歌曲请求失败')
                }
                lyricStr.value = res.data.lrc.lyric
                // 对歌词做相应的处理
                if (lyricStr.value) {
                    let arrList = lyricStr.value.split(/[(\r\n)\r\n]+/)
                    // console.log(arrList)
                    arrlyric.value = arrList.map(item => {
                        let min = item.slice(1, 3)
                        let sec = item.slice(4, 7)
                        let mill = item.slice(7, 10)
                        let lrc = item.slice(11, item.length)
                        let timer = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill)
                        if (isNaN(Number(mill))) {
                            mill = item.slice(7, 9)
                            lrc = item.slice(10, item.length)
                            timer = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill)
                        }
                        return {
                            min,
                            sec,
                            mill,
                            lrc,
                            timer
                        }
                    })
                }
                arrlyric.value.pop()
                if (arrlyric.value) {
                    arrlyric.value.forEach((item, i) => {
                        if (arrlyric.value.length - 1 === i) {
                            arrlyric.value.pre = 0
                        } else {
                            item.pre = arrlyric.value[i + 1].timer
                        }
                    })
                    console.log(arrlyric)
                }
            })
            // console.log(Obj)
        }
        const audioUrl = ref('')
        const geturl = (id) => {
            songUrl(id).then((res) => {
                if (res.data.data[0] !== undefined) {
                    audioUrl.value = res.data.data[0].url
                    pubsub.publish('audio', [audioUrl.value, songObj])
                    console.log(audioUrl.value)
                }

                // isShowBofang.value = true
            })
        }

        songObj = computed(() => {
            const Obj = store.state.showOrHide.prvacyFmDetail
            geturl(store.state.showOrHide.prvacyFmDetail.id)
            getLyricApi(Obj)
            return Obj
        })
        onBeforeUnmount(() => {
            //    1.我们需要把fm里面的数据变成songdata的数据同时我们也要获取到现在的索引
            store.commit('showOrHide/songlist', store.state.showOrHide.prvacyFmList)
            store.commit('showOrHide/picUrl', store.state.showOrHide.prvacyFmDetail)
        })
        return { dailySongs, clickPic, target, opity, isClose, clickbtn, songObj, arrlyric, lyricScrollTop, currentTime, likeMusic, like }
    }
}
</script>
<style lang="less" scoped>
.privacyContainer {
    width: 1000px;
    height: 503px;
    position: relative;
    display: flex;

    .rightAera {
        width: 400px;
        height: 100%;
        background-color: aqua;
    }

    .leftAera {
        position: relative;
        left: 10%;

        .picContainer {

            width: 600px;
            height: 100%;
            margin-top: 80px;

            display: flex;

            .anniu {
                position: absolute;
                left: 34%;
                top: 33%;
                z-index: 51;

                @keyframes axisX {
                    from {
                        top: -14px;
                        left: 4px;
                    }

                    to {
                        left: 110px;
                        top: 120px
                    }
                }

                // :style="{ top: isClose ? '140px' : '-14px', left: isClose ? '120px' : '4px' }"
                /* 2. 过渡类名 */
                /* 开始 */
                .h1-enter-active {
                    animation: axisX 1s reverse forwards;

                }

                /* 结束 */
                .h1-leave-active {
                    // animation: axisX 2s, forwards;
                    animation: axisX 1s forwards;

                }

                @keyframes axisX2 {
                    0% {
                        opacity: 0;
                    }

                    90% {
                        opacity: 0;
                    }

                    100% {
                        opacity: 1;
                    }
                }

                // :style="{ top: isClose ? '140px' : '-14px', left: isClose ? '120px' : '4px' }"
                /* 2. 过渡类名 */
                /* 开始 */
                .h2-enter-active {
                    animation: axisX2 1.2s forwards;

                }

                /* 结束 */
                .h2-leave-active {
                    // animation: axisX 2s, forwards;
                    animation: axisX2 0.1s reverse forwards;

                }

                div {
                    .icon-bofang {
                        color: red;
                        font-size: 51px;
                        position: absolute;
                        left: 110px;
                        top: 120px
                    }

                    .icon-bofang-copy {
                        color: red;
                        font-size: 51px;
                        position: absolute;
                        top: -14px;
                        left: -4px;
                    }
                }
            }

            .pic {
                max-width: 240px;
                transition: all 1s;
                float: left;
                position: absolute;
            }
        }

        .icons {
            left: 17%;
            top: 75%;
            position: absolute;
            display: flex;

            div {
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #eee;
                width: 50px;
                height: 50px;
                margin-right: 10px;
                border-radius: 50%;

                i {
                    font-size: 30px;
                }
            }
        }
    }

    .songtextCon {
        height: 100%px;
        width: 400px;
        text-align: center;
        /* margin-right: 72px; */
        position: absolute;
        /* float: left; */
        left: 54%;
        // background-color: pink;

        .title {
            font-size: 25px;
            font-weight: 700;
            color: #000000;
            margin: 10px 0 10px 0;
        }

        .smallTitle {
            font-size: 15px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 21px;
        }

        .lyricName {
            display: flex;
            flex-direction: column;
            align-items: center;

            .text {
                margin: 10px 0;
                color: #646364;
                .overflow();
                font-size: 15px;
            }

            .textActive {
                color: #000000;
                font-weight: 700;
                font-size: 20px;
                .overflow();
            }
        }
    }
}
</style>