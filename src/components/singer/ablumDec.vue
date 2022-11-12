<template>
    <div class="decContainer">
        <h3 style="margin-bottom: 15px;">专辑介绍</h3>
        <p style="text-indent:2em ;  line-height: 30px;">{{ albumString }}</p>
    </div>
</template>
<script>
import { albumText } from '../../api/singerDetail'
import { watch, ref } from 'vue'
import { $MsgErr } from '../../utils/Message'
export default {
    name: 'ablumDec',
    components: {

    },
    props: {
        id: {
            type: Number,
            default: null
        }
    },
    setup(props) {
        const albumString = ref('')
        const getAlbumText = (id) => {
            albumText(id).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.message)
                }
                console.log(res.data.album.description)
                albumString.value = res.data.album.description
            })
        }
        // 监听id的是否传入
        watch(() => props.id, (newValue) => {
            if (newValue) {
                console.log(newValue)
                getAlbumText(newValue)
            }
        }, { immediate: true })
        return { albumString }
    }
}
</script>
<style lang="less" scoped>

</style>