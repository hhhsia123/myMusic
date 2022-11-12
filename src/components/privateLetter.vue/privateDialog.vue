<template>
    <div class="topNavDialog">
        <el-icon size="20px" @click="leftArrow" style="cursor: pointer;">
            <ArrowLeft />
        </el-icon>
        <span class="name">{{ uname }}</span>
        <el-scrollbar height="350px" ref="scrollTop" @scroll="scrToTop">
            <div class="dialog" ref="dialogRef" v-if="privateTextArr.length">
                <div class="leftDiallog" v-for="(item, i) in privateTextArr" :key="i">
                    <div class="time">{{ item.time }}</div>
                    <div class="dialogContainer"
                        :class="{ 'right': $store.state.user.profile.nickname === item.fromUser.nickname }">
                        <img v-if="!($store.state.user.profile.nickname === item.fromUser.nickname)" class="pic"
                            :src="item.fromUser.avatarUrl + '?param=200y200'" alt="">
                        <div class="msg "
                            :class="{ 'rightMsg': $store.state.user.profile.nickname === item.fromUser.nickname }">
                            {{ item.msg.title }} {{ item.msg.msg }}
                            <!-- 是否有发布单曲 -->
                            <div class="repliedItem"
                                v-if="!(item.msg.song === undefined || item.msg.song.album === undefined)">
                                <img class="pic" :src="item.msg.song.album.picUrl" alt="">
                                <!-- 判断是否有单曲 -->
                                <div class="title" v-if="!(item.msg.song === undefined)">
                                    <div class="songname">{{ item.msg.song.name }}</div>
                                    <div class="singer">{{ item.msg.song.album.artists[0].name }}</div>
                                </div>
                            </div>
                            <!-- 判断是否有视频 -->
                            <div class="videoUrl" v-if="!(item.msg.mv === undefined)">
                                <RouterLink :to="`/videoPlay/videoDetail/${item.msg.mv.id}`" @click="closeDialog">
                                    <img class="img" :src="item.msg.mv.imgurl + '?param=229y128'" alt="">
                                    <span class="nameMV">{{ item.msg.mv.name }}-{{ item.msg.mv.artist.name }}</span>
                                    <span class="durationMV">{{ item.msg.mv.duration }}</span>
                                    <span class="playCount">播放:{{ item.msg.mv.playCount }}</span>
                                    <i class="icon iconfont   icon-bofang-copy"></i>
                                </RouterLink>
                            </div>
                            <!-- 是否有图片 -->
                            <div class="picUrl" v-if="!(item.msg.picInfo === undefined)">
                                <el-image style="max-width: 150px; " :src="item.msg.picInfo.picUrl" :initial-index="0"
                                    fit="cover" :key="i" />
                            </div>
                        </div>
                        <img v-if="($store.state.user.profile.nickname === item.fromUser.nickname)" class="pic"
                            :src="item.fromUser.avatarUrl" alt="">
                    </div>
                </div>
            </div>
            <div class="noContent" v-else>暂无私信内容</div>
        </el-scrollbar>
        <!-- 文本框 -->
        <el-input v-model="textarea" maxlength="150" :placeholder="'回复 ' + uname" show-word-limit type="textarea" />
        <div style="display: flex; justify-content:space-between;margin-top: -7px;">
            <div>
                <el-popover :visible="isShow" popper-class="dialogEmoji" placement="top-start" title="表情" :width="200"
                    trigger="click">
                    <template #reference>
                        <i class="icon iconfont  icon-xiaolian" @click="clickShow"> </i>
                    </template>
                    <emoJi @emoJival="getEmoji"></emoJi>
                </el-popover>
                <i class="icon iconfont  icon-tupian"></i>
            </div>
            <el-button style="margin-bottom: 10px;" plain @click="sendletter()">发送</el-button>
        </div>
    </div>
</template>
<script>
import emoJi from '../app-emoJi.vue'
import { $MsgSucc } from '@/utils/Message'
import { sendPrivate } from '../../api/privateMessage'
import pubsub from 'pubsub-js'
import { useStore } from 'vuex'
import { ArrowLeft } from '@element-plus/icons-vue'
import { onUnmounted, onUpdated, ref, nextTick, watch } from 'vue'

