<template>
    <el-scrollbar height="534px">
        <h2 style="margin: 15px;">动态</h2>
        <dynamicList :eventMessge="events" :MVUrls="MVUrl"></dynamicList>
    </el-scrollbar>
</template>
<script>
import { useRoute } from 'vue-router'
import { mvUrl } from '../../api/MVapi'
import moment from 'moment'
import { $MsgErr } from '@/utils/Message'
import dynamicList from '../../components/follow/dynamicList.vue'
import { userEvent } from '../../api/follow'
import { useStore } from 'vuex'
import { watch, ref } from 'vue'
export default {
    name: 'userDynamic',
    components: {
        dynamicList
    },
    setup() {
        const route = useRoute()
        const events = ref([])
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
        // 动态消息
        const getUserEvent = (newval) => {
            userEvent(newval).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data.event)
                if (res.data.events !== undefined) {
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
                }

                lastTimes.value = res.data.lasttime
                // 合并数组
                // const arr = [...events.value, ...res.data.events]
                events.value = res.data.events
                console.log(events.value)
            })
        }
        const uId = ref('')
        const store = useStore()
        watch(() => [store.state.user.profile.userId, route.params.id], (newval) => {
            uId.value = newval[0]
            if (route.params.id === '1') {
                getUserEvent(uId.value)
            } else {
                getUserEvent(newval[1])
            }

            getUserEvent(newval)
        }, { immediate: true })
        return { events }
    }
}
</script>
<style lang="less" scoped>
/deep/.commentList {
    width: 1000px;

    /deep/.hotCommentList {
        max-width: 1000px;
        margin-left: 30px;

        /deep/.forwardCommentMain {
            margin-left: 10px;
            width: 857px;
        }

        /deep/ .forwardreplied {
            width: 846px;
        }
    }
}
</style>