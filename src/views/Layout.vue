<template>
    <div class="auto">
        <div class="common-layout">

            <appTop @change="move"></appTop>
            <div class="contain">
                <!-- 左侧栏 -->
                <aside>
                    <appAside></appAside>
                </aside>
                <!-- 主体 -->
                <!-- 二级路由 -->
                <!-- -->
                <!--  -->
                <!-- <keep-alive>
                        <component :is="Component" />
                    </keep-alive> -->
                <router-view>

                </router-view>

            </div>
            <appFooter :drawers="drawer" :closeLryic="closeLryic" @DrawerValue="Drawer" @showLryic="showLryic"
                @closeLryicDialog="stopBtn">
            </appFooter>
            <div class="DrawerContainer">

                <el-drawer v-model="drawer" close-delay="200" :direction="direction" style="position: absolute;"
                    :show-close="false" @open="clickopen">
                    <template #header="{}">
                        <!-- 搜索框 -->
                        <div class="drawerHeader">
                            <searchCp></searchCp>
                            <div class="lyricName">
                                <Transition name="lyricFade">
                                    <div v-if="lyricTop">
                                        <div class="title">{{ Lyricobj.data.name }}</div>
                                        <!-- <RouterLink :to="`/singerDetail/${songObj.uid}`"> -->
                                        <div class="smallTitle">{{
                                                activeLyric
                                        }}</div>
                                        <!-- </RouterLink> -->
                                    </div>
                                </Transition>
                            </div>

                            <el-icon :size="30" @click="drawer = false">
                                <ArrowDown />
                            </el-icon>
                        </div>
                    </template>
                    <musicPage :isShowneedle="isneedle" @activeLyric="(val, time) => Lyrics(val, time)"
                        @showLyricTop="(isShow, muasicPageObj) => isShowlyric(isShow, muasicPageObj)"></musicPage>
                </el-drawer>
            </div>
        </div>
        <div v-if="closeLryic" class="lyricScrollconatainer" @mousedown="keyup" ref="target"
            :style="[{ top: (noDrag ? noDragY + 'px' : lyricY + 'px'), left: (noDrag ? noDragX + 'px' : lyricX + 'px'), cursor: (noDrag ? 'Default' : 'move') }]">
            <div class="middleIcon">
                <div class="lock" @click="clickIsLock">
                    <!-- 未解锁 -->
                    <i class=" iconfont  icon-mb_suoding" v-if="isLock"></i>
                    <!-- 解锁 -->
                    <i class=" iconfont  icon-jiesuo-unlock" v-else></i>
                </div>
                <i class=" iconfont  icon-zuobian-tianchong" @click="clickicon(-1)"></i>
                <div class="isBofang" @click="clickbtn">
                    <!-- 播放 -->
                    <i class=" iconfont  icon-bofang" v-if="isClose"> </i>
                    <!-- 未播放 -->
                    <i class=" iconfont  icon-bofang1" v-else></i>
                </div>
                <!-- 下一首 -->
                <i class=" iconfont  icon-youbian-tianchong" @click="clickicon(1)"></i>

                <el-icon size="20px" color="#fff" style="margin-right: 20px; cursor: pointer;" @click="clickClose">
                    <Close />
                </el-icon>
            </div>
            <div class="changeLryic">
                <span v-show="isload" class="text " :style="{ animationDuration: `${lyricTime}s` }"> {{ activeLyric }}
                </span>
            </div>
        </div>
    </div>

</template>
<script>
import { $MsgWarn } from '@/utils/Message'
import { useRoute } from 'vue-router'
import { useMouseInElement } from '@vueuse/core'
import searchCp from '../components/search/searchCp.vue'
import { useStore } from 'vuex'
import musicPage from '../components/app-musicPage.vue'
// vue3引入
import { ArrowDown, Close } from '@element-plus/icons-vue'
// 头部组件
import appTop from '@/components/app-Top.vue'
// 尾部组件
import appFooter from '@/components/app-Footer.vue'
// 左侧边
import appAside from '@/components/app-aside.vue'
// 导入vueuse
import { ref, watch, reactive, onMounted } from 'vue'

