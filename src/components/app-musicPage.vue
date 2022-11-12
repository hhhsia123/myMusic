<template>
    <el-scrollbar max-height="600px" v-loading="loading" ref="offsetTop" @scroll="scroll">
        <div class="musicPage">
            <!-- 标题 -->
            <div class="musicContainer">
                <div class="needleContainer">
                    <!-- 磁盘旋转 -->
                    <img src="../assets/imagges/needle.png" :class="[isShowNeedle ? 'needle' : 'needleActive']" />
                    <div class="discContainer">
                        <img class="disc" src="../assets/imagges/disc.png" />
                    </div>
                    <!--图片 -->
                    <img class="rotateImg" :class="[isShowNeedle ? 'image_run ' : 'image_paused']"
                        :src="songObj.picUrl + '?param=200y200'" alt="">
                </div>
                <div class=" songtextCon">
                    <div class="title">{{ songObj.name }}</div>
                    <RouterLink :to="`/singerDetail/${songObj.uid}`">
                        <div class="smallTitle">{{ songObj.title }}</div>
                    </RouterLink>
                    <el-scrollbar height="400px" ref="lyricScrollTop">
                        <!-- 歌词部分 -->

                        <div class="lyricName" v-for="(item, i) in arrlyric" :key="i">
                            <div class="text"
                                :class="[item.timer < parseInt(currentTime * 1000) && parseInt(currentTime * 1000) < item.pre ? 'textActive' : 'text']">
                                {{ item.lrc }}{{ (item.timer < parseInt(currentTime * 1000) && parseInt(currentTime *
                                        1000) < item.pre) ? getActiveLyric(item.lrc, (item.pre - item.timer)) : ''
                                }}</div>
                            </div>
                    </el-scrollbar>
                </div>
                <transition name="fade">
                    <div @click="clickComment" v-if="commentBtnShow" class="whiteCommentBtn"> <i
                            class=" icon iconfont  icon-bianji-xiugai-pinglun-03"> </i>
                        写评论</div>
                </transition>
            </div>
            <!-- ------------------------------------------------------------------------------- -->
            <!-- 歌曲评论组件 -->
            <appComment :musicommentId="songObj.id" @clickTop="clickTop(true)"></appComment>
            <!-- 显示返回顶部 -->
            <div :class="{ 'showBackTop': showTop, 'close': !showTop }" @click="clickTop(true)">
                <i class="icon icon iconfont  icon-top"></i>
            </div>
        </div>
    </el-scrollbar>

</template>
<script>
import appComment from '../components/app-Comment.vue'

