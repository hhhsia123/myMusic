<template>
    <!-- 聊天框 -->
    <div v-if="visible">
        <privateDialog :privateConentArr="privateConent" :artistId="uids" @leftArrow="close"
            @dialogApi="() => getPrivateContentApi(uids, lastTimePrivate)" @falseData="newMsg"></privateDialog>
    </div>
    <!--导航栏 -->
    <div class="contianerPrivate" v-if="!visible">
        <h2 style="margin: 0px 0 10px 20px;">消息</h2>
        <div class="topNav">
            <div @click="isActive(i)" class="messge" :class="{ 'active': i === index }"
                v-for="(item, i) in privateConstant" :key="i">{{ item.message }}</div>
        </div>

        <div ref="itemArr">
            <!-- 私信内容 -->
            <div class="item" :style="{ display: (0 === index ? 'block' : 'none') }">
                <privateContent :privacy="privacyArr" @change="getPrivateLetter"
                    @visible="(val, uid) => drawerVisibal(val, uid)">
                </privateContent>
            </div>
            <!-- 评论 -->
            <div class="item" :style="{ display: (1 === index ? 'block' : 'none') }">
                <commentContent :comments="commentsArr" @change="getPrivateLetter"></commentContent>
            </div>
            <!-- @我 -->
            <div class="item" :style="{ display: (2 === index ? 'block' : 'none') }">
                <forwardsContent :forwards="forwardsArr" @change="getPrivateLetter"></forwardsContent>
            </div>
            <!-- 通知 -->
            <div class="item" :style="{ display: (3 === index ? 'block' : 'none') }">
                <noticesContent :notices="noticesArr" @change="($event) => getNotice(lastTimeNotice, $event)">
                </noticesContent>
            </div>
        </div>

    </div>