export default {
    name: 'LayOut',
    components: {
        appTop,
        appFooter,
        appAside,
        ArrowDown,
        musicPage,
        searchCp,
        Close
    },
    setup() {
        const route = useRoute()
        const closeLryic = ref(true)
        const noDragX = ref(null)
        const noDragY = ref(null)
        const noDrag = ref(false)
        const isLock = ref(false)
        let pageX = ref(null)
        let pageY = ref(null)
        let lyricX = ref(null)
        let lyricY = ref(null)
        let moveX = ref(null)
        let moveY = ref(null)
        const target = ref(null)
        const isClose = ref(false)
        const tragetTime = ref(null)
        const dialogVisible = ref(true)
        const direction = ref('btt')
        const drawer = ref(false)
        const store = useStore()
        const isneedle = ref(false)
        const lyricTop = ref(false)
        const Lyricobj = reactive({ data: {} })
        const activeLyric = ref('')
        const isload = ref(false)
        const lyricTime = ref('')
        const move = (msg) => {
            // console.log(msg)
            moveX.value = msg.moveX
            moveY.value = msg.moveY
        }
        const Drawer = (val) => {
            drawer.value = val
        }
        // 是否显示歌词顶部
        const isShowlyric = (val, objLyric) => {
            lyricTop.value = val
            Lyricobj.data = objLyric
        }
        // 点击
        const clickbtn = (i) => {
            isClose.value = !isClose.value
            if (!isClose.value) {
                store.commit('showOrHide/discisShow', isClose.value)
            } else {
                store.commit('showOrHide/discisShow', isClose.value)
            }
        }
        // 暂停
        const stopBtn = () => {
            isClose.value = !isClose.value
        }
        // 点击是否要上锁
        const clickIsLock = () => {
            isLock.value = !isLock.value
            if (isLock.value) {
                // 不能拖拽
                noDrag.value = true
                noDragX.value = lyricX.value
                noDragY.value = lyricY.value
            } else {
                noDrag.value = false
            }
        }
        watch(() => route.params.id, () => {
            if (route.path === '/privacy/4') {
                closeLryic.value = false
                $MsgWarn('暂时不支持一起听私人FM,正在解锁中')
            }
        }, { immediate: true })
        const showLryic = (val) => {
            closeLryic.value = val
        }
        // 动态获取歌词数据
        const Lyrics = (val, time) => {
            lyricTime.value = (time / 1000).toFixed(3)
            console.log(activeLyric.value)
            activeLyric.value = val
            console.dir(tragetTime.value)
        }
        // 监听他的
        watch(lyricTime, (newVal) => {
            console.log(newVal)
            isload.value = false
            setTimeout(() => {
                isload.value = true
            }, 30)
        }, { immediate: true })
        const clickicon = (i, data) => {
            console.log(i)
            // 下一首
            if (i === 1) {
                store.commit('showOrHide/contextSong', 'next')
            }
            // 上一首
            if (i === -1) {
                store.commit('showOrHide/contextSong', 'up')
            }
        }
        let num = 0
        // 监听关闭按钮关闭了也要关闭
        watch(() => store.state.showOrHide.discShowHide, (newValue) => {
            if (num === 0) {
                if (route.path === '/privacy/4') {
                    drawer.value = false
                    isClose.value = newValue
                } else {
                    drawer.value = true
                    num = num + 1
                    isClose.value = newValue
                }
            } else {
                isClose.value = newValue
            }
        })
        const clickClose = () => {
            closeLryic.value = false
        }
        // 拖拽
        const { elementX, elementY, x, y, isOutside, elementPositionX, elementPositionY } = useMouseInElement(target)
        watch([elementX, elementY, isOutside], () => {
            // console.log(isOutside.value)
        })
        const keyup = () => {
            let PositionX = elementPositionX.value
            let PositionY = elementPositionY.value
            pageX.value = x.value - PositionX
            pageY.value = y.value - PositionY
            // console.log(pageX.value, pageY.value)
            document.addEventListener('mousemove', move)
            function move() {
                lyricX.value = x.value - pageX.value
                lyricY.value = y.value - pageY.value
            }
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', move)
            })
        }
        onMounted(() => {
        })
        return { moveY, moveX, move, lyricX, stopBtn, lyricY, Lyrics, showLryic, closeLryic, clickClose, noDragX, noDragY, noDrag, isLock, keyup, clickIsLock, drawer, target, clickbtn, clickicon, isClose, tragetTime, activeLyric, lyricTime, isload, direction, Drawer, isneedle, isShowlyric, lyricTop, Lyricobj, dialogVisible }
    }
}
</script>
<style lang="less" scoped>
/deep/.el-autocomplete {
    position: relative;
    display: inline-block;
    max-width: 200px;

    margin-left: 124px;

    .el-input__wrapper {
        border-radius: 30px;
    }
}

