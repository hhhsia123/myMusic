
<template>
    <el-scrollbar height="465px" ref="offsetTop" @scroll="scroll" v-loading="loadingScoll"
        element-loading-text="Loading...">
        <div class="recommendContainer">
            <PanelBrand></PanelBrand>
            <highquality @BackTop="backTop"></highquality>
        </div>
    </el-scrollbar>
</template>

<script>
import { ref } from 'vue'
import PanelBrand from './Panel.vue'
import highquality from './highquality.vue'
export default {
    name: 'personRecommend',
    components: {
        PanelBrand,
        highquality
    },
    setup() {
        const loadingScoll = ref(false)
        const offsetTop = ref(null)
        let scrollnum = ref(0)
        // 封装动画
        let time
        const animate = () => {
            clearInterval(time)
            time = setInterval(() => {
                if (scrollnum.value <= 0) {
                    clearInterval(time)
                    loadingScoll.value = false
                }
                scrollnum.value = scrollnum.value - 50
                offsetTop.value.setScrollTop(scrollnum.value)
            }, 30)
        }
        const backTop = () => {
            loadingScoll.value = true
            animate()
        }
        const scroll = ({ scrollTop }) => {
            scrollnum.value = Math.floor(scrollTop)
        }
        return { offsetTop, scroll, backTop, loadingScoll }
    }
}
</script>
<style lang="less" scoped>
.recommendContainer {
    width: 920px;
    margin: 5px auto;
    // background-color: aqua;
}
</style>