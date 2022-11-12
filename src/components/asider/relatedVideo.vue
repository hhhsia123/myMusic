<template>
    <div class="videotuijian" v-for="(item, i) in relatedVideoArr" :key="i">
        <RouterLink :to="`/videoPlay/videoDetail/${item.vid}`">
            <img class="pic" :src="item.coverUrl" alt="">
        </RouterLink>
        <div class="desc" v-if="item.creator">
            <div class="title">{{ item.title }}</div>
            <div class="by">by: {{ item.creator[0].userName }}</div>
        </div>
        <div class="durationms">{{ item.durationms }}</div>
        <div class="playCount">
            <el-icon size="20px" color="#fff">
                <VideoPlay />
            </el-icon>
            <span style="color: #fff;font-size: 10px;">{{ getPlayCount(item.playTime) }}</span>
        </div>

    </div>
</template>
<script>
import { getPlayCount } from '../../utils/mixins'
import { VideoPlay } from '@element-plus/icons-vue'
import moment from 'moment'
import { $MsgErr } from '@/utils/Message'
import { relatedVideo } from '../../api/videoApi'
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'
export default {
    mixins: [getPlayCount],
    name: 'relatedVideo',
    components: {
        VideoPlay
    },
    setup() {
        const id = ref('')
        const route = useRoute()
        const relatedVideoArr = ref([])
        // 获取相关视频
        const getrelatedVideo = (vid) => {
            relatedVideo(vid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                res.data.data.forEach((item, i) => {
                    item.durationms = moment(item.durationms).format('mm:ss')
                    item.songIndex = i
                })
                relatedVideoArr.value = res.data.data
            })
        }
        watch(() => route.params.id, (newValue) => {
            if (newValue && `/videoPlay/videoDetail/${newValue}` === route.path) {
                // 匹配如果都是数字那么就是mv 不然就是视频
                let num = /^[0-9]*$/
                if (num.test(newValue)) {
                    // 发mv接口
                    // 相关mv
                    id.value = newValue
                    getrelatedVideo(newValue)
                } else {
                    // 发视频接口
                    // 相关视频
                    id.value = newValue
                    getrelatedVideo(newValue)
                }
            }
        }, { immediate: true })
        return { relatedVideoArr, getPlayCount, id }
    }
}
</script>
<style lang="less" scoped>
.videotuijian {
    display: flex;
    margin-top: 20px;
    margin-left: 10px;
    position: relative;
    cursor: pointer;

    .pic {
        max-width: 200px;
        border-radius: 10px;
    }

    .durationms {
        position: absolute;
        color: #fff;
        bottom: 5%;
        left: 46%;
    }

    .playCount {
        position: absolute;
        align-items: center;
        line-height: 30px;
        top: 2px;
        left: 2px;
        width: 75px;
        height: 30px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 30px;

        .el-icon {
            vertical-align: middle;
            margin-left: 5px;
            margin-right: 5px;
            margin-bottom: 2px;
        }
    }

    .desc {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .title {
            display: -webkit-box;
            text-overflow: ellipsis;
            overflow: hidden;
            /* 设置对齐模式 */
            -webkit-box-orient: vertical;
            /* 设置盒子的行数 */
            -webkit-line-clamp: 2;
            font-size: 16px;
        }

        .by {
            color: #9F9F9F;
            display: -webkit-box;
            text-overflow: ellipsis;
            overflow: hidden;
            /* 设置对齐模式 */
            -webkit-box-orient: vertical;
            /* 设置盒子的行数 */
            -webkit-line-clamp: 1;
            font-size: 8px;
        }
    }
}
</style>