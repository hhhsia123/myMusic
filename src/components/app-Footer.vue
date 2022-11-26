<template>

    <div class="Footer">
        <audio ref="audio" :autoplay="autoplay" :loop="!isLoop" :src="audioUrl" @ended="ended"></audio>
        <div class="left">
            <div class="picMaskIcon">
                <img v-if='JSON.stringify(FMsongObj) !== "{}"' class="pic" :src="FMsongObj.picUrl + '?param=100y100'"
                    alt="">
                <img class="pic" :src="songObj.picUrl + '?param=100y100'" alt="" v-else>
                <div class="masks"></div>
                <el-icon class="playButtom" size="30px" color="#fff" @click="clickDrawer" v-if="Drawer">
                    <ArrowDown />
                </el-icon>
                <el-icon class="playButtom" size="30px" color="#fff" @click="clickDrawer" v-else>
                    <ArrowUp />
                </el-icon>

            </div>
            <div class="textContainer">
                <span class="paomad" v-if='JSON.stringify(FMsongObj) !== "{}"'>{{ FMsongObj.name }}</span>
                <span class="paomad" v-else>{{ songObj.name }}</span>
                <RouterLink :to="`/singerDetail/${songObj.uid}`">
                    <span class="text" v-if='JSON.stringify(FMsongObj) !== "{}"'>{{ FMsongObj.title }}</span>
                    <span class="text" v-else>{{ songObj.title }}</span>
                </RouterLink>
            </div>
            <!-- <i class=" iconfont  icon-caijiashoucang"></i> -->
        </div>
        <div class="middle">
            <!-- icon -->
            <div class="middleIcon">
                <!-- 列表循环 -->
                <i class=" iconfont  icon-24gl-repeat2" @click="isLoops" v-if="isLoop"></i>
                <!-- 循环 -->
                <i class=" iconfont  icon-24gl-repeatOnce2" @click="isLoops" v-else></i>
                <i class=" iconfont  icon-zuobian-tianchong" @click="Upbuttom"></i>
                <!-- 播放 -->
                <div class="isBofang" @click="ClickBofang">
                    <i class=" iconfont  icon-bofang" v-if="isShowBofang"> </i>
                    <!-- 未播放 -->
                    <i class=" iconfont  icon-bofang1" v-else></i>
                </div>
                <!-- 下一首 -->
                <i class=" iconfont  icon-youbian-tianchong" @click="nextbuttom"></i>
                <i class=" iconfont  icon-geciweidianji" @click="clcikShowlryic"
                    :style="{ color: (Showlryic ? '#EC4141' : '') }"></i>
            </div>
            <!-- 进度条 -->
            <div class="slider-demo-block"
                :contents="(sliderTimer.currentMins ? sliderTimer.currentMins : '00') + ':' + (sliderTimer.currentSecs ? sliderTimer.currentSecs : '00')"
                :content="(sliderTimer.durationMins ? sliderTimer.durationMins : '00') + ':' + (sliderTimer.durationSecs ? sliderTimer.durationSecs : '00')">
                <el-slider v-model="value1" @change="changeValue" :max="durationTime" size="samall" />
            </div>
        </div>

        <div class="right">
            <!-- 画质 -->
            <div style="margin: 15px">
                <el-button plain size="small">无损</el-button>
            </div>
            <!-- 滑块 -->
            <i class=" iconfont  icon-jiadayinliang" v-if="ismuted" @click="isMuted"></i>
            <i class=" iconfont icon-guanbiyinliang" v-else @click="isMuted"></i>
            <div class="slider">
                <el-slider class="demonstration" @input="input" v-model="value" width="300px" />
            </div>
            <!-- icon -->
            <i class=" iconfont  icon-yonghu"></i>
            <popOver></popOver>

        </div>

    </div>
</template>
<script>

