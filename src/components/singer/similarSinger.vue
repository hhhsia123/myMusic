<template>
    <div class="similarContainer">
        <singerBox :singerData="artistsArr" :Loading="filterLoading"></singerBox>
    </div>
</template>
<script>
import singerBox from '../../smallComponts/singerBox.vue'
import { $MsgErr } from '../../utils/Message'
import { watch, ref } from 'vue'
import { simiSinger } from '../../api/singerDetail'
export default {
    name: 'similarSinger',
    components: {
        singerBox
    },
    props: {
        id: {
            type: Number,
            default: null
        }
    },
    setup(props) {
        const filterLoading = ref(false)
        const artistsArr = ref([])
        const getSimiSinger = (id) => {
            filterLoading.value = true
            simiSinger(id).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.message)
                }
                // console.log(res.data.artists)
                artistsArr.value = res.data.artists
                filterLoading.value = false
            })
        }
        // 监听id的是否传入
        watch(() => props.id, (newValue) => {
            if (newValue) {
                console.log(newValue)
                getSimiSinger(newValue)
            }
        }, { immediate: true })
        return { artistsArr, filterLoading }
    }
}
</script>
<style lang="less" scoped>
.similarContainer {
    /deep/.boxContain {
        .box {
            margin: 10px 0 10px 0px;

        }
    }
}
</style>