<template>
    <div class="similarContainer">
        <videoBox :videoData="VideoResourceArr" :Loading="filterLoading"></videoBox>

    </div>
</template>
<script>
import moment from 'moment'
import videoBox from '../../smallComponts/videoBox.vue'
import { $MsgErr } from '../../utils/Message'
import { ref } from 'vue'
import { videoResource } from '../../api/videoApi'
export default {
    name: 'videoShow',
    components: {
        videoBox
    },
    setup(props) {
        const VideoResourceArr = ref([])
        const filterLoading = ref(false)
        const artistsArr = ref([])

        // 获取视频资源接口
        const getVideoResource = (id, offset = 0, name = '') => {
            filterLoading.value = true
            videoResource(id, offset).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data.datas)
                res.data.datas.forEach((item, i) => {
                    item.data.duration = moment(item.data.durationms).format('mm:ss')
                    item.songIndex = i
                })
                if (!name) {
                    const arr = [...VideoResourceArr.value, ...res.data.datas]
                    VideoResourceArr.value = arr
                } else {
                    VideoResourceArr.value = res.data.datas
                }

                filterLoading.value = false
            })
        }
        return { artistsArr, filterLoading, getVideoResource, VideoResourceArr }
    }
}

</script>
<style lang="less" scoped>
.similarContainer {
    margin-top: 20px;

    /deep/.boxContain {
        /deep/.box {
            margin: 10px 0 10px 0px;

        }
    }
}
</style>