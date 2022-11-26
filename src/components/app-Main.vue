<template>
    <div class="main">
        <!-- 头部导航 -->
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="个人推荐" name="first">
                <el-scrollbar max-height="465px">
                    <el-carousel :interval="4000" :initial-index='6' type="card" height="200px">
                        <el-carousel-item v-for="(item, i) in swiper" :key="i">
                            <h3 text="2xl" justify="center">
                                <img class="imageUrl" :src="item.imageUrl" alt="">
                            </h3>
                        </el-carousel-item>
                    </el-carousel>
                    <!-- 图片盒子 -->
                    <h2 style="margin-left:48px;font-weight: 700;">推荐歌单</h2>
                    <smallBox :songData="songData"></smallBox>
                </el-scrollbar>
            </el-tab-pane>
            <!-- 私人雷达 -->
            <el-tab-pane label="专属定制" name="second">
                <personRecommend></personRecommend>
            </el-tab-pane>
            <el-tab-pane label="歌单" name="third">
                <songSheet></songSheet>
            </el-tab-pane>
            <el-tab-pane label="排行榜" name="fourth">
                <topList></topList>
            </el-tab-pane>
            <el-tab-pane label="最新音乐" name="five">
                <newMusic></newMusic>
            </el-tab-pane>
            <el-tab-pane label="歌手" name="six">
                <sinGer></sinGer>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import sinGer from '../components/singer/singer.vue'
import newMusic from '../components/newMusic/newMusic.vue'
import topList from '../components/topList.vue/topList.vue'
import songSheet from '../components/songSheet/songSheet.vue'
import personRecommend from '../components/Recommend/personalRecommend.vue'
// vue3引入轮播数据
import { Carousel, personalized } from '../api/mainApi'
import { ref } from 'vue'
// 导入消息组件
import { $MsgErr } from '../utils/Message'
// 导入盒子组件
import smallBox from '../smallComponts/smallBox.vue'

// import pubsub from 'pubsub-js'
export default {
    name: 'appMain',
    components: {
        smallBox,
        personRecommend,
        songSheet,
        topList,
        newMusic,
        sinGer
    },
    setup() {
        const activeName = ref('first')
        const songData = ref([])
        // 获取轮播数据
        const swiper = ref([])
        // let pubId = null
        Carousel().then(res => {
            if (res.data.code === !200) {
                return $MsgErr(res.data.code)
            }
            swiper.value = res.data.banners
        })
        // 获取推荐歌单
        personalized(10).then(res => {
            if (res.data.code !== 200) {
                $MsgErr(res.data.code)
            }
            console.log(res.data.result)
            songData.value = res.data.result
        })

        // const demo = (msgName, data) => {
        //     console.log('msgName====', msgName)
        //     console.log('data====', data)
        // }
        // 订阅消息
        // onMounted(() => {
        //     // 订阅消息
        //     pubId = pubsub.subscribe('bofang', demo)
        // })
        // onUnmounted(() => {
        //     pubsub.unsubscribe(pubId)
        // })
        return { swiper, ref, songData, activeName }
    }
}
</script>
<style lang="less" scoped>
@mainWidth: 1000px;

.main {
    width: @mainWidth;

    /deep/.el-tabs {
        color: #303133;
        width: 100%;
        height: 533px;

        .el-tabs__nav-scroll {
            overflow: hidden;
            margin-left: 51px;
            margin-top: 15px;
        }

        .el-tab-pane {
            .el-table {
                .cell {
                    white-space: nowrap !important
                }

                --el-table-current-row-bg-color: #f5e4e4b0;
            }

        }

        .el-tabs__item.is-active {
            color: @priceColor !important;
            font-weight: 700;
            font-size: 20px;
        }

        .el-tabs__active-bar {
            background-color: @priceColor ;
        }

        .el-tabs__nav-wrap {
            &::after {
                background-color: #fff;
            }
        }

        .el-tabs__item:hover {
            color: #5e5858;
        }

    }

    .el-carousel {
        width: 900px;
        margin: 5px auto;

        .el-carousel__item {

            h3 {

                .imageUrl {
                    height: 200px;

                }
            }

            &:nth-child(2n) {

                background-color: #ffffff;
                border-radius: 15px;
            }

            &:nth-child(2n + 1) {
                background-color: #d3dce6;
                border-radius: 15px;
            }
        }
    }

}
</style>