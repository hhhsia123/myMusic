<template>
    <el-dialog v-model="dialogVisible" title="分享" width="32%" hight="48%" align-center center draggable
        custom-class="dialog">
        <div v-if="!recentPalyCp">
            <el-input v-model="textarea" maxlength="150" placeholder="一起聊聊音乐把~" show-word-limit type="textarea" />
            <div class="share">
                <div class="shareMusic">
                    <div style="height: 40px;" @click="recentPaly" v-if="SongInfo.img === undefined">
                        <p style="display: flex; align-items: center;">
                            <i class="icon iconfont  icon-pailietubiao-14"></i>
                            <span>给动态配上音乐</span>
                        </p>
                        <i class="icon iconfont  icon-jiahao"></i>
                    </div>
                    <div v-else style="height: 40px;" @click="recentPaly">
                        <p style="display: flex; align-items: center;">
                            <img class="pic" :src="SongInfo.img + '?param=100y100'" alt="">
                            {{ SongInfo.song }} - <span>{{ SongInfo.singer }}</span>
                        </p>
                        <i class="icon iconfont  icon-jiahao"></i>
                    </div>
                </div>
                <div class="float  ">
                    <el-popover :visible="isShow" popper-class="dialogEmoji" placement="top" title="表情" :width="200"
                        trigger="click">
                        <template #reference>
                            <i class="icon iconfont  icon-xiaolian" @click="clickShow"> </i>
                        </template>
                        <emoJi @emoJival="getEmoji"></emoJi>
                    </el-popover>
                    <el-button round @click="dialogClose">分享
                    </el-button>
                </div>
            </div>
            <div class="shareWb">同时分享到 : <i class="icon iconfont  icon-weibo"></i></div>
        </div>
        <div class="recnetPlayContianer" v-else>
            <recentPlay @close="recentPaly" @infoObj="SongInformation"></recentPlay>
        </div>
    </el-dialog>
    <div class="infinite-list" style="overflow: auto;height: 530px; width: 1000px; list-style: none;">
        <div class="followContainer">

            <div class="leftContainer">
                <div class="top">
                    <span>动态</span>
                    <el-button round @click="dialogVisible = true">
                        <el-icon>
                            <Edit />
                        </el-icon>发动态
                    </el-button>
                </div>
                <!-- 新歌发布 -->
                <div class="newSong">进三个月有10首新歌发布</div>
                <!-- 动态展现 -->
                <dynamicList :eventMessge="event" :MVUrls="MVUrl"></dynamicList>

            </div>

            <div class="rightContianer">
                <!-- 获取热门话题 -->
                <hotTopic></hotTopic>
            </div>
        </div>
    </div>
</template>
<script>
import emoJi from '../../components/app-emoJi.vue'

