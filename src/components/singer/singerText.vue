<template>

    <div v-if="descArr.length">
        <div class="decContainer" v-for="(item, i) in descArr" :key="i">
            <h2 class="ti">{{ item.ti }}</h2>
            <p class="txt">{{ item.txt }}</p>
        </div>
    </div>
    <div v-else>
        <p class="txt">{{ simpleDesc }}</p>
    </div>
</template>
<script>

import { $MsgErr } from '../../utils/Message'
import { watch, ref } from 'vue'
import { artistDescApi } from '../../api/singerDetail'
export default {
    name: 'singerText',
    components: {

    },
    props: {
        id: {
            type: Number,
            default: null
        }
    },
    setup(props) {
        const simpleDesc = ref('')
        const descArr = ref([])
        const getArtistDesc = (id) => {
            artistDescApi(id).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data)
                descArr.value = res.data.introduction
                simpleDesc.value = res.data.briefDesc
            })
        }
        // 监听id的是否传入
        watch(() => props.id, (newValue) => {
            if (newValue) {
                getArtistDesc(newValue)
            }
        }, { immediate: true })
        return { descArr, simpleDesc }
    }
}
</script>
<style lang="less" scoped>
.decContainer {
    .ti {
        margin: 10px 0 10px 0;
    }
}

.txt {
    text-indent: 2em;
    line-height: 30px;
}
</style>