// vue3引入
// import musicPage from './app-musicPage.vue'
import { $MsgSucc, $MsgWarn } from '@/utils/Message'
import pubsub from 'pubsub-js'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { reactive, ref, watch, computed } from 'vue'
import popOver from '../smallComponts/popOver.vue'
import { songUrl } from '@/api/songDetail'
import { useRoute } from 'vue-router'
export default {
    name: 'appFooter',
    components: {
        popOver,
        ArrowUp,
        ArrowDown
    },
    props: {
        drawers: {
            type: Boolean,
            default: false
        },
        closeLryic: {
            type: Boolean
        }
    },
    emits: ['showLryic', 'closeLryicDialog'],
    setup(props, { emit }) {
        const Showlryic = ref(true)
        const isShowBofang = ref(false)
        const route = useRoute()
        // 点击弹出抽柜
        const Drawer = ref(false)
        const value = ref(100)
        const value1 = ref(0)
        const store = useStore()
        const audio = ref(null)
        let songObj = reactive({})
        const FMsongObj = ref({})
        const audioUrl = ref('')
        const autoplay = ref(false)
        const currentTime = ref(null)
        const durationTime = ref(null)
        let currentDuration = reactive({})
        const isLoop = ref(true)
        const ismuted = ref(true)
        let time = null
        let volum
        const index = ref('')
        let songDetailObj = reactive({})
        // 是否关闭抽屉组件
        const clickDrawer = () => {
            // 如果在私人FM中是无法打开这个页面
            watch(() => route.params.id, () => {
                if (route.path === '/privacy/4') {
                    Drawer.value = true
                    return false
                }
            }, { immediate: true })
            Drawer.value = !Drawer.value
            emit('DrawerValue', Drawer.value)
        }

        // 拖动音频使其声音变大变小
        const input = (val) => {
            if (value.value > 1) {
                ismuted.value = true
            }
            volum = val / 100
            audio.value.volume = volum
            value.value = volum * 100
            // console.log('声音改变了', xiao)
        }

        // 是否静音
        const isMuted = () => {
            ismuted.value = !ismuted.value
            if (!ismuted.value) {
                // 如果为false的我们还需要静音
                audio.value.volume = 0
                value.value = 0
            }
            if (ismuted.value) {
                audio.value.volume = 1
                value.value = 100
            }
        }
        // 监听播放的当前的时间
        watch(isShowBofang, (newValue) => {
            if (newValue) {
                // 如果播放按钮的值为真我们就播放
                setTimeout(() => {
                    audio.value.play()
                    // console.log(audio.value.currentTime)
                })
            } else {
                audio.value.pause()
                console.dir(audio.value)
            }
        })
        // 是否关闭抽屉组件
        watch(() => [props.drawers, props.closeLryic], (newValue) => {
            // console.log(newValue)
            Drawer.value = newValue[0]
            Showlryic.value = newValue[1]
        })
        // 显示歌词组件
        const clcikShowlryic = () => {
            if (route.path === '/privacy/4') {
                Showlryic.value = false
                $MsgWarn('暂时不支持一起听私人FM,正在解锁中')
            } else {
                Showlryic.value = !Showlryic.value
                emit('showLryic', Showlryic.value)
            }
        }
        // 点击是否循环还是按列表播放
        const isLoops = () => {
            isLoop.value = !isLoop.value
            if (!isLoop.value) {
                $MsgSucc('循环播放')
            } else {
                $MsgSucc('列表播放')
            }
        }
        pubsub.subscribe('audio', (message, data) => {
            audioUrl.value = data[0]
            FMsongObj.value = data[1]._value
        })
        const geturl = (id) => {
            FMsongObj.value = {}
            songUrl(id).then((res) => {
                if (res.data.data[0] !== undefined) {
                    audioUrl.value = res.data.data[0].url
                    console.log(audioUrl.value)
                }

                // isShowBofang.value = true
            })
        }
        // 视频开启音频关闭逻辑 订阅消息
        pubsub.subscribe('close', (message, data) => {
            ClickBofang()
        })
        // 点击播放实现切换
        const ClickBofang = () => {
            // console.log(isShowBofang)
            isShowBofang.value = !isShowBofang.value
            // 发布消息
            // pubsub.publish('bofang', 6666)
            store.commit('showOrHide/discisShow', isShowBofang.value)
        }
        // 获取播放的总时长和初始值
        const getduration = (currentTime, duration) => {
            // 获取当前分钟
            let currentMin = Math.floor(currentTime / 60)
            // 获取当前时间的秒
            let currentSec = Math.floor(currentTime % 60)
            // 获取总分钟
            let durationMin = Math.floor(duration / 60)
            // 获取总秒
            let durationSec = Math.floor(duration % 60)
            // 给时间加0如果未满10秒
            if (currentMin < 10) {
                currentMin = '0' + currentMin
            }
            if (currentSec < 10) {
                currentSec = '0' + currentSec
            }
            if (durationMin < 10) {
                durationMin = '0' + durationMin
            }
            if (durationSec < 10) {
                durationSec = '0' + durationSec
            }

            currentDuration.currentMins = currentMin
            currentDuration.currentSecs = currentSec
            currentDuration.durationMins = durationMin
            currentDuration.durationSecs = durationSec
            store.commit('showOrHide/currentDuration', currentDuration)
        }
        const sliderTimer = computed(() => {
            let sliderTime = store.state.showOrHide.currentDuration
            if (isNaN(sliderTime.durationMins) && isNaN(sliderTime.durationSecs)) {
                sliderTime.durationMins = '00'
                sliderTime.durationSecs = '00'
                return sliderTime
            }
            return sliderTime
        })
        watch(() => [store.state.showOrHide.currentTime, store.state.showOrHide.durationTime], (newValue) => {
            value1.value = newValue[0]
            durationTime.value = newValue[1]
        }, { immediate: true })
        // value1.value = Timer.value
        let songData
        // 播放事件监听
        const ended = () => {
            console.log('播放结束')
            // 循环下一首歌
            if (songData.length === 1) {
                store.commit('showOrHide/discisShow', false)
                emit('closeLryicDialog', false)
            } else {
                setTimeout(() => {
                    nextbuttom()
                    value1.value = 0
                }, 50)
            }
        }
        // 拖拽事件
        const changeValue = (val) => {
            console.log(val)
            audio.value.currentTime = val
        }
        // 是否播放上一首和下一首
        let data
        watch(() => [store.state.showOrHide.contextsong, store.state.showOrHide.songDetail.rowsIndex], (newValue) => {
            console.log(newValue)
            songData = store.state.showOrHide.songData
            store.commit('showOrHide/contextSong', '')
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
                    songDetailObj.title = data.ar[0].name
                    songDetailObj.name = data.name
                    songDetailObj.id = data.id
                    songDetailObj.uid = data.ar[0].id
                    songDetailObj.rowsIndex = data.songIndex
                    index.value = data.songIndex
                    store.commit('showOrHide/picUrl', songDetailObj)
                } else if (data.album) {
                    songDetailObj.picUrl = data.album.picUrl
                    songDetailObj.title = data.artists[0].name
                    songDetailObj.name = data.name
                    songDetailObj.id = data.id
                    songDetailObj.uid = data.artists[0].id
                    songDetailObj.rowsIndex = data.songIndex
                    index.value = data.songIndex
                    store.commit('showOrHide/picUrl', songDetailObj)
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
                    songDetailObj.title = data.ar[0].name
                    songDetailObj.name = data.name
                    songDetailObj.id = data.id
                    songDetailObj.uid = data.ar[0].id
                    songDetailObj.rowsIndex = data.songIndex
                    index.value = data.songIndex
                    store.commit('showOrHide/picUrl', songDetailObj)
                } else if (data.album) {
                    console.log(data)
                    songDetailObj.picUrl = data.album.picUrl
                    songDetailObj.title = data.artists[0].name
                    songDetailObj.name = data.name
                    songDetailObj.id = data.id
                    songDetailObj.uid = data.artists[0].id
                    songDetailObj.rowsIndex = data.songIndex
                    index.value = data.songIndex
                    store.commit('showOrHide/picUrl', songDetailObj)
                }
            }
        }, { immediate: true })
        // 监视索引发生改变立刻把进度条的初始值变成0
        // watch(() => store.state.showOrHide.songDetail.rowsIndex, (newValue) => {
        //     value1.value = 0
        // }, { immediate: true })
        // 播放逻辑  播放bug需要修改都需要true和flase不然会点击二次的情况出现
        let i = 0
        watch(() => store.state.showOrHide.discShowHide, (newValue) => {
            if (i === 0 && (newValue === true || newValue === false)) {
                // console.log('1111')
                store.commit('showOrHide/discisShow', false)
                i = i + 1
                return false
            } else {
                if (newValue) {
                    time = setInterval(() => {
                        currentTime.value = audio.value.currentTime
                        durationTime.value = audio.value.duration
                        value1.value = currentTime.value
                        // console.log(currentTime.value, audio.value.duration, [audio.value])
                        getduration(currentTime.value, audio.value.duration)
                        store.commit('showOrHide/cTimer', currentTime.value)
                        store.commit('showOrHide/dTimer', durationTime.value)
                    }, 1000)
                } else {
                    clearInterval(time)
                }
                isShowBofang.value = newValue
                autoplay.value = newValue
            }
        }, { immediate: true })
        // 点击播放下一首
        const nextbuttom = () => {
            value1.value = 0

            // eslint-disable-next-line quotes
            if (JSON.stringify(FMsongObj.value) !== "{}") {
                // 发布消息
                pubsub.publish('bofang', 'next')
            } else {
                store.commit('showOrHide/contextSong', 'next')
            }
        }
        // 点击播放上一首
        const Upbuttom = () => {
            value1.value = 0
            // eslint-disable-next-line quotes
            if (JSON.stringify(FMsongObj.value) !== "{}") {
                // 发布消息
                pubsub.publish('bofang', 'up')
            } else {
                store.commit('showOrHide/contextSong', 'up')
            }
        }
        songObj = computed(() => {
            if (store.state.showOrHide.songDetail) {
                geturl(store.state.showOrHide.songDetail.id)
            }
            return store.state.showOrHide.songDetail
        })
        // watch(() => router.params.id, () => {
        //     songObj = computed(() => {
        //         if (store.state.showOrHide.prvacyFmDetail) {
        //             geturl(store.state.showOrHide.prvacyFmDetail.id)
        //         }
        //         return store.state.showOrHide.prvacyFmDetail
        //     })
        // }, { immediate: true }

        return { ismuted, isMuted, input, isLoops, clcikShowlryic, FMsongObj, value1, Showlryic, value, clickDrawer, Drawer, isShowBofang, ClickBofang, songObj, audio, audioUrl, autoplay, nextbuttom, Upbuttom, sliderTimer, currentTime, durationTime, changeValue, ended, isLoop }
    }
}
</script>
<style lang="less" scoped>
.overflow() {
    display: -webkit-box;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    /* 设置对齐模式 */
    -webkit-box-orient: vertical;
    /* 设置盒子的行数 */
    -webkit-line-clamp: 1;
}