import { shareResource } from '../../api/commentApi'
import recentPlay from './recentPlay.vue'
import moment from 'moment'
import { ref, onMounted } from 'vue'
import { $MsgErr, $MsgSucc } from '@/utils/Message'
import { eventList } from '../../api/follow'
import { mvUrl } from '../../api/MVapi'
import dynamicList from '../../components/follow/dynamicList.vue'
import { Edit } from '@element-plus/icons-vue'
import hotTopic from '../../components/follow/hotTopic.vue'
// import { useStore } from 'vuex'
export default {
    name: 'followList',
    components: {
        Edit,
        dynamicList,
        hotTopic,
        recentPlay,
        emoJi

    },
    setup() {
        const isShow = ref(false)
        const textarea = ref('')
        const event = ref([])
        const MVUrl = ref(null)
        const lastTimes = ref(null)
        const eject = ref(null)
        const dialogVisible = ref(false)
        const recentPalyCp = ref(false)
        const SongInfo = ref({})
        const emoJiArr = ref([])
        // 获取mv地址
        const getMVurl = (mvid) => {
            mvUrl(mvid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                MVUrl.value = res.data.data.url
            })
        }
        const recentPaly = () => {
            recentPalyCp.value = !recentPalyCp.value
        }
        // 单曲信息
        const SongInformation = (val) => {
            SongInfo.value = val
        }
        // 点击弹出对话框
        const openMessage = () => {
            // console.dir(eject.value)
            eject.value.open()
        }
        // 表情
        const getEmoji = (val) => {
            emoJiArr.value.push(val)
            isShow.value = false
            textarea.value = textarea.value + emoJiArr.value.join('')
        }
        const clickShow = () => {
            isShow.value = !isShow.value
        }
        // 分享数据
        const getShareResource = () => {
            let { id } = SongInfo.value
            shareResource(id, textarea.value).then(res => {
                if (res.data.code === 200) {
                    $MsgSucc('分享成功数据稍有延迟')
                }
                let time = setInterval(() => {
                    if (textarea.value === event.value[0].json.msg) {
                        clearInterval(time)
                    }
                    geteventList()
                }, 10000)
            })
        }
        //  点击分享发送数据同时关闭对话框
        const dialogClose = () => {
            getShareResource()
            dialogVisible.value = false
        }
        // 动态消息
        const geteventList = (lastTime) => {
            eventList(lastTime).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data.event)
                // 处理时间                //处理动态类型
                res.data.event.forEach((item, i) => {
                    item.eventTime = moment(item.eventTime).format('yyyy年M月DD日')
                    item.songIndex = i
                    switch (item.type) {
                        case 18:
                            item.type = '分享单曲'
                            break
                        case 19:
                            item.type = '分享专辑'
                            break
                        case 17:
                            item.type = '分享电台节目'
                            break
                        case 22:
                            item.type = '转发'
                            break
                        case 39:
                            item.type = '发布视频'
                            break
                        case 35:
                            item.type = '分享歌单'
                            break
                        case 13:
                            item.type = '分享歌单'
                            break
                        case 24:
                            item.type = '分享专栏文章'
                            break
                        case 41:
                            item.type = '分享视频'
                            break
                        case 21:
                            item.type = '分享视频'
                            break
                    }
                    // 对json格式进行解析
                    item.json = JSON.parse(item.json)
                    // 对json格式进行解析
                    if (item.json.event !== undefined) {
                        item.json.event.json = JSON.parse(item.json.event.json)
                        switch (item.json.event.type) {
                            case 18:
                                item.json.event.type = '分享单曲'
                                break
                            case 19:
                                item.json.event.type = '分享专辑'
                                break
                            case 17:
                                item.json.event.type = '分享电台节目'
                                break
                            case 22:
                                item.json.event.type = '转发'
                                break
                            case 39:
                                item.json.event.type = '发布视频'
                                break
                            case 35:
                                item.json.event.type = '分享歌单'
                                break
                            case 13:
                                item.json.event.type = '分享歌单'
                                break
                            case 24:
                                item.json.event.type = '分享专栏文章'
                                break
                            case 41:
                                item.json.event.type = '分享视频'
                                break
                            case 21:
                                item.json.event.type = '分享视频'
                                break
                        }
                    }
                    // 查询遍历是否有mv如果有我们就发mv请求获取到mv地址
                    if (item.json.mv) {
                        getMVurl(item.json.mv.id)
                    }
                    // 匹配##
                    if (!(item.bottomActivityInfos === null)) {
                        item.bottomActivityInfos.forEach((list, i) => {
                            if (!(item.json.msg === undefined)) {
                                item.json.msg = item.json.msg.replace('#' + list.name + '#', '')
                            }
                        })
                    }
                })
                lastTimes.value = res.data.lasttime
                // 合并数组
                const arr = [...event.value, ...res.data.event]
                event.value = arr
            })
        }
        // 滚动就加载发请求
        // const getLoad = () => {
        //     geteventList(lastTimes.value)
        // }
        // // 滚动底部加载
        // const load = () => {
        //     getLoad()
        // }
        onMounted(() => {
            geteventList()
        })

        return { event, MVUrl, eject, openMessage, SongInformation, SongInfo, textarea, dialogVisible, recentPaly, recentPalyCp, dialogClose, clickShow, getEmoji }
    }
}
</script>
<style  lang="less" scoped>
::-webkit-scrollbar-track {
    border-radius: 60px;
    background-color: #fff;
}

::-webkit-scrollbar {
    width: 12px;
    background-color: #fff;
}

::-webkit-scrollbar-thumb {
    border-radius: 60px;
    width: 5px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    background-color: #DEDFE1;
}

/deep/.el-textarea__inner {
    width: 442px;
    height: 152px;
    resize: none;
    border-radius: 0px;
}

/deep/.el-textarea {

    width: 442px;
}

/deep/ .el-button {
    background-color: #ff4040;
    color: #fff;
}

.shareWb {
    margin-top: 20px;
    display: flex;
    align-items: center;

    .iconfont {
        font-size: 30px;
        margin-left: 5px;

        &:hover {
            color: red;
        }
    }

}

.share {
    display: flex;
    align-items: center;
    margin-top: -10px;

    .shareMusic {
        flex: 1;
        height: 60px;
        border: 1px solid #E5E5E5;
        border-top: 0;
        margin-right: 8px;
        display: flex;
        align-items: center;

        &:hover {
            background-color: #F2F2F2;
        }

        div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-left: 10px;

            .pic {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
            }

            .iconfont {
                &.icon-pailietubiao-14 {
                    font-size: 40px;
                    margin-right: 10px;
                }

                color: rgb(246, 24, 24);
                font-size: 30px;
            }
        }

    }
}

.followContainer {
    display: flex;
    width: 950px;
    margin: 0 auto;

    .leftContainer {
        width: 70%;

        .newSong {
            text-align: center;
            line-height: 50px;
            margin-top: 15px;
            width: 95%;
            margin: 15px 0 15px 0;
            height: 50px;
            border: 2px solid #eee;
        }

        .top {
            display: flex;
            align-items: center;
            margin-top: 10px;
            background-color: #fff;
            height: 50px;
            position: sticky;
            top: 0;
            z-index: 2;

            span {
                font-size: 20px;
                color: black;
                font-weight: 700;
                margin-right: 20px;
            }
        }
    }

    .rightContianer {
        width: 30%;
        margin: 0 auto;
    }
}
</style>