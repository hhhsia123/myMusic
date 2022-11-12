<template>
    <div class="descContainer">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="视频" name="first">
                <videoPage></videoPage>
            </el-tab-pane>
            <el-tab-pane label="MV" name="second">
                <MvPage></MvPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import MvPage from '../asider/Mv/MVpage.vue'
import videoPage from '../../components/asider/video.vue'
import { ref } from 'vue'
export default {
    name: 'videoPaly',
    components: {
        videoPage,
        MvPage
    },
    props: {
        id: {
            type: Number,
            default: null
        }
    },
    setup(props) {
        const activeName = ref('first')
        return { activeName }
    }
}
</script>
<style lang="less" scoped>
.descContainer {
    width: 900px;
    margin: 0 auto;
    height: 530px;

    .el-tabs {
        position: absolute;
        color: #303133;
        width: 96%;

        .el-tab-pane {
            .el-table {
                /deep/.cell {
                    white-space: nowrap !important
                }

            }

        }

        /deep/.el-tabs__item.is-active {
            color: @priceColor !important;
            font-weight: 700;
            font-size: 20px;
        }

        /deep/.el-tabs__active-bar {
            background-color: @priceColor ;
        }

        // 去掉下边框
        /deep/ .el-tabs__nav-wrap {
            &::after {
                background-color: transparent;
            }
        }

        /deep/.el-tabs__item:hover {
            color: #303133;
        }

    }
}
</style>