export default {
    name: 'privateDialog',
    components: {
        ArrowLeft,
        emoJi
    },
    props: {
        privateConentArr: {
            type: Array,
            default: () => []
        },
        artistId: {
            type: Number
        }
    },
    setup(props, { emit }) {
        const isShow = ref(false)
        const scrollTop = ref(null)
        const dialogRef = ref(null)
        const uname = ref('')
        const store = useStore()
        const dataLoad = ref(false)
        const sum = ref(0)
        const clientHeight = ref(null)
        const textarea = ref('')
        const singId = ref(null)
        const newMsg = ref([])
        const privateTextArr = ref([])
        const emoJiArr = ref([])
        // 订阅消息
        pubsub.subscribe('nickName', (message, data) => {
            uname.value = data
        })
        // 表情
        const getEmoji = (val) => {
            emoJiArr.value.push(val)
            isShow.value = false
            textarea.value = textarea.value + emoJiArr.value.join('')
        }
        const clickShow = () => {
            isShow.value = !isShow.value
        }
        // 滚到数据顶部进行数据加载 //防抖
        const scrToTop = ({ scrollTop }) => {
            // console.log(scrollTop)
            if (scrollTop <= 10) {
                sum.value = sum.value + 1
                if (dataLoad.value) {
                    // 利用 return 终止函数继续运行
                    return false
                }
                dataLoad.value = true
                setTimeout(() => {
                    // 发请求
                    emit('dialogApi')
                    console.log('数据加载')
                    dataLoad.value = false
                }, 1000)
            }
        }
        const getSendPrivate = () => {
            sendPrivate(singId.value, (textarea.value).trim()).then(res => {
                // 伪造假数据模拟发送
                if (res.data.code === 200) {
                    $MsgSucc('发送成功')
                }
                newMsg.value = res.data.newMsgs
                emit('falseData', newMsg.value)
                // 清空文本框
                textarea.value = ''
            })
        }
        const sendletter = () => {
            getSendPrivate()
        }
        // 返回上一级
        const leftArrow = () => {
            emit('leftArrow', false)
        }
        // 关闭对话框
        const closeDialog = () => {
            // 发布消息
            pubsub.publish('nickName', false)
        }
        watch(() => [props.artistId, props.privateConentArr], (newVal) => {
            singId.value = newVal[0]
            privateTextArr.value = newVal[1]
        }, { immediate: true })
        onUpdated(() => {
            nextTick(() => {
                if (dialogRef.value !== undefined) {
                    if (sum.value === 0) {
                        scrollTop.value.setScrollTop(dialogRef.value.clientHeight)
                        clientHeight.value = dialogRef.value.clientHeight
                    } else {
                        scrollTop.value.setScrollTop(dialogRef.value.clientHeight - clientHeight.value)
                        clientHeight.value = dialogRef.value.clientHeight
                    }
                }
            })
        })
        onUnmounted(() => {
            pubsub.unsubscribe()
        })
        return { store, uname, leftArrow, closeDialog, getEmoji, clickShow, isShow, scrollTop, dialogRef, scrToTop, textarea, sendletter, privateTextArr }
    }
}
</script>
<style lang="less" scoped>
.iconfont {
    font-size: 20px;
    margin-right: 5px;
    cursor: pointer;
}

/deep/.el-textarea {
    width: 360px;
}

/deep/.el-textarea__inner {
    width: 360px;
    height: 70px;
    resize: none;
}

.topNavDialog {
    height: 40px;
    text-align: center;
    margin: 0 20px 0 20px;

    .el-icon {
        float: left;
    }

    .name {
        margin-left: -20px;
    }

    /deep/.el-scrollbar {

        height: 350px;
        width: 376px;
        margin-top: 20px;

        /* margin-right: -31px; */
        // transform: translateX(-20px);
        .noContent {
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            font-weight: 700;

        }

        .dialog {

            .time {
                margin: auto;
                margin-top: 20px;
                // left: 50%;
                background-color: #F1F2F3;
                width: 120px;
                border-radius: 30px;
                color: #939394;
                font-size: 10px;
                // transform: translateX(-50%);
            }

            .dialogContainer {
                margin-top: 15px;
                display: flex;

                &.right {
                    display: flex;
                    justify-content: flex-end;
                    margin-right: 20px;
                }

                .pic {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }

                .msg {
                    margin-left: 20px;
                    border-radius: 15px;
                    border-top-left-radius: 0;
                    max-width: 249px;
                    background-color: #F1F2F3;
                    word-break: break-all;
                    padding: 5px;

                    .videoUrl {
                        position: relative;
                        margin: 5px;

                        .iconfont {
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            color: @priceColor ;
                            font-size: 50px;
                            transform: translate(-50%, -30%);
                        }

                        .img {
                            object-fit: cover;
                            margin-top: 10px;
                            border-radius: 5px;
                        }

                        .nameMV {
                            position: absolute;
                            color: #fff;
                            top: 15px;
                            left: 5px;
                            .overflow();
                        }

                        .durationMV {
                            position: absolute;
                            right: 4px;
                            bottom: 5px;
                            color: #fff;
                        }

                        .playCount {
                            position: absolute;
                            left: 4px;
                            bottom: 5px;
                            color: #fff;
                        }

                    }

                    .repliedItem {
                        margin: 5px;
                        display: flex;
                        align-items: center;
                        background-color: #fff;
                        width: 200px;
                        height: 54px;
                        border-radius: 15px;

                        .pic {
                            margin: 10px 0 10px 0;
                            max-width: 60px;
                            max-height: 60px;
                            margin-left: 10px;
                        }

                        .title {
                            margin-left: 10px;

                            .singer {
                                float: left;
                            }
                        }
                    }

                    &.rightMsg {
                        margin-right: 20px !important;
                        border-radius: 15px;
                        border-bottom-right-radius: 0 !important;
                    }
                }
            }

        }
    }

}
</style>