.Footer {
    position: absolute;
    width: 100%;
    height: 75px;
    border-top: 2px solid #eee;
    background-color: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    z-index: 103;

    .middle {
        margin: 0 140px;
        flex: 1;

        .slider-demo-block {
            display: flex;

            &::after {
                content: attr(content);
                margin-left: 10px;
            }

            &::before {
                content: attr(contents);
                margin-right: 10px;
            }

            .el-slider {
                margin-top: 5px;
                height: 10px;
                --el-slider-main-bg-color: @priceColor;
                --el-slider-runway-bg-color: #CECECE;
                --el-slider-stop-bg-color: var(--el-color-white);
                --el-slider-border-radius: 50%;
                --el-slider-height: 5px;
                --el-slider-button-size: 10px;
                --el-slider-button-wrapper-size: 36px;
                --el-slider-button-wrapper-offset: -15px;

                .el-tooltip__trigger {
                    background-color: @priceColor ;
                }

            }

        }

        .middleIcon {
            display: flex;
            justify-content: space-around;
            align-items: center;

            .isBofang {
                .iconfont {
                    font-size: 35px;
                }
            }

            .iconfont {
                font-size: 23px;

                &:nth-child(3) {
                    font-size: 35px;
                }

                &:hover {
                    color: #EC4141;
                    font-weight: 350;
                }
            }
        }
    }

    .right {
        display: flex;
        align-items: center;
        margin-right: 15px;

        /deep/.slider {

            .demonstration {
                width: 60px;
                --el-slider-main-bg-color: @priceColor;
                --el-slider-runway-bg-color: #CECECE;
                --el-slider-stop-bg-color: var(--el-color-white);
                --el-slider-border-radius: 50%;
                --el-slider-height: 5px;
                --el-slider-button-size: 10px;
                --el-slider-button-wrapper-size: 36px;
                --el-slider-button-wrapper-offset: -15px;

                .el-tooltip__trigger {
                    background-color: @priceColor ;
                }
            }
        }

        .iconfont {
            font-size: 23px;
            color: #333333;
            margin: 0 12px;
            border: none !important;

            &:hover {
                color: #EC4141;
                font-weight: 350;
            }
        }
    }

    .left {
        display: flex;

        .picMaskIcon {

            &:hover {
                .masks {
                    opacity: 1;
                }

                .playButtom {
                    opacity: 1;
                }
            }

            .pic {
                margin-left: 30px;
                width: 55px;
                height: 55px;
                background-color: aqua;
                vertical-align: bottom;
                border-radius: 8px;
                cursor: pointer;
            }

            .masks {
                display: block;
                position: absolute;
                top: 10px;
                left: 29px;
                width: 55px;
                height: 55px;
                background-color: rgba(0, 0, 0, 0.5);
                opacity: 0;
                transition: all 1s;
                border-radius: 10px;
            }

            .playButtom {
                display: block;
                position: absolute;
                top: 20px;
                left: 43px;
                opacity: 0;
                transition: all 1s;
                cursor: pointer;
            }
        }

        .textContainer {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            margin-top: 5px;
            width: 150px;
            overflow: hidden;
            text-align: center;

            .paomad {

                color: #373737;
                margin-bottom: 5px;
                font-size: 15px;
                font-weight: 700;
                white-space: nowrap;
                overflow: hidden;
                float: left;
                animation: marquee-wrap 15s infinite linear;

            }

            @keyframes marquee-wrap {

                0% {
                    transform: translateX(100%);
                }

                70%,
                100% {
                    transform: translateX(-100%);
                }
            }

            .text {
                color: #6C6C6C;
                font-size: 15px;
                .overflow()
            }
        }
    }
}
</style>