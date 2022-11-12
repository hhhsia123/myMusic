<template>
    <div class="infinite-list" style="overflow: auto;height: 530px; width: 1000px; list-style: none;">
        <div class="followContainer">

            <div class="leftContainer">
                <div class="top">
                    <span>动态</span>
                    <el-button type="danger" round>
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
import { topicEvent } from '../../api/follow'
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'
import moment from 'moment'

import { $MsgErr } from '@/utils/Message'

import { mvUrl } from '../../api/MVapi'
import dynamicList from '../../components/follow/dynamicList.vue'
import { Edit } from '@element-plus/icons-vue'
import hotTopic from '../../components/follow/hotTopic.vue'
// import { $MsgErr } from '@/utils/Message'
export default {
    name: 'topicRanking',
    components: {
        dynamicList, hotTopic, Edit
    },
    setup() {
        const route = useRoute()
        const event = ref([])
        const MVUrl = ref(null)
        const lastTimes = ref(null)
        // 获取mv地址
        const getMVurl = (mvid) => {
            mvUrl(mvid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                MVUrl.value = res.data.data.url
            })
        }
        // 滚动就加载发请求
        // const getLoad = () => {
        //     getTopicEvent()
        // }

        // 滚动底部加载
        // const load = () => {
        //     getTopicEvent()
        // }
        // 获取话题动态
        const getTopicEvent = (actid) => {
            topicEvent(actid).then(res => {
                console.log(res.data)
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data.event)
                // 处理时间                //处理动态类型
                res.data.events.forEach((item, i) => {
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
                const arr = [...event.value, ...res.data.events]
                event.value = arr
            })
        }
        watch(() => route.params.id, (newVal) => {
            getTopicEvent(newVal)
        }, { immediate: true })
        return { event, MVUrl }
    }
}
</script>
<style lang="less" scoped>
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
            z-index: 999;

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