</template>
<script>
import pubsub from 'pubsub-js'
import privateDialog from '../../components/privateLetter.vue/privateDialog.vue'
import noticesContent from '../../components/privateLetter.vue/noticesContent.vue'
import forwardsContent from '../../components/privateLetter.vue/forwardsContent.vue'
import { useStore } from 'vuex'
import commentContent from '../../components/privateLetter.vue/commentContent.vue'
import moment from 'moment'
import privateContent from '../../components/privateLetter.vue/privateContent.vue'
import { $MsgErr } from '@/utils/Message'
import { privateLetter, commentMessage, repliedMe, notice, privateContentApi } from '../../api/privateMessage'
import { onMounted, ref } from 'vue'
import { privateConstant } from '../../api/constant'
export default {
    name: 'privaatteLetter',
    components: {
        privateContent,
        commentContent,
        forwardsContent,
        noticesContent,
        privateDialog
    },
    setup() {
        const privateConent = ref([])
        const lastTimePrivate = ref(null)
        const noticesArr = ref([])
        const lastTimeNotice = ref('')
        const forwardsArr = ref([])
        const commentsArr = ref([])
        const userId = ref(null)
        const privacyArr = ref([])
        const index = ref(0)
        const itemArr = ref(null)
        const uids = ref(null)
        let arr = []
        const visible = ref(false)
        // 关闭对话框
        const close = (val) => {
            visible.value = val
        }
        // 对话框的最近数据和原数据进行合并
        const newMsg = (newMsgArr) => {
            privateConent.value.shift()
            newMsgArr[0].msg = JSON.parse(newMsgArr[0].msg)
            newMsgArr[0].time = moment(newMsgArr[0].time).format('YY-MM-DD HH:mm')
            arr = [...privateConent.value, ...newMsgArr]
            privateConent.value = arr
        }
        // 获取私信内容
        const getPrivateContentApi = (uid, lastime = 0) => {
            privateContentApi(uid, lastime).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                console.log(res.data)
                // 判断是否已经加载完毕
                if (!res.data.msgs.length) {
                    console.log('加载完毕')
                    return false
                }
                // 把最后的时间保存起来
                lastTimePrivate.value = res.data.msgs[res.data.msgs.length - 1].time
                // 格式时间
                res.data.msgs.forEach(item => {
                    item.msg = JSON.parse(item.msg)
                    item.time = moment(item.time).format('YY-MM-DD HH:mm')
                    if (JSON.stringify(item.msg.mv) !== undefined) {
                        item.msg.mv.duration = moment(item.msg.mv.duration).format('mm:ss')
                    }
                })
                if (lastime !== 0) {
                    arr = [...res.data.msgs.reverse(), ...privateConent.value]
                    privateConent.value = arr
                } else {
                    // 把数组倒过来
                    privateConent.value = res.data.msgs.reverse()
                }
            })
        }
        // 显示二级弹框
        const drawerVisibal = (val, uid) => {
            console.log(val, uid)
            visible.value = val
            // 发请求获取私信内容
            getPrivateContentApi(uid)
            uids.value = uid
        }
        pubsub.subscribe('dialogVisible', (message, data) => {
            console.log(data)
            drawerVisibal(data.bol, data.id)
        })
        const store = useStore()
        // 获取私信
        const getPrivateLetter = (offset = 0) => {
            privateLetter(offset).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                // 判断是否已经加载完毕
                if (!res.data.msgs.length) {
                    console.log('加载完毕')
                    return false
                }
                // 格式时间
                res.data.msgs.forEach(item => {
                    item.lastMsgTime = moment(item.lastMsgTime).format('YY年M月DD日')
                })
                // 判断是否需要合并数字
                if (offset !== 0) {
                    arr = [...privacyArr.value, ...res.data.msgs]
                    privacyArr.value = arr
                } else {
                    privacyArr.value = res.data.msgs
                }
            })
        }
        // 获取评论
        const getCommentMessage = (userId) => {
            commentMessage(userId).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                // 判断是否已经加载完毕
                if (!res.data.comments) {
                    console.log('加载完毕')
                    return false
                }
                // 格式时间
                res.data.comments.forEach(item => {
                    item.time = moment(item.time).format('YY年M月DD日')
                })
                // 判断是否需要合并数字
                // if (offset !== 0) {
                //     arr = [...privacyArr.value, ...res.data.msgs]
                //     privacyArr.value = arr
                // } else {
                commentsArr.value = res.data.comments
                // }
            })
        }
        // 获取@w我
        const getRepliedMe = () => {
            repliedMe().then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                // 判断是否已经加载完毕
                if (!res.data.forwards) {
                    console.log('加载完毕')
                    return false
                }
                // 格式时间                 // json解析
                res.data.forwards.forEach(item => {
                    item.time = moment(item.time).format('YY年M月DD日')
                    item.json = JSON.parse(item.json)
                    // console.log(item.json)
                })
                // 判断是否需要合并数字
                // if (offset !== 0) {
                //     arr = [...privacyArr.value, ...res.data.msgs]
                //     privacyArr.value = arr
                // } else {
                forwardsArr.value = res.data.forwards
                // }
            })
        }
        // 获取通知
        const getNotice = (lastTime) => {
            notice(lastTime).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                // 判断是否已经加载完毕
                if (!res.data.notices.length) {
                    console.log('加载完毕')
                    return false
                }
                // 把最后的时间保存起来
                lastTimeNotice.value = res.data.notices[res.data.notices.length - 1].time
                // 格式时间                 // json解析
                res.data.notices.forEach(item => {
                    item.time = moment(item.time).format('YY年M月DD日')
                    item.notice = JSON.parse(item.notice)
                    console.log(item.notice)
                })
                // 判断是否需要合并数字
                if (lastTimeNotice.value !== '') {
                    arr = [...noticesArr.value, ...res.data.notices]
                    noticesArr.value = arr
                } else {
                    noticesArr.value = res.data.notices
                }
            })
        }
        // 判断是什么类型的发什么请求
        const isActive = (i) => {
            index.value = i
            switch (i) {
                case 0:
                    getPrivateLetter()
                    break
                case 1:
                    getCommentMessage(userId.value)
                    break
                case 2:
                    getRepliedMe()
                    break
                case 3:
                    getNotice()
            }
        }
        onMounted(() => {
            getPrivateLetter()
            setImmediate(() => {
                console.log([itemArr.value])
            }, 200)
            userId.value = store.state.user.profile.userId
        })
        return { privateConstant, index, close, privateConent, getPrivateContentApi, uids, newMsg, lastTimePrivate, lastTimeNotice, isActive, getNotice, drawerVisibal, visible, privacyArr, getPrivateLetter, itemArr, commentsArr, forwardsArr, noticesArr }
    }
}
</script>
<style lang="less" scoped>
.contianerPrivate {

    .topNav {
        width: 90%;
        height: 40px;
        border: 1px solid #BBBBBB;
        display: flex;
        border-radius: 30px;
        margin: 20px 20px 0 20px;

        .messge {
            text-align: center;
            line-height: 36.5px;
            width: 90px;
            height: 100%;
            border-radius: 30px;

            &.active {
                color: #fff;
                background-color: #BBBBBB;
            }
        }
    }

    .privateContent {
        padding: 0;
    }

    .item {
        display: none;
    }
}
</style>