import { lyricApi } from '../api/songDetail'
import { ref, watch, computed, reactive } from 'vue'
import { useStore } from 'vuex'
// import pubsub from 'pubsub-js'
// import { CircleCloseFilled } from '@element-plus/icons-vue'
export default {
    name: 'musicPage',
    components: {
        appComment
    },
    props: {
        isShowneedle: {
            type: Boolean,
            default: false
        }
    },
    emits: ['showTop', 'activeLyric'],
    setup(props, { emit }) {
        const offsetTop = ref(null)
        const store = useStore()
        const isShowNeedle = ref(false)
        const drawer = ref(false)
        const lyricStr = ref('')
        let arrlyric = ref([])
        const currentTime = ref(null)
        let timer = ref(null)
        // 请求歌词
        let lyricScrollTop = ref(null)
        let set = null
        let sun = 0
        let songObj = reactive({})
        // 滚动的距离
        let scrollnum = ref(0)
        const showTop = ref(false)
        const commentBtnShow = ref(true)
        const lyricTop = ref(false)
        // 获取动态歌词
        const getActiveLyric = (ActiveLyric, time) => {
            // 拿到代码就动态渲染抽屉上面去
            emit('activeLyric', ActiveLyric, time)
        }
        // 评论
        const whiteComment = () => {
            // console.dir(target.value)
            if (scrollnum.value >= 100) {
                console.log(scrollnum.value)
                commentBtnShow.value = false
                // 评论开启的时候歌曲顶部开始关闭
                lyricTop.value = true
                if (lyricTop.value) {
                    emit('showLyricTop', lyricTop.value, songObj)
                }
            } else {
                commentBtnShow.value = true
                // 评论关闭的时候歌曲顶部开始显示
                lyricTop.value = false
                if (!lyricTop.value) {
                    emit('showLyricTop', lyricTop.value, songObj)
                }
            }
        }
        // 回顶部
        const Top = () => {
            // console.dir(target.value)
            if (scrollnum.value >= 300) {
                console.log(scrollnum.value)
                showTop.value = true
            } else {
                showTop.value = false
            }
        }
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
                        let scroll = textActive.offsetTop - 175
                        scroll = parseInt(scroll)
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
                if (res.data.lrc !== undefined) {
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

        songObj = computed(() => {
            const Obj = store.state.showOrHide.songDetail
            getLyricApi(Obj)
            return Obj
        })

        watch(() => props.isShowneedle, (newVal) => {
            // console.log(newVal)
            isShowNeedle.value = props.isShowneedle
            // console.log(isShowNeedle.value)
        }, { immediate: true })
        // -------------------------------------------------------------------------------------------
        // 封装动画
        let time
        function animate() {
            clearInterval(time)
            time = setInterval(() => {
                if (scrollnum.value <= 0) {
                    clearInterval(time)
                }
                scrollnum.value = scrollnum.value - 50
                offsetTop.value.setScrollTop(scrollnum.value)
            }, 30)
        }

        const scroll = ({ scrollTop }) => {
            scrollnum.value = Math.floor(scrollTop)
            // console.log(scrollnum.value)
            Top()
            whiteComment()
        }
        // 点击按钮
        const clickComment = (boolen) => {
            offsetTop.value.setScrollTop(500)
        }
        // 点击按钮
        const clickTop = (boolen) => {
            animate()
        }
        return { showTop, drawer, isShowNeedle, clickComment, getActiveLyric, commentBtnShow, songObj, arrlyric, currentTime, lyricScrollTop, scroll, offsetTop, clickTop }
    }
}
</script>
<style lang="less" scoped>
.musicPage {
    position: relative;

    .showBackTop {
        top: 70%;
        left: 80%;
        .isshowTop();
        animation: BackTop 2s linear alternate;

    }

    @keyframes BackTop {

        0% {
            top: 80%;
            opacity: 0;
        }

        40% {
            top: 67%;
        }

        70% {
            top: 73%;
            opacity: 1;
        }

        100% {
            top: 70%;

        }
    }

    .close {
        top: 80%;
        left: 74%;
        transition: all 2s;
        .isshowTop();
        opacity: 0;
    }

    /deep/.el-textarea {
        margin-left: 130px;
        transform: translateY(137px);
    }

    /deep/h3 {
        margin-left: 130px;
        transform: translateY(137px);
    }

    /deep/.float {
        // width: 100%;
        width: 1058px;
        transform: translateY(137px);

        /deep/.iconfont {
            font-size: 20px;
            cursor: pointer;
        }

        /deep/ .el-button {
            margin-left: 10px;
        }
    }

    /deep/ .example-pagination-block {
        margin-top: 39px;
        margin-bottom: 86px;

    }

    /deep/.moreComment {
        transform: translateY(137px);
    }

    /deep/.commentList {
        margin-top: 10px;
        transform: translateY(137px);

        /deep/.hotCommentList {
            margin: auto !important;

            /deep/.commentCreatorAvatar {
                /deep/ .pic {
                    max-width: 40px;
                    max-height: 40px;
                    border-radius: 50%;
                    flex: 1;
                    margin-top: 10px;
                }
            }

            /deep/.commentMain {
                margin-left: 15px;
                line-height: 30px;
                width: 100%;

                /deep/.replied {
                    width: 100%;
                    background-color: #f2f2f2;
                }

                /deep/.commentBottom {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;

                    /deep/.commentCreatedTime {
                        color: #9F9F9F;
                    }

                    /deep/.commentIcons {
                        display: flex;
                        width: 150px;
                        justify-content: space-around;
                    }
                }
            }
        }

    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 1s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    // }

    .musicContainer {
        position: relative;
        height: 400px;
        display: flex;
        text-align: center;

        .whiteCommentBtn {
            background-color: #ececec;
            width: 100px;
            height: 40px;
            border-radius: 30px;
            line-height: 40px;
            align-self: flex-end;
            position: absolute;
            top: 115%;
            right: 134px;
            cursor: pointer;

        }

        .title {
            display: flex;
            flex-direction: column;
            color: #282828;
            font-size: 30px;
            font-weight: 700;
        }

        .smallTitle {
            margin: 10px 0;
            display: flex;
            flex-direction: column;
            color: #B7AFB6;
            font-size: 15px;
            font-weight: 700;
        }

        .needleContainer {
            // background-color: aqua;
            height: 100%;
            width: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 30px 0 0 30px;

            .needle {
                position: absolute;
                width: 100px;
                height: 123px;
                left: 222px;
                transform-origin: 0 0;
                transform: rotate(3deg);
                z-index: 100;
                transition: transform 1s;
                top: 40px;

                // background-color: blue;

            }

            .needleActive {
                top: 40px;
                position: absolute;
                width: 100px;
                height: 123px;
                left: 222px;
                transform-origin: 0 0;
                transform: rotate(-28deg);
                z-index: 100;
                transition: transform 1s;
                // background-color: blue;
            }

            .discContainer {
                background-color: #cccce2;
                width: 280px;
                height: 280px;
                border-radius: 50%;
                position: absolute;

                .disc {
                    position: absolute;
                    width: 250px;
                    height: 250px;
                    left: 15px;
                    top: 15px;
                }
            }

            .rotateImg {
                position: absolute;
                width: 180;
                height: 180px;
                border-radius: 50%;
                animation: disc 25s linear infinite;
                /* 动画延迟一秒 */
                animation-delay: 0.8s;

                &.image_run {
                    animation-play-state: running;
                }

                &.image_paused {
                    animation-play-state: paused;
                }
            }

            // 动画旋转
            @keyframes disc {
                from {
                    transform: rotate(0deg);
                }

                to {
                    transform: rotate(360deg);
                }
            }
        }

        .songtextCon {
            height: 100%;
            width: 400px;
            text-align: center;
            // background-color: pink;

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
                    transition: color 0.7s;
                    .overflow();
                }
            }
        }
    }
}
</style>