.lyricScrollconatainer {
    z-index: 1000000;
    width: 600px;
    position: absolute;
    height: 180px;
    background-color: rgba(0, 0, 0, 0.5);
    top: 60%;
    text-align: center;
    cursor: move;

    .middleIcon {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 10px;

        .isBofang {
            .iconfont {
                font-size: 35px;
            }
        }

        .iconfont {
            font-size: 35px;
            color: #eae2e2;

            &:nth-child(3) {
                font-size: 35px;
            }
        }
    }

    span {
        background-size: 100% 100%;
        animation-name: scan;
        transition-timing-function: linear;
    }

    .changeLryic {
        margin-top: 25px;

        .text {
            background: #ffffff -webkit-linear-gradient(left, #FFCACA, #d86f6f) no-repeat 0 0;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 0 100%;
            font-size: 30px;
            font-weight: 700;

        }
    }

    @keyframes scan {
        0% {
            background-size: 0 100%;
        }

        100% {
            background-size: 100% 100%;
        }
    }

}

.auto {
    display: flex;
    align-items: center;
    justify-content: center;

    .common {
        position: relative;

        &-layout {
            .DrawerContainer {
                .drawerHeader {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 80px;
                    text-align: center;

                    // 动画
                    @keyframes axisX {
                        0% {
                            transform: translateY(30px);
                            opacity: 0;
                        }

                        50% {
                            transform: translateY(30px);
                            opacity: 0;
                        }

                        100% {
                            transform: translateY(0px);
                            opacity: 1;
                        }
                    }

                    // :style="{ top: isClose ? '140px' : '-14px', left: isClose ? '120px' : '4px' }"
                    /* 2. 过渡类名 */
                    /* 开始 */
                    .lyricFade-enter-active {
                        animation: axisX 1s forwards;

                    }

                    /* 结束 */
                    .lyricFade-leave-active {
                        // animation: axisX 2s, forwards;
                        animation: axisX 1s forwards reverse;

                    }

                    .lyricName {
                        transform: translateX(-104px);

                        .title {
                            color: #2F3030;
                            font-size: 25px;
                            margin-bottom: 7px;
                        }

                    }
                }

                :deep .el-drawer {
                    height: 100% !important;
                    background: -webkit-linear-gradient(#dcc9da, #eae2e2, #ffffff);
                }

                :deep .el-overlay {
                    position: absolute;
                    z-index: 101 !important;

                    .el-drawer__body {
                        padding: 0;
                    }

                    .el-drawer__header {
                        margin-bottom: 0;
                        padding: 0 30px 0 0;

                    }
                }
            }

            width: 1200px;
            height: 670px;
            background-color: rgb(255, 255, 255);
            position: absolute;
            top: 4%;
            left: 11%;
            box-shadow: 3px 2px 9px 4px rgba(0, 0, 0, 0.2);

            .contain {
                display: flex;
                align-items: center;
            }
        }

    }
}
</style>