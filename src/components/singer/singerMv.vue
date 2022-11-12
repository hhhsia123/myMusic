<template>
    <div>
        <MVBox :videoData="mvs" :Loading="keletonShow"></MVBox>
    </div>
</template>

<script>
import moment from 'moment'
import MVBox from '../../smallComponts/MVBox.vue'
import { $MsgErr } from '@/utils/Message'
import { ref, watch } from 'vue'
import { artistMv } from '../../api/singerDetail'
export default {
    name: 'artistMv',
    components: {
        MVBox
    },
    props: {
        id: {
            type: Number
        }
    },
    setup(props) {
        const keletonShow = ref(false)
        const mvs = ref([])
        watch(() => props.id, (newval) => {
            keletonShow.value = true
            artistMv(newval).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                console.log(res.data)
                keletonShow.value = false
                res.data.mvs.forEach((item, i) => {
                    item.duration = moment(item.duration).format('mm:ss')
                })
                mvs.value = res.data.mvs
            })
        }, { immediate: true })
        return { mvs, keletonShow }
    }
}
</script>
<style lang="less" scoped>
/deep/.boxContain {
    /deep/.box {
        margin: 35px 0 10px 0px;
    }
}
</style>