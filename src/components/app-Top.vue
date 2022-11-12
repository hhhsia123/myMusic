
<template>
    <nav class="Topcontain" ref="target" @mousedown="keyup">
        <!-- 左边内容 -->
        <div class="left">
            <!-- 图标 -->
            <div class="title" @click="homePage">
                <img class="iconImg" src="../assets/imagges/logo.png" alt="">
                <div class="text">网易云音乐</div>
            </div>
            <!-- 前进后退 -->
            <div class="arrow">
                <el-icon color="#fff" class="back" @click="backClick">
                    <ArrowLeft />
                </el-icon>
                <el-icon color="#fff" class="go" @click="goClick">
                    <ArrowRight />
                </el-icon>
            </div>
            <!-- 搜索框 -->
            <searchCp></searchCp>
        </div>
        <!-- 右边内容 -->
        <div class="right">
            <!-- 名字 -->
            <AppLogin></AppLogin>
            <!-- 下拉菜单 -->
            <el-dropdown v-if="($store.state.user.profile.cookie)">
                <span class="el-dropdown-link">
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <div class="infoContianer">
                            <div class="infoTops">
                                <RouterLink :to="'/userDynamic/1'">
                                    <div class="data-dynamicTop">
                                        <span>{{ infos.eventCount }}</span>
                                        <span>动态</span>
                                    </div>
                                </RouterLink>
                                <RouterLink :to="'/care/1'">
                                    <div class="data-careTop">
                                        <span>{{ infos.follows }}</span>
                                        <span>关注</span>
                                    </div>
                                </RouterLink>
                                <RouterLink :to="'/care/0'">
                                    <div class="data-followsTop">
                                        <span>{{ infos.followeds }}</span>
                                        <span>粉丝</span>
                                    </div>
                                </RouterLink>
                            </div>
                            <div class="btn" v-if="isShowSign" @click="noShowSign">签到</div>
                            <div class="btns" v-else>已签到</div>
                            <div class="leaveLogin">
                                <ul>
                                    <li> <i class="icon iconfont icon-dengji-A"></i>等级 <i
                                            class="icon iconfont  icon-jiantou"></i> </li>
                                    <li @click="leaveClick"> <i class="icon iconfont  icon-tuichu"></i>退出登录 </li>
                                </ul>
                            </div>
                        </div>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- 图标 -->
            <el-icon size="20px" color="#fff" style="margin-right: 10px;">
                <Tools />
            </el-icon>
            <el-icon size="20px" color="#fff" style="margin-right: 10px;cursor: pointer;" @click="visibleClick"
                v-if="($store.state.user.profile.cookie)">
                <Message />
            </el-icon>
            <el-icon size="20px" color="#fff" style="margin-right: 10px;">
                <SemiSelect />
            </el-icon>
            <el-icon size="20px" color="#fff" style="margin-right: 20px;">
                <Close />
            </el-icon>
        </div>
        <!-- 抽屉 -->
        <el-drawer v-if="visible" v-model="visible" :show-close="false" custom-class="privatelContainer">
            <privaatteLetter></privaatteLetter>
        </el-drawer>
    </nav>
</template>
<script>

// vue3导入图标
import { $MsgSucc } from '@/utils/Message'
import { useStore } from 'vuex'
import pubsub from 'pubsub-js'
import privaatteLetter from '../components/privateLetter.vue/privateLetter.vue'
import searchCp from '../components/search/searchCp.vue'
import { ArrowLeft, ArrowRight, ArrowDown, Tools, Message, SemiSelect, Close } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMouseInElement } from '@vueuse/core'
import AppLogin from './app-login.vue'
import { computed } from '@vue/reactivity'
export default {
    emits: ['change'],
    name: 'appTop',
    components: {
        ArrowLeft,
        ArrowRight,
        ArrowDown,

        Tools,
        Message,
        SemiSelect,
        Close,
        AppLogin,
        privaatteLetter,
        searchCp

    },
    setup(pros, { emit }) {
        const isShowSign = ref(true)
        const store = useStore()
        const visible = ref(false)
        const router = useRouter()
        // 获取坐标实现拖拽效果
        const target = ref(null)
        let pageX = ref(null)
        let pageY = ref(null)
        let moveX = ref(null)
        let moveY = ref(null)
        // 获取动态 关注 粉丝信息
        const infos = computed(() => {
            return store.state.user.profile
        })
        const noShowSign = () => {
            isShowSign.value = !isShowSign.value
        }
        const { elementX, elementY, x, y, isOutside, elementPositionX, elementPositionY } = useMouseInElement(target)
        watch([elementX, elementY, isOutside], () => {
            // console.log(isOutside.value)
        })
        pubsub.subscribe('nickName', (message, data) => {
            visible.value = data
        })
        pubsub.subscribe('visible', (message, data) => {
            visible.value = data
        })
        // 点击返回首页
        const homePage = () => {
            router.push('/')
        }
        // 点击弹框
        const visibleClick = () => {
            visible.value = !visible.value
        }
        //     // 获取坐标实现拖拽效果
        const keyup = () => {
            let PositionX = elementPositionX.value
            let PositionY = elementPositionY.value
            pageX.value = x.value - PositionX
            pageY.value = y.value - PositionY
            // console.log(pageX.value, pageY.value)
            document.addEventListener('mousemove', move)
            function move() {
                moveX.value = x.value - pageX.value
                moveY.value = y.value - pageY.value
                console.log(moveX.value, moveY.value)

                emit('change', { moveX: moveX.value, moveY: moveY.value })
            }
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', move)
            })
        }
        // 后退
        const backClick = () => {
            router.back()
        }
        // 前进退
        const goClick = () => {
            router.forward()
        }
        // 点击退出登录 清空用户信息
        const leaveClick = () => {
            store.commit('user/setuser', {})
            $MsgSucc('退出成功')
            router.go(0)
        }
        return { target, keyup, backClick, goClick, homePage, visible, visibleClick, infos, isShowSign, noShowSign, leaveClick }
    }
}
</script>
<style lang="less" scoped>
@height: 60px;
@color: #fff;

.btnSame() {
    height: 30px;
    line-height: 30px;
    width: 80px;
    margin-top: 18px;
    cursor: pointer;
    border-radius: 30px;
    padding-bottom: 10px;
}

/deep/.el-overlay {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9900 !important;
    height: 80%;
    background-color: var(--el-overlay-color-lighter);
    overflow: auto;

    .el-drawer.rtl {
        width: 33% !important;
    }

    /deep/.el-drawer__body {
        flex: 1;
        padding: 0;
        overflow: visible;
    }

    /deep/.el-drawer__header {
        margin-bottom: 0;
        color: #373737
    }
}

.infoContianer {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .btn {
        .btnSame();
        background-color: #EC4141;
        color: #ffff;
    }

    .btns {
        .btnSame();
        background-color: #ffffff;
        color: rgb(12, 12, 12);
        border: 1px solid #eee;
    }

    .leaveLogin {
        margin-top: 30px;

        ul {
            text-align: start;

            li {
                cursor: pointer;
                font-size: 15px;
                border-top: 1px solid #eee;
                width: 320px;
                height: 50px;
                line-height: 40px;

                .iconfont {
                    display: inline;
                    margin: 0 8px 0 8px;
                    font-size: 18px;
                    vertical-align: baseline;
                }

                .icon-jiantou {
                    float: right;
                }

                &:hover {
                    background-color: #F1F2F3;
                }
            }
        }
    }

    .infoTops {
        display: flex;
        width: 100%;
        height: 50px;
        justify-content: space-around;
        align-items: center;
        margin-top: 15px;

        div {
            display: flex;
            flex-direction: column;
        }

        div[class^=data] {
            span {
                &:nth-child(1) {
                    font-size: 20px;
                    color: black;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                &:nth-child(2) {
                    &:hover {
                        color: red;
                    }
                }
            }
        }
    }
}

.Topcontain {
    height: @height;
    width: 100%;
    background-color: @priceColor;
    display: flex;

    .left {
        display: flex;

        .title {
            height: @height;
            display: flex;
            align-items: center;
            margin-left: 30px;
            cursor: pointer;

            .iconImg {
                width: 30px;
                height: 30px;
            }

            .text {
                margin: 5px;
                color: @color;
                font-size: 20px;
            }
        }

        .arrow {
            margin-left: 50px;
            display: flex;
            align-items: center;
            cursor: pointer;

            .back {
                width: 25px;
                height: 25px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
            }

            .go {
                margin-left: 10px;
                width: 25px;
                height: 25px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
            }
        }

        /deep/ .el-autocomplete {
            margin-top: 15px;
            margin-left: 20px;

            /deep/.el-input__wrapper {
                // 边框圆角
                border-radius: 50px !important;
            }
        }
    }

    .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .avarat {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #fff;
        }

        span {
            color: @color;
            margin: 0 8px;
            font-size: 13px;

        }
    }